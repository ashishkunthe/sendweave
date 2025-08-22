import { Handle, Position } from "@xyflow/react";

export function WaitNode({ data }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 w-48">
      <h3 className="text-sm font-bold text-yellow-600 mb-2">⏳ Wait Node</h3>
      <input
        type="text"
        placeholder="Delay (e.g. 1 min)"
        value={data.delay || ""}
        onChange={(e) => (data.delay = e.target.value)}
        className="w-full border px-2 py-1 text-sm rounded"
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
