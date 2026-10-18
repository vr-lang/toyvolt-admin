import React from 'react';
import { Settings } from 'lucide-react';
import PlaceholderPage from '../../components/common/PlaceholderPage';

export const SettingsPage = () => {
  return (
    <PlaceholderPage
      title="Store Settings"
      category="SYSTEM // CONFIGURATION"
      description="Configure free shipping thresholds (currently ₹999), COD convenience fees, store contact credentials, GST identification numbers, and operating hours."
      icon={Settings}
    />
  );
};

export default SettingsPage;
