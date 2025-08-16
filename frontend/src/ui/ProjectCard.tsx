import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "../graphql/mutations";
import type { ProjectFormValues } from "./ProjectForm";
import ProjectForm from "./ProjectForm";
import type { Project } from "../types";
import { LIST_PROJECTS } from "../graphql/queries";

export default function ProjectCard({ project }: { project: Project }) {
  const pct = project.taskCount ? Math.round((project.completedTasks / project.taskCount) * 100) : 0;
  const statusColor = { ACTIVE: "bg-green-500", COMPLETED: "bg-blue-600", ON_HOLD: "bg-yellow-500" }[project.status];

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    // optimistic UI (optional)
    optimisticResponse: (vars) => ({
      updateProject: {
        __typename: "UpdateProject",
        project: {
          __typename: "ProjectType",
          id: vars.id,
          name: vars.name ?? project.name,
          description: vars.description ?? project.description,
          status: vars.status ?? project.status,
          dueDate: vars.dueDate ?? project.dueDate,
          taskCount: project.taskCount,
          completedTasks: project.completedTasks,
        },
      },
    }),
    refetchQueries: [{ query: LIST_PROJECTS, variables: { search: "" } }],
  });

  const handleEdit = (vals: ProjectFormValues) => {
    updateProject({ variables: { id: project.id, name: vals.name, description: vals.description, status: vals.status, dueDate: vals.dueDate } });
  };

  return (
    <div className="rounded-2xl border p-4 hover:shadow transition">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${statusColor}`} />
        <h3 className="font-semibold">{project.name}</h3>
        <span className="ml-auto text-xs text-gray-500">{project.dueDate ?? "No due"}</span>
      </div>

      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{project.description}</p>

      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded">
          <div className="h-2 bg-gray-800 rounded" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs text-gray-500 mt-1">{project.completedTasks}/{project.taskCount} done</div>
      </div>

      <div className="mt-3 flex justify-end">
        <ProjectForm
          triggerLabel="Edit"
          initial={{
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            dueDate: project.dueDate ?? undefined,
          }}
          onSubmit={handleEdit}
        />
      </div>
    </div>
  );
}
