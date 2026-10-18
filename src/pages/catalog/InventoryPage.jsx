import React from 'react';
import { Boxes } from 'lucide-react';
import PlaceholderPage from '../../components/common/PlaceholderPage';

export const InventoryPage = () => {
  return (
    <PlaceholderPage
      title="Stock & Low Inventory"
      category="CATALOG // INVENTORY"
      description="Real-time stock audits, replenishment threshold triggers, supplier order tracking, and fast batch adjustments."
      icon={Boxes}
    />
  );
};

export default InventoryPage;
