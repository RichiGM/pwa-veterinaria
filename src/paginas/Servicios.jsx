import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../api/cliente'
import { formatoPrecio } from '../datos/especies'
import Cargador from '../componentes/Cargador'
import EstadoVacio from '../componentes/EstadoVacio'
import ImagenSegura from '../componentes/ImagenSegura'

export default function Servicios() {
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    api('/servicios')
      .then(setServicios)
      .catch((error) => toast.error(error.message))
      .finally(() => setCargando(false))
  }, [])

  const serviciosFiltrados = servicios.filter((servicio) =>
    `${servicio.nombre} ${servicio.descripcion}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      <div className="page-head">
        <div>
          <p className="muted">Lista de servicios de la clínica</p>
          <h1>Servicios</h1>
        </div>
        <div className="search">
          <input placeholder="Buscar servicio" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
        </div>
      </div>

      {cargando ? (
        <Cargador />
      ) : serviciosFiltrados.length === 0 ? (
        <EstadoVacio titulo="Sin resultados" texto="No hay servicios con ese nombre." />
      ) : (
        <div className="grid grid--3">
          {serviciosFiltrados.map((servicio) => (
            <article key={servicio.id} className="card">
              <ImagenSegura ruta={servicio.imagen} texto={servicio.nombre} clase="card__img" />
              <div className="card__body">
                <div className="card__top">
                  <h3>{servicio.nombre}</h3>
                  <span className="price">{formatoPrecio(servicio.precio)}</span>
                </div>
                <p className="muted">{servicio.descripcion}</p>
                <div className="card__footer">
                  <span className="muted">{servicio.duracion_min} min</span>
                  <Link to={`/app/citas?servicio=${servicio.id}`} className="btn btn--sm">Agendar</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
