import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Package,
  Search,
  IndianRupee,
  AlertCircle,
  Loader2,
  Check,
  ShoppingBag,
  CreditCard,
  Banknote,
  Truck
} from 'lucide-react';
import { productService } from '../../services/productService';
import { formatINR } from '../../services/orderService';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry'
];

export const CreateManualOrderModal = ({
  isOpen = false,
  onClose,
  onOrderCreated
}) => {
  // Product catalog state
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  // Order items state
  const [items, setItems] = useState([]);

  // Customer & Address state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Delhi');
  const [postalCode, setPostalCode] = useState('');

  // Payment method: 'cod' or 'razorpay'
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load products when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProducts();
      // Reset form
      setItems([]);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('Delhi');
      setPostalCode('');
      setPaymentMethod('cod');
      setError(null);
    }
  }, [isOpen]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await productService.getProducts({ limit: 100 });
      const prods = res.products || [];
      setCatalogProducts(prods.filter(p => p.isActive && !p.isArchived));
    } catch (err) {
      console.error('Failed to load products for manual order:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (!isOpen) return null;

  // Filtered products for dropdown selection
  const filteredCatalog = catalogProducts.filter(p => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  // Add item from dropdown
  const handleAddItem = (productId) => {
    if (!productId) return;
    const found = catalogProducts.find(p => p._id === productId);
    if (!found) return;

    // Check if already in items list
    const existingIndex = items.findIndex(it => it.productId === productId);
    if (existingIndex >= 0) {
      // Increment quantity if stock permits
      const existing = items[existingIndex];
      const maxStock = found.availableStock ?? 999;
      if (existing.quantity < maxStock) {
        const nextItems = [...items];
        nextItems[existingIndex].quantity += 1;
        setItems(nextItems);
      }
    } else {
      // Add new
      setItems([
        ...items,
        {
          productId: found._id,
          name: found.name,
          sku: found.sku,
          imageUrl: found.images?.[0]?.url || '',
          unitPricePaise: found.price || 0,
          quantity: 1,
          availableStock: found.availableStock ?? 0
        }
      ]);
    }
    setSelectedProductId('');
  };

  const updateItemQty = (index, delta) => {
    const next = [...items];
    const current = next[index];
    const newQty = current.quantity + delta;

    if (newQty <= 0) {
      next.splice(index, 1);
    } else if (newQty <= current.availableStock) {
      current.quantity = newQty;
    }
    setItems(next);
  };

  const removeItem = (index) => {
    const next = [...items];
    next.splice(index, 1);
    setItems(next);
  };

  // Calculations
  const subtotalPaise = items.reduce((acc, it) => acc + (it.unitPricePaise * it.quantity), 0);
  const isFreeShipping = subtotalPaise >= 99900; // >= ₹999
  const shippingFeePaise = items.length === 0 ? 0 : (isFreeShipping ? 0 : 9900); // ₹99
  const finalAmountPaise = subtotalPaise + shippingFeePaise;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (items.length === 0) {
      setError('Please add at least one product to create an order.');
      return;
    }

    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (!addressLine1.trim()) {
      setError('Address Line 1 is required.');
      return;
    }

    if (!city.trim()) {
      setError('City is required.');
      return;
    }

    if (!postalCode.trim() || postalCode.replace(/\D/g, '').length !== 6) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }

    // Auto-generate email if empty for direct counter orders
    const emailToUse = customerEmail.trim() || `counter_${cleanPhone}@toyvolt.com`;

    const payload = {
      customerName: customerName.trim(),
      customerEmail: emailToUse,
      paymentMethod,
      directItems: items.map(it => ({
        productId: it.productId,
        quantity: it.quantity
      })),
      items: items.map(it => ({
        productId: it.productId,
        quantity: it.quantity
      })),
      shippingAddress: {
        fullName: customerName.trim(),
        phone: cleanPhone,
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: 'India'
      }
    };

    setSubmitting(true);
    try {
      await onOrderCreated(payload);
      onClose();
    } catch (err) {
      console.error('Failed to create manual order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create manual order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F7F3EB] border-4 border-[#171717] shadow-[8px_8px_0px_#171717] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-[#171717] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-[#171717] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#315FE8] border border-white" />
            <div>
              <h3 className="font-mono font-bold text-sm tracking-wider uppercase text-white">
                CREATE MANUAL ORDER // PHONE & COUNTER BOOKING
              </h3>
              <p className="text-[10px] font-mono text-gray-400">
                Direct booking into inventory with atomic stock reservation
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

        {/* Scrollable Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border-2 border-red-500 p-3 flex items-start gap-2.5 text-xs text-red-900 font-mono">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">ERROR:</span> {error}
              </div>
            </div>
          )}

          {/* Section 1: Item Catalog Selection */}
          <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
            <div className="flex items-center justify-between border-b-2 border-[#171717] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#315FE8]" />
                <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#171717]">
                  1. Line Items & Product Selection
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#E8EEFF] text-[#315FE8] px-2 py-0.5 border border-[#315FE8]">
                {items.length} ITEMS SELECTED
              </span>
            </div>

            {/* Product dropdown search & add */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
              <div className="md:col-span-8">
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    if (e.target.value) handleAddItem(e.target.value);
                  }}
                  disabled={loadingProducts}
                  className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:bg-white"
                >
                  <option value="">
                    {loadingProducts ? 'Loading Catalog...' : '-- Select Product to Add --'}
                  </option>
                  {filteredCatalog.map(prod => (
                    <option
                      key={prod._id}
                      value={prod._id}
                      disabled={prod.availableStock <= 0}
                    >
                      {prod.name} | SKU: {prod.sku} | {formatINR(prod.price, true)} | Stock: {prod.availableStock ?? 0}
                      {prod.availableStock <= 0 ? ' [OUT OF STOCK]' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4 flex items-center gap-1.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search catalog..."
                    className="w-full bg-white border-2 border-[#171717] pl-7 pr-2 py-2 text-xs font-mono focus:outline-none"
                  />
                  <Search size={12} className="absolute left-2.5 top-3 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Selected items table */}
            {items.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 p-6 text-center text-xs font-mono text-gray-500">
                No products added yet. Select a product from the dropdown above to add items to this order.
              </div>
            ) : (
              <div className="border-2 border-[#171717] overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-[#171717] text-white">
                      <th className="p-2 border-r border-[#333]">Product</th>
                      <th className="p-2 border-r border-[#333] w-24">Price</th>
                      <th className="p-2 border-r border-[#333] w-32 text-center">Quantity</th>
                      <th className="p-2 border-r border-[#333] w-28 text-right">Subtotal</th>
                      <th className="p-2 w-12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.productId} className="border-b border-[#171717] hover:bg-[#F7F3EB]/50">
                        <td className="p-2 border-r border-[#171717]">
                          <div className="flex items-center gap-2">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-8 h-8 object-cover border border-[#171717] bg-white shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 border border-[#171717] flex items-center justify-center shrink-0">
                                <Package size={14} className="text-gray-500" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-xs truncate max-w-[240px] text-[#171717]">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                SKU: {item.sku} | Avail: {item.availableStock}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 border-r border-[#171717] font-bold">
                          {formatINR(item.unitPricePaise, true)}
                        </td>
                        <td className="p-2 border-r border-[#171717]">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateItemQty(idx, -1)}
                              className="w-6 h-6 border border-[#171717] bg-white hover:bg-gray-200 font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateItemQty(idx, 1)}
                              disabled={item.quantity >= item.availableStock}
                              className="w-6 h-6 border border-[#171717] bg-white hover:bg-gray-200 font-bold flex items-center justify-center disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-2 border-r border-[#171717] text-right font-bold">
                          {formatINR(item.unitPricePaise * item.quantity, true)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2: Customer & Shipping Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Contact */}
            <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
              <div className="border-b-2 border-[#171717] pb-2 mb-3">
                <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#171717]">
                  2. Customer Information
                </h4>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block font-bold text-[#171717] mb-1">
                    CUSTOMER FULL NAME <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#171717] mb-1">
                    PHONE NUMBER (10 DIGITS) <span className="text-red-600">*</span>
                  </label>
                  <div className="flex">
                    <span className="bg-[#171717] text-white px-2.5 py-2 border-2 border-[#171717] font-bold text-xs flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full bg-[#F7F3EB] border-2 border-l-0 border-[#171717] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[#171717] mb-1">
                    EMAIL ADDRESS (OPTIONAL)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Leave blank to auto-assign in-store direct buyer account.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
              <div className="border-b-2 border-[#171717] pb-2 mb-3">
                <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#171717]">
                  3. Delivery Destination
                </h4>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block font-bold text-[#171717] mb-1">
                    ADDRESS LINE 1 <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / Flat / Building No., Street"
                    className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#171717] mb-1">
                    ADDRESS LINE 2 (LANDMARK / AREA)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Near Landmark / Sector"
                    className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#171717] mb-1">
                      CITY <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. New Delhi"
                      className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-2 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#171717] mb-1">
                      PIN CODE <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="110001"
                      className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-2 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[#171717] mb-1">
                    STATE <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#F7F3EB] border-2 border-[#171717] px-3 py-2 text-xs font-mono focus:outline-none focus:bg-white"
                  >
                    {INDIAN_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method & Financial Summary */}
          <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-4">
            <div className="border-b-2 border-[#171717] pb-2 mb-3">
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-[#171717]">
                4. Payment & Commercial Summary
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Payment selector */}
              <div>
                <label className="block font-mono font-bold text-xs text-[#171717] mb-2">
                  PAYMENT METHOD
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`border-2 p-3 cursor-pointer flex flex-col justify-between transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#171717] bg-[#FFD983] shadow-[3px_3px_0px_#171717]'
                        : 'border-[#171717] bg-[#F7F3EB] hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Banknote size={18} className="text-[#171717]" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#171717]"
                      />
                    </div>
                    <p className="font-mono font-bold text-xs text-[#171717]">CASH ON DELIVERY</p>
                    <p className="font-mono text-[10px] text-gray-700">Collect cash upon courier delivery</p>
                  </label>

                  <label
                    className={`border-2 p-3 cursor-pointer flex flex-col justify-between transition-colors ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#171717] bg-[#315FE8] text-white shadow-[3px_3px_0px_#171717]'
                        : 'border-[#171717] bg-[#F7F3EB] hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard size={18} className={paymentMethod === 'razorpay' ? 'text-white' : 'text-[#171717]'} />
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-white"
                      />
                    </div>
                    <p className={`font-mono font-bold text-xs ${paymentMethod === 'razorpay' ? 'text-white' : 'text-[#171717]'}`}>
                      PREPAID ONLINE
                    </p>
                    <p className={`font-mono text-[10px] ${paymentMethod === 'razorpay' ? 'text-blue-100' : 'text-gray-700'}`}>
                      Paid via UPI, Card, Netbanking
                    </p>
                  </label>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-[#F7F3EB] border-2 border-[#171717] p-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal ({items.reduce((acc, it) => acc + it.quantity, 0)} items):</span>
                  <span className="font-bold">{formatINR(subtotalPaise, true)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span className="flex items-center gap-1">
                    <Truck size={12} /> Shipping Fee:
                  </span>
                  <span className="font-bold">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 bg-emerald-100 px-1 border border-emerald-400">FREE</span>
                    ) : (
                      formatINR(shippingFeePaise, true)
                    )}
                  </span>
                </div>
                <div className="border-t-2 border-[#171717] pt-2 flex items-center justify-between text-sm font-bold text-[#171717]">
                  <span>TOTAL PAYABLE:</span>
                  <span className="text-base text-[#315FE8] bg-white px-2 py-0.5 border border-[#171717]">
                    {formatINR(finalAmountPaise, true)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t-2 border-[#171717]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-[#171717] font-mono font-bold text-xs border-2 border-[#171717] shadow-[2px_2px_0px_#171717]"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="px-6 py-2 bg-[#315FE8] hover:bg-[#254bc4] text-white font-mono font-bold text-xs border-2 border-[#171717] shadow-[3px_3px_0px_#171717] disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  CREATING ORDER...
                </>
              ) : (
                <>
                  <Check size={14} />
                  CONFIRM & PLACE ORDER [{formatINR(finalAmountPaise, true)}]
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManualOrderModal;
