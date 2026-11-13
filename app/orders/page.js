"use client";

export default function OrdersPage() {
  const orders = [
    {
      id: "ORD123",
      date: "2025-09-15",
      status: "Delivered",
      total: 199,
    },
    {
      id: "ORD124",
      date: "2025-09-20",
      status: "Shipped",
      total: 129,
    },
    {
      id: "ORD125",
      date: "2025-09-25",
      status: "Processing",
      total: 89,
    },
  ];

  return (
    <main className="min-h-screen bg-darkBg text-lightText px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-darkCard p-6 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-mutedText text-sm">{order.date}</p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={
                    order.status === "Delivered"
                      ? "text-green-400"
                      : order.status === "Shipped"
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }
                >
                  {order.status}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">${order.total}</p>
              <button href={`/orders/${order.id}`} className="mt-2 text-accent hover:underline text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
