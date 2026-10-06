import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DisenoAuth from '../componentes/DisenoAuth'
import { useAuth } from '../contexto/ContextoAuth'

export default function Registro() {
  const { registro, sesion } = useAuth()
  const navegar = useNavigate()
  const [formulario, setFormulario] = useState({ nombre: '', correo: '', contrasena: '', confirmacion: '' })
  const [enviando, setEnviando] = useState(false)

  if (sesion) return <Navigate to="/app" replace />

  const alCambiar = (evento) => setFormulario({ ...formulario, [evento.target.name]: evento.target.value })

  const alEnviar = async (evento) => {
    evento.preventDefault()
    if (formulario.contrasena.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres.')
    if (formulario.contrasena !== formulario.confirmacion) return toast.error('Las contraseñas no coinciden.')

    setEnviando(true)
    try {
      await registro(formulario.nombre.trim(), formulario.correo, formulario.contrasena)
      toast.success(`Bienvenido, ${formulario.nombre}`)
      navegar('/app')
    } catch (error) {
      toast.error(error.message)
      setEnviando(false)
    }
  }

  return (
    <DisenoAuth titulo="Crear cuenta" subtitulo="Regístrate para agendar citas y guardar tus mascotas." imagen="/img/registro.jpg">
      <form className="form" onSubmit={alEnviar}>
        <label className="field">
          <span>Nombre</span>
          <input name="nombre" placeholder="Ej. Ana Martínez" value={formulario.nombre} onChange={alCambiar} required autoComplete="name" />
        </label>
        <label className="field">
          <span>Correo</span>
          <input type="email" name="correo" placeholder="tu@correo.com" value={formulario.correo} onChange={alCambiar} required autoComplete="email" />
        </label>
        <label className="field">
          <span>Contraseña (mínimo 6 caracteres)</span>
          <input type="password" name="contrasena" value={formulario.contrasena} onChange={alCambiar} required autoComplete="new-password" />
        </label>
        <label className="field">
          <span>Repite la contraseña</span>
          <input type="password" name="confirmacion" value={formulario.confirmacion} onChange={alCambiar} required autoComplete="new-password" />
        </label>

        <button className="btn btn--primary btn--block" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth__switch">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </DisenoAuth>
  )
}
