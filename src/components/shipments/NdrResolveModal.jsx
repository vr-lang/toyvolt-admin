import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  RotateCcw, 
  Edit3, 
  ArrowLeftRight, 
  Send, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { shipmentService } from '../../services/shipmentService';

export default function NdrResolveModal({ 
  shipment, 
  isOpen, 
  onClose, 
  onSuccess 
}) {
  const [action, setAction] = useState('REATTEMPT'); // 'REATTEMPT' | 'UPDATE_INFO' | 'RTO'
  const [reattemptDate, setReattemptDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [altAddress, setAltAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !shipment) return null;

  const awb = shipment.trackingNumber || shipment.awbNumber || 'PENDING_AWB';
  const recipient = shipment.order?.shippingAddress || shipment.shippingAddress || {};
  const currentPhone = recipient.phone || shipment.order?.user?.phone || 'N/A';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await shipmentService.resolveNdr(shipment._id, {
        action,
        comments: remarks,
        reattemptDate: action === 'REATTEMPT' ? reattemptDate : undefined,
        updatedPhone: action === 'UPDATE_INFO' ? altPhone : undefined,
        updatedAddress: action === 'UPDATE_INFO' ? altAddress : undefined,
      });

      if (onSuccess) {
        onSuccess(`NDR Action [${action}] transmitted to carrier for AWB ${awb}`);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit NDR resolution instruction');
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
            <AlertTriangle className="w-5 h-5 text-white" />
            <h3 className="font-mono font-black text-base uppercase tracking-tight">
              RESOLVE NDR INSTRUCTION
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 border-2 border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100 shadow-[2px_2px_0px_#000]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-100 border-2 border-red-600 text-red-900 font-mono text-xs font-bold">
              ERROR: {error}
            </div>
          )}

          {/* Dossier Header */}
          <div className="p-3 bg-white border-2 border-neutral-900 shadow-[2px_2px_0px_#000] flex justify-between items-center text-xs">
            <div>
              <div className="font-mono text-neutral-500 font-bold uppercase text-[10px]">TARGET CONSIGNMENT</div>
              <div className="font-mono font-black text-neutral-900">AWB: {awb}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-neutral-500 font-bold uppercase text-[10px]">FAILED REASON</div>
              <div className="font-mono font-bold text-[#FF5638]">
                {shipment.ndrReason || 'Customer Unavailable'}
              </div>
            </div>
          </div>

          {/* Select Action Strategy */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-black uppercase text-neutral-900">
              Select Carrier Directive
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAction('REATTEMPT')}
                className={`p-3 border-2 border-neutral-900 font-mono text-xs font-bold text-center flex flex-col items-center gap-1.5 transition-all ${
                  action === 'REATTEMPT' 
                    ? 'bg-[#315FE8] text-white shadow-[3px_3px_0px_#000] translate-x-0.5 translate-y-0.5' 
                    : 'bg-white text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>RE-ATTEMPT</span>
              </button>

              <button
                type="button"
                onClick={() => setAction('UPDATE_INFO')}
                className={`p-3 border-2 border-neutral-900 font-mono text-xs font-bold text-center flex flex-col items-center gap-1.5 transition-all ${
                  action === 'UPDATE_INFO' 
                    ? 'bg-[#FFD983] text-neutral-900 shadow-[3px_3px_0px_#000] translate-x-0.5 translate-y-0.5' 
                    : 'bg-white text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>UPDATE INFO</span>
              </button>

              <button
                type="button"
                onClick={() => setAction('RTO')}
                className={`p-3 border-2 border-neutral-900 font-mono text-xs font-bold text-center flex flex-col items-center gap-1.5 transition-all ${
                  action === 'RTO' 
                    ? 'bg-[#FF5638] text-white shadow-[3px_3px_0px_#000] translate-x-0.5 translate-y-0.5' 
                    : 'bg-white text-neutral-800 hover:bg-neutral-100'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>RETURN (RTO)</span>
              </button>
            </div>
          </div>

          {/* Conditional Inputs */}
          {action === 'REATTEMPT' && (
            <div className="space-y-2 p-3 bg-white border-2 border-neutral-900">
              <label className="block text-xs font-mono font-bold text-neutral-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#315FE8]" />
                SCHEDULED RE-ATTEMPT DATE (OPTIONAL)
              </label>
              <input
                type="date"
                value={reattemptDate}
                onChange={(e) => setReattemptDate(e.target.value)}
                className="w-full p-2 bg-[#F7F3EB] border border-neutral-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#315FE8]"
              />
              <p className="text-[10px] font-mono text-neutral-500">
                Default: Carrier will schedule priority re-attempt on next working dispatch shift.
              </p>
            </div>
          )}

          {action === 'UPDATE_INFO' && (
            <div className="space-y-3 p-3 bg-white border-2 border-neutral-900">
              <div>
                <label className="block text-xs font-mono font-bold text-neutral-900 flex items-center gap-1 mb-1">
                  <Phone className="w-3.5 h-3.5 text-[#315FE8]" />
                  CONFIRMED ALTERNATIVE PHONE
                </label>
                <input
                  type="tel"
                  placeholder={`Current: ${currentPhone}`}
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full p-2 bg-[#F7F3EB] border border-neutral-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#315FE8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-900 flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#315FE8]" />
                  REVISED LANDMARK / ADDRESS DETAIL
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near gate 2, call security upon arrival"
                  value={altAddress}
                  onChange={(e) => setAltAddress(e.target.value)}
                  className="w-full p-2 bg-[#F7F3EB] border border-neutral-900 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#315FE8]"
                />
              </div>
            </div>
          )}

          {action === 'RTO' && (
            <div className="p-3 bg-[#FF5638]/10 border-2 border-[#FF5638] text-xs font-mono text-neutral-900 space-y-1">
              <p className="font-bold text-[#FF5638]">WARNING: RETURN TO ORIGIN (RTO)</p>
              <p className="text-[11px] text-neutral-700">
                This instructs the courier to immediately terminate delivery attempts and reverse dispatch back to origin warehouse. Reverse logistics fees will apply.
              </p>
            </div>
          )}

          {/* Remarks / Comments */}
          <div className="space-y-1">
            <label className="block text-xs font-mono font-bold uppercase text-neutral-900">
              OPERATIONAL REMARKS / DISPATCH NOTE
            </label>
            <textarea
              rows={2}
              required
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., Customer verified availability via phone, please deliver after 4 PM."
              className="w-full p-2.5 bg-white border-2 border-neutral-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#315FE8]"
            />
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
              disabled={loading}
              className="px-5 py-2 border-2 border-neutral-900 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-black shadow-[3px_3px_0px_#000] flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              {loading ? 'TRANSMITTING...' : 'DISPATCH DIRECTIVE'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
