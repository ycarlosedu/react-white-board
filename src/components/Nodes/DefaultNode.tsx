import {useRef, useState} from 'react'
import { NodeProps, NodeToolbar, useReactFlow, useStoreApi } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { Handlers } from './Handlers';
import useAutosizeTextArea from '../../hooks/useAutosizeTextArea';
import { Trash, Copy } from '@phosphor-icons/react';
import Tooltip from '../Tooltip';
import useSelectNode from '../../hooks/useSelectNode';
import { NodesTypes } from '../Canvas';
import Dropdown from '../Dropdown';
import { At, GridFour, PaintBucket } from 'phosphor-react';
import { getFontColor, getLabelColor } from '../../constants';

type Props = Partial<NodeProps> & {
  resizer?: boolean;
  handlers?: boolean;
  defaultWidth?: number;
  style?: React.CSSProperties;
}

const NODES_CLASSNAMES = {
  square: 'rounded p-4',
  circle: 'rounded-full p-20',
}

export function DefaultNode({ id, selected, resizer = true, handlers = true, defaultWidth = 200, style, data, type }: Props) {
  const [labelValue, setLabelValue] = useState(data?.label)
  const [nodeType, setNodeType] = useState(type)
  const [labelColorValue, setLabelColorValue] = useState(getLabelColor(data?.labelColor))
  const [fontColorValue, setFontColorValue] = useState(getFontColor(data?.fontColor))

  const { getNode, setNodes, deleteElements } = useReactFlow()
  const node = getNode(id!)
  const storeApi = useStoreApi()

  const nodeStyle = NODES_CLASSNAMES[type as NodesTypes || 'square']

  const handleUpdateNode = () => {
    deleteElements({nodes: [node!]})
    node && setNodes(prevNodes => [...prevNodes, {
      ...node,
      type: nodeType,
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

  const handleChangeNodeType = (newType: NodesTypes) => {
    setNodeType(newType)
    handleUpdateNode()
  }

  const handleChangeFontColor = (event: any) => {
    event.stopPropagation();
    setFontColorValue(event.target.value)
    handleUpdateNode()
  }

  const handleChangeLabelColor = (event: any) => {
    event.stopPropagation();
    setLabelColorValue(event.target.value)
    handleUpdateNode()
  }

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const minHeight = useAutosizeTextArea(textAreaRef.current, labelValue, defaultWidth);

  const itemsNodeType = [
    {
      text: 'Square',
      onClick: () => handleChangeNodeType('square'),
      checked: type === 'square'
    },
    {
      text: 'Circle',
      onClick: () => handleChangeNodeType('circle'),
      checked: type === 'circle'
    }
  ]

  return (
    <>
    <NodeToolbar isVisible={selected} className='flex gap-2'>
      <Tooltip text="Delete Node">
        <button onClick={handleDeleteNode} className='toolbarButton'>
          <Trash size={24}/>
        </button>
      </Tooltip>

      <Tooltip text="Copy Node">
        <button onClick={() => useSelectNode(node!, storeApi)} className='toolbarButton'>
          <Copy size={24} />
        </button>
      </Tooltip>

      <Dropdown tooltip="Change Node Type" items={itemsNodeType}>
        <button 
          className='toolbarButton'
          aria-label="Change Node Type">
          <GridFour size={24} />
        </button>
      </Dropdown>

      <Tooltip text="Change Label Color">
        <div
          className="toolbarButton w-16"
        >
          <PaintBucket size={16} color={labelColorValue} />
          <input
            value={labelColorValue}
            onChange={handleChangeLabelColor}
            type="color" className="toolbarInput" 
          />
        </div>
      </Tooltip>

      <Tooltip text="Change Font Color">
        <div
          className="toolbarButton w-16"
        >
          <At size={16} color={fontColorValue} />
          <input
            value={fontColorValue}
            onChange={handleChangeFontColor}
            type="color" className="toolbarInput" 
          />
        </div>
      </Tooltip>
    </NodeToolbar>

    <div 
      style={{...style, minHeight, color: fontColorValue, backgroundColor: labelColorValue, minWidth: defaultWidth}} 
      className={`${nodeStyle} group box-border w-full h-full}`}
    >
      <textarea 
        ref={textAreaRef}
        rows={1}
        onBlur={handleUpdateNode} 
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