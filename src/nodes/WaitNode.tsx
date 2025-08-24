import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

export function WaitNode({ id, data, selected }: NodeProps) {
  return (
    <div
      className={`p-3 rounded-lg shadow-lg border-2 ${
        selected ? "border-green-400" : "border-gray-300"
      } bg-white w-60`}
    >
      <h3 className="font-bold text-green-600 mb-2">⏳ Wait Node</h3>

      <input
        // @ts-ignore
        value={data.delay}
        // @ts-ignore
        onChange={(e) => data.onChange(id, "delay", e.target.value)}
        placeholder="Delay (e.g. 1 minute)"
        className="w-full px-2 py-1 border rounded"
      />

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
