import React, { useState } from 'react';
import { X, Tag, AlertCircle, Loader2, Check } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'placed', label: 'Placed (Awaiting Confirmation)', color: 'bg-amber-100 text-amber-900 border-amber-400' },
  { value: 'confirmed', label: 'Confirmed (Inventory Reserved)', color: 'bg-blue-100 text-blue-900 border-blue-400' },
  { value: 'processing', label: 'Processing (Ready for Dispatch)', color: 'bg-[#DCE5FF] text-[#315FE8] border-[#315FE8]' },
  { value: 'shipped', label: 'Shipped (In-Transit with Courier)', color: 'bg-emerald-100 text-emerald-900 border-emerald-400' },
  { value: 'delivered', label: 'Delivered (Handed to Customer)', color: 'bg-green-100 text-green-900 border-green-400' },
  { value: 'cancelled', label: 'Cancelled (Release Reserved Stock)', color: 'bg-red-100 text-red-900 border-red-400' }
];

export const UpdateOrderStatusModal = ({
  order = null,
  isOpen = false,
  onClose,
  onConfirmUpdate
}) => {
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || 'confirmed');
  const [cancellationReason, setCancellationReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.orderStatus || 'confirmed');
      setCancellationReason(order.cancellationReason || '');
      setError(null);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStatus === 'cancelled' && !cancellationReason.trim()) {
      setError('Please provide a reason for cancelling this order.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onConfirmUpdate(order._id, selectedStatus, cancellationReason.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update order status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white border-4 border-[#171717] shadow-[6px_6px_0px_#171717] w-full max-w-md overflow-hidden font-mono">
        {/* Header */}
        <div className="bg-[#171717] text-white px-4 py-3 flex items-center justify-between border-b-2 border-[#171717]">
          <div className="flex items-center gap-2">
            <Tag size={15} className="text-[#315FE8]" />
            <h3 className="font-bold text-xs uppercase tracking-wider">
              Update Order Status // {order.orderNumber || order._id}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 bg-red-50 border-2 border-[#FF5638] text-[#FF5638] text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-[#171717] mb-2">
              Select Target Lifecycle Status
            </label>
            <div className="space-y-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center justify-between p-2.5 border-2 cursor-pointer transition-all ${
                    selectedStatus === opt.value
                      ? 'border-[#315FE8] bg-[#DCE5FF]/40 shadow-[2px_2px_0px_#315FE8]'
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="orderStatus"
                      value={opt.value}
                      checked={selectedStatus === opt.value}
                      onChange={() => setSelectedStatus(opt.value)}
                      className="accent-[#315FE8]"
                    />
                    <span className="text-xs font-bold text-[#171717]">{opt.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedStatus === 'cancelled' && (
            <div>
              <label className="block text-xs font-bold uppercase text-[#FF5638] mb-1">
                Cancellation Reason *
              </label>
              <textarea
                rows={2}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g. Customer requested cancellation before dispatch / Wrong address"
                className="w-full bg-[#FAF8F5] border-2 border-[#171717] p-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
              />
            </div>
          )}

          <div className="pt-2 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-xs font-bold uppercase border-2 border-[#171717]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-[#315FE8] hover:bg-[#254bc0] text-white text-xs font-bold uppercase border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting && <Loader2 size={13} className="animate-spin" />}
              <span>Save Status</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderStatusModal;
