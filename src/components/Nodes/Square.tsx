import { Handle, Node, NodeProps, Position, useNodeId, useStore } from 'reactflow';
import { NodeResizer, NodeResizeControl } from '@reactflow/node-resizer';
import { Handlers } from './Handlers';

type Props = Partial<NodeProps> & {
  resizer?: boolean;
  handlers?: boolean;
  defaultWidth?: number;
  style?: React.CSSProperties;
}

export function Square({ selected, resizer = true, handlers = true, defaultWidth = 200, style }: Props) {
  return (
    <div style={style} className={`bg-violet-500 rounded group min-w-[${defaultWidth}px] min-h-[${defaultWidth}px] ${resizer ? 'w-full h-full' : ''}`}>
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
  )
}