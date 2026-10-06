export default function Cargador({ pantallaCompleta = false, texto = 'Cargando...' }) {
  return <div className={pantallaCompleta ? 'loader loader--full' : 'loader'}>{texto}</div>
}
