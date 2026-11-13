"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;

  // Static orders (later replace with DB/API fetch)
  const orders = [
    {
      id: "ORD123",
      date: "2025-09-15",
      status: "Delivered",
      total: 199,
      items: [
        { name: "Curated Product 1", qty: 1, price: 99 },
        { name: "Curated Product 2", qty: 1, price: 100 },
      ],
    },
    {
      id: "ORD124",
      date: "2025-09-20",
      status: "Shipped",
      total: 129,
      items: [{ name: "Curated Product 3", qty: 2, price: 64.5 }],
    },
    {
      id: "ORD125",
      date: "2025-09-25",
      status: "Processing",
      total: 89,
      items: [{ name: "Curated Product 4", qty: 1, price: 89 }],
    },
  ];

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <main className="min-h-screen bg-darkBg text-lightText flex items-center justify-center">
        <h1 className="text-2xl">Order not found</h1>
      </main>
    );
  }

  const steps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];
  const currentStep = steps.indexOf(order.status);

  return (
    <main className="min-h-screen bg-darkBg text-lightText px-6 py-12">
      <div className="max-w-4xl mx-auto bg-darkCard p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
        <p className="text-sm text-mutedText mb-6">
          {order.date} —{" "}
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

        {/* Timeline */}
        <div className="flex justify-between items-center mb-8 relative">
          {steps.map((step, index) => {
            const isActive = index <= currentStep;
            return (
              <div key={index} className="flex-1 text-center relative">
                {/* Dot */}
                <div
                  className={`w-6 h-6 mx-auto rounded-full ${
                    isActive ? "bg-accent" : "bg-line"
                  }`}
                ></div>
                <p className="mt-2 text-sm">{step}</p>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-3 left-1/2 w-full h-1 -z-10 ${
                      isActive ? "bg-accent" : "bg-line"
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Items */}
        <div className="space-y-4 mb-6">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between bg-darkBg p-4 rounded-lg shadow"
            >
              <span>
                {item.name} (x{item.qty})
              </span>
              <span>${item.price * item.qty}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span>${order.total}</span>
        </div>

        <div className="flex justify-between">
          <Link
            href="/orders"
            className="px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white transition"
          >
            Back to Orders
          </Link>
          <button className="px-6 py-2 rounded-lg bg-accent text-white font-semibold hover:bg-accentDark transition">
            Download Invoice
          </button>
        </div>
      </div>
    </main>
  );
}
