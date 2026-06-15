"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, LayoutGrid, Phone, Menu, X } from "lucide-react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/compare", label: "Bandingkan", icon: LayoutGrid },
    { href: "/lead", label: "Hubungi WO Partner", icon: Phone },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 h-10 w-10 rounded-full bg-white border border-border shadow-md flex items-center justify-center"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header with nav */}
        <div className="h-14 border-b border-border flex items-center px-4 gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo-images/logo-dinikahin.png"
              alt="dinikahin.com"
              className="h-6 w-6 rounded-full object-contain"
            />
            <span className="font-heading text-base font-bold">
              dinikahin<span className="text-[#C9A84C]">.com</span>
            </span>
          </Link>

          {/* Step indicators */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map((item, i) => (
              <div key={item.href} className="flex items-center">
                {i > 0 && (
                  <span className="text-muted-foreground/30 mx-0.5 text-xs">›</span>
                )}
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 lg:w-96 border-l border-border bg-[#FFFCF5] shrink-0 overflow-y-auto">
        <ChatSidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="md:hidden fixed right-0 top-0 h-full w-80 max-w-[85vw] z-50 bg-[#FFFCF5] border-l border-border shadow-xl overflow-y-auto">
            <ChatSidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}
    </div>
  );
}
