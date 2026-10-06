import { useEffect } from 'react'

export default function Modal({ abierto, titulo, onCerrar, children }) {
  useEffect(() => {
    if (!abierto) return
    const alPresionarTecla = (evento) => evento.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alPresionarTecla)
    return () => window.removeEventListener('keydown', alPresionarTecla)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="modal-backdrop" onMouseDown={onCerrar}>
      <div className="modal" role="dialog" aria-modal="true" onMouseDown={(evento) => evento.stopPropagation()}>
        <div className="modal__header">
          <h3>{titulo}</h3>
          <button className="btn btn--sm" onClick={onCerrar} aria-label="Cerrar">Cerrar</button>
        </div>
        {children}
      </div>
    </div>
  )
}
