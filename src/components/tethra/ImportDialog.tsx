import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTasks, useSaveProject } from "@/hooks/useTethra";
import { parseBulkList, parseStructuredList, TARGETS } from "@/lib/tethra-types";

/** Bulk paste (one task per line) and structured paste (headings + target). */
export function ImportDialog({
  open,
  onOpenChange,
  token,
  defaults,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string | null;
  defaults: { priority: string; target: string };
}) {
  const [bulk, setBulk] = useState("");
  const [structured, setStructured] = useState("");
  const createTasks = useCreateTasks(token);
  const saveProject = useSaveProject(token);

  const preview = parseStructuredList(structured);

  async function importBulk() {
    const titles = parseBulkList(bulk);
    if (!titles.length) return;
    await createTasks.mutateAsync({
      projectId: null,
      tasks: titles.map((title) => ({
        title,
        priority: defaults.priority,
        target_type: defaults.target,
      })),
    } as never);
    toast.success(`${titles.length} tasks added`);
    setBulk("");
    onOpenChange(false);
  }

  async function importStructured() {
    if (!preview.tasks.length) return;
    let projectId: string | null = null;
    if (preview.projectName) {
      const project = await saveProject.mutateAsync({
        name: preview.projectName,
        target: preview.target,
      });
      projectId = project.id;
    }
    const target =
      TARGETS.find((t) => t.toLowerCase() === (preview.target ?? "").toLowerCase()) ??
      defaults.target;
    await createTasks.mutateAsync({
      projectId,
      tasks: preview.tasks.map((task) => ({
        title: task.title,
        group_label: task.group_label,
        priority: defaults.priority,
        target_type: target,
      })),
    } as never);
    toast.success(`${preview.tasks.length} tasks imported`);
    setStructured("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import tasks</DialogTitle>
          <DialogDescription>Paste a list and Tethra turns it into cards.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="bulk">
          <TabsList className="w-full">
            <TabsTrigger value="bulk" className="flex-1">
              Bulk list
            </TabsTrigger>
            <TabsTrigger value="structured" className="flex-1">
              Structured
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk" className="space-y-3 pt-3">
            <Label htmlFor="bulk-input">One task per line</Label>
            <Textarea
              id="bulk-input"
              rows={9}
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
              placeholder={"Call the printer\nDraft launch email\nBook flights"}
            />
            <DialogFooter>
              <Button onClick={importBulk} disabled={!bulk.trim() || createTasks.isPending}>
                Add {parseBulkList(bulk).length || ""} tasks
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="structured" className="space-y-3 pt-3">
            <Label htmlFor="structured-input">Board name, TARGET line, headings, tasks</Label>
            <Textarea
              id="structured-input"
              rows={9}
              value={structured}
              onChange={(e) => setStructured(e.target.value)}
              placeholder={"LAUNCH WEEK\nTARGET: THIS WEEK\nMARKETING\n- Write the announcement\n- Schedule posts"}
            />
            {preview.tasks.length ? (
              <p className="text-xs text-muted-foreground">
                {preview.projectName ? `Project “${preview.projectName}” · ` : ""}
                {preview.target ? `${preview.target} · ` : ""}
                {preview.tasks.length} tasks detected
              </p>
            ) : null}
            <DialogFooter>
              <Button
                onClick={importStructured}
                disabled={!preview.tasks.length || createTasks.isPending}
              >
                Import
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
