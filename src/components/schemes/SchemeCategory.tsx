import React from 'react';
import { SchemeCard } from './SchemeCard';
import type { SchemeCategory as SchemeCategoryType } from '../../types/scheme';

interface SchemeCategoryProps {
  category: SchemeCategoryType;
}

export function SchemeCategory({ category }: SchemeCategoryProps) {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{category.title}</h2>
        <p className="text-gray-600 mt-1">{category.titleHindi}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {category.schemes.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}
      </div>
    </div>
  );
}