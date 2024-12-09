export const formatPrice = (price: string, hasDecimals: boolean = false, currency: string = 'USD') => {
  return parseFloat(price).toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: +price >= 100 && !hasDecimals ? 0 : 2,
    maximumFractionDigits: +price >= 100 && !hasDecimals ? 0 : 2,
  });
};

export const getDiscountPercentage = (base_price: string, price: string) => {
  return (((parseFloat(base_price) - parseFloat(price)) / parseFloat(base_price)) * 100).toFixed();
};

export const showDiscount = (discountable: boolean, discountPercentage: string) => {
  return discountable && discountPercentage !== '0';
};
