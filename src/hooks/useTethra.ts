import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import {
  createAttachmentUpload,
  createTasks,
  createWorkspace,
  deleteAttachment,
  deleteProject,
  deleteTask,
  getBoard,
  listAttachments,
  registerAttachment,
  saveProject,
  saveSettings,
  setTaskCompletion,
  updateTask,
} from "@/lib/tethra.functions";
import type { BoardData } from "@/lib/tethra-types";
import { useWorkspaceToken } from "@/lib/workspace-store";

/** Loads the whole board for the workspace key held in this browser. */
export function useBoard() {
  const { token, ready, save, reset } = useWorkspaceToken();
  const load = useServerFn(getBoard);

  const query = useQuery<BoardData>({
    queryKey: ["board", token],
    queryFn: () => load({ data: { token: token as string } }),
    enabled: Boolean(token),
    staleTime: 10_000,
  });

  return { token, ready, saveToken: save, resetToken: reset, ...query };
}

export function useCreateWorkspace() {
  const create = useServerFn(createWorkspace);
  return useMutation({
    mutationFn: (data: { name: string; email: string }) => create({ data }),
  });
}

/** Every board mutation refetches the board so all views stay in sync. */
function useBoardMutation<TArgs, TResult>(fn: (data: TArgs) => Promise<TResult>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["board"] }),
  });
}

export function useCreateTasks(token: string | null) {
  const call = useServerFn(createTasks);
  return useBoardMutation((data: { projectId?: string | null; tasks: Record<string, unknown>[] }) =>
    call({ data: { ...data, token: token as string } as never }),
  );
}

export function useUpdateTask(token: string | null) {
  const call = useServerFn(updateTask);
  return useBoardMutation((data: { id: string; patch: Record<string, unknown> }) =>
    call({ data: { ...data, token: token as string } as never }),
  );
}

export function useDeleteTask(token: string | null) {
  const call = useServerFn(deleteTask);
  return useBoardMutation((id: string) => call({ data: { id, token: token as string } }));
}

export function useToggleTask(token: string | null) {
  const call = useServerFn(setTaskCompletion);
  return useBoardMutation((data: { id: string; completed: boolean }) =>
    call({ data: { ...data, token: token as string } }),
  );
}

export function useSaveProject(token: string | null) {
  const call = useServerFn(saveProject);
  return useBoardMutation((data: { id?: string; name: string; target?: string | null }) =>
    call({ data: { ...data, token: token as string } }),
  );
}

export function useDeleteProject(token: string | null) {
  const call = useServerFn(deleteProject);
  return useBoardMutation((id: string) => call({ data: { id, token: token as string } }));
}

export function useSaveSettings(token: string | null) {
  const call = useServerFn(saveSettings);
  return useBoardMutation((data: Record<string, unknown>) =>
    call({ data: { ...data, token: token as string } as never }),
  );
}

export function useAttachments(token: string | null, taskId: string | null) {
  const call = useServerFn(listAttachments);
  return useQuery({
    queryKey: ["attachments", taskId],
    queryFn: () => call({ data: { token: token as string, taskId: taskId as string } }),
    enabled: Boolean(token && taskId),
  });
}

/** Signed direct-to-storage upload, then a row registered server-side. */
export function useUploadAttachment(token: string | null, taskId: string | null) {
  const prepare = useServerFn(createAttachmentUpload);
  const register = useServerFn(registerAttachment);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const slot = await prepare({
        data: { token: token as string, taskId: taskId as string, fileName: file.name },
      });
      const res = await fetch(slot.signedUrl, {
        method: "PUT",
        headers: { "content-type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      return register({
        data: {
          token: token as string,
          taskId: taskId as string,
          path: slot.path,
          fileName: file.name,
          mimeType: file.type || null,
          size: file.size,
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", taskId] }),
  });
}

export function useDeleteAttachment(token: string | null, taskId: string | null) {
  const call = useServerFn(deleteAttachment);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => call({ data: { id, token: token as string } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attachments", taskId] }),
  });
}
