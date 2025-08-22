import { Handle, Position } from "@xyflow/react";

export function EmailNode({ data }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 w-64">
      <h3 className="text-sm font-bold text-indigo-600 mb-2">📧 Email Node</h3>
      <input
        type="text"
        placeholder="To"
        value={data.to || ""}
        onChange={(e) => (data.to = e.target.value)}
        className="w-full border px-2 py-1 text-sm rounded mb-2"
      />
      <input
        type="text"
        placeholder="Subject"
        value={data.subject || ""}
        onChange={(e) => (data.subject = e.target.value)}
        className="w-full border px-2 py-1 text-sm rounded mb-2"
      />
      <textarea
        placeholder="Body"
        value={data.body || ""}
        onChange={(e) => (data.body = e.target.value)}
        className="w-full border px-2 py-1 text-sm rounded"
      />

      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
