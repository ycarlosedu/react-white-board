import { Trash } from "phosphor-react";
import { Edge, EdgeLabelRenderer, EdgeProps, getSimpleBezierPath, getSmoothStepPath, getStraightPath, useReactFlow } from "reactflow";

const backgroundColors = {
  yellow: "#ffcc00",
  red: "#ff0000",
  blue: "#008cff",
  transparent: "rgba(0, 0, 0, 0)",
}

type BackgroundColors = keyof typeof backgroundColors;

const fontColors = {
  yellow: "#ffcc00",
  red: "#ff0000",
  blue: "#008cff",
  black: "#000",
  white: "#FFF",
}

type FontColors = keyof typeof fontColors;

const getEdgeType = {
  default: getSmoothStepPath,
  smooth: getSimpleBezierPath,
  straight: getStraightPath
}

type EdgeTypes = keyof typeof getEdgeType;

export function DefaultEdge({
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
  selected
}: EdgeProps) {
  const getPath = getEdgeType[data?.edgeType as EdgeTypes] || getEdgeType.default;
  const [edgePath, labelX, labelY] = getPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { deleteElements, getEdge } = useReactFlow()
  const edge = getEdge(id)
  const foreignObjectSize = 400;

  const onEdgeClick = (evt: any, id: string) => {
    evt.stopPropagation();
    deleteElements({edges: [edge!]})
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className={`stroke-[3] fill-none ${selected ? 'stroke-zinc-500' : 'stroke-zinc-300'}`}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: backgroundColors[data?.labelColor as BackgroundColors] as string || backgroundColors.transparent,
            color: fontColors[data?.fontColor as FontColors] as string || fontColors.white,
          }}
          className="nodrag nopan pointer-events-auto p-3 rounded font-bold text-xs absolute"
        >
          <input type="text" value={data?.label} className="nopan pointer-events-auto bg-transparent outline-none text-center" />

          {selected && (
            <foreignObject
              width={foreignObjectSize}
              height={foreignObjectSize}
              // x={labelX - (foreignObjectSize / 2) - 50}
              x={labelX - foreignObjectSize / 2}
              y={labelY - foreignObjectSize / 2}
              requiredExtensions="http://www.w3.org/1999/xhtml"
            >
              <div
                className="bg-white rounded-2xl shadow-lg border border-zinc-300 px-2 gap-2 left-1/2 -translate-x-1/2 h-6 flex items-center justify-center absolute -top-10"
              >
                <button
                  className="nopan pointer-events-auto border-x border-zinc-300 w-5 h-full flex items-center justify-center text-xs text-black transition-all hover:bg-zinc-200"
                  onClick={(event) => onEdgeClick(event, id)}
                >
                  <Trash size={16} color="#cb1818" />
                </button>
              </div>
            </foreignObject>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
