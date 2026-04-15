'use client';

interface BrandsSectionProps {
  brands: string[];
  onBrandClick?: (brand: string) => void;
}

const brandLogos: Record<string, string> = {
  'lotus biscoff': '/brands/biscoff.png',
  'biscoff': '/brands/biscoff.png',
  'me-o': '/brands/meo.png',
  "palmer's": '/brands/palmers.png',
  'palmers': '/brands/palmers.png',
  'pentel': '/brands/pentel.png',
  'ovaltine': '/brands/ovaltine.png',
};

function getBrandLogo(brand: string): string | undefined {
  return brandLogos[brand.toLowerCase()];
}

export default function BrandsSection({ brands, onBrandClick }: BrandsSectionProps) {
  if (brands.length === 0) return null;

  return (
    <section className="mx-4 sm:mx-6 mt-10 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Top Brands</h2>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          Shop from trusted brands you love — quality products backed by names you can rely on.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {brands.map((brand) => {
          const logo = getBrandLogo(brand);
          return (
            <button
              key={brand}
              onClick={() => onBrandClick?.(brand)}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-border-color bg-white p-6 transition-all duration-200 hover:border-cta hover:shadow-card hover:-translate-y-1"
            >
              {logo ? (
                <div className="flex h-16 w-36 items-center justify-center">
                  <img
                    src={logo}
                    alt={brand}
                    className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold text-text-primary transition-colors group-hover:bg-cta-light group-hover:text-cta">
                  {brand.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                {brand}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
