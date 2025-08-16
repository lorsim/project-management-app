import { DndContext} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useQuery, useMutation} from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import { PROJECT_TASKS } from "../graphql/queries";
import { UPDATE_TASK_STATUS } from "../graphql/mutations";
import type { Task, TaskStatus } from "../types";

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

type ProjectTasksQuery = { projectTasks: Task[] };
type ProjectTasksVars = { projectId: string };

type UpdateTaskStatusVars = { id: string; status: TaskStatus };
type GqlTaskRef = {
  __typename: "TaskType";
  id: string;
  status: TaskStatus;
};
type UpdateTaskStatusMutation = {
  updateTaskStatus: {
    __typename: "UpdateTaskStatus";
    task: GqlTaskRef;
  };
};

const PROJECT_TASKS_TDN = PROJECT_TASKS as TypedDocumentNode<ProjectTasksQuery, ProjectTasksVars>;

export default function TaskBoardDnD({ projectId }: { projectId: string }) {
  const { data, loading } = useQuery<ProjectTasksQuery, ProjectTasksVars>(
    PROJECT_TASKS_TDN,
    { variables: { projectId } }
  );

  const [updateStatus] = useMutation<UpdateTaskStatusMutation, UpdateTaskStatusVars>(
    UPDATE_TASK_STATUS
  );

  if (loading) return <div className="p-4 animate-pulse">Loading tasks…</div>;

  const byStatus: Record<TaskStatus, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
  (data?.projectTasks ?? []).forEach((t: Task) => {
    byStatus[t.status].push(t);
  });

  const onDragEnd = (e: DragEndEvent) => {
    const taskId = String(e.active.id);
    const target = e.over ? (String(e.over.id) as TaskStatus) : undefined;
    if (!target || !STATUSES.includes(target)) return;

    updateStatus({
      variables: { id: taskId, status: target },
      optimisticResponse: {
        updateTaskStatus: {
            __typename: "UpdateTaskStatus",
            task: { __typename: "TaskType", id: taskId, status: target }
        }
     },
      update(cache) {
        cache.modify({
          id: cache.identify({ __typename: "TaskType", id: taskId }),
          fields: { status: () => target }
        });
      }
    });
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid md:grid-cols-3 gap-4">
        {STATUSES.map((s) => (
          <StatusCol key={s} id={s} title={s} items={byStatus[s]} />
        ))}
      </div>
    </DndContext>
  );
}

function StatusCol({ id, title, items }: { id: TaskStatus; title: string; items: Task[] }) {
  return (
    <div id={id} className="rounded-2xl border p-3 min-h-[200px]">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} id={t.id} draggable className="cursor-move border rounded-xl p-2 bg-white shadow-sm">
            <div className="font-medium">{t.title}</div>
            <div className="text-xs text-gray-500">{t.assigneeEmail || "unassigned"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
