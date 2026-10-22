export interface Lesson {
  id: string;
  number: string;
  title: string;
  duration: string;
  durationMinutes: number;
  isFreePreview?: boolean;
  summary: string;
  keyTakeaways: string[];
  practicalFormulaOrCode: string;
  resourceTitle: string;
  resourceContent: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type CourseVisualTheme =
  | 'finance_ledger'
  | 'cloud_fullstack'
  | 'ecommerce_growth'
  | 'data_analytics'
  | 'product_design'
  | 'remote_leadership';

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category:
    | 'Finanzas y Crédito'
    | 'Tecnología y Datos'
    | 'Negocios y E-Commerce'
    | 'Diseño y Producto'
    | 'Liderazgo Remoto';
  level: 'Fundamentos' | 'Intermedio' | 'Avanzado';
  priceCOP: number;
  originalPriceCOP: number;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  totalDuration: string;
  lessonsCount: number;
  visualTheme: CourseVisualTheme;
  tagText: string;
  anywhereBenefit: string;
  instructor: {
    name: string;
    role: string;
    organization: string;
    bio: string;
  };
  outcomes: string[];
  modules: CourseModule[];
}

export interface EfipayTransaction {
  reference: string;
  date: string;
  buyerName: string;
  buyerEmail: string;
  buyerDoc: string;
  buyerLocation: string;
  methodLabel: string;
  currency: 'COP' | 'USD';
  amountFormatted: string;
  courseIds: string[];
  courseTitles: string[];
}

export const CATEGORIES = [
  'Todos los cursos',
  'Finanzas y Crédito',
  'Tecnología y Datos',
  'Negocios y E-Commerce',
  'Diseño y Producto',
  'Liderazgo Remoto',
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

export const COURSES: Course[] = [
  {
    id: 'crs-finanzas-credito',
    slug: 'arquitectura-financiera-credito-inversion',
    title: 'Arquitectura Financiera, Gestión de Crédito e Inversión Global',
    subtitle:
      'Domina el análisis de endeudamiento inteligente, calificación crediticia, flujo de caja y portafolios de inversión desde cualquier lugar.',
    category: 'Finanzas y Crédito',
    level: 'Intermedio',
    priceCOP: 149000,
    originalPriceCOP: 220000,
    priceUSD: 38,
    rating: 4.9,
    reviewsCount: 418,
    studentsCount: 2840,
    totalDuration: '14h 20m',
    lessonsCount: 4,
    visualTheme: 'finance_ledger',
    tagText: 'Más vendido',
    anywhereBenefit:
      'Incluye plantillas financieras multi-divisa (COP, USD, EUR, MXN) listas para usar en móvil o escritorio.',
    instructor: {
      name: 'Alejandro Montenegro, CFA',
      role: 'Director de Estrategia Patrimonial',
      organization: 'Andes Capital & Ex-Banca de Inversión',
      bio: '14 años estructurando portafolios de crédito e inversión en Latinoamérica y Estados Unidos. Ha formado a más de 12,000 profesionales en educación financiera práctica.',
    },
    outcomes: [
      'Calcular el costo efectivo anual (E.A.) real de cualquier línea de crédito y optimizar tasas mediante compra de cartera.',
      'Construir un sistema de flujo de caja personal o empresarial automatizado en 4 cuentas operativas.',
      'Evaluar instrumentos de renta fija (CDTs, Bonos del Tesoro) y ETFs indexados internacionales sin intermediarios costosos.',
      'Diseñar un plan de blindaje patrimonial con fondo de liquidez en moneda fuerte.',
    ],
    modules: [
      {
        id: 'mod-fin-1',
        title: 'Módulo 1 · Diagnóstico de Liquidez y Estructura de Crédito',
        lessons: [
          {
            id: 'les-fin-1',
            number: '01',
            title: 'Anatomía del flujo de caja y regla de solvencia 50/30/20 ajustada',
            duration: '22:15',
            durationMinutes: 22,
            isFreePreview: true,
            summary:
              'Aprenderás a auditar tus ingresos netos, separar costos fijos de pasivos financieros y establecer tu índice real de liquidez mensual antes de adquirir deuda o invertir.',
            keyTakeaways: [
              'El índice de cobertura de liquidez mide cuántos meses de costos básicos cubre tu reserva disponible.',
              'Diferencia entre deuda destructiva (consumo depreciable) y deuda apalancada (activos productivos o educación con retorno).',
              'Automatización de transferencias el día de recepción del ingreso para eliminar fricción conductual.',
            ],
            practicalFormulaOrCode: `// Cálculo de Razón de Endeudamiento Saludable y Tasa Efectiva
Ingreso Mensual Neto:        $6,500,000 COP (o $1,650 USD)
Cuota Máxima Recomendada:    <= 25% del ingreso neto ($1,625,000 COP)
Conversión Tasa Nominal a Efectiva Anual (E.A.):
E.A. = (1 + i_mensual)^12 - 1
Ejemplo: 1.8% M.V. -> (1.018)^12 - 1 = 23.87% E.A.`,
            resourceTitle: 'Plantilla_Auditoria_Liquidez_CREDIULEP.txt',
            resourceContent: `CREDIULEP — PLANTILLA DE AUDITORÍA DE LIQUIDEZ Y CRÉDITO
1. Ingreso Neto Mensual Total: ______________________
2. Costos Fijos Esenciales (<= 50%): ________________
3. Servicio de Deuda Actual (<= 20%): _______________
4. Capital de Inversión Automático (>= 20%): ________
5. Meta de Fondo de Paz Mental (6 meses de costos): __`,
            quiz: {
              question:
                'Si un crédito tiene una tasa del 1.5% Mes Vencido (M.V.), ¿cuál es el comportamiento de su Tasa Efectiva Anual (E.A.)?',
              options: [
                'Es exactamente 18.0% E.A. porque se multiplica por 12 meses',
                'Es 19.56% E.A. debido a la capitalización compuesta mensual',
                'Es 15.0% E.A. descontando la inflación anual',
              ],
              correctIndex: 1,
              explanation:
                'Por interés compuesto, (1 + 0.015)^12 - 1 = 0.1956 (19.56% E.A.), superior a la multiplicación simple de 1.5% x 12.',
            },
          },
          {
            id: 'les-fin-2',
            number: '02',
            title: 'Ingeniería del puntaje crediticio y optimización de tasas bancarias',
            duration: '28:40',
            durationMinutes: 29,
            summary:
              'Cómo funcionan los motores de scoring crediticio, el factor de utilización de cupo rotativo y el protocolo paso a paso para negociar reducciones de tasa desde tu banca virtual.',
            keyTakeaways: [
              'Mantener la utilización de tarjetas de crédito por debajo del 30% del cupo total dispara positivamente el score en 60 días.',
              'Método Avalancha (atacar mayor tasa E.A.) vs. Método Bola de Nieve (atacar menor saldo insoluto).',
              'Guion de negociación de tasa de interés por retención o compra de cartera con otra entidad.',
            ],
            practicalFormulaOrCode: `// Variables de Peso en el Score Crediticio
1. Historial de pagos puntuales:          35%
2. Nivel de utilización de cupo (<30%):   30%
3. Antigüedad promedio de productos:      15%
4. Mezcla de productos financieros:       10%
5. Consultas recientes a centrales:       10%`,
            resourceTitle: 'Guion_Negociacion_Tasas_Bancarias.txt',
            resourceContent: `GUION PRÁCTICO PARA REDUCCIÓN DE TASA O COMPRA DE CARTERA — CREDIULEP
Paso 1: Solicitar certificado de saldo y tasa E.A. actual.
Paso 2: Contactar área de retención indicando oferta competidora 400 puntos básicos menor.
Paso 3: Solicitar redenominación de tasa sin extender plazo remanente.`,
            quiz: {
              question:
                '¿Cuál es el porcentaje máximo de utilización del cupo de tarjeta de crédito recomendado para maximizar tu puntaje crediticio?',
              options: [
                'Menos del 30% del cupo total aprobado',
                'Entre el 75% y el 90% del cupo total',
                'El 100% siempre que se pague el mínimo',
              ],
              correctIndex: 0,
              explanation:
                'Los algoritmos de riesgo penalizan utilizaciones superiores al 30% porque indican dependencia de liquidez de corto plazo.',
            },
          },
        ],
      },
      {
        id: 'mod-fin-2',
        title: 'Módulo 2 · Portafolios de Inversión y Renta Compuesta',
        lessons: [
          {
            id: 'les-fin-3',
            number: '03',
            title: 'Renta fija soberana, CDTs digitales y protección contra inflación',
            duration: '31:10',
            durationMinutes: 31,
            summary:
              'Aprende a calcular la rentabilidad real neta (después de inflación e impuestos) y a escalonar vencimientos de renta fija para tener liquidez trimestral.',
            keyTakeaways: [
              'Rentabilidad Real = ((1 + Tasa Nominal) / (1 + Inflación)) - 1.',
              'Estrategia de escalera de CDTs / Bonos (Bond Laddering) a 90, 180 y 360 días.',
              'Cuándo priorizar cuentas remuneradas de alta liquidez frente a certificados a término.',
            ],
            practicalFormulaOrCode: `// Fórmula de Fisher para Rentabilidad Real
Tasa CDTs / Bono:     11.5% E.A.
Inflación Anual IPC:   5.2% Anual
Rentabilidad Real = ((1 + 0.115) / (1 + 0.052)) - 1
                  = (1.115 / 1.052) - 1 = +5.99% Real Anual`,
            resourceTitle: 'Calculadora_Rentabilidad_Real_IPC.txt',
            resourceContent: `MATRIZ DE ESCALONAMIENTO DE RENTA FIJA (BOND LADDERING)
Tramo 1 (25% del capital): Liquidez a la vista remunerada.
Tramo 2 (25% del capital): Vencimiento a 90 días.
Tramo 3 (25% del capital): Vencimiento a 180 días.
Tramo 4 (25% del capital): Vencimiento a 360 días.`,
            quiz: {
              question:
                'Si una inversión rinde 10% E.A. y la inflación del periodo es 6%, ¿la rentabilidad real es superior o inferior al 4%?',
              options: [
                'Ligeramente inferior al 4% (3.77%) por la fórmula de Fisher',
                'Exactamente 16% sumando ambos indicadores',
                'Cero por ciento porque hay inflación',
              ],
              correctIndex: 0,
              explanation:
                'Aplicando ((1.10 / 1.06) - 1), la rentabilidad real exacta es 3.77%.',
            },
          },
          {
            id: 'les-fin-4',
            number: '04',
            title: 'Portafolio Global con ETFs Indexados y Dollar-Cost Averaging',
            duration: '34:05',
            durationMinutes: 34,
            summary:
              'Construye un portafolio diversificado globalmente desde tu país utilizando ETFs de bajo costo (TER < 0.10%) y aportaciones periódicas automatizadas.',
            keyTakeaways: [
              'Por qué el bajo costo de administración (Expense Ratio) determina hasta el 40% del patrimonio a 15 años.',
              'Combinación clásica de renta variable global (S&P 500 / MSCI World) y bonos de corta duración.',
              'Regla de rebalanceo anual por bandas de desviación de +/- 5%.',
            ],
            practicalFormulaOrCode: `// Distribución Modelo de Portafolio Moderado Global
60% — ETF Renta Variable Global (TER 0.03% - 0.07%)
25% — Renta Fija Local / Bonos del Tesoro Corto Plazo
15% — Liquidez Estratégica de Oportunidad
Frecuencia de Rebalanceo: Semestral o al superar +/- 5% de desviación`,
            resourceTitle: 'Politica_Personal_Inversion_IPS.txt',
            resourceContent: `DECLARACIÓN DE POLÍTICA DE INVERSIÓN PERSONAL (IPS) — CREDIULEP
Horizonte temporal: ______ años.
Tolerancia máxima a volatilidad: ______%.
Día del mes para aporte DCA: Día ______.`,
            quiz: {
              question: '¿En qué consiste la estrategia Dollar-Cost Averaging (DCA)?',
              options: [
                'Invertir un monto fijo de forma periódica sin intentar adivinar el piso del mercado',
                'Comprar únicamente cuando las noticias financieras son positivas',
                'Vender todo el portafolio cada viernes',
              ],
              correctIndex: 0,
              explanation:
                'El DCA reduce el impacto emocional y promedia el precio de compra a lo largo de distintos ciclos de mercado.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'crs-fullstack-cloud',
    slug: 'ingenieria-web-fullstack-arquitectura-cloud',
    title: 'Ingeniería Web Full-Stack con TypeScript, React y Pasarelas de Pago',
    subtitle:
      'Construye aplicaciones web en producción, APIs seguras, webhooks transaccionales y despliegues en la nube.',
    category: 'Tecnología y Datos',
    level: 'Avanzado',
    priceCOP: 189000,
    originalPriceCOP: 280000,
    priceUSD: 49,
    rating: 4.95,
    reviewsCount: 512,
    studentsCount: 3410,
    totalDuration: '18h 45m',
    lessonsCount: 4,
    visualTheme: 'cloud_fullstack',
    tagText: 'Certificación técnica',
    anywhereBenefit:
      'Entorno de desarrollo en la nube listo para programar desde una laptop ligera o tablet en cualquier ciudad.',
    instructor: {
      name: 'Camila Restrepo, M.Sc.',
      role: 'Staff Software Architect',
      organization: 'Fintech LatAm Cloud',
      bio: 'Arquitecta de sistemas distribuidos y pasarelas de pago de alto volumen. Ha liderado integraciones financieras que procesan más de 4 millones de transacciones mensuales.',
    },
    outcomes: [
      'Diseñar arquitecturas frontend modulares en React 19 y TypeScript con estado predecible y latencia cero.',
      'Integrar pasarelas de pago mediante Checkout Transparente, PSE y validación criptográfica de Webhooks.',
      'Implementar idempotencia en pagos para evitar cobros duplicados ante caídas de red móvil.',
      'Desplegar contenedores auto-escalables con monitoreo de errores en tiempo real.',
    ],
    modules: [
      {
        id: 'mod-dev-1',
        title: 'Módulo 1 · Arquitectura Frontend Resiliente y Estado Transaccional',
        lessons: [
          {
            id: 'les-dev-1',
            number: '01',
            title: 'Modelado de dominio con TypeScript estricto y máquinas de estado',
            duration: '26:30',
            durationMinutes: 27,
            isFreePreview: true,
            summary:
              'Evita estados imposibles en carritos de compra y flujos de pago utilizando uniones discriminadas en TypeScript.',
            keyTakeaways: [
              'Uso de Discriminated Unions para modelar estados: idle | processing | approved | rejected.',
              'Persistencia optimista sincronizada con almacenamiento local para conexiones móviles intermitentes.',
              'Validación de esquemas en frontera de cliente y servidor.',
            ],
            practicalFormulaOrCode: `type PaymentState =
  | { status: 'idle' }
  | { status: 'processing'; idempotencyKey: string }
  | { status: 'approved'; txRef: string; unlockedAt: string }
  | { status: 'rejected'; reason: string; retryable: boolean };`,
            resourceTitle: 'Guia_Arquitectura_TypeScript_Pagos.txt',
            resourceContent: `PATRONES DE TIPADO ESTRICTO PARA COMERCIO ELECTRÓNICO — CREDIULEP
1. Nunca uses booleanos sueltos (isLoading, isError, isSuccess).
2. Usa uniones discriminadas por 'status'.
3. Representa montos monetarios en enteros (centavos) para evitar errores IEEE 754.`,
            quiz: {
              question:
                '¿Por qué se recomienda almacenar y operar montos monetarios en números enteros (centavos o pesos enteros) en lugar de decimales flotantes?',
              options: [
                'Para evitar errores de precisión binaria en punto flotante (como 0.1 + 0.2 = 0.30000000000000004)',
                'Porque los navegadores no soportan el símbolo de punto decimal',
                'Para reducir el tamaño de la fuente en pantalla',
              ],
              correctIndex: 0,
              explanation:
                'La aritmética en punto flotante IEEE 754 introduce redondeos inexactos; operar con enteros garantiza exactitud contable.',
            },
          },
          {
            id: 'les-dev-2',
            number: '02',
            title: 'Integración de API de Pagos: Checkout, PSE, Billeteras y Webhooks HMAC',
            duration: '35:15',
            durationMinutes: 35,
            summary:
              'Implementación completa del ciclo de vida de una transacción digital: creación de orden, tokenización, redirección bancaria y confirmación vía Webhook firmado.',
            keyTakeaways: [
              'Generación de llave de idempotencia única por intento de cobro.',
              'Verificación de firma HMAC-SHA256 en el endpoint de Webhook antes de liberar el curso.',
              'Liberación instantánea del contenido educativo tras confirmación de estado APPROVED.',
            ],
            practicalFormulaOrCode: `// Verificación de firma de Webhook en Node/Express
import crypto from 'crypto';

function verifyPaymentWebhook(payload: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}`,
            resourceTitle: 'Checklist_Seguridad_Pagos_API.txt',
            resourceContent: `CHECKLIST DE PRODUCCIÓN PARA INTEGRACIÓN DE PAGOS — CREDIULEP
[x] Credenciales API almacenadas en variables de entorno seguras.
[x] Verificación HMAC-SHA256 activa en ruta POST /api/webhooks/payments.
[x] Idempotencia por reference_id en base de datos para evitar doble activación.`,
            quiz: {
              question:
                '¿Cuál es la función de una clave de idempotencia (Idempotency-Key) al enviar un pago a la pasarela?',
              options: [
                'Garantizar que si el usuario hace doble clic o se reintenta la petición por red lenta, solo se procese un único cobro',
                'Encriptar las imágenes del catálogo de productos',
                'Aumentar el precio del producto automáticamente',
              ],
              correctIndex: 0,
              explanation:
                'La clave de idempotencia asegura que múltiples solicitudes idénticas produzcan un único efecto transaccional.',
            },
          },
        ],
      },
      {
        id: 'mod-dev-2',
        title: 'Módulo 2 · Rendimiento, Caché Distribuido y Entrega Global',
        lessons: [
          {
            id: 'les-dev-3',
            number: '03',
            title: 'Optimización de carga para redes móviles 4G/5G y modo offline',
            duration: '29:00',
            durationMinutes: 29,
            summary:
              'Técnicas de partición de código, compresión Brotli y sincronización de progreso de lecciones cuando el estudiante viaja.',
            keyTakeaways: [
              'Presupuesto de JavaScript inicial menor a 150 KB comprimido.',
              'Cola de sincronización local para guardar notas y avance de lecciones sin perder datos.',
              'Optimización de Core Web Vitals (LCP < 1.8s, INP < 100ms).',
            ],
            practicalFormulaOrCode: `// Sincronización resiliente de progreso de lección
async function syncLessonProgress(courseId: string, lessonId: string) {
  localStorage.setItem(\`progress:\${courseId}:\${lessonId}\`, 'completed');
  if (navigator.onLine) {
    await fetch('/api/progress', { method: 'POST', body: JSON.stringify({ courseId, lessonId }) });
  }
}`,
            resourceTitle: 'Presupuesto_Performance_Web.txt',
            resourceContent: `MÉTRICAS OBJETIVO PARA PLATAFORMAS EDUCATIVAS MÓVILES
- Largest Contentful Paint (LCP): <= 1.8 segundos
- Interaction to Next Paint (INP): <= 100 milisegundos
- Cumulative Layout Shift (CLS): 0.00`,
            quiz: {
              question: '¿Qué métrica de Core Web Vitals mide la estabilidad visual evitando saltos bruscos de diseño?',
              options: [
                'CLS (Cumulative Layout Shift)',
                'DNS Lookup Time',
                'SMTP Latency',
              ],
              correctIndex: 0,
              explanation:
                'Cumulative Layout Shift (CLS) cuantifica los desplazamientos inesperados de elementos visibles en la página.',
            },
          },
          {
            id: 'les-dev-4',
            number: '04',
            title: 'Despliegue continuo, observabilidad y auditoría de transacciones',
            duration: '27:45',
            durationMinutes: 28,
            summary:
              'Configuración de pipelines CI/CD, trazabilidad de órdenes y tableros de conciliación financiera.',
            keyTakeaways: [
              'Logs estructurados en JSON con correlationId por transacción.',
              'Pruebas automatizadas de extremo a extremo para el flujo Carrito -> Pago -> Aula Virtual.',
              'Estrategia de despliegue Blue-Green sin tiempo de inactividad.',
            ],
            practicalFormulaOrCode: `// Log estructurado de conciliación transaccional
logger.info({
  event: 'COURSE_UNLOCKED_INSTANTLY',
  txReference: 'ORD-894210',
  latencyMs: 142,
  studentAccess: 'GRANTED'
});`,
            resourceTitle: 'Protocolo_Conciliacion_Transaccional.txt',
            resourceContent: `AUDITORÍA Y CONCILIACIÓN DIARIA — CREDIULEP
1. Cruzar webhooks aprobados contra matrículas activadas.
2. Verificar latencia de activación (< 2 segundos tras confirmación).
3. Emitir comprobante electrónico automático al estudiante.`,
            quiz: {
              question: '¿Qué ventaja ofrece un despliegue Blue-Green en una tienda virtual activa 24/7?',
              options: [
                'Permite actualizar a una nueva versión sin interrumpir a los usuarios que están pagando en ese instante',
                'Cambia los colores de la interfaz automáticamente a azul y verde',
                'Elimina la necesidad de tener servidor backend',
              ],
              correctIndex: 0,
              explanation:
                'El despliegue Blue-Green mantiene dos entornos idénticos y conmuta el tráfico instantáneamente sin caída del servicio.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'crs-ecommerce-growth',
    slug: 'estrategia-ecommerce-conversion-pagos-digitales',
    title: 'Estrategia de E-Commerce, Conversión y Ventas Sin Fronteras',
    subtitle:
      'Crea tiendas virtuales de alta conversión, reduce el abandono de carrito con pagos locales e internacionales y escala tu adquisición.',
    category: 'Negocios y E-Commerce',
    level: 'Fundamentos',
    priceCOP: 129000,
    originalPriceCOP: 195000,
    priceUSD: 33,
    rating: 4.88,
    reviewsCount: 329,
    studentsCount: 2190,
    totalDuration: '11h 15m',
    lessonsCount: 3,
    visualTheme: 'ecommerce_growth',
    tagText: 'Alta demanda',
    anywhereBenefit:
      'Metodología aplicable para vender productos físicos o cursos digitales desde cualquier ciudad hacia toda Latinoamérica.',
    instructor: {
      name: 'Valeria Lozano',
      role: 'VP of Digital Commerce',
      organization: 'Escala LatAm & Ex-Directora Growth',
      bio: 'Especialista en optimización de tasa de conversión (CRO) y medios de pago digitales. Ha asesorado a más de 180 comercios en su expansión regional.',
    },
    outcomes: [
      'Aumentar la tasa de aprobación y conversión en el checkout ofreciendo PSE, Nequi, Tarjetas y Links de pago.',
      'Estructurar catálogos categorizados que guían al comprador desde el descubrimiento hasta el pago en menos de 3 clics.',
      'Dominar las métricas unitarias del comercio electrónico: CAC, LTV, AOV y ROAS marginal.',
      'Implementar secuencias de recuperación de carritos y activación post-compra inmediata.',
    ],
    modules: [
      {
        id: 'mod-eco-1',
        title: 'Módulo 1 · Psicología de Conversión y Fricción Cero en Checkout',
        lessons: [
          {
            id: 'les-eco-1',
            number: '01',
            title: 'Arquitectura de catálogo categorizado y ficha de producto persuasiva',
            duration: '24:10',
            durationMinutes: 24,
            isFreePreview: true,
            summary:
              'Cómo estructurar categorías claras, propuestas de valor específicas y pruebas cuantitativas que duplican la intención de compra.',
            keyTakeaways: [
              'Regla de los 3 segundos: el comprador debe entender qué compra, cuánto cuesta y cómo recibe acceso inmediato.',
              'Por qué ofrecer métodos de pago locales (PSE, billeteras móviles) incrementa la conversión hasta un 42% en Latinoamérica.',
              'Transparencia total de precios sin cargos ocultos en el último paso.',
            ],
            practicalFormulaOrCode: `// Ecuación Fundamental de Ingresos en E-Commerce
Ingresos = Tráfico Calificado × Tasa de Conversión (CR) × Ticket Promedio (AOV)

Impacto de mejora del +20% en cada palanca:
1.20 × 1.20 × 1.20 = 1.728 (+72.8% de crecimiento compuesto en ventas)`,
            resourceTitle: 'Matriz_Auditoria_Checkout_CRO.txt',
            resourceContent: `LISTA DE VERIFICACIÓN DE CONVERSIÓN EN CHECKOUT — CREDIULEP
1. ¿Se permite comprar sin obligar a crear una cuenta previa de 15 campos?
2. ¿Están visibles PSE, Tarjetas, Nequi y QR desde el resumen de compra?
3. ¿Se entrega el producto digital en el mismo segundo tras aprobar el pago?`,
            quiz: {
              question:
                'Si mejoras un 20% el tráfico, un 20% la tasa de conversión y un 20% el ticket promedio, ¿cuánto crecen los ingresos totales?',
              options: [
                'Crecen un 72.8% gracias al efecto multiplicativo compuesto (1.2 x 1.2 x 1.2)',
                'Crecen exactamente un 20%',
                'Crecen un 60% lineal',
              ],
              correctIndex: 0,
              explanation:
                'Al ser variables multiplicativas en la ecuación de ingresos, 1.20 × 1.20 × 1.20 = 1.728 (+72.8%).',
            },
          },
          {
            id: 'les-eco-2',
            number: '02',
            title: 'Unit Economics: Cálculo riguroso de CAC, LTV y margen de contribución',
            duration: '30:20',
            durationMinutes: 30,
            summary:
              'Aprende a calcular cuánto puedes invertir en adquirir un cliente manteniendo rentabilidad saludable desde la primera compra.',
            keyTakeaways: [
              'Margen de Contribución = Precio Neto - Costo Directo de Entrega - Comisión de Pasarela.',
              'Relación saludable LTV : CAC >= 3:1 para crecimiento sostenible.',
              'Cómo usar paquetes de cursos (Bundles) para elevar el Ticket Promedio (AOV).',
            ],
            practicalFormulaOrCode: `// Cálculo de Unit Economics para Curso Digital
Precio del Curso:             $149,000 COP
Costo Transaccional:           -$8,900 COP
Margen de Contribución (94%): $140,100 COP
CAC Objetivo Máximo (1/3):     $46,700 COP`,
            resourceTitle: 'Calculadora_Unit_Economics_Tienda.txt',
            resourceContent: `PLANTILLA DE UNIT ECONOMICS PARA TIENDA VIRTUAL
Precio de Venta Promedio (AOV): ______________
Comisión de Transacción: _____________________
Margen Bruto por Orden: ______________________
Costo de Adquisición de Cliente (CAC): _______`,
            quiz: {
              question: '¿Qué relación mínima entre Valor de Vida del Cliente (LTV) y Costo de Adquisición (CAC) se considera saludable?',
              options: [
                'Al menos 3 a 1 (LTV >= 3x CAC)',
                '1 a 5 (gastar 5 veces más de lo que genera el cliente)',
                'No importa el CAC en comercio electrónico',
              ],
              correctIndex: 0,
              explanation:
                'Una relación LTV:CAC de al menos 3:1 asegura cubrir costos operativos y generar utilidad neta reinvertible.',
            },
          },
          {
            id: 'les-eco-3',
            number: '03',
            title: 'Links de pago directos, QR y comercio conversacional por WhatsApp',
            duration: '26:50',
            durationMinutes: 27,
            summary:
              'Cierra ventas asistidas en minutos combinando catálogo web con links de pago instantáneos verificables desde cualquier celular.',
            keyTakeaways: [
              'Cuándo usar Checkout integrado en web vs. Link de pago directo en conversaciones.',
              'Estructura de seguimiento en 3 toques para carritos pendientes sin ser invasivo.',
              'Activación automática de cuenta estudiantil al confirmar pago por QR o PSE.',
            ],
            practicalFormulaOrCode: `// Flujo de Conversión Híbrida CREDIULEP
1. Selección en Catálogo Web o Consulta Móvil
2. Orden Generada con Referencia Única
3. Pago vía PSE / Nequi / Tarjeta / QR en < 45 segundos
4. Redirección Automática al Reproductor de Lecciones`,
            resourceTitle: 'Plantillas_Cierre_Ventas_Digitales.txt',
            resourceContent: `PROTOCOLO DE RECUPERACIÓN Y CIERRE RÁPIDO — CREDIULEP
Mensaje 1 (Minuto 15): Resumen del programa y enlace directo a lección gratuita.
Mensaje 2 (Hora 4): Resolución de dudas frecuentes sobre medios de pago.
Mensaje 3 (Hora 24): Confirmación de cupo y acceso inmediato garantizado.`,
            quiz: {
              question: '¿Cuál es el principal beneficio de ofrecer acceso inmediato a las lecciones tras el pago?',
              options: [
                'Elimina la ansiedad post-compra y capitaliza el momento de máxima motivación del estudiante',
                'Retrasa el inicio del curso por 48 horas hábiles',
                'Obliga al usuario a enviar comprobantes impresos por correo físico',
              ],
              correctIndex: 0,
              explanation:
                'El acceso inmediato recompensa la confianza del comprador al instante y eleva la tasa de finalización del curso.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'crs-data-intelligence',
    slug: 'ciencia-datos-sql-business-intelligence',
    title: 'Analítica de Datos, SQL Avanzado y Business Intelligence Aplicado',
    subtitle:
      'Transforma bases de datos crudas en tableros ejecutivos de toma de decisiones con SQL, modelado dimensional y métricas de negocio.',
    category: 'Tecnología y Datos',
    level: 'Intermedio',
    priceCOP: 169000,
    originalPriceCOP: 250000,
    priceUSD: 44,
    rating: 4.92,
    reviewsCount: 384,
    studentsCount: 2560,
    totalDuration: '16h 10m',
    lessonsCount: 3,
    visualTheme: 'data_analytics',
    tagText: 'Práctico con SQL',
    anywhereBenefit:
      'Consultas y ejercicios SQL ejecutables directamente en el navegador sin instalar motores pesados.',
    instructor: {
      name: 'Dr. Sebastián Villa',
      role: 'Head of Data & Analytics',
      organization: 'Quantia LatAm',
      bio: 'Doctor en Ingeniería Matemática y líder de equipos de datos en banca digital y retail. Experto en traducir consultas SQL complejas en decisiones estratégicas.',
    },
    outcomes: [
      'Escribir consultas SQL analíticas usando CTEs, funciones de ventana (ROW_NUMBER, LAG, LEAD) y agregaciones de cohortes.',
      'Diseñar modelos estrella (Fact & Dimension Tables) optimizados para inteligencia de negocios.',
      'Construir análisis de retención por cohortes y predicción de deserción (Churn).',
      'Presentar hallazgos cuantitativos con precisión ejecutiva y rigor estadístico.',
    ],
    modules: [
      {
        id: 'mod-dat-1',
        title: 'Módulo 1 · SQL Analítico y Funciones de Ventana en Producción',
        lessons: [
          {
            id: 'les-dat-1',
            number: '01',
            title: 'CTEs modulares y Window Functions para análisis de ingresos',
            duration: '29:45',
            durationMinutes: 30,
            isFreePreview: true,
            summary:
              'Reemplaza subconsultas anidadas difíciles de leer por Common Table Expressions (WITH) y calcula acumulados móviles.',
            keyTakeaways: [
              'Uso de PARTITION BY y ORDER BY dentro de OVER() sin colapsar las filas originales.',
              'Cálculo de crecimiento mes a mes (MoM) utilizando la función LAG().',
              'Ranking de cursos y productos por categoría con DENSE_RANK().',
            ],
            practicalFormulaOrCode: `WITH ventas_mensuales AS (
  SELECT
    DATE_TRUNC('month', fecha_pago) AS mes,
    categoria,
    SUM(monto_cop) AS ingresos
  FROM transacciones_pagos
  WHERE estado = 'APPROVED'
  GROUP BY 1, 2
)
SELECT
  mes,
  categoria,
  ingresos,
  LAG(ingresos) OVER (PARTITION BY categoria ORDER BY mes) AS mes_anterior
FROM ventas_mensuales;`,
            resourceTitle: 'Cheatsheet_SQL_Window_Functions.txt',
            resourceContent: `GUÍA RÁPIDA DE FUNCIONES DE VENTANA SQL — CREDIULEP
- ROW_NUMBER(): Numeración única secuencial por partición.
- LAG(col, 1): Valor de la fila anterior en la ventana ordenada.
- SUM(col) OVER (ORDER BY fecha): Acumulado continuo (Running Total).`,
            quiz: {
              question:
                '¿Qué función de ventana en SQL permite obtener el valor de la fila inmediatamente anterior sin hacer un self-join?',
              options: ['LAG()', 'COUNT(*)', 'DROP TABLE'],
              correctIndex: 0,
              explanation:
                'LAG() accede a datos de una fila previa en el mismo conjunto de resultados según el orden definido en OVER().',
            },
          },
          {
            id: 'les-dat-2',
            number: '02',
            title: 'Análisis de cohortes de retención y comportamiento de recompra',
            duration: '33:20',
            durationMinutes: 33,
            summary:
              'Mide qué porcentaje de estudiantes o compradores vuelven a adquirir un segundo curso en los meses posteriores a su primera compra.',
            keyTakeaways: [
              'Definición de cohorte por mes de primera compra aprobada.',
              'Construcción de matriz triangular de retención en SQL.',
              'Identificación del punto de inflexión hacia el segundo curso.',
            ],
            practicalFormulaOrCode: `// Índice de Retención de Cohorte en el Mes N
Retención(Mes N) = (Usuarios Activos de la Cohorte en Mes N / Total Usuarios Iniciales de la Cohorte) × 100`,
            resourceTitle: 'Plantilla_SQL_Cohortes_Retencion.txt',
            resourceContent: `ESTRUCTURA DE COHORTES EN SQL — CREDIULEP
Paso 1: Identificar fecha_primera_compra por usuario_id.
Paso 2: Calcular diferencia en meses (month_number) para cada compra subsecuente.
Paso 3: Agrupar y dividir por el tamaño inicial de la cohorte (Mes 0).`,
            quiz: {
              question: '¿Qué mide una matriz de retención por cohortes?',
              options: [
                'El porcentaje de usuarios de un grupo inicial que permanece activo o recompra a lo largo del tiempo',
                'La velocidad del ventilador del servidor de base de datos',
                'El número de colores utilizados en el logotipo',
              ],
              correctIndex: 0,
              explanation:
                'El análisis por cohortes separa grupos por su fecha de ingreso para observar la evolución real de la retención sin distorsión por nuevos registros.',
            },
          },
          {
            id: 'les-dat-3',
            number: '03',
            title: 'Diseño de Dashboards Ejecutivos con jerarquía visual y precisión',
            duration: '25:15',
            durationMinutes: 25,
            summary:
              'Cómo presentar indicadores clave sin ruido visual, utilizando comparativas temporales claras y numeración tabular.',
            keyTakeaways: [
              'Toda métrica debe ir acompañada de su unidad, ventana temporal y delta comparativo.',
              'Evitar gráficos circulares con más de 3 segmentos; preferir barras horizontales ordenadas.',
              'Diseño de alertas operativas basadas en umbrales estadísticos.',
            ],
            practicalFormulaOrCode: `// Estructura de KPI Ejecutivo de Alta Precisión
Métrica:   Tasa de Aprobación Transaccional
Valor:     96.4% (+2.1 pts vs. trimestre anterior)
Muestra:   n = 14,820 transacciones verificadas`,
            resourceTitle: 'Guia_Diseno_Tableros_Ejecutivos.txt',
            resourceContent: `PRINCIPIOS DE VISUALIZACIÓN DE DATOS — CREDIULEP
1. Maximizar la proporción datos-tinta (Data-Ink Ratio).
2. Usar números tabulares (tabular-nums) para alineación vertical perfecta.
3. Incluir siempre contexto temporal y meta de referencia.`,
            quiz: {
              question: '¿Por qué todo indicador numérico en un reporte debe incluir horizonte temporal y comparativa?',
              options: [
                'Porque un número aislado sin contexto ni unidad no permite tomar una decisión informada',
                'Para llenar espacio vacío en la pantalla',
                'Porque SQL no permite mostrar números solos',
              ],
              correctIndex: 0,
              explanation:
                'La precisión cuantitativa exige unidad, periodo de medición y punto de comparación para evaluar el desempeño real.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'crs-product-design',
    slug: 'diseno-producto-digital-ux-ui-sistemas',
    title: 'Diseño de Producto Digital UX/UI y Sistemas de Diseño Escalables',
    subtitle:
      'Diseña interfaces limpias, accesibles y orientadas a conversión con arquitectura tipográfica, tokens de diseño y prototipado funcional.',
    category: 'Diseño y Producto',
    level: 'Intermedio',
    priceCOP: 139000,
    originalPriceCOP: 210000,
    priceUSD: 36,
    rating: 4.94,
    reviewsCount: 276,
    studentsCount: 1940,
    totalDuration: '12h 50m',
    lessonsCount: 3,
    visualTheme: 'product_design',
    tagText: 'Diseño de sistemas',
    anywhereBenefit:
      'Incluye librería de tokens tipográficos, grillas de 1440px y checklists de accesibilidad WCAG AA.',
    instructor: {
      name: 'Martín Echavarría',
      role: 'Principal Product Designer',
      organization: 'Atelier Digital & Ex-Lead Design',
      bio: 'Diseñador de sistemas de interfaz para productos financieros y educativos. Defensor de la claridad tipográfica, el espacio negativo intencional y la accesibilidad universal.',
    },
    outcomes: [
      'Aplicar la regla 60-30-10 de distribución cromática y contraste WCAG AA (4.5:1) en cualquier aplicación web.',
      'Establecer jerarquías tipográficas editoriales y escalas espaciales matemáticamente consistentes.',
      'Diseñar flujos de compra y reproductores educativos sin fricción tanto en escritorio como en móvil.',
      'Documentar tokens de diseño para entrega impecable a ingeniería.',
    ],
    modules: [
      {
        id: 'mod-ux-1',
        title: 'Módulo 1 · Fundamentos Espaciales, Tipografía y Contraste',
        lessons: [
          {
            id: 'les-ux-1',
            number: '01',
            title: 'Matemática espacial, radios anidados y regla cromática 60-30-10',
            duration: '23:40',
            durationMinutes: 24,
            isFreePreview: true,
            summary:
              'Aprende las proporciones exactas de espaciado interno, cálculo de radios concéntricos y presupuesto de color de acento.',
            keyTakeaways: [
              'El padding exterior de un contenedor debe ser mayor o igual al espacio interno entre sus hijos.',
              'Fórmula de radio anidado: r_interno = r_externo - padding.',
              '60% lienzo neutro dominante, 30% superficies estructurales, 10% presupuesto de acento en acciones primarias.',
            ],
            practicalFormulaOrCode: `/* Matemática de Radios Concéntricos Armónicos */
.card-outer {
  border-radius: 16px;
  padding: 8px;
}
.card-inner-media {
  /* 16px (outer) - 8px (padding) = 8px */
  border-radius: 8px;
}`,
            resourceTitle: 'Sistema_Tokens_Espaciales_UX.txt',
            resourceContent: `REGLAS DE ORO DE COMPOSICIÓN DE INTERFAZ — CREDIULEP
1. Contraste mínimo texto normal: 4.5:1 (WCAG AA).
2. Área táctil mínima en móvil: 44x44 píxeles.
3. Un único punto focal dominante por vista.`,
            quiz: {
              question:
                'Si una tarjeta exterior tiene un border-radius de 16px y un padding de 8px, ¿cuál debe ser el border-radius del elemento interno para mantener curvatura concéntrica?',
              options: ['8px (16px - 8px)', '32px', '0px'],
              correctIndex: 0,
              explanation:
                'Restar el padding al radio exterior (r_inner = r_outer - padding) produce esquinas perfectamente paralelas.',
            },
          },
          {
            id: 'les-ux-2',
            number: '02',
            title: 'Diseño de flujos de pago y confianza en comercio digital',
            duration: '27:15',
            durationMinutes: 27,
            summary:
              'Cómo diseñar módulos de compra contiguos, estados de validación claros y confirmaciones post-pago que inspiran seguridad.',
            keyTakeaways: [
              'Nunca usar solo color para indicar error o éxito; acompañar siempre de texto explícito e ícono semántico.',
              'Mantener título, precio, métodos de pago y CTA principal en un bloque contiguo estable.',
              'Mostrar el desglose exacto de la orden en todo momento durante el pago.',
            ],
            practicalFormulaOrCode: `// Jerarquía de Estados Accesibles
Estado Error:   Ícono Alerta + Texto descriptivo ("Ingresa los 10 dígitos de tu celular")
Estado Éxito:   Ícono Check + Referencia verificable + Acción inmediata ("Ir a la Lección 1")`,
            resourceTitle: 'Auditoria_Accesibilidad_WCAG_Checkout.txt',
            resourceContent: `AUDITORÍA DE ACCESIBILIDAD EN FORMULARIOS DE PAGO
[x] Labels visibles y asociados mediante htmlFor / id.
[x] Anillos de foco visibles al navegar con teclado (focus-visible).
[x] Mensajes de error claros junto al campo correspondiente.`,
            quiz: {
              question: '¿Por qué nunca se debe comunicar un estado de error o aprobación únicamente mediante color rojo o verde?',
              options: [
                'Por accesibilidad para personas con daltonismo y claridad cognitiva inmediata',
                'Porque los monitores modernos no muestran el color verde',
                'Para que el formulario tarde más en cargar',
              ],
              correctIndex: 0,
              explanation:
                'El principio de accesibilidad exige acompañar el color con etiquetas textuales explícitas o iconografía clara.',
            },
          },
          {
            id: 'les-ux-3',
            number: '03',
            title: 'Arquitectura de plataformas educativas y reproductores sin distracción',
            duration: '26:00',
            durationMinutes: 26,
            summary:
              'Diseño de entornos de aprendizaje enfocados en la retención de conocimiento, lectura cómoda (65–75 caracteres por línea) y progreso visible.',
            keyTakeaways: [
              'Ancho de línea óptimo para lectura prolongada: 65 a 75 caracteres (measure).',
              'Acceso en un clic entre el reproductor visual, los apuntes descargables y la autoevaluación.',
              'Celebración sobria de hitos con certificado verificable al completar el programa.',
            ],
            practicalFormulaOrCode: `/* Tipografía de Lectura Óptima en Aula Virtual */
.lesson-prose {
  font-size: 16px;
  line-height: 1.65;
  max-width: 68ch;
}`,
            resourceTitle: 'Guia_Tipografia_Editorial_Web.txt',
            resourceContent: `ESCALA TIPOGRÁFICA RECOMENDADA — CREDIULEP
- Titular Hero: clamp(2.25rem, 4vw, 3.5rem), text-wrap: balance
- Encabezado de Sección: 24px - 32px SemiBold
- Cuerpo de Lectura: 16px Regular, interlineado 1.6`,
            quiz: {
              question: '¿Cuál es el ancho de línea (measure) ideal para bloques de lectura educativa en pantalla?',
              options: [
                'Entre 65 y 75 caracteres por línea',
                'Más de 250 caracteres de extremo a extremo del monitor',
                'Menos de 10 caracteres por línea',
              ],
              correctIndex: 0,
              explanation:
                'Un ancho de 65 a 75 caracteres evita la fatiga ocular al saltar de una línea a la siguiente.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'crs-remote-leadership',
    slug: 'liderazgo-agil-equipos-remotos-asincronos',
    title: 'Liderazgo Ágil, Gestión de Proyectos y Trabajo Remoto Asíncrono',
    subtitle:
      'Dirige equipos distribuidos de alto desempeño, implementa rituales asíncronos efectivos y entrega proyectos complejos a tiempo desde cualquier huso horario.',
    category: 'Liderazgo Remoto',
    level: 'Fundamentos',
    priceCOP: 119000,
    originalPriceCOP: 179000,
    priceUSD: 31,
    rating: 4.89,
    reviewsCount: 245,
    studentsCount: 1780,
    totalDuration: '10h 30m',
    lessonsCount: 3,
    visualTheme: 'remote_leadership',
    tagText: '100% aplicable',
    anywhereBenefit:
      'Diseñado específicamente para profesionales y líderes que trabajan o emprenden desde cualquier ciudad o país.',
    instructor: {
      name: 'Daniela Pizarro, PMP',
      role: 'Directora de Operaciones Distribuidas',
      organization: 'GlobalWork LatAm',
      bio: 'Ha dirigido operaciones remotas con equipos en 11 países de América y Europa. Autora de marcos de comunicación escrita y ejecución por objetivos.',
    },
    outcomes: [
      'Reemplazar el 60% de las reuniones improductivas por documentos de decisión asíncrona (RFCs) claros y accionables.',
      'Establecer OKRs trimestrales y métricas de entrega semanal sin caer en el micromanagement.',
      'Coordinar proyectos entre múltiples zonas horarias con protocolos de entrega limpia (Handoffs).',
      'Diseñar tu rutina personal de enfoque profundo trabajando desde casa, coworking o en viaje.',
    ],
    modules: [
      {
        id: 'mod-rem-1',
        title: 'Módulo 1 · Sistemas de Operación Asíncrona y Claridad Escrita',
        lessons: [
          {
            id: 'les-rem-1',
            number: '01',
            title: 'Comunicación asíncrona de alta precisión y acuerdos de nivel de respuesta',
            duration: '21:30',
            durationMinutes: 22,
            isFreePreview: true,
            summary:
              'Cómo redactar mensajes y propuestas que contienen todo el contexto necesario para tomar decisiones sin esperar a una videollamada.',
            keyTakeaways: [
              'Formato Contexto -> Propuesta -> Impacto -> Decisión requerida antes de [Fecha/Hora].',
              'Separación entre canales urgentes (síncronos) y canales de trabajo profundo (asíncronos).',
              'Documentación viva como fuente única de verdad del equipo.',
            ],
            practicalFormulaOrCode: `// Estructura de Mensaje Asíncrono Efectivo (Protocolo CREDIULEP)
1. CONTEXTO:     Situación actual en 2 oraciones con datos verificables.
2. PROPUESTA:    Opción recomendada (A) y alternativa evaluada (B).
3. ACCIÓN:       Qué se necesita de quién y antes de qué hora exacta.`,
            resourceTitle: 'Plantilla_Documento_Decision_Asincrona.txt',
            resourceContent: `PLANTILLA DE DECISIÓN ASÍNCRONA (RFC) — CREDIULEP
Título de la iniciativa: __________________________
Responsable (DRI): ________________________________
Contexto y datos: _________________________________
Recomendación: ____________________________________`,
            quiz: {
              question: '¿Cuál es el pilar principal del trabajo remoto asíncrono de alto desempeño?',
              options: [
                'La documentación escrita clara y autónoma que permite avanzar sin depender de reuniones constantes',
                'Estar en una videollamada abierta durante 8 horas seguidas',
                'No registrar ningún acuerdo por escrito',
              ],
              correctIndex: 0,
              explanation:
                'La escritura clara y estructurada desacopla la colaboración de la coincidencia simultánea en el reloj.',
            },
          },
          {
            id: 'les-rem-2',
            number: '02',
            title: 'Planificación por ciclos de 6 semanas y gestión de riesgos',
            duration: '28:10',
            durationMinutes: 28,
            summary:
              'Aplica ciclos enfocados con alcance flexible y fecha fija para entregar valor continuo sin agotamiento del equipo.',
            keyTakeaways: [
              'Por qué fijar el tiempo y flexibilizar el alcance secundario garantiza entregas puntuales.',
              'Identificación temprana de cuellos de botella en los primeros 10 días del ciclo.',
              'Retrospectivas orientadas a mejoras de sistema, no a culpas individuales.',
            ],
            practicalFormulaOrCode: `// Regla de Presupuesto de Ciclo (6 Semanas)
Semanas 1-2: Resolución de incógnitas técnicas y arquitectura base
Semanas 3-5: Construcción e integración del flujo principal (Must-Haves)
Semana 6:    Pulido, pruebas de calidad y lanzamiento en producción`,
            resourceTitle: 'Mapa_Ciclo_Ejecucion_6_Semanas.txt',
            resourceContent: `PLANTILLA DE CICLO DE 6 SEMANAS — CREDIULEP
Objetivo Principal No Negociable: ___________________
Alcance Flexible (Nice-to-have): ____________________
Indicador de Éxito Medible: _________________________`,
            quiz: {
              question: 'En la gestión moderna de proyectos por ciclos con fecha fija, ¿qué variable se ajusta si surge complejidad inesperada?',
              options: [
                'Se recorta o simplifica el alcance secundario preservando la calidad del flujo principal y la fecha de entrega',
                'Se pospone el lanzamiento indefinidamente por años',
                'Se eliminan las pruebas de seguridad',
              ],
              correctIndex: 0,
              explanation:
                'Mantener fija la fecha y la calidad mientras se prioriza el núcleo esencial permite lanzar valor real de forma predecible.',
            },
          },
          {
            id: 'les-rem-3',
            number: '03',
            title: 'Productividad portátil: cómo trabajar y estudiar desde donde estés',
            duration: '24:45',
            durationMinutes: 25,
            summary:
              'Diseña tu entorno móvil de trabajo y estudio con bloques de concentración de 90 minutos, respaldos en la nube y seguridad en redes públicas.',
            keyTakeaways: [
              'Ritual de arranque de 5 minutos para entrar en estado de flujo en cualquier lugar (casa, aeropuerto, café o biblioteca).',
              'Seguridad digital al conectarse desde distintas ciudades: autenticación multifactor y gestión de sesiones.',
              'Hábito de aprendizaje continuo de 30 minutos diarios en CREDIULEP.',
            ],
            practicalFormulaOrCode: `// Bloques de Enfoque Profundo (90 / 20)
08:30 - 10:00  Bloque 1: Tarea de mayor impacto cognitivo (Sin notificaciones)
10:00 - 10:20  Descanso activo y desconexión visual
10:20 - 11:50  Bloque 2: Ejecución y entrega de avances documentados`,
            resourceTitle: 'Checklist_Estudio_Y_Trabajo_Remoto.txt',
            resourceContent: `PROTOCOLO DE PRODUCTIVIDAD DESDE CUALQUIER LUGAR — CREDIULEP
[x] Definición de las 3 prioridades del día la noche anterior.
[x] Archivos y notas sincronizados en la nube y modo local.
[x] 1 lección diaria completada en el Aula Virtual CREDIULEP.`,
            quiz: {
              question: '¿Cuánto dura un bloque óptimo de trabajo o estudio profundo según los ritmos ultradianos de atención?',
              options: [
                'Alrededor de 90 minutos seguidos de un descanso breve de recuperación',
                '9 horas continuas sin levantarse ni hidratarse',
                '2 minutos por semana',
              ],
              correctIndex: 0,
              explanation:
                'El cerebro humano sostiene picos de atención profunda en ciclos de aproximadamente 90 minutos antes de requerir una pausa breve.',
            },
          },
        ],
      },
    ],
  },
];

export function formatPrice(amountCOP: number, amountUSD: number, currency: 'COP' | 'USD'): string {
  if (currency === 'USD') {
    return `US$ ${amountUSD.toLocaleString('en-US')}`;
  }
  return `$ ${amountCOP.toLocaleString('es-CO')} COP`;
}
