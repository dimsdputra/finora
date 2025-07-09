export const getCurrency = (countryCode: string | undefined): Currency => {
  switch (countryCode) {
    case "ID":
      return "IDR";
    case "US":
      return "USD";
    case "IN":
      return "INR";
    case "SG":
      return "SGD";
    case "MY":
      return "MYR";
    case "JP":
      return "JPY";
    case "KR":
      return "KRW";
    case "CN":
      return "CNY";
    case "EU":
    case "AD":
    case "AT":
    case "BE":
    case "DE":
    case "FI":
    case "FR":
    case "IE":
    case "IT":
    case "PT":
    case "ES":
      return "EUR";
    case "AU":
      return "AUD";
    case "GB":
      return "GBP";
    default:
      return "USD"; // Default to USD if country code is not recognized
  }
};

export const getCurrencySymbol = (currency: Currency | undefined) => {
  switch (currency) {
    case "IDR":
      return "Rp";
    case "USD":
      return "&#36;";
    case "EUR":
      return "&#8364;";
    case "JPY":
      return "&#165;";
    case "KRW":
      return "&#8361;";
    case "SGD":
      return "&#36;";
    case "CNY":
      return "&#165;";
    case "INR":
      return "&#8377;";
    case "MYR":
      return "RM";
    case "AUD":
      return "&#36;";
    case "GBP":
      return "&#163;";
    default:
      return "&#36;";
  }
};

export const getCurrentMonth = () => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();
  const currentMonth = monthNames[now.getMonth()];

  return currentMonth;
};
