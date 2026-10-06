export const ESPECIES = {
  perro: { etiqueta: 'Perro', imagen: '/img/mascota-perro.jpg' },
  gato: { etiqueta: 'Gato', imagen: '/img/mascota-gato.jpg' },
  ave: { etiqueta: 'Ave', imagen: '/img/mascota-ave.jpg' },
  conejo: { etiqueta: 'Conejo', imagen: '/img/mascota-conejo.jpg' },
  otro: { etiqueta: 'Otro', imagen: '/img/mascota-otro.jpg' },
}

export const ESTADOS_CITA = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

export const formatoPrecio = (cantidad) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cantidad ?? 0)
