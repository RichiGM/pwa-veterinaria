import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ProveedorAuth } from './contexto/ContextoAuth'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorAuth>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{ style: { borderRadius: '4px', fontFamily: 'Arial, sans-serif' } }}
        />
      </ProveedorAuth>
    </BrowserRouter>
  </StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registro) => console.log('Service Worker registrado:', registro.scope))
      .catch((error) => console.error('Error al registrar el Service Worker:', error))
  })
}
