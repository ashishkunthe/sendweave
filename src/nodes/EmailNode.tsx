import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

export function EmailNode({ id, data, selected }: NodeProps) {
  return (
    <div
      className={`p-3 rounded-lg shadow-lg border-2 ${
        selected ? "border-blue-400" : "border-gray-300"
      } bg-white w-60`}
    >
      <h3 className="font-bold text-blue-600 mb-2">📧 Email Node</h3>

      <input
        // @ts-ignore
        value={data.to}
        // @ts-ignore
        onChange={(e) => data.onChange(id, "to", e.target.value)}
        placeholder="Recipient email"
        className="w-full mb-2 px-2 py-1 border rounded"
      />

      <input // @ts-ignore
        value={data.subject} // @ts-ignore
        onChange={(e) => data.onChange(id, "subject", e.target.value)}
        placeholder="Subject"
        className="w-full mb-2 px-2 py-1 border rounded"
      />

      <textarea // @ts-ignore
        value={data.body} // @ts-ignore
        onChange={(e) => data.onChange(id, "body", e.target.value)}
        placeholder="Body"
        className="w-full px-2 py-1 border rounded"
      />

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
