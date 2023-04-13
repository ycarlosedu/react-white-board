import { useState } from "react";
import { Trash, PaintBucket, BezierCurve, At } from "phosphor-react";
import { EdgeLabelRenderer, EdgeProps, addEdge, getSimpleBezierPath, getSmoothStepPath, getStraightPath, useReactFlow } from "reactflow";
import Tooltip from "../Tooltip";
import Dropdown from "../Dropdown";

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
  const [edgeTypeValue, setEdgeTypeValue] = useState<EdgeTypes>(data?.edgeType || 'default')
  const getPath = getEdgeType[edgeTypeValue as EdgeTypes];

  const [edgePath, labelX, labelY] = getPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const backgroundColor = backgroundColors[data?.labelColor as BackgroundColors] as string || backgroundColors.blue
  const fontColor = fontColors[data?.fontColor as FontColors] as string || fontColors.black

  const [labelValue, setLabelValue] = useState(data?.label)
  const [labelColorValue, setLabelColorValue] = useState(backgroundColor)
  const [fontColorValue, setFontColorValue] = useState(fontColor)

  const { deleteElements, getEdge, setEdges } = useReactFlow()
  const edge = getEdge(id)

  const onEdgeDelete = (event: any) => {
    event.stopPropagation();
    deleteElements({edges: [edge!]})
  };

  const handleOnChangeLabelValue = (event: any) => {
    event.stopPropagation();
    setLabelValue(event.target.value)
  }

  const handleOnChangeBgValue = (event: any) => {
    event.stopPropagation();
    setLabelColorValue(event.target.value)
    handleUpdateEdge()
  }

  const handleOnChangeFontValue = (event: any) => {
    event.stopPropagation();
    setFontColorValue(event.target.value)
    handleUpdateEdge()
  }

  const handleUpdateEdge = () => {
    deleteElements({edges: [edge!]})
    edge && setEdges((prevEdges) => addEdge({
      ...edge,
      id: crypto.randomUUID(),
      data: {
        label: 'Hi!',
        labelColor: labelColorValue,
        fontColor: fontColorValue,
        edgeType: edgeTypeValue,
      }
    }, prevEdges))
  }

  const handleSelectNewShape = (shape: EdgeTypes) => {
    setEdgeTypeValue(shape)
    handleUpdateEdge()
  }

  const itemsEdgeType = [
    {
      text: 'Default',
      onClick: () => handleSelectNewShape('default')
    },
    {
      text: 'Smooth',
      onClick: () => handleSelectNewShape('smooth')
    },
    {
      text: 'Straight',
      onClick: () => handleSelectNewShape('straight')
    }
  ]
  
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
            border: '2px solid ' + labelColorValue,
            color: fontColorValue,
          }}
          className="nodrag nopan pointer-events-auto p-1 min-w-0 rounded font-bold text-xs absolute"
        >
          <input 
            maxLength={20} 
            onChange={handleOnChangeLabelValue}  
            onBlur={handleUpdateEdge} 
            type="text" 
            value={labelValue} 
            className="nopan pointer-events-auto w-full min-w-0 bg-transparent outline-none text-center" 
          />

          {selected && (
            <div
              className="bg-white rounded-2xl shadow-lg border border-zinc-300 px-2 left-1/2 -translate-x-1/2 h-6 flex items-center justify-center absolute -top-10"
            >
              <Tooltip text="Delete Edge">
                <button
                  className="nopan pointer-events-auto px-1 border-zinc-300 w-6 h-full flex gap-1 items-center justify-center text-xs text-black transition-all hover:bg-zinc-200"
                  onClick={onEdgeDelete}
                >
                  <Trash size={16} color="#cb1818" />
                </button>
              </Tooltip>

              <Dropdown tooltip="Change Edge Type" items={itemsEdgeType}>
                <button 
                  className="nopan pointer-events-auto px-1 border-zinc-300 w-6 h-full flex gap-1 items-center justify-center text-xs text-black transition-all hover:bg-zinc-200"
                  aria-label="Change Edge Type">
                  <BezierCurve size={16} />
                </button>
              </Dropdown>

              <Tooltip text="Change Border Color">
                <div
                  className="nopan pointer-events-auto px-1 border-zinc-300 w-12 h-full flex gap-1 items-center justify-center text-xs text-black transition-all hover:bg-zinc-200"
                >
                  <PaintBucket size={16} color={backgroundColor} />
                  <input
                    value={labelColorValue}
                    onChange={handleOnChangeBgValue}
                    type="color" className="nopan pointer-events-auto w-1/2 h-full bg-transparent" 
                  />
                </div>
              </Tooltip>

              <Tooltip text="Change Font Color">
                <div
                  className="nopan pointer-events-auto px-1 border-zinc-300 w-12 h-full flex gap-1 items-center justify-center text-xs text-black transition-all hover:bg-zinc-200"
                >
                  <At size={16} color={fontColor} />
                  <input
                    value={fontColorValue}
                    onChange={handleOnChangeFontValue}
                    type="color" className="nopan pointer-events-auto w-1/2 h-full bg-transparent" 
                  />
                </div>
              </Tooltip>

            </div>
          )} 

        </div>
      </EdgeLabelRenderer>
    </>
  );
}
