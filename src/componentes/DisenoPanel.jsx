import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexto/ContextoAuth'
import Logo from './Logo'

const enlaces = [
  { ruta: '/app/mascotas', texto: 'Mis mascotas', corto: 'Mascotas' },
  { ruta: '/app/citas', texto: 'Mis citas', corto: 'Citas' },
  { ruta: '/app/servicios', texto: 'Servicios', corto: 'Servicios' },
]

export default function DisenoPanel() {
  const { nombre, usuario, logout } = useAuth()
  const navegar = useNavigate()

  const cerrarSesion = async () => {
    await logout()
    toast.success('Sesión cerrada')
    navegar('/login', { replace: true })
  }

  return (
    <div className="dash">
      <aside className="sidebar">
        <Logo destino="/app" claro />

        <nav className="sidebar__nav">
          {enlaces.map(({ ruta, texto }) => (
            <NavLink key={ruta} to={ruta} className="sidebar__link">
              {texto}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__user">
          <strong>{nombre}</strong>
          {usuario?.correo}
        </div>
        <button className="btn btn--salir btn--block" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </aside>

      <header className="topbar">
        <Logo destino="/app" />
        <button className="btn btn--sm" onClick={cerrarSesion}>Salir</button>
      </header>

      <main className="dash__main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {enlaces.map(({ ruta, corto }) => (
          <NavLink key={ruta} to={ruta} className="bottom-nav__link">
            {corto}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
