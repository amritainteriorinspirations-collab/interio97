import { Wrench, Shield, Truck } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: Wrench,
      label: "Installation Services Available",
    },
    {
      icon: Shield,
      label: "Amrita Interior Design Assured",
    },
    {
      icon: Truck,
      label: "Doorstep Delivery",
    },
  ];

  return (
    <div className="bg-gray-50 rounded-md border border-gray-200 p-3 sm:p-4">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="bg-orange-700/90 text-white rounded-full p-2.5 mb-2">
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-[12px] sm:text-sm font-medium text-gray-900">
                {badge.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}