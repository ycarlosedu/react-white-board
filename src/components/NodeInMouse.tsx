import { Node } from "reactflow";
import { NodesTypes } from "./Canvas"
import { DefaultNode } from "./Nodes/DefaultNode";

type Props = {
  position?: {
    top: number,
    left: number,
  },
  element?: Node & { type: NodesTypes },
}

const NODES = {
  square: DefaultNode,
  circle: DefaultNode,
}

export default function NodeInMouse({ position = { top: 0, left: 0 }, element }: Props) {
  if (!element?.type) return null

  const LazyNode = NODES[element?.type || "square"];
  
  return (
    <>
      <LazyNode style={{top: position.top, left: position.left, opacity: 0.5, position: 'fixed'}} resizer={false} handlers={false} defaultWidth={50} />
    </>
  )
}