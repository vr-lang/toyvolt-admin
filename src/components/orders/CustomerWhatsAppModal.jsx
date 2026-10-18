import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Send,
  Phone,
  User,
  Package,
  Truck,
  IndianRupee
} from 'lucide-react';
import { formatINR } from '../../services/orderService';

export const CustomerWhatsAppModal = ({
  order = null,
  isOpen = false,
  onClose
}) => {
  const [templateKey, setTemplateKey] = useState('confirmed');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (order) {
      applyTemplate(templateKey);
    }
  }, [order, templateKey]);

  if (!isOpen || !order) return null;

  const customerName = order.shippingAddress?.fullName || order.userId?.name || 'Customer';
  const rawPhone = order.shippingAddress?.phone || order.userId?.phone || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  // Format for WhatsApp: if 10 digits, prepend 91 (India)
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const orderNum = order.orderNumber || order._id;
  const amountStr = formatINR(order.finalAmount || 0, true);
  const isCod = order.paymentMethod === 'cod' || order.paymentId?.paymentMethod === 'cod';
  const courier = order.shipmentId?.courierName || 'our delivery partner';
  const awb = order.shipmentId?.awbCode || 'Pending Assignment';

  const applyTemplate = (key) => {
    setTemplateKey(key);
    let msg = '';
    if (key === 'confirmed') {
      msg = `Hi ${customerName}, your Toyvolt order #${orderNum} for ${amountStr} has been confirmed! We are carefully testing and packaging your items now. We will notify you once your order is picked up by the courier. Thank you for shopping with Toyvolt!`;
    } else if (key === 'dispatched') {
      msg = `Hi ${customerName}, great news! Your Toyvolt order #${orderNum} has been dispatched via ${courier}. AWB Tracking Number: ${awb}. You can monitor live transit updates on our portal. Thank you for choosing Toyvolt!`;
    } else if (key === 'delivery') {
      msg = `Hi ${customerName}, your Toyvolt order #${orderNum} is expected for delivery today! ${
        isCod
          ? `Please keep ${amountStr} ready for the courier partner.`
          : 'This order is fully prepaid, no additional payment is required.'
      } Please inspect the sealed box upon delivery.`;
    }
    setMessage(msg);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    if (!waPhone) {
      alert('No valid phone number found for this customer.');
      return;
    }
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${waPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F7F3EB] border-4 border-[#171717] shadow-[8px_8px_0px_#171717] w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#171717] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#171717] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 border border-white" />
            <div>
              <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-400" />
                WHATSAPP CUSTOMER DISPATCH NOTIFIER
              </h3>
              <p className="text-[10px] font-mono text-gray-400">
                Order #{orderNum} // {customerName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 bg-white hover:bg-[#FF5638] text-[#171717] hover:text-white flex items-center justify-center border border-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 font-mono text-xs overflow-y-auto">
          {/* Customer Metadata Card */}
          <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-3 grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-gray-500 uppercase block">Customer / Phone</span>
              <span className="font-bold text-[#171717] block truncate">{customerName}</span>
              <span className="text-emerald-700 font-bold block">{rawPhone ? `+91 ${cleanPhone.slice(-10)}` : 'No Phone'}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase block">Order Status / Amount</span>
              <span className="font-bold uppercase text-[#315FE8] block">{order.orderStatus || 'N/A'}</span>
              <span className="font-bold text-[#171717] block">{amountStr} ({isCod ? 'COD' : 'PREPAID'})</span>
            </div>
          </div>

          {/* Quick Template Selector */}
          <div>
            <label className="block font-bold uppercase mb-1.5 text-[#171717]">
              SELECT NOTIFICATION TEMPLATE:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('confirmed')}
                className={`p-2 border-2 text-[10px] font-bold text-center transition-colors ${
                  templateKey === 'confirmed'
                    ? 'border-[#171717] bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                    : 'border-[#171717] bg-white text-[#171717] hover:bg-gray-100'
                }`}
              >
                1. CONFIRMED
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('dispatched')}
                className={`p-2 border-2 text-[10px] font-bold text-center transition-colors ${
                  templateKey === 'dispatched'
                    ? 'border-[#171717] bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                    : 'border-[#171717] bg-white text-[#171717] hover:bg-gray-100'
                }`}
              >
                2. DISPATCHED & AWB
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('delivery')}
                className={`p-2 border-2 text-[10px] font-bold text-center transition-colors ${
                  templateKey === 'delivery'
                    ? 'border-[#171717] bg-[#315FE8] text-white shadow-[2px_2px_0px_#171717]'
                    : 'border-[#171717] bg-white text-[#171717] hover:bg-gray-100'
                }`}
              >
                3. OUT FOR DELIVERY
              </button>
            </div>
          </div>

          {/* Editable Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold uppercase text-[#171717]">
                MESSAGE CONTENT (EDITABLE):
              </label>
              <span className="text-[10px] text-gray-500">
                {message.length} characters
              </span>
            </div>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border-2 border-[#171717] p-3 text-xs font-mono focus:outline-none focus:bg-[#FFFDF9]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t-2 border-[#171717]">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 bg-white hover:bg-gray-100 text-[#171717] font-bold border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  COPIED TO CLIPBOARD
                </>
              ) : (
                <>
                  <Copy size={14} />
                  COPY TEXT
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              disabled={!waPhone}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-2 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center gap-2 disabled:opacity-40"
            >
              <Send size={14} />
              OPEN IN WHATSAPP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerWhatsAppModal;
