export default function AddressSelector({
  addresses,
  selected,
  onSelect,
}) {
  return (
    <div className="bg-white border rounded p-6">
      <h2 className="text-lg font-semibold mb-4">
        Shipping Address
      </h2>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <label
            key={addr._id}
            className={`block border rounded p-4 cursor-pointer ${
              selected === addr._id
                ? "border-orange-500 bg-orange-50"
                : ""
            }`}
          >
            <input
              type="radio"
              checked={selected === addr._id}
              onChange={() => onSelect(addr._id)}
              className="mr-2"
            />
            <p className="text-sm font-medium">{addr.name}</p>
            <p className="text-sm text-gray-600">
              {addr.addressLine1}, {addr.city},{" "}
              {addr.state} – {addr.pincode}
            </p>
          </label>
        ))}
      </div>
    </div>
  );
}
