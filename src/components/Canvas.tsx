import { useCallback, useRef, useState, useEffect } from 'react';
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
  Panel,
  useStoreApi,
  useStore,
} from 'reactflow';

import 'reactflow/dist/style.css';
import '@reactflow/node-resizer/dist/style.css';
import { DefaultNode } from './Nodes/DefaultNode';
import { DefaultEdge } from './Edges/DefaultEdge';
import NodeInMouse from './NodeInMouse';
import useSelectNode from '../hooks/useSelectNode';
import { LOCAL_STORAGE, getItems, saveItems } from '../utils/localStorage';

export type NodesTypes = keyof typeof NODE_TYPES | undefined

interface InitialNode extends Node {
  type: NodesTypes
}

const position = {
  x: 0,
  y: 0,
}

const defaultNodes = {
  square: { 
    id: crypto.randomUUID().toString(),
    data: {
      label: ''
    },
    position,
    type: 'square',
  },
  circle: { 
    id: crypto.randomUUID().toString(),
    data: {
      label: ''
    },
    position,
    type: 'circle',
  },
};

const defaultEdges = {
  straight: {
    id: crypto.randomUUID().toString(),
    source: '1',
    target: '2',
    data: {
      label: 'Hi!',
      labelColor: 'blue',
      fontColor: 'red',
      edgeType: 'straight',
    }
  },
  animated: {
    id: crypto.randomUUID().toString(),
    source: '1',
    target: '2',
    animated: true,
    data: {
      label: 'animated styled edge',
      labelColor: 'red',
      fontColor: 'white',
    },
  },
};

const NODE_TYPES = {
  square: DefaultNode,
  circle: DefaultNode,
}

const EDGE_TYPES = {
  default: DefaultEdge,
}

export const getElementSelected = (state: any) => state.elementSelected;

export function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(getItems(LOCAL_STORAGE.NODES));
  const [edges, setEdges, onEdgesChange] = useEdgesState(getItems(LOCAL_STORAGE.EDGES));
  const [mousePosition, setMousePosition] = useState<{ top: number; left: number; }>();

  useEffect(() => {
    saveItems(LOCAL_STORAGE.NODES, nodes)
  }, [nodes])

  useEffect(() => {
    saveItems(LOCAL_STORAGE.EDGES, edges)
  }, [edges])

  const elementSelected = useStore(getElementSelected);
  const storeApi = useStoreApi()
  
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
        edgeType: 'default',
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
    if (!elementSelected) return

    setNodes((nodes) => {
      return [...nodes, {
        ...elementSelected,
        id: crypto.randomUUID(),
        position: getCoordinates(event),
      }]
    })
    useSelectNode(undefined, storeApi)
  }

  function handleMouseMove(event: any) {
    setMousePosition({
      top: event.clientY,
      left: event.clientX
    })
  }

  function handleSelectNewNode(element: Node) {
    element === elementSelected ? useSelectNode(undefined, storeApi) : useSelectNode(element, storeApi)
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
          data: {
            type: 'default'
          }
        }}
        onPaneClick={handleAddNode}
        onMouseMove={handleMouseMove}
        snapToGrid={true}
        fitView
      >
        <MiniMap />
        <Controls /> 
        <Background gap={12} size={2} color={zinc['200']} />

        <Panel position="top-center">White Board React</Panel>
      </ReactFlow>

      <NodeInMouse position={mousePosition} element={elementSelected} />

      <Toolbar.Root className="fixed bottom-10 flex gap-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 h-20 w-auto overflow-hidden">
        <Toolbar.Button onClick={() => handleSelectNewNode(defaultNodes.square)} className="text-zinc-400 w-32 h-32 bg-violet-500 mt-6 rounded hover:-translate-y-2 transition-transform" />
        <Toolbar.Button onClick={() => handleSelectNewNode(defaultNodes.circle)} className="text-zinc-400 w-32 h-32 bg-blue-500 mt-6 rounded-full hover:-translate-y-2 transition-transform" />
      </Toolbar.Root>
    </>
  );
}