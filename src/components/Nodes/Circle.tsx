import { Handle, Node, NodeProps, NodeToolbar, Position, useNodeId, useStore } from 'reactflow';
import { NodeResizer, NodeResizeControl } from '@reactflow/node-resizer';
import { Handlers } from './Handlers';

type Props = Partial<NodeProps> & {
  resizer?: boolean;
  handlers?: boolean;
  defaultWidth?: number;
  style?: React.CSSProperties;
}

export function Circle({ selected, resizer = true, handlers = true, defaultWidth = 200, style }: Props) {
  return (
    <>
    <NodeToolbar isVisible={selected}>
      <button>delete</button>
      <button>copy</button>
      <button>expand</button>
    </NodeToolbar>

    <div style={style} className={`bg-blue-500 rounded-full group min-w-[${defaultWidth}px] min-h-[${defaultWidth}px] ${resizer ? 'w-full h-full' : ''}`}>
      {resizer && (
        <NodeResizer 
          minWidth={defaultWidth} 
          minHeight={defaultWidth} 
          isVisible={selected} 
          lineClassName="border-blue-400"
          handleClassName="h-3 w-3 bg-white border-2 rounded border-blue-400"
        />
      )}

      {handlers && (
        <Handlers />
      )}
    </div>
    </>
  )
}