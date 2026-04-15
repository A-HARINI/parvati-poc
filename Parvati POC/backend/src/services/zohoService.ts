import axios from 'axios';

type ZohoItemResponse = {
  item?: {
    item_id: string;
  };
};

let accessToken: string | null = null;
let expiresAt = 0;
let refreshing = false;

function isZohoConfigured(): boolean {
  const id = process.env.ZOHO_CLIENT_ID;
  const secret = process.env.ZOHO_CLIENT_SECRET;
  const token = process.env.ZOHO_REFRESH_TOKEN;
  const org = process.env.ZOHO_ORG_ID;
  return !!(id && secret && token && org &&
    !id.startsWith('your_') && !secret.startsWith('your_') &&
    !token.startsWith('your_') && !org.startsWith('your_'));
}

function getZohoHeaders() {
  return {
    Authorization: `Zoho-oauthtoken ${accessToken}`,
    'Content-Type': 'application/json;charset=UTF-8',
  };
}

async function refreshToken() {
  if (refreshing) {
    // Wait for ongoing refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
  }

  refreshing = true;
  try {
    console.log('[Zoho] Refreshing access token...');
    const response = await axios.post(
      `https://accounts.zoho.com/oauth/v2/token`,
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: 'refresh_token',
        },
      }
    );

    accessToken = response.data.access_token;
    expiresAt = Date.now() + (response.data.expires_in - 60) * 1000;
    console.log('[Zoho] Token refreshed successfully');
  } catch (error: any) {
    console.error('[Zoho] Token refresh failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  } finally {
    refreshing = false;
  }
}

async function ensureToken() {
  if (!accessToken || Date.now() >= expiresAt) {
    await refreshToken();
  }
}

async function performZohoRequest<T>(request: () => Promise<T>, retries = 3): Promise<T> {
  try {
    await ensureToken();
    return await request();
  } catch (error: any) {
    if (error.response?.status === 429 && retries > 0) {
      const delay = Number(error.response.headers['retry-after'] || 2) * 1000;
      console.warn(`[Zoho] Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return performZohoRequest(request, retries - 1);
    }
    if (error.response?.status === 401 && retries > 0) {
      console.warn('[Zoho] Token expired. Refreshing and retrying...');
      accessToken = null;
      return performZohoRequest(request, retries - 1);
    }
    console.error('[Zoho] Request failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
}

export async function createZohoItem(product: {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  category: string;
  price: number;
}) {
  if (!isZohoConfigured()) return null;
  return performZohoRequest(async () => {
    const response = await axios.post<ZohoItemResponse>(
      `https://books.zoho.com/api/v3/items`,
      {
        name: product.name,
        description: product.description,
        rate: product.price,
        sku: product.id || product._id,
        product_type: 'goods',
        unit: 'Nos',
        tax_id: null,
        is_inclusive_tax: false,
      },
      {
        headers: getZohoHeaders(),
        params: {
          organization_id: process.env.ZOHO_ORG_ID,
        },
      }
    );
    console.log('[Zoho] Item created:', product.name);
    return response.data;
  });
}

export async function updateZohoStock(product: {
  zoho_item_id?: string;
  price: number;
  available: boolean;
}) {
  if (!isZohoConfigured()) return null;
  if (!product.zoho_item_id) {
    console.warn('[Zoho] Skipping update — no zoho_item_id');
    return null;
  }

  return performZohoRequest(async () => {
    const response = await axios.put(
      `https://books.zoho.com/api/v3/items/${product.zoho_item_id}`,
      {
        rate: product.price,
        active: product.available,
      },
      {
        headers: getZohoHeaders(),
        params: {
          organization_id: process.env.ZOHO_ORG_ID,
        },
      }
    );
    console.log('[Zoho] Item updated:', product.zoho_item_id);
    return response.data;
  });
}

export async function fetchZohoItems() {
  if (!isZohoConfigured()) return { items: [] };
  return performZohoRequest(async () => {
    const response = await axios.get(`https://books.zoho.com/api/v3/items`, {
      headers: getZohoHeaders(),
      params: {
        organization_id: process.env.ZOHO_ORG_ID,
        per_page: 50,
      },
    });
    console.log(`[Zoho] Fetched ${response.data?.items?.length || 0} items`);
    return response.data;
  });
}
