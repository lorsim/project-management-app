import type{ Project } from "../types";
export default function ProjectCard({ project }: { project: Project }) {
  const pct = project.taskCount ? Math.round((project.completedTasks / project.taskCount) * 100) : 0;
  const color = { ACTIVE:"bg-green-500", COMPLETED:"bg-blue-600", ON_HOLD:"bg-yellow-500" }[project.status];
  return (
    <div className="border rounded-2xl p-4 hover:shadow transition">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        <h3 className="font-semibold">{project.name}</h3>
        <span className="ml-auto text-xs text-gray-500">{project.dueDate ?? "No due"}</span>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{project.description}</p>
      <div className="mt-3">
        <div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-gray-800 rounded" style={{width:`${pct}%`}} /></div>
        <div className="text-xs text-gray-500 mt-1">{project.completedTasks}/{project.taskCount} done</div>
      </div>
    </div>
  );
}
