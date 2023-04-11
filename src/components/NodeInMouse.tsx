import { NodesTypes } from "./Canvas"
import { Circle } from "./Nodes/Circle";
import { Square } from "./Nodes/Square";

type Props = {
  position?: {
    top: number,
    left: number,
  },
  element?: NodesTypes,
}

const NODES = {
  square: Square,
  circle: Circle,
}

export default function NodeInMouse({ position = { top: 0, left: 0 }, element }: Props) {
  if (!element) return null

  const LazyNode = NODES[element];
  
  return (
    <>
      <LazyNode style={{top: position.top, left: position.left, opacity: 0.5, position: 'fixed'}} resizer={false} handlers={false} defaultWidth={50} />
    </>
  )
}