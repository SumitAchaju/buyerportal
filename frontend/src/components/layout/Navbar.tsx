import { NavLink, Outlet, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogoutButton } from "../auth/LogoutButton";
import { Button } from "../ui/button";
import { Building2 } from "lucide-react";
import { useSessionStore } from "@/store/auth-store";

export default function NavBar() {
  const navigate = useNavigate();

  const { user } = useSessionStore();
  return (
    <div className="min-h-screen bg-[#f5f4f0]">
      {/* Grid texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 48px)",
        }}
      />

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-zinc-900 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-zinc-900 tracking-tight">
              Buyer Portal
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/properties"
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-colors",
                  {
                    "text-zinc-900 bg-zinc-200": isActive,
                  },
                )
              }
            >
              Properties
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg transition-colors",
                  {
                    "text-zinc-900 bg-zinc-200": isActive,
                  },
                )
              }
            >
              Dashboard
            </NavLink>
          </nav>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2.5 cursor-pointer">
                <span className="text-sm text-zinc-500 hidden sm:block">
                  {user?.name}
                </span>
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center">
                    {user?.name[0] || "U"}
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="py-2">
              <DropdownMenuItem className="w-50">
                <Button
                  variant={"ghost"}
                  onClick={() => navigate("/properties")}
                >
                  <Building2 /> Properties
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <Outlet />
      </main>
    </div>
  );
}
