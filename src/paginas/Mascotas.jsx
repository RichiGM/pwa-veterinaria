import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../api/cliente'
import { useAuth } from '../contexto/ContextoAuth'
import { ESPECIES } from '../datos/especies'
import Modal from '../componentes/Modal'
import Cargador from '../componentes/Cargador'
import EstadoVacio from '../componentes/EstadoVacio'
import ImagenSegura from '../componentes/ImagenSegura'

const FORMULARIO_VACIO = { nombre: '', especie: 'perro', raza: '', edad: '', peso: '', notas: '' }

export default function Mascotas() {
  const { nombre } = useAuth()
  const [mascotas, setMascotas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  const [idEditando, setIdEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const cargarMascotas = useCallback(async () => {
    try {
      setMascotas(await api('/mascotas'))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarMascotas()
  }, [cargarMascotas])

  const abrirNueva = () => {
    setFormulario(FORMULARIO_VACIO)
    setIdEditando(null)
    setModalAbierto(true)
  }

  const abrirEdicion = (mascota) => {
    setFormulario({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza ?? '',
      edad: mascota.edad ?? '',
      peso: mascota.peso ?? '',
      notas: mascota.notas ?? '',
    })
    setIdEditando(mascota.id)
    setModalAbierto(true)
  }

  const cerrarModal = useCallback(() => setModalAbierto(false), [])

  const alCambiar = (evento) => setFormulario({ ...formulario, [evento.target.name]: evento.target.value })

  const guardar = async (evento) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      if (idEditando) {
        await api(`/mascotas/${idEditando}`, { metodo: 'PUT', cuerpo: formulario })
        toast.success('Mascota actualizada')
      } else {
        await api('/mascotas', { metodo: 'POST', cuerpo: formulario })
        toast.success(`${formulario.nombre} fue agregado`)
      }
      setModalAbierto(false)
      cargarMascotas()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (mascota) => {
    if (!confirm(`¿Eliminar a ${mascota.nombre}? Sus citas también se borran.`)) return
    try {
      await api(`/mascotas/${mascota.id}`, { metodo: 'DELETE' })
      toast.success(`${mascota.nombre} fue eliminado`)
      setMascotas((anteriores) => anteriores.filter((elemento) => elemento.id !== mascota.id))
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <p className="muted">Hola, {nombre}</p>
          <h1>Mis mascotas</h1>
        </div>
        <button className="btn btn--primary" onClick={abrirNueva}>
          Agregar mascota
        </button>
      </div>

      {cargando ? (
        <Cargador />
      ) : mascotas.length === 0 ? (
        <EstadoVacio titulo="Todavía no tienes mascotas" texto="Agrega una mascota para poder agendar citas.">
          <button className="btn btn--primary" onClick={abrirNueva}>Agregar mascota</button>
        </EstadoVacio>
      ) : (
        <div className="grid grid--3">
          {mascotas.map((mascota) => {
            const especie = ESPECIES[mascota.especie] ?? ESPECIES.otro
            return (
              <article key={mascota.id} className="card">
                <div className="pet-card__media">
                  <ImagenSegura ruta={especie.imagen} texto={especie.etiqueta} />
                </div>
                <div className="card__body">
                  <h3>{mascota.nombre}</h3>
                  <p className="muted">{especie.etiqueta} - {mascota.raza || 'Sin raza'}</p>
                  <p>Edad: {mascota.edad != null ? `${mascota.edad} año${mascota.edad === 1 ? '' : 's'}` : 'sin dato'}</p>
                  <p>Peso: {mascota.peso != null ? `${mascota.peso} kg` : 'sin dato'}</p>
                  {mascota.notas && <p className="pet-card__notes">{mascota.notas}</p>}
                  <div className="pet-card__actions">
                    <Link to={`/app/citas?mascota=${mascota.id}`} className="btn btn--sm">Agendar cita</Link>
                    <button className="btn btn--sm" onClick={() => abrirEdicion(mascota)}>Editar</button>
                    <button className="btn btn--sm btn--danger" onClick={() => eliminar(mascota)}>Eliminar</button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal abierto={modalAbierto} titulo={idEditando ? 'Editar mascota' : 'Nueva mascota'} onCerrar={cerrarModal}>
        <form className="form" onSubmit={guardar}>
          <label className="field">
            <span>Nombre *</span>
            <input name="nombre" value={formulario.nombre} onChange={alCambiar} placeholder="Ej. Firulais" required />
          </label>

          <div className="field">
            <span>Especie *</span>
            <div className="especies">
              {Object.entries(ESPECIES).map(([clave, { etiqueta }]) => (
                <button
                  type="button"
                  key={clave}
                  className={`especie ${formulario.especie === clave ? 'is-active' : ''}`}
                  onClick={() => setFormulario({ ...formulario, especie: clave })}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span>Raza</span>
            <input name="raza" value={formulario.raza} onChange={alCambiar} placeholder="Ej. Labrador" />
          </label>

          <div className="form__row">
            <label className="field">
              <span>Edad (años)</span>
              <input type="number" min="0" name="edad" value={formulario.edad} onChange={alCambiar} />
            </label>
            <label className="field">
              <span>Peso (kg)</span>
              <input type="number" min="0" step="0.1" name="peso" value={formulario.peso} onChange={alCambiar} />
            </label>
          </div>

          <label className="field">
            <span>Notas (alergias, enfermedades, etc.)</span>
            <textarea name="notas" rows="3" value={formulario.notas} onChange={alCambiar} />
          </label>

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={cerrarModal}>Cancelar</button>
            <button className="btn btn--primary" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </Modal>
    </>
  )
}
