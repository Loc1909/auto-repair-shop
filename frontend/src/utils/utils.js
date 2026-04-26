export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch {
        return "N/A";
    }
};

export function formatPrice(price) {
  if (!price && price !== 0) return null;
  
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return null;
  
  return num.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}