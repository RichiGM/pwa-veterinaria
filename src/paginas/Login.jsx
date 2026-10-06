import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DisenoAuth from '../componentes/DisenoAuth'
import { useAuth } from '../contexto/ContextoAuth'

export default function Login() {
  const { login, sesion } = useAuth()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const [formulario, setFormulario] = useState({ correo: '', contrasena: '' })
  const [verContrasena, setVerContrasena] = useState(false)
  const [enviando, setEnviando] = useState(false)

  if (sesion) return <Navigate to="/app" replace />

  const alCambiar = (evento) => setFormulario({ ...formulario, [evento.target.name]: evento.target.value })

  const alEnviar = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    try {
      await login(formulario.correo, formulario.contrasena)
      toast.success('Bienvenido de nuevo')
      navegar(ubicacion.state?.desde || '/app', { replace: true })
    } catch (error) {
      toast.error(error.message)
      setEnviando(false)
    }
  }

  return (
    <DisenoAuth titulo="Iniciar sesión" subtitulo="Entra para ver tus mascotas y tus citas." imagen="/img/login.jpg">
      <form className="form" onSubmit={alEnviar}>
        <label className="field">
          <span>Correo</span>
          <input type="email" name="correo" placeholder="tu@correo.com" value={formulario.correo} onChange={alCambiar} required autoComplete="email" />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <input type={verContrasena ? 'text' : 'password'} name="contrasena" value={formulario.contrasena} onChange={alCambiar} required autoComplete="current-password" />
        </label>

        <label>
          <input type="checkbox" checked={verContrasena} onChange={() => setVerContrasena(!verContrasena)} /> Mostrar contraseña
        </label>

        <button className="btn btn--primary btn--block" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="auth__switch">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </DisenoAuth>
  )
}
