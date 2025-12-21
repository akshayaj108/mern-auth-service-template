export function calculateDiscount(price: number, discountRate: number): number {
  return price - (price * discountRate) / 100;
}
