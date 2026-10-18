import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { shipmentService } from '../../services/shipmentService';

export default function BulkNdrModal({ 
  isOpen, 
  onClose, 
  selectedShipmentIds = [], 
  totalNdrCount = 0,
  onSuccess 
}) {
  const [comments, setComments] = useState('Customer re-confirmed availability via automated IVR/SMS. Proceed with priority redelivery.');
  const [reattemptDate, setReattemptDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const isSelectedBatch = selectedShipmentIds.length > 0;
  const countToProcess = isSelectedBatch ? selectedShipmentIds.length : totalNdrCount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await shipmentService.bulkNdrReattempt({
        shipmentIds: isSelectedBatch ? selectedShipmentIds : undefined,
        comments,
        reattemptDate: reattemptDate || undefined,
      });

      if (onSuccess) {
        onSuccess(res.message || `Successfully broadcast re-attempt instructions for ${res.resolvedCount || countToProcess} consignments.`);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to execute bulk NDR re-attempt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#FFF9F0] border-4 border-neutral-900 shadow-[8px_8px_0px_#000] w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#FF5638] text-white p-4 border-b-2 border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-white" />
            <h3 className="font-mono font-black text-base uppercase tracking-tight">
              BULK NDR RE-ATTEMPT PROTOCOL
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 border-2 border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-100 border-2 border-red-600 text-red-900 font-mono text-xs font-bold">
              ERROR: {error}
            </div>
          )}

          <div className="p-4 bg-white border-2 border-neutral-900 shadow-[2px_2px_0px_#000] space-y-2">
            <div className="text-xs font-mono font-black uppercase text-neutral-900 flex items-center justify-between">
              <span>SCOPE OF BATCH TRANSMISSION</span>
              <span className="px-2 py-0.5 bg-[#FF5638] text-white font-mono text-[10px]">
                {countToProcess} PARCELS TARGETED
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-mono">
              {isSelectedBatch 
                ? `Transmitting carrier dispatch override for ${selectedShipmentIds.length} specifically selected consignments.`
                : `Transmitting carrier dispatch override for all ${totalNdrCount} active NDR cases pending re-attempt instruction across all carriers.`}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold uppercase text-neutral-900">
              DISPATCH CARRIER INSTRUCTION (BROADCAST)
            </label>
            <textarea
              rows={3}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2.5 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold uppercase text-neutral-900">
              MANDATORY RE-ATTEMPT DATE (OPTIONAL)
            </label>
            <input
              type="date"
              value={reattemptDate}
              onChange={(e) => setReattemptDate(e.target.value)}
              className="w-full p-2 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
            />
            <p className="text-[10px] font-mono text-neutral-500">
              Leave blank to allow courier automated scheduling for immediate next available delivery cycle.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t-2 border-neutral-900">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border-2 border-neutral-900 bg-white hover:bg-neutral-100 font-mono text-xs font-bold text-neutral-800"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || countToProcess === 0}
              className="px-5 py-2 border-2 border-neutral-900 bg-[#FF5638] hover:bg-[#e04529] text-white font-mono text-xs font-black shadow-[3px_3px_0px_#000] flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {loading ? 'BROADCASTING...' : `BROADCAST RE-ATTEMPT (${countToProcess})`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
