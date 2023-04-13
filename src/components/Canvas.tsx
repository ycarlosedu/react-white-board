import { useCallback, useRef, useState } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { zinc } from 'tailwindcss/colors'

import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  ConnectionMode,
  Connection,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  MiniMap,
} from 'reactflow';

import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import { Square } from './Nodes/Square';
import { Circle } from './Nodes/Circle';
import { DefaultEdge } from './Edges/DefaultEdge';
import NodeInMouse from './NodeInMouse';

export type NodesTypes = keyof typeof NODE_TYPES

interface InitialNode extends Node {
  type: NodesTypes
}

const initialNodes: InitialNode[] = [
  { 
    id: '1', 
    position: { x: 200, y: 400 }, 
    data: {
      label: 'teste'
    },
    type: 'square',
  },
  { 
    id: '2', 
    position: { x: 600, y: 400 }, 
    data: {
      label: 'teste 2'
    },
    type: 'square',
  },
];

const initialEdges: Edge[] = [
  // { 
  //   id: 'e1-2', 
  //   source: '1', 
  //   target: '2', 
  //   label: 'connect to' 
  // }
  {
    id: 'edge-1-2',
    source: '1',
    target: '2',
    data: {
      label: 'Hi!',
      labelColor: 'blue',
      fontColor: 'red',
      edgeType: 'straight',
    }
  },
  {
    id: 'edge-1-2-default',
    source: '1',
    target: '2',
    animated: true,
    data: {
      label: 'animated styled edge',
      labelColor: 'red',
      fontColor: 'white',
    },
    style: { stroke: 'red' },
  },
];

const NODE_TYPES = {
  square: Square,
  circle: Circle,
}

const EDGE_TYPES = {
  default: DefaultEdge,
}

export function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeTypeSelected, setNodeTypeSelected] = useState<NodesTypes | undefined>(undefined);
  const [mousePosition, setMousePosition] = useState<{ top: number; left: number; }>();
  
  const reactFlowRef = useRef<any>()
  const reactFlowInstance = useReactFlow()

  const onConnect = useCallback((params: Connection) => {
    return setEdges((eds) => addEdge({
      ...params,
      id: crypto.randomUUID(),
      data: {
        label: 'Hi!',
        labelColor: 'blue',
        fontColor: 'red',
        edgeType: 'straight',
      }
    }, eds))
  }, [setEdges]);

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge: Edge) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  function getCoordinates(event: any) {
    const bounds = reactFlowRef.current.getBoundingClientRect();
    return reactFlowInstance.project({
      x: event.clientX - bounds.left - 50,
      y: event.clientY - bounds.top - 50
    });
  }

  function handleAddNode(event: any) {
    if (!nodeTypeSelected) return

    setNodes((nodes) => {
      return [...nodes, {
        id: crypto.randomUUID(),
        position: getCoordinates(event),
        data: {
          label: ''
        },
        type: nodeTypeSelected,
      }]
    })
    setNodeTypeSelected(undefined)
  }

  function handleSelectNewNode(type: NodesTypes) {
    setNodeTypeSelected(type)
  }

  function handleMouseMove(event: any) {
    setMousePosition({
      top: event.clientY,
      left: event.clientX
    })
  }

  return (
    <>
      <ReactFlow
        ref={reactFlowRef}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: 'default'
        }}
        onPaneClick={handleAddNode}
        onMouseMove={handleMouseMove}
        snapToGrid={true}
        fitView
      >
        <MiniMap />
        <Controls /> 
        <Background gap={12} size={2} color={zinc['200']} />
      </ReactFlow>

      <NodeInMouse position={mousePosition} element={nodeTypeSelected} />

      <Toolbar.Root className="fixed bottom-10 flex gap-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 h-20 w-auto overflow-hidden">
        <Toolbar.Button onClick={() => handleSelectNewNode('square')} className="text-zinc-400 w-32 h-32 bg-violet-500 mt-6 rounded hover:-translate-y-2 transition-transform" />
        <Toolbar.Button onClick={() => handleSelectNewNode('circle')} className="text-zinc-400 w-32 h-32 bg-blue-500 mt-6 rounded-full hover:-translate-y-2 transition-transform" />
      </Toolbar.Root>
    </>
  );
}