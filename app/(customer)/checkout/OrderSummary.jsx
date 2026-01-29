export default function OrderSummary({
  cart,
  placingOrder,
  onPlaceOrder,
}) {
  const { totals } = cart;

  return (
    <div className="bg-white border rounded p-6 space-y-4 sticky top-24 h-fit">
      <h2 className="text-lg font-semibold">
        Order Summary
      </h2>

      <div className="space-y-2 text-sm">
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between"
          >
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>₹{item.pricing.lineFinalTotal}</span>
          </div>
        ))}
      </div>

      <hr />

      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Total Market Price</span>
          <span>₹{totals.totalOriginalPrice}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{totals.totalDiscount}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span>₹{totals.deliveryCharge}</span>
        </div>
      </div>

      <hr />

      <div className="flex justify-between font-semibold text-lg">
        <span>Total Payable</span>
        <span>₹{totals.grandTotal}</span>
      </div>

      {totals.totalDiscount > 0 && (
        <p className="text-sm text-green-600">
          You will save ₹{totals.totalDiscount} on this order
        </p>
      )}

      <button
        onClick={onPlaceOrder}
        disabled={placingOrder}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold"
      >
        {placingOrder ? "Placing Order…" : "Place Order"}
      </button>
    </div>
  );
}
