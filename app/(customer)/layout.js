
export const metadata = {
  title: "Amrita Interior Design - Premium Flooring & Interior Materials",
  description: "Shop premium wooden flooring, tiles, wallpapers, and more",
};

export default async function CustomerLayout({ children }) {

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}