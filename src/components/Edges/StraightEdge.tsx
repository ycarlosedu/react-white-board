import { EdgeProps, getStraightPath } from "reactflow";

export function StraightEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <path
      id={id}
      style={style}
      className="stroke-[3] fill-none stroke-zinc-300"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
}