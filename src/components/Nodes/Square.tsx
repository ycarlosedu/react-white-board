import {useRef, useState} from 'react'
import { Handle, Node, NodeProps, NodeToolbar, Position, useNodeId, useReactFlow, useStore } from 'reactflow';
import { NodeResizer, NodeResizeControl } from '@reactflow/node-resizer';
import { Handlers } from './Handlers';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { Trash, Copy } from '@phosphor-icons/react';

type Props = Partial<NodeProps> & {
  resizer?: boolean;
  handlers?: boolean;
  defaultWidth?: number;
  style?: React.CSSProperties;
}

export function Square({ id, selected, resizer = true, handlers = true, defaultWidth = 200, style, data }: Props) {
  const [labelValue, setLabelValue] = useState(data?.label)
  const { getNode, setNodes, deleteElements } = useReactFlow()
  const node = getNode(id!)
  const handleOnBlur = () => {
    node && setNodes(prevNodes => [...prevNodes, {
      ...node,
      data: {
        ...node.data,
        label: labelValue
      }
    }])
  }

  const handleOnChange = (event: any) => {
    setLabelValue(event.target.value)
  }

  const handleDeleteNode = () => {
    deleteElements({nodes: [node!]})
  }

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, labelValue);

  return (
    <>
    <NodeToolbar isVisible={selected} className='flex gap-2'>
      <button onClick={handleDeleteNode} className='bg-white p-2 border border-zinc-500 rounded-full hover:bg-zinc-100'>
        <Trash size={24}/>
      </button>
      <button className='bg-white p-2 border border-zinc-500 rounded-full hover:bg-zinc-100'>
        <Copy size={24} />
      </button>
    </NodeToolbar>

    <div style={style} className={`bg-violet-500 rounded group p-4 box-border min-w-[${defaultWidth}px] min-h-[${defaultWidth}px] ${resizer ? 'w-full h-full' : ''}`}>
      <textarea 
        ref={textAreaRef}
        rows={1}
        onBlur={handleOnBlur} 
        onChange={handleOnChange} 
        value={labelValue} 
        className="bg-transparent outline-none resize-none" 
      />
      
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