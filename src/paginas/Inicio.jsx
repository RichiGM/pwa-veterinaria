import { Link } from 'react-router-dom'
import Logo from '../componentes/Logo'
import ImagenSegura from '../componentes/ImagenSegura'
import { useAuth } from '../contexto/ContextoAuth'
import { useInstalacion } from '../hooks/useInstalacion'

const servicios = [
  { titulo: 'Consulta general', texto: 'Revisión de tu mascota y tratamiento si lo necesita.', imagen: '/img/servicio-consulta.jpg' },
  { titulo: 'Vacunación', texto: 'Vacunas para cachorros, gatitos y adultos.', imagen: '/img/servicio-vacunacion.jpg' },
  { titulo: 'Cirugía', texto: 'Esterilizaciones y otras cirugías.', imagen: '/img/servicio-cirugia.jpg' },
  { titulo: 'Estética', texto: 'Baño y corte de pelo.', imagen: '/img/servicio-estetica.jpg' },
  { titulo: 'Laboratorio', texto: 'Análisis clínicos con resultados el mismo día.', imagen: '/img/servicio-laboratorio.jpg' },
  { titulo: 'Urgencias 24/7', texto: 'Atención a cualquier hora.', imagen: '/img/servicio-urgencias.jpg' },
]

const equipo = [
  { nombre: 'Dra. Mariana López', puesto: 'Medicina general', imagen: '/img/equipo-1.jpg' },
  { nombre: 'Dr. Carlos Ruiz', puesto: 'Cirujano veterinario', imagen: '/img/equipo-2.jpg' },
  { nombre: 'Dra. Sofía Méndez', puesto: 'Especialista en gatos', imagen: '/img/equipo-3.jpg' },
]

const testimonios = [
  { nombre: 'Andrea G.', mascota: 'Dueña de Max', texto: 'Atendieron a Max de urgencia a medianoche. Fueron muy amables.' },
  { nombre: 'Luis P.', mascota: 'Dueño de Michi', texto: 'Es muy fácil agendar citas desde el celular.' },
  { nombre: 'Fernanda R.', mascota: 'Dueña de Kiwi', texto: 'Encontré especialistas en aves, que es difícil de encontrar.' },
]

export default function Inicio() {
  const { sesion } = useAuth()
  const { puedeInstalar, instalar } = useInstalacion()

  return (
    <div>
      <header className="navbar">
        <div className="container navbar__inner">
          <Logo />
          <nav className="navbar__links">
            <a href="#servicios">Servicios</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#equipo">Equipo</a>
            <a href="#contacto">Contacto</a>
            {puedeInstalar && <button className="btn btn--sm" onClick={instalar}>Instalar app</button>}
            {sesion ? (
              <Link to="/app" className="btn btn--primary btn--sm">Mi panel</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn--sm">Iniciar sesión</Link>
                <Link to="/registro" className="btn btn--primary btn--sm">Crear cuenta</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero__inner">
          <div>
            <h1>Clínica veterinaria HuellitasVet</h1>
            <p>
              Registra a tus mascotas, agenda citas y consulta los servicios de la clínica.
              La app también funciona sin conexión.
            </p>
            <div className="hero__actions">
              <Link to={sesion ? '/app/citas' : '/registro'} className="btn btn--primary btn--lg">Agendar una cita</Link>
              <a href="#servicios" className="btn btn--lg">Ver servicios</a>
            </div>
            <p className="muted">Más de 5,000 mascotas atendidas. Urgencias las 24 horas.</p>
          </div>
          <ImagenSegura ruta="/img/hero-veterinaria.jpg" texto="Veterinaria atendiendo a un perro" clase="hero__img" />
        </div>
      </section>

      <section id="servicios" className="section">
        <div className="container">
          <h2>Nuestros servicios</h2>
          <div className="grid grid--3">
            {servicios.map(({ titulo, texto, imagen }) => (
              <article key={titulo} className="card">
                <ImagenSegura ruta={imagen} texto={titulo} clase="card__img" />
                <div className="card__body">
                  <h3>{titulo}</h3>
                  <p className="muted">{texto}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="section section--soft">
        <div className="container split">
          <ImagenSegura ruta="/img/nosotros.jpg" texto="Instalaciones de la clínica" clase="split__img" />
          <div>
            <h2>Sobre nosotros</h2>
            <p className="muted">
              Tenemos más de 15 años atendiendo mascotas. La clínica cuenta con quirófano,
              laboratorio y área de hospitalización.
            </p>
            <ul className="lista">
              <li>Veterinarios certificados</li>
              <li>Historial de cada mascota</li>
              <li>Recordatorios de vacunas y citas</li>
              <li>Precios claros</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="equipo" className="section">
        <div className="container">
          <h2>Nuestro equipo</h2>
          <div className="grid grid--3">
            {equipo.map((integrante) => (
              <article key={integrante.nombre} className="card card__body">
                <ImagenSegura ruta={integrante.imagen} texto={integrante.nombre} clase="team-img" />
                <h3>{integrante.nombre}</h3>
                <p className="muted">{integrante.puesto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <h2>Opiniones de clientes</h2>
          <div className="grid grid--3">
            {testimonios.map((testimonio) => (
              <blockquote key={testimonio.nombre} className="testimonial">
                <p>{testimonio.texto}</p>
                <footer><strong>{testimonio.nombre}</strong> - {testimonio.mascota}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2>Agenda tu primera cita</h2>
              <p>Crea tu cuenta, registra a tu mascota y agenda en pocos pasos.</p>
            </div>
            <Link to={sesion ? '/app/citas' : '/registro'} className="btn btn--white btn--lg">Comenzar</Link>
          </div>
        </div>
      </section>

      <footer id="contacto" className="footer">
        <div className="container footer__grid">
          <div>
            <Logo claro />
            <p>Clínica veterinaria para el cuidado de tu mascota.</p>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>Teléfono: (55) 1234 5678</p>
            <p>Correo: contacto@huellitasvet.com</p>
            <p>Dirección: Av. de las Mascotas 123, CDMX</p>
          </div>
          <div>
            <h4>Horario</h4>
            <p>Lunes a sábado: 9:00 a 20:00</p>
            <p>Domingo: 10:00 a 14:00</p>
            <p>Urgencias: 24 horas</p>
          </div>
        </div>
        <div className="footer__bottom">{new Date().getFullYear()} HuellitasVet. Todos los derechos reservados.</div>
      </footer>
    </div>
  )
}
