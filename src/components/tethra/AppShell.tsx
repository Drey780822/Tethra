import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Monitor, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearToken, useTheme, useWorkspaceToken, type ThemeChoice } from "@/lib/workspace-store";

const NAV = [
  { to: "/board", label: "Board" },
  { to: "/completed", label: "Completed" },
  { to: "/settings", label: "Settings" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options: { value: ThemeChoice; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Light theme" },
    { value: "dark", icon: Moon, label: "Dark theme" },
    { value: "system", icon: Monitor, label: "System theme" },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border bg-card p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          aria-pressed={theme === option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground",
            theme === option.value && "bg-secondary text-foreground",
          )}
        >
          <option.icon className="h-3.5 w-3.5" aria-hidden />
        </button>
      ))}
    </div>
  );
}

export function SignOutButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      aria-label="Sign out of this device"
      onClick={() => {
        clearToken();
        void navigate({ to: "/", replace: true });
      }}
    >
      <LogOut className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">Sign out</span>
    </Button>
  );
}

export function AppShell({ children, action }: { children: ReactNode; action?: ReactNode }) {
  const { token, ready } = useWorkspaceToken();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/board" className="shrink-0">
            <Wordmark />
          </Link>
          <nav aria-label="Main" className="order-3 w-full sm:order-none sm:w-auto">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    activeProps={{ className: "bg-secondary text-foreground" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {ready && token ? <SignOutButton /> : null}
            {action}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}

export function EmptyWorkspace() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
      <h1 className="text-xl font-semibold">No workspace on this device</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Create one or paste your workspace key to pick up where you left off.
      </p>
      <Button asChild className="mt-5">
        <Link to="/">Get started</Link>
      </Button>
    </div>
  );
}
