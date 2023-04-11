import './styles/global.css'

import { Canvas } from "./components/Canvas";
import { ReactFlowProvider } from 'reactflow';

export function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
    </div>
  )
}

