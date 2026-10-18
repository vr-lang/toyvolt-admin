import React from 'react';
import { Tags } from 'lucide-react';
import PlaceholderPage from '../../components/common/PlaceholderPage';

export const CategoriesPage = () => {
  return (
    <PlaceholderPage
      title="Categories & Tags"
      category="CATALOG // TAXONOMY"
      description="Manage toy categories, age filter brackets, collection banners, and tag taxonomy for navigation in the customer storefront."
      icon={Tags}
    />
  );
};

export default CategoriesPage;
