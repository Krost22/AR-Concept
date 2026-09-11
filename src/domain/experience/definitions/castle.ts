import type { ExperienceDefinition } from '../types'

export const castleExperience: ExperienceDefinition = {
  id: 'castillo-san-felipe',
  name: 'Castillo de San Felipe de Barajas',
  tagline: 'La fortaleza que detuvo al invasor',
  shortDescription:
    'Descubre la fortaleza y revive una escena de la Cartagena colonial.',
  description:
    'La mayor fortificación construida por España en América. Recorre sus bastiones y observa cómo la flota enemiga se aproxima durante el asedio de 1741, en una reconstrucción histórica serena y detallada.',
  coverImage: '/images/castillo-san-felipe.svg',
  heroImage: '/images/castillo-san-felipe.svg',
  location: 'Cerro de San Lázaro, Cartagena de Indias',
  era: 'Siglos XVII – XVIII',
  durationMinutes: 12,
  tags: ['Fortificación', 'Asedio de 1741', 'Patrimonio'],
  highlights: [
    { icon: 'compass', label: 'Recorrido', value: 'Bastiones y explanada' },
    { icon: 'layers', label: 'Escena', value: 'Ataque naval de 1741' },
    { icon: 'history', label: 'Época', value: 'Cartagena colonial' },
  ],
  scene: 'castle-siege',
  model: {
    src: undefined,
    attribution: 'Modelo procedural de demostración',
  },
  animations: [
    {
      id: 'sea',
      label: 'Mar en movimiento',
      description: 'Oleaje suave alrededor de la isla durante toda la experiencia.',
      trigger: 'auto',
    },
    {
      id: 'flags',
      label: 'Banderas al viento',
      description: 'Los estandartes del castillo y de la flota ondean con la brisa.',
      trigger: 'auto',
    },
    {
      id: 'approach',
      label: 'Aproximación de la flota',
      description: 'Los navíos avanzan desde el horizonte hasta su posición de combate.',
      trigger: 'manual',
    },
    {
      id: 'bombardment',
      label: 'Intercambio de cañonazos',
      description: 'Disparos con destellos y humo, sin crueldad: reconstrucción histórica.',
      trigger: 'manual',
    },
    {
      id: 'withdrawal',
      label: 'Retirada de la flota',
      description: 'Los barcos se alejan y el mar vuelve a quedar en calma.',
      trigger: 'manual',
    },
  ],
  info: [
    {
      id: 'la-fortaleza',
      kind: 'history',
      title: 'La fortaleza',
      summary: 'La obra defensiva más grande de España en América.',
      body: 'Las primeras defensas del cerro de San Lázaro se levantaron en el siglo XVI y fueron ampliadas durante los siglos XVII y XVIII. Su nombre honra a Felipe IV de España. El ingeniero militar Antonio de Arévalo dirigió su gran ampliación, que la convirtió en un complejo de bastiones, rampas y túneles capaz de cruzar fuego sobre cualquier atacante.',
      fact: 'Se levanta sobre el cerro de San Lázaro, dominando los accesos terrestres a la ciudad amurallada.',
    },
    {
      id: 'asedio-1741',
      kind: 'history',
      title: 'El asedio de 1741',
      summary: 'La gran prueba de fuego de Cartagena.',
      body: 'Durante la guerra del Asiento, una enorme flota al mando del almirante Edward Vernon puso sitio a Cartagena. La defensa, dirigida por el virrey Sebastián de Eslava y el marino Blas de Lezo, resistió durante semanas. La artillería del castillo y del cercano fuerte de San Lázaro resultaron decisivas para que la ciudad no cayera.',
      fact: 'La resistencia de 1741 se recuerda como uno de los mayores fracasos navales británicos del siglo XVIII.',
    },
    {
      id: 'defensa-capas',
      kind: 'architecture',
      title: 'Defensa en capas',
      summary: 'Bastiones, rampas y fuego cruzado.',
      body: 'El castillo combina bastiones en forma de punta de flecha, rampas en lugar de escaleras y galerías subterráneas. Cada elemento está pensado para que los defensores se cubran entre sí y para que ninguna escalada quede sin respuesta. En la vista aumentada, observa cómo los cañones apuntan en abanico hacia el mar.',
      fact: 'Las rampas permitían subir artillería y munición sin escaleras, incluso durante un bombardeo.',
    },
    {
      id: 'vida-cotidiana',
      kind: 'curiosity',
      title: 'La vida en el castillo',
      summary: 'Una pequeña ciudad de soldados y artesanos.',
      body: 'Además de soldados, el castillo albergaba almacenes, capilla, cocinas y alojamientos. El suministro de agua y alimentos era el punto más vulnerable: por eso los asedios buscaban cortar los accesos antes de intentar un asalto directo.',
    },
  ],
  ar: {
    environment: 'Mar Caribe · asedio de 1741',
    placementHint: 'Apunta hacia una superficie plana y toca para colocar la escena.',
    targetSizeMeters: 1.5,
    initialScale: 1,
    scaleRange: { min: 0.5, max: 2.5 },
    allowScale: true,
    allowRelocate: true,
    controls: [
      {
        id: 'toggle-playback',
        label: 'Iniciar ataque',
        activeLabel: 'Detener ataque',
        icon: 'play',
        emphasis: 'primary',
      },
      { id: 'replay', label: 'Repetir escena', icon: 'restart' },
      { id: 'reset', label: 'Reiniciar vista', icon: 'expand' },
      { id: 'info', label: 'Información histórica', icon: 'info' },
    ],
  },
}
