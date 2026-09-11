import type { ExperienceDefinition } from '../types'
import { assetUrl } from '@/lib/assets'

export const palaceExperience: ExperienceDefinition = {
  id: 'palacio-inquisicion',
  name: 'Palacio de la Inquisición',
  tagline: 'Arquitectura, poder y memoria',
  shortDescription:
    'Explora uno de los edificios históricos más emblemáticos de Cartagena.',
  description:
    'Un recorrido arquitectónico por el antiguo Tribunal del Santo Oficio, hoy Museo Histórico de Cartagena. Coloca el edificio en tu entorno, gíralo para descubrir su portada barroca, sus balcones de madera y el patio de arcos que organiza todo el conjunto.',
  coverImage: assetUrl('images/palacio-inquisicion.svg'),
  heroImage: assetUrl('images/palacio-inquisicion.svg'),
  location: 'Plaza de Bolívar, Centro Histórico, Cartagena de Indias',
  era: 'Siglo XVIII',
  durationMinutes: 10,
  tags: ['Arquitectura', 'Barroco colonial', 'Museo'],
  highlights: [
    { icon: 'compass', label: 'Visita', value: 'Fachada, claustro y patio' },
    { icon: 'layers', label: 'Puntos', value: '4 puntos históricos' },
    { icon: 'history', label: 'Época', value: 'Cartagena virreinal' },
  ],
  scene: 'palace-exploration',
  model: {
    src: assetUrl('models/palacio-inquisicion.glb'),
    attribution: 'Modelo generado con Tripo AI.',
  },
  animations: [
    {
      id: 'points',
      label: 'Puntos históricos',
      description:
        'Marcadores flotantes que puedes tocar para descubrir la portada, los balcones, el claustro y el patio.',
      trigger: 'manual',
    },
  ],
  info: [
    {
      id: 'portada',
      kind: 'architecture',
      title: 'La portada',
      summary: 'La puerta de piedra que anunciaba el poder del Tribunal.',
      body: 'La fachada se organiza alrededor de una portada en piedra de estilo barroco colonial, con arcos de medio punto y remates labrados. Su presencia sobria y monumental debía imponer respeto a quienes cruzaban la plaza rumbo al Tribunal del Santo Oficio.',
      fact: 'Sobre la portada se labraron escudos y símbolos que declaraban la autoridad de la Corona y de la Inquisición.',
    },
    {
      id: 'balcones',
      kind: 'architecture',
      title: 'Balcones de madera',
      summary: 'Voladizos que dan sombra y aire a la planta alta.',
      body: 'Los balcones de madera son una seña de identidad de la arquitectura caribeña: protegen del sol, permiten la ventilación cruzada y convierten la calle en una extensión de la vida doméstica. En el palacio, recorren la planta superior y tamizan la luz que entra a las salas.',
      fact: 'La madera se trabajaba localmente y se pintaba con tonos claros para reflejar el calor.',
    },
    {
      id: 'claustro',
      kind: 'architecture',
      title: 'El claustro de arcos',
      summary: 'Galerías que ordenan el edificio alrededor del patio.',
      body: 'La planta se organiza en torno a un patio central rodeado de galerías con arcos de medio punto. Este esquema, heredado de la tradición mediterránea, permite que todas las salas reciban luz y ventilación natural, algo esencial en el clima de Cartagena.',
      fact: 'El patio funcionaba como distribuidor, lugar de espera y espacio de representación del Tribunal.',
    },
    {
      id: 'tribunal',
      kind: 'history',
      title: 'El Tribunal del Santo Oficio',
      summary: 'Sede de la Inquisición en el Caribe.',
      body: 'Cartagena fue una de las tres sedes americanas de la Inquisición. El edificio actual, levantado en el siglo XVIII, albergó las salas del Tribunal hasta los procesos de independencia. Con el tiempo se transformó en sede administrativa y, finalmente, en el Museo Histórico de Cartagena.',
      fact: 'Hoy sus salas conservan documentos, objetos y testimonios de la vida colonial.',
    },
    {
      id: 'museo',
      kind: 'practical',
      title: 'Hoy: Museo Histórico',
      summary: 'Un museo para entender la Cartagena virreinal.',
      body: 'La visita recorre patios, salas y dependencias donde se exhiben piezas de la vida cotidiana, el comercio y la justicia colonial. La arquitectura del edificio es, en sí misma, el objeto más valioso de la colección.',
      fact: 'Se encuentra frente a la Plaza de Bolívar, en pleno centro histórico amurallado.',
    },
  ],
  ar: {
    environment: 'Centro histórico · Cartagena',
    placementHint: 'Apunta hacia una superficie plana y toca para colocar el edificio.',
    targetSizeMeters: 1.4,
    initialScale: 1,
    scaleRange: { min: 0.5, max: 2.5 },
    allowScale: true,
    allowRelocate: true,
    controls: [
      {
        id: 'focus-points',
        label: 'Puntos de interés',
        activeLabel: 'Ocultar puntos',
        icon: 'map-pin',
        emphasis: 'primary',
      },
      { id: 'reset', label: 'Reiniciar vista', icon: 'expand' },
      { id: 'info', label: 'Información histórica', icon: 'info' },
    ],
  },
}
