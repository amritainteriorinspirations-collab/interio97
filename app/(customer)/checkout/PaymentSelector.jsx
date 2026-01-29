export default function PaymentSelector({ value, onChange }) {
  return (
    <div className="bg-white border rounded p-6">
      <h2 className="text-lg font-semibold mb-4">
        Payment Method
      </h2>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="radio"
          checked={value === "COD"}
          onChange={() => onChange("COD")}
        />
        Cash on Delivery
      </label>

      <label className="flex items-center gap-2 text-sm mt-2">
        <input
          type="radio"
          checked={value === "PREPAID"}
          onChange={() => onChange("PREPAID")}
        />
        Online Payment (Razorpay)
      </label>
    </div>
  );
}
