import React from 'react';
import { PlugZap } from 'lucide-react';
import PlaceholderPage from '../../components/common/PlaceholderPage';

export const IntegrationsPage = () => {
  return (
    <PlaceholderPage
      title="API & Indian Logistics"
      category="SYSTEM // INTEGRATIONS"
      description="Manage Shiprocket courier API tokens, Razorpay test/live key pairs, Resend transactional email webhooks, and Cloudinary media upload presets."
      icon={PlugZap}
    />
  );
};

export default IntegrationsPage;
