import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/tethra/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateWorkspace } from "@/hooks/useTethra";
import { useWorkspaceToken } from "@/lib/workspace-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tethra — Target. Do. Prioritise. Complete." },
      {
        name: "description",
        content:
          "Tethra is a calm personal whiteboard for your tasks: set a target, do the work, prioritise what matters and clear it.",
      },
      { property: "og:title", content: "Tethra — Target. Do. Prioritise. Complete." },
      {
        property: "og:description",
        content: "A minimal personal task whiteboard. No accounts, just your workspace key.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { word: "Target", copy: "Say when it happens — today, this week, later." },
  { word: "Do", copy: "One board, one glance, no project-management theatre." },
  { word: "Prioritise", copy: "High, medium, low. That's the whole system." },
  { word: "Complete", copy: "Tick it, it clears, and the founder gets the note." },
];

function Landing() {
  const navigate = useNavigate();
  const { token, ready, save } = useWorkspaceToken();
  const create = useCreateWorkspace();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");

  useEffect(() => {
    if (ready && token) void navigate({ to: "/board" });
  }, [ready, token, navigate]);

  async function onCreate(event: React.FormEvent) {
    event.preventDefault();
    try {
      const result = await create.mutateAsync({ name: name.trim(), email: email.trim() });
      save(result.token);
      toast.success("Workspace ready");
      void navigate({ to: "/board" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the workspace");
    }
  }

  function onRestore(event: React.FormEvent) {
    event.preventDefault();
    const value = key.trim();
    if (!/^[0-9a-f-]{36}$/i.test(value)) {
      toast.error("That doesn't look like a workspace key");
      return;
    }
    save(value);
    void navigate({ to: "/board" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Wordmark />
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <section className="grid gap-10 py-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Personal digital whiteboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Target. Do.
              <br />
              Prioritise. Complete.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Tethra keeps everything you owe yourself on one quiet board. No sprints, no boards of
              boards — just what's next and when.
            </p>

            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              {STEPS.map((step) => (
                <div key={step.word} className="rounded-xl border border-border bg-card p-4">
                  <dt className="font-display text-sm font-semibold uppercase tracking-wide">
                    {step.word}
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{step.copy}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="board-surface rounded-2xl border border-border p-5 sm:p-7">
            <LogoMark className="h-8 w-8 text-marker" />
            <h2 className="mt-4 text-xl font-semibold">Start your workspace</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No password. We store a workspace key in this browser — keep it safe to use Tethra
              elsewhere.
            </p>

            <form onSubmit={onCreate} className="mt-5 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="ws-name">Your name</Label>
                <Input
                  id="ws-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Palesa"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ws-email">Email</Label>
                <Input
                  id="ws-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create workspace"}
              </Button>
            </form>

            <form onSubmit={onRestore} className="mt-6 space-y-2 border-t border-border pt-5">
              <Label htmlFor="ws-key">Already have a workspace key?</Label>
              <div className="flex gap-2">
                <Input
                  id="ws-key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="0000-0000…"
                />
                <Button type="submit" variant="secondary">
                  Open
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
