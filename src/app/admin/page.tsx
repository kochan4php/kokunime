import AdminDashboard from "@/components/admin-dashboard";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Admin · Kokunime Hub",
  robots: { index: false, follow: false },
};

// Ops dashboard: index warm-up, cache revalidation and metrics, all gated by
// ADMIN_TOKEN/METRICS_TOKEN on the API side. No secrets are stored server-side.
const AdminPage = (): JSX.Element => (
  <main className="container mx-auto min-h-screen px-4 py-10">
    <AdminDashboard />
  </main>
);

export default AdminPage;
