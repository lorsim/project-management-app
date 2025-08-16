import { useEffect, useState } from "react";

/** Listens for window 'app-error' events and shows a dismissible banner. */
export default function ErrorToaster() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const onErr = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setMsg(detail);
      // auto-hide after 6s
      const t = setTimeout(() => setMsg(null), 6000);
      return () => clearTimeout(t);
    };
    window.addEventListener("app-error", onErr as EventListener);
    return () => window.removeEventListener("app-error", onErr as EventListener);
  }, []);

  if (!msg) return null;
  return (
    <div className="fixed top-3 inset-x-0 z-50 mx-auto max-w-3xl">
      <div className="mx-3 rounded-xl bg-red-600 text-white shadow p-3 flex items-start gap-3">
        <span className="font-semibold">Error</span>
        <span className="opacity-90">{msg}</span>
        <button className="ml-auto underline opacity-90 hover:opacity-100" onClick={()=>setMsg(null)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
