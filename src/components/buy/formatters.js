/**
 * Format currency in Indian numbering system (Crores / Lakhs)
 */
export function formatIndianPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2).replace(/\.?0+$/, '');
    return `₹${cr} Cr`;
  }
  if (num >= 100000) {
    const l = (num / 100000).toFixed(2).replace(/\.?0+$/, '');
    return `₹${l} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

export function formatFullPrice(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function calculatePricePerSqFt(price, area) {
  if (!price || !area || area <= 0) return null;
  const rate = Math.round(price / area);
  return `₹${rate.toLocaleString('en-IN')}/sq ft`;
}

export function formatArea(area, unit = 'sq ft') {
  if (!area) return 'N/A';
  return `${Number(area).toLocaleString('en-IN')} ${unit}`;
}

