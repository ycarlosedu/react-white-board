import { useCallback, useRef, useState } from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { Square as SquareIcon } from 'phosphor-react'
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
} from 'reactflow';

import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import { Square } from './Square';
import { DefaultEdge } from './DefaultEdge';

interface InitialNode extends Node {
  type: keyof typeof NODE_TYPES
}

const initialNodes: InitialNode[] = [
  { 
    id: '1', 
    position: { x: 200, y: 400 }, 
    data: {},
    type: 'square',
  },
  { 
    id: '2', 
    position: { x: 600, y: 400 }, 
    data: {},
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
];

const NODE_TYPES = {
  square: Square,
}

type NodesTypes = keyof typeof NODE_TYPES

const EDGE_TYPES = {
  default: DefaultEdge,
}

export function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeTypeSelected, setNodeTypeSelected] = useState<NodesTypes | undefined>(undefined);
  
  const reactFlowRef = useRef<any>()
  const reactFlowInstance = useReactFlow()

  const onConnect = useCallback((params: Connection) => {
    return setEdges((eds) => addEdge(params, eds))
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
    console.log(getCoordinates(event))
    if (!nodeTypeSelected) return

    setNodes((nodes) => {
      return [...nodes, {
        id: crypto.randomUUID(),
        position: getCoordinates(event),
        data: {},
        type: nodeTypeSelected,
      }]
    })
    setNodeTypeSelected(undefined)
  }

  function handleSelectNewNode(type: NodesTypes) {
    setNodeTypeSelected(type)
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
      >
        <Controls /> 
        <Background gap={12} size={2} color={zinc['200']} />
      </ReactFlow>

      <Toolbar.Root className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 h-20 w-96 overflow-hidden">
        <Toolbar.Button onClick={() => handleSelectNewNode('square')} className="text-zinc-400">
          <div className="w-32 h-32 bg-violet-500 mt-6 rounded hover:-translate-y-2 transition-transform"></div>
        </Toolbar.Button>
      </Toolbar.Root>
    </>
  );
}