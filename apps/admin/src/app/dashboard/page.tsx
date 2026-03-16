import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to UMESTAY host &amp; admin dashboard
          </p>
        </div>

        {/* Stats overview — to be implemented */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              { label: "Total Properties", value: "—" },
              { label: "Active Bookings", value: "—" },
              { label: "Revenue (MTD)", value: "—" },
              { label: "Occupancy Rate", value: "—" },
            ] as const
          ).map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-white p-6 shadow-sm border border-gray-200"
            >
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* TODO: Add property listings table, bookings calendar, revenue charts */}
      </div>
    </main>
  );
}
