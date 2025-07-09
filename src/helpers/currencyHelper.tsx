export const FormatCurrency = (value: number, currency: Currency | undefined) => {
  if (isNaN(value)) {
    return "-";
  }

  const formatValues = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return formatValues;
};
