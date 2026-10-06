import { useState } from 'react'

export default function ImagenSegura({ ruta, texto, clase = '' }) {
  const [fallo, setFallo] = useState(!ruta)

  if (fallo) {
    return (
      <div className={`img-box img-box--vacia ${clase}`} role="img" aria-label={texto}>
        {texto}
      </div>
    )
  }

  return <img src={ruta} alt={texto} loading="lazy" className={`img-box ${clase}`} onError={() => setFallo(true)} />
}
