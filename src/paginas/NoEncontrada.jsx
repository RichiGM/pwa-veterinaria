import { Link } from 'react-router-dom'
import EstadoVacio from '../componentes/EstadoVacio'

export default function NoEncontrada() {
  return (
    <div className="center-page">
      <EstadoVacio titulo="Página no encontrada (404)" texto="La página que buscas no existe.">
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </EstadoVacio>
    </div>
  )
}
