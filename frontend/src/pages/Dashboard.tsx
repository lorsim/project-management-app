import { useQuery, useMutation } from "@apollo/client";
import { LIST_PROJECTS } from "../graphql/queries";
import { CREATE_PROJECT } from "../graphql/mutations";
import ProjectForm from "../ui/ProjectForm";
import ProjectCard from "../ui/ProjectCard";
import { useState } from "react";
import type{ Project } from "../types";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery(LIST_PROJECTS, { variables: { search } });
  const [createProject] = useMutation(CREATE_PROJECT, {
    optimisticResponse: (vars)=>({
      createProject:{ __typename:"CreateProject",
        project:{ __typename:"ProjectType", id:"temp-"+Math.random().toString(36).slice(2),
          name:vars.inputName, description:vars.description??"", status:vars.status??"ACTIVE", dueDate:vars.dueDate??null,
          taskCount:0, completedTasks:0 }}})
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <input className="ml-auto border rounded px-3 py-2" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} />
        <ProjectForm onSubmit={(v)=>createProject({ variables:{ inputName: v.name, ...v }, refetchQueries:[{query:LIST_PROJECTS, variables:{search}}] })} />
      </header>
      {loading && <div className="animate-pulse">Loading…</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data?.projects as Project[]|undefined)?.map(p=><ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  );
}
