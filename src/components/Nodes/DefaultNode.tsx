import {useRef, useState} from 'react'
import { NodeProps, NodeToolbar, useReactFlow, useStore, useStoreApi } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { Handlers } from './Handlers';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { Trash, Copy } from '@phosphor-icons/react';
import Tooltip from '../Tooltip';
import useSelectNode from '../../hooks/useSelectNode';
import { NodesTypes } from '../Canvas';

type Props = Partial<NodeProps> & {
  resizer?: boolean;
  handlers?: boolean;
  defaultWidth?: number;
  style?: React.CSSProperties;
}

const NODES_CLASSNAMES = {
  square: 'rounded bg-violet-500 p-4',
  circle: 'rounded-full bg-blue-500 p-20',
}

export function DefaultNode({ id, selected, resizer = true, handlers = true, defaultWidth = 200, style, data, type }: Props) {
  const [labelValue, setLabelValue] = useState(data?.label)

  const { getNode, setNodes, deleteElements } = useReactFlow()
  const node = getNode(id!)
  const storeApi = useStoreApi()

  const nodeStyle = NODES_CLASSNAMES[type as NodesTypes || 'square']

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
  const minHeight = useAutosizeTextArea(textAreaRef.current, labelValue, defaultWidth);

  return (
    <>
    <NodeToolbar isVisible={selected} className='flex gap-2'>
      <Tooltip text="Delete Node">
        <button onClick={handleDeleteNode} className='bg-white p-2 border border-zinc-500 rounded-full hover:bg-zinc-100'>
          <Trash size={24}/>
        </button>
      </Tooltip>
      <Tooltip text="Copy Node">
        <button onClick={() => useSelectNode(node!, storeApi)} className='bg-white p-2 border border-zinc-500 rounded-full hover:bg-zinc-100'>
          <Copy size={24} />
        </button>
      </Tooltip>
    </NodeToolbar>

    <div style={{...style, minHeight}} className={`${nodeStyle} group box-border min-w-[${defaultWidth}px] ${resizer ? 'w-full h-full' : ''}`}>
      <textarea 
        ref={textAreaRef}
        rows={1}
        onBlur={handleOnBlur} 
        onChange={handleOnChange} 
        value={labelValue} 
        className="bg-transparent outline-none resize-none w-full" 
      />
      
      {resizer && (
        <NodeResizer 
          minWidth={defaultWidth} 
          minHeight={minHeight} 
          isVisible={selected} 
          lineClassName="border-blue-400 border-2"
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