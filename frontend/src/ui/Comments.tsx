import { useQuery, useMutation } from "@apollo/client";
import { TASK_COMMENTS } from "../graphql/queries";
import { ADD_TASK_COMMENT } from "../graphql/mutations";
import { useState } from "react";

type TaskComment = {
  id: string;
  content: string;
  authorEmail: string;
  timestamp: string;
};

export default function Comments({ taskId }: { taskId: string }) {
  const { data, refetch } = useQuery(TASK_COMMENTS, { variables: { taskId } });
  const [text, setText] = useState("");
  const [add] = useMutation(ADD_TASK_COMMENT, {
    onCompleted: () => { setText(""); refetch(); },
  });
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {(data?.taskComments ?? []).map((c:TaskComment)=>(
          <div key={c.id} className="text-sm border rounded p-2">
            <div className="text-gray-600">{c.content}</div>
            <div className="text-xs text-gray-400 mt-1">{c.authorEmail}</div>
          </div>
        ))}
      </div>
      <textarea className="w-full border p-2 rounded" value={text} onChange={e=>setText(e.target.value)} placeholder="Add a comment…" />
      <button className="px-3 py-1 rounded bg-blue-600 text-white"
        onClick={()=>text.trim() && add({ variables: { taskId, content: text, authorEmail: "me@example.com" }})}>
        Comment
      </button>
    </div>
  );
}
