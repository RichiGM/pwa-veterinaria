import { Link } from 'react-router-dom'
import Logo from './Logo'
import ImagenSegura from './ImagenSegura'

export default function DisenoAuth({ titulo, subtitulo, imagen, children }) {
  return (
    <div className="auth">
      <div className="auth__media">
        <ImagenSegura ruta={imagen} texto="Mascota" clase="auth__img" />
      </div>
      <div className="auth__panel">
        <div className="auth__box">
          <Link to="/">Volver al inicio</Link>
          <Logo />
          <h1>{titulo}</h1>
          <p className="muted">{subtitulo}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
