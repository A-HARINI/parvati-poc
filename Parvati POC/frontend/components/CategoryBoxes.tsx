'use client';

interface CategoryBoxesProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
}

const categoryData: Record<string, { icon: string; bg: string; border: string; text: string; description: string; tagline: string }> = {
  'Food Consumer Goods': {
    icon: '🍫',
    bg: 'bg-amber-50',
    border: 'border-amber-200 hover:border-amber-400',
    text: 'text-amber-700',
    description: 'Snacks, beverages, confectionery & everyday food items from top brands',
    tagline: 'Best Sellers',
  },
  'NON Food Consumer Goods': {
    icon: '🧴',
    bg: 'bg-blue-50',
    border: 'border-blue-200 hover:border-blue-400',
    text: 'text-blue-700',
    description: 'Personal care, stationery, household essentials & more',
    tagline: 'Essentials',
  },
  'Pet Care Brands': {
    icon: '🐾',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200 hover:border-emerald-400',
    text: 'text-emerald-700',
    description: 'Premium pet food, treats & care products for your furry friends',
    tagline: 'Top Picks',
  },
};

const defaultData = {
  icon: '🛍️',
  bg: 'bg-gray-50',
  border: 'border-gray-200 hover:border-gray-400',
  text: 'text-gray-700',
  description: 'Explore our curated selection of quality products',
  tagline: 'Shop Now',
};

export default function CategoryBoxes({ categories, onCategoryClick }: CategoryBoxesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-4 sm:mx-6 mt-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Shop by Category</h2>
          <p className="mt-2 max-w-lg text-sm text-text-secondary leading-relaxed">
            Explore our carefully curated categories — from everyday essentials to the latest in tech, find exactly what you need.
          </p>
        </div>
        <button
          onClick={() => onCategoryClick('All')}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-cta hover:text-cta-dark transition"
        >
          View All Products →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const data = categoryData[cat] || defaultData;
          return (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className={`group relative flex items-start gap-4 rounded-2xl border-2 ${data.border} ${data.bg} p-5 text-left transition-all duration-200 hover:shadow-card hover:-translate-y-1`}
            >
              <span className="flex-shrink-0 text-4xl transition-transform duration-200 group-hover:scale-110">
                {data.icon}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-base font-bold ${data.text}`}>{cat}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${data.bg} ${data.text} ring-1 ring-current/20`}>
                    {data.tagline}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {data.description}
                </p>
              </div>
              <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium ${data.text} opacity-0 transition-opacity group-hover:opacity-100`}>
                →
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onCategoryClick('All')}
        className="mt-4 w-full rounded-xl border-2 border-dashed border-border-color py-3 text-sm font-medium text-text-secondary transition hover:border-cta hover:text-cta sm:hidden"
      >
        View All Products →
      </button>
    </section>
  );
}
