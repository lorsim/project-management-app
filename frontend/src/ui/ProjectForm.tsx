import { useState } from "react";
export default function ProjectForm({ onSubmit }: { onSubmit: (v: { name: string; description?: string; status?: string; dueDate?: string|null })=>void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE"); const [dueDate, setDueDate] = useState("");
  const submit = () => { if(!name.trim()) return alert("Name required");
    onSubmit({ name, description, status, dueDate: dueDate || null }); setOpen(false); setName(""); setDescription(""); setStatus("ACTIVE"); setDueDate(""); };
  return (
    <div>
      <button className="rounded bg-black text-white px-3 py-2" onClick={()=>setOpen(true)}>+ New</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center" onClick={()=>setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-[480px]" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Create Project</h3>
            <input className="w-full border p-2 rounded mb-2" placeholder="Name *" value={name} onChange={e=>setName(e.target.value)} />
            <textarea className="w-full border p-2 rounded mb-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
            <div className="flex gap-2">
              <select className="border p-2 rounded" value={status} onChange={e=>setStatus(e.target.value)}>
                <option>ACTIVE</option><option>COMPLETED</option><option>ON_HOLD</option>
              </select>
              <input type="date" className="border p-2 rounded" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
              <button className="ml-auto px-3 py-2 rounded bg-blue-600 text-white" onClick={submit}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
