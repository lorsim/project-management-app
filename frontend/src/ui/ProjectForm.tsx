import { useEffect, useState } from "react";

export type ProjectFormValues = {
  id?: string;               
  name: string;
  description?: string;
  status?: string;
  dueDate?: string | null;
};

export default function ProjectForm({
  initial,
  triggerLabel = "+ New",
  onSubmit,
}: {
  initial?: ProjectFormValues;                    
  triggerLabel?: string;                           // button label
  onSubmit: (vals: ProjectFormValues) => void;     // create or update
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [dueDate, setDueDate] = useState<string>("");

  const isEdit = !!initial?.id;

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");
    setStatus(initial?.status ?? "ACTIVE");
    setDueDate((initial?.dueDate as string) ?? "");
  }, [open, initial]);

  const submit = () => {
    if (!name.trim()) return alert("Name is required");
    onSubmit({ id: initial?.id, name, description, status, dueDate: dueDate || null });
    setOpen(false);
  };

  return (
    <div>
      <button
        className={`rounded-xl ${isEdit ? "border px-3 py-1" : "bg-black text-white px-4 py-2"}`}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-[480px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-medium mb-4">{isEdit ? "Edit Project" : "Create Project"}</h3>
            <div className="space-y-3">
              <input className="w-full border p-2 rounded" placeholder="Name *" value={name} onChange={(e)=>setName(e.target.value)} />
              <textarea className="w-full border p-2 rounded" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
              <select className="border p-2 rounded" value={status} onChange={(e)=>setStatus(e.target.value)}>
                <option>ACTIVE</option><option>COMPLETED</option><option>ON_HOLD</option>
              </select>
              <input type="date" className="border p-2 rounded" value={dueDate ?? ""} onChange={(e)=>setDueDate(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <button className="px-4 py-2" onClick={()=>setOpen(false)}>Cancel</button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={submit}>
                  {isEdit ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
