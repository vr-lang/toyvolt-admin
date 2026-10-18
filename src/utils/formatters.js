/**
 * Formatting utilities for Toyvolt Admin Console (INR currency, dates, export)
 */

export const formatCurrencyINR = (amount, { isPaise = false } = {}) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const rupees = isPaise ? Math.round(Number(amount) / 100) : Number(amount);
  return `₹${rupees.toLocaleString('en-IN')}`;
};

export const formatINR = (amount, isPaise = false) => {
  const isP = typeof isPaise === 'boolean' ? isPaise : Boolean(isPaise?.isPaise);
  return formatCurrencyINR(amount, { isPaise: isP });
};

export const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return Number(val).toLocaleString('en-IN');
};

export const formatDateIST = (dateInput) => {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '—';
  }
};

export const formatDateTimeIST = (dateInput) => {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '—';
  }
};

export const getTodayFormatted = () => {
  const now = new Date();
  return now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
};

export const downloadCSV = (filename, csvRows) => {
  const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
