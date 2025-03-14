import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TileGame from './TileGame.tsx'
// import BlockGame from './BlockGame.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TileGame />
    {/* <BlockGame /> */}
  </StrictMode>
)
