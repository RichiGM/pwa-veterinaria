export default function EstadoVacio({ titulo, texto, children }) {
  return (
    <div className="empty">
      <h3>{titulo}</h3>
      <p className="muted">{texto}</p>
      {children}
    </div>
  )
}
