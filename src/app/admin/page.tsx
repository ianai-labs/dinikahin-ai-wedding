"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Sparkles,
  TrendingUp,
  PhoneCall,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

// Mock lead data
const mockLeads = [
  { id: "l1", name: "Rina & Adi", phone: "081234567890", email: "rina@email.com", venueInterest: "Palma One Grand Ballroom", status: "pending", date: "2026-06-14" },
  { id: "l2", name: "Dina & Rizky", phone: "081298765432", email: null, venueInterest: "Balai Sudirman", status: "contacted", date: "2026-06-13" },
  { id: "l3", name: "Sari & Andi", phone: "087812345678", email: "sari@email.com", venueInterest: "Hotel Mulia", status: "converted", date: "2026-06-12" },
  { id: "l4", name: "Putri & Bayu", phone: "085611223344", email: null, venueInterest: "Palma One Grand Ballroom", status: "lost", date: "2026-06-10" },
];

const stats = {
  total: 12,
  pending: 5,
  contacted: 3,
  converted: 2,
  lost: 2,
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  contacted: "Dihubungi",
  converted: "Konversi",
  lost: "Hilang",
};

export default function AdminPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredLeads = filter === "all" ? mockLeads : mockLeads.filter((l) => l.status === filter);

  return (
    <div className="h-full overflow-y-auto bg-[#FFFCF5]">
      <div className="px-6 py-6">
        <h1 className="font-heading text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Total Leads", value: stats.total, icon: Users, color: "text-[#0A1E3D]" },
            { label: "Pending", value: stats.pending, icon: TrendingUp, color: "text-amber-600" },
            { label: "Dihubungi", value: stats.contacted, icon: PhoneCall, color: "text-blue-600" },
            { label: "Konversi", value: stats.converted, icon: CheckCircle, color: "text-green-600" },
            { label: "Hilang", value: stats.lost, icon: XCircle, color: "text-red-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-border rounded-xl p-4">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {["all", "pending", "contacted", "converted", "lost"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${filter === s ? "bg-[#C9A84C] text-white" : "bg-white border border-border hover:border-[#C9A84C]"}`}
            >
              {s === "all" ? "Semua" : statusLabels[s]}
            </button>
          ))}
        </div>

        {/* Leads Table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-[#F5F5F4]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Nama</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Kontak</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">Venue</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground hidden md:table-cell">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FFFCF5] transition-colors">
                    <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {lead.phone}{lead.email && <><br />{lead.email}</>}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground hidden sm:table-cell">{lead.venueInterest}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell">{lead.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
