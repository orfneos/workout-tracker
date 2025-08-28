import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Apply global styles inline
rootElement.style.height = '100%'
rootElement.style.width = '100%'

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
