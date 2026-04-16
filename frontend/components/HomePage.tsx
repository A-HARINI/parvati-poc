'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import HeroSlider from './HeroSlider';
import CategoryBoxes from './CategoryBoxes';
import BrandsSection from './BrandsSection';

interface HomePageProps {
  categories: string[];
  brands: string[];
}

export default function HomePage({ categories, brands }: HomePageProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
      router.push('/products');
    } else {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  const handleBrandClick = (brand: string) => {
    router.push(`/products?brand=${encodeURIComponent(brand)}`);
  };

  return (
    <>
      <Navbar
        searchValue={search}
        onSearchChange={handleSearch}
        cartCount={0}
        categories={categories}
        selectedCategory="All"
        onCategoryChange={handleCategoryClick}
      />

      <div className="mx-auto max-w-[1440px]">
        <HeroSlider
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
        <CategoryBoxes
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
        <BrandsSection
          brands={brands}
          onBrandClick={handleBrandClick}
        />
      </div>

      {/* Footer spacer */}
      <div className="pb-10" />
    </>
  );
}
