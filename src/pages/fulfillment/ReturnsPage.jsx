import React from 'react';
import { RotateCcw } from 'lucide-react';
import PlaceholderPage from '../../components/common/PlaceholderPage';

export const ReturnsPage = () => {
  return (
    <PlaceholderPage
      title="Unbox & Returns"
      category="FULFILLMENT // REVERSE LOGISTICS"
      description="Inspect customer unboxing video submissions, approve replacement dispatches, authorize refunds, and manage return courier pickups."
      icon={RotateCcw}
    />
  );
};

export default ReturnsPage;
