import { Link } from 'react-router-dom'

export default function Logo({ destino = '/', claro = false }) {
  return (
    <Link to={destino} className={claro ? 'logo logo--claro' : 'logo'}>
      Huellitas<strong>Vet</strong>
    </Link>
  )
}
