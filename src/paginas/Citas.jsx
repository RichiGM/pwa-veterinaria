import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../api/cliente'
import { ESPECIES, ESTADOS_CITA, formatoPrecio } from '../datos/especies'
import Modal from '../componentes/Modal'
import Cargador from '../componentes/Cargador'
import EstadoVacio from '../componentes/EstadoVacio'

const fechaDeHoy = () => new Date().toLocaleDateString('sv-SE')

const formatoFecha = (fecha) =>
  new Date(fecha + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })

const formularioInicial = () => ({ mascota_id: '', servicio_id: '', fecha: fechaDeHoy(), hora: '10:00', motivo: '' })

const FILTROS = [
  ['proximas', 'Próximas'],
  ['historial', 'Historial'],
  ['todas', 'Todas'],
]

export default function Citas() {
  const [parametros, setParametros] = useSearchParams()
  const [citas, setCitas] = useState([])
  const [mascotas, setMascotas] = useState([])
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [filtro, setFiltro] = useState('proximas')
  const [guardando, setGuardando] = useState(false)
  const [formulario, setFormulario] = useState(formularioInicial)

  const cargarDatos = useCallback(async () => {
    try {
      const [listaCitas, listaMascotas, listaServicios] = await Promise.all([
        api('/citas'),
        api('/mascotas'),
        api('/servicios'),
      ])
      setCitas(listaCitas)
      setMascotas(listaMascotas)
      setServicios(listaServicios)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  useEffect(() => {
    const mascota = parametros.get('mascota')
    const servicio = parametros.get('servicio')
    if (mascota || servicio) {
      setFormulario((anterior) => ({
        ...anterior,
        mascota_id: mascota ?? anterior.mascota_id,
        servicio_id: servicio ?? anterior.servicio_id,
      }))
      setModalAbierto(true)
      setParametros({}, { replace: true })
    }
  }, [parametros, setParametros])

  const citasFiltradas = useMemo(() => {
    const hoy = fechaDeHoy()
    const terminada = (cita) => cita.estado === 'cancelada' || cita.estado === 'completada'
    if (filtro === 'proximas') return citas.filter((cita) => cita.fecha >= hoy && !terminada(cita))
    if (filtro === 'historial') return citas.filter((cita) => cita.fecha < hoy || terminada(cita)).reverse()
    return citas
  }, [citas, filtro])

  const alCambiar = (evento) => setFormulario({ ...formulario, [evento.target.name]: evento.target.value })
  const cerrarModal = useCallback(() => setModalAbierto(false), [])

  const guardar = async (evento) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      await api('/citas', { metodo: 'POST', cuerpo: formulario })
      toast.success('Cita agendada')
      setModalAbierto(false)
      setFormulario(formularioInicial())
      cargarDatos()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setGuardando(false)
    }
  }

  const cancelar = async (cita) => {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await api(`/citas/${cita.id}`, { metodo: 'PATCH', cuerpo: { estado: 'cancelada' } })
      toast.success('Cita cancelada')
      cargarDatos()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const eliminar = async (cita) => {
    if (!confirm('¿Eliminar esta cita del historial?')) return
    try {
      await api(`/citas/${cita.id}`, { metodo: 'DELETE' })
      setCitas((anteriores) => anteriores.filter((elemento) => elemento.id !== cita.id))
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <p className="muted">Citas de tus mascotas</p>
          <h1>Mis citas</h1>
        </div>
        <button className="btn btn--primary" onClick={() => setModalAbierto(true)} disabled={!mascotas.length && !cargando}>
          Nueva cita
        </button>
      </div>

      <div className="tabs">
        {FILTROS.map(([clave, texto]) => (
          <button key={clave} className={`tab ${filtro === clave ? 'is-active' : ''}`} onClick={() => setFiltro(clave)}>
            {texto}
          </button>
        ))}
      </div>

      {cargando ? (
        <Cargador />
      ) : mascotas.length === 0 ? (
        <EstadoVacio titulo="Primero agrega una mascota" texto="Para agendar una cita necesitas tener una mascota.">
          <Link to="/app/mascotas" className="btn btn--primary">Ir a mis mascotas</Link>
        </EstadoVacio>
      ) : citasFiltradas.length === 0 ? (
        <EstadoVacio titulo="No hay citas" texto="Aquí van a aparecer tus citas.">
          <button className="btn btn--primary" onClick={() => setModalAbierto(true)}>Agendar cita</button>
        </EstadoVacio>
      ) : (
        <div className="list">
          {citasFiltradas.map((cita) => {
            const especie = ESPECIES[cita.mascota_especie] ?? ESPECIES.otro
            return (
              <article key={cita.id} className={`appt ${cita.estado === 'cancelada' ? 'is-cancelled' : ''}`}>
                                <div className="appt__info">
                  <h3>{cita.mascota_nombre} ({especie.etiqueta})</h3>
                  <p>Servicio: {cita.servicio_nombre ?? 'Sin servicio'}
                    {cita.servicio_nombre && <> - {formatoPrecio(cita.servicio_precio)}</>}
                  </p>
                  <p>Fecha: {formatoFecha(cita.fecha)} a las {cita.hora.slice(0, 5)} h</p>
                  {cita.motivo && <p className="muted">Motivo: {cita.motivo}</p>}
                </div>
                <div className="appt__side">
                  <span className={`badge badge--${cita.estado}`}>{ESTADOS_CITA[cita.estado]}</span>
                  <div className="appt__actions">
                    {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                      <button className="btn btn--sm" onClick={() => cancelar(cita)}>Cancelar</button>
                    )}
                    <button className="btn btn--sm btn--danger" onClick={() => eliminar(cita)}>Eliminar</button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal abierto={modalAbierto} titulo="Agendar cita" onCerrar={cerrarModal}>
        <form className="form" onSubmit={guardar}>
          <label className="field">
            <span>Mascota *</span>
            <select name="mascota_id" value={formulario.mascota_id} onChange={alCambiar} required>
              <option value="">Selecciona una mascota</option>
              {mascotas.map((mascota) => <option key={mascota.id} value={mascota.id}>{mascota.nombre}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Servicio</span>
            <select name="servicio_id" value={formulario.servicio_id} onChange={alCambiar}>
              <option value="">Selecciona un servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>{servicio.nombre} - {formatoPrecio(servicio.precio)}</option>
              ))}
            </select>
          </label>
          <div className="form__row">
            <label className="field">
              <span>Fecha *</span>
              <input type="date" name="fecha" min={fechaDeHoy()} value={formulario.fecha} onChange={alCambiar} required />
            </label>
            <label className="field">
              <span>Hora *</span>
              <input type="time" name="hora" min="09:00" max="20:00" value={formulario.hora} onChange={alCambiar} required />
            </label>
          </div>
          <label className="field">
            <span>Motivo</span>
            <textarea name="motivo" rows="3" value={formulario.motivo} onChange={alCambiar} placeholder="Escribe el motivo de la consulta" />
          </label>
          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={cerrarModal}>Cancelar</button>
            <button className="btn btn--primary" disabled={guardando}>{guardando ? 'Agendando...' : 'Agendar'}</button>
          </div>
        </form>
      </Modal>
    </>
  )
}
