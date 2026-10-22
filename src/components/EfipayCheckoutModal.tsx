import React, { useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Building2,
  Smartphone,
  QrCode,
  Banknote,
  Lock,
  ArrowRight,
  Download,
  X,
  AlertCircle,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { Course, EfipayTransaction, formatPrice } from '../data/courses';

interface EfipayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Course[];
  currency: 'COP' | 'USD';
  onPaymentSuccess: (transaction: EfipayTransaction, firstCourseId: string) => void;
  onOpenCourseImmediately: (courseId: string) => void;
}

type EfipayMethod = 'card' | 'pse' | 'wallet' | 'qr' | 'cash';

const COLOMBIAN_BANKS = [
  'Bancolombia',
  'Davivienda',
  'Banco de Bogotá',
  'BBVA Colombia',
  'Nequi (Cuenta Depósito)',
  'Lulo Bank',
  'Scotiabank Colpatria',
  'Banco de Occidente',
  'Nu Colombia',
];

const BUYER_LOCATIONS = [
  'Bogotá D.C., Colombia',
  'Medellín, Colombia',
  'Cali, Colombia',
  'Barranquilla, Colombia',
  'Bucaramanga, Colombia',
  'Ciudad de México, México',
  'Madrid, España',
  'Miami, Estados Unidos',
  'Buenos Aires, Argentina',
  'Lima, Perú',
  'Otra ciudad / En tránsito',
];

export const EfipayCheckoutModal: React.FC<EfipayCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onPaymentSuccess,
  onOpenCourseImmediately,
}) => {
  const [method, setMethod] = useState<EfipayMethod>('pse');
  const [buyerName, setBuyerName] = useState('Andrés Felipe Martínez');
  const [buyerEmail, setBuyerEmail] = useState('estudiante@crediulep.edu.co');
  const [buyerDocType, setBuyerDocType] = useState<'CC' | 'CE' | 'NIT' | 'PAS'>('CC');
  const [buyerDoc, setBuyerDoc] = useState('1020784512');
  const [buyerLocation, setBuyerLocation] = useState(BUYER_LOCATIONS[0]);

  // Card state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8914');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('842');
  const [installments, setInstallments] = useState('1');

  // PSE state
  const [pseBank, setPseBank] = useState(COLOMBIAN_BANKS[0]);
  const [psePersonType, setPsePersonType] = useState<'Natural' | 'Jurídica'>('Natural');

  // Wallet state
  const [walletProvider, setWalletProvider] = useState<'Nequi' | 'Daviplata'>('Nequi');
  const [walletPhone, setWalletPhone] = useState('314 789 4521');

  // Promo code
  const [couponInput, setCouponInput] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  // Flow state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [approvedTx, setApprovedTx] = useState<EfipayTransaction | null>(null);

  if (!isOpen || items.length === 0) return null;

  const rawTotalCOP = items.reduce((acc, item) => acc + item.priceCOP, 0);
  const rawTotalUSD = items.reduce((acc, item) => acc + item.priceUSD, 0);

  const finalCOP = discountApplied ? Math.round(rawTotalCOP * 0.85) : rawTotalCOP;
  const finalUSD = discountApplied ? Math.round(rawTotalUSD * 0.85) : rawTotalUSD;
  const formattedTotal = formatPrice(finalCOP, finalUSD, currency);

  const handleApplyCoupon = () => {
    if (couponInput.trim().toUpperCase() === 'CREDIULEP15') {
      setDiscountApplied(true);
      setErrorMessage(null);
    } else {
      setCouponInput('CREDIULEP15');
      setDiscountApplied(true);
      setErrorMessage(null);
    }
  };

  const getMethodLabel = (m: EfipayMethod): string => {
    switch (m) {
      case 'card':
        return `Tarjeta Crédito/Débito (${installments} ${Number(installments) === 1 ? 'cuota' : 'cuotas'}) · Efipay`;
      case 'pse':
        return `PSE Débito Bancario (${pseBank} · Persona ${psePersonType}) · Efipay`;
      case 'wallet':
        return `Billetera Digital ${walletProvider} (${walletPhone}) · Efipay`;
      case 'qr':
        return 'Código QR Interoperable / Link Internacional · Efipay';
      case 'cash':
        return 'Efectivo Convenio Efipay (Efecty / Baloto Validado)';
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!buyerName.trim() || !buyerEmail.trim() || !buyerDoc.trim()) {
      setErrorMessage(
        'Por favor completa tu nombre, correo electrónico y documento para emitir el comprobante Efipay y activar tus lecciones.'
      );
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const txReference = `EFIPAY-${Math.floor(100000 + Math.random() * 900000)}`;
      const nowStr = new Date().toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      const tx: EfipayTransaction = {
        reference: txReference,
        date: nowStr,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerDoc: `${buyerDocType} ${buyerDoc.trim()}`,
        buyerLocation,
        methodLabel: getMethodLabel(method),
        currency,
        amountFormatted: formattedTotal,
        courseIds: items.map((c) => c.id),
        courseTitles: items.map((c) => c.title),
      };

      setIsProcessing(false);
      setApprovedTx(tx);
      onPaymentSuccess(tx, items[0].id);
    }, 950);
  };

  const handleDownloadReceipt = () => {
    if (!approvedTx) return;
    const content = [
      '============================================================',
      '        COMPROBANTE OFICIAL DE PAGO — PASARELA EFIPAY       ',
      '        COMERCIO: CREDIULEP EDUCACIÓN SIN FRONTERAS         ',
      '============================================================',
      `Referencia Efipay:     ${approvedTx.reference}`,
      `Estado Transacción:    APROBADA — ACCESO INMEDIATO ACTIVADO`,
      `Fecha y Hora:          ${approvedTx.date}`,
      `Estudiante:            ${approvedTx.buyerName}`,
      `Documento:             ${approvedTx.buyerDoc}`,
      `Correo:                ${approvedTx.buyerEmail}`,
      `Ubicación de Compra:   ${approvedTx.buyerLocation}`,
      `Método de Pago:        ${approvedTx.methodLabel}`,
      `Total Pagado:          ${approvedTx.amountFormatted}`,
      '------------------------------------------------------------',
      'CURSOS DESBLOQUEADOS EN EL AULA VIRTUAL:',
      ...approvedTx.courseTitles.map((t, i) => `  ${i + 1}. ${t}`),
      '============================================================',
      'CREDIULEP · Compra y estudia tu curso desde donde estés.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Comprobante_${approvedTx.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAndClose = () => {
    setApprovedTx(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="efipay-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full overflow-hidden shadow-xl my-6">
        {/* Top Efipay Gateway Header Bar */}
        <div className="bg-[#131924] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm font-mono-tabular">
                E
              </div>
              <div>
                <span
                  id="efipay-modal-title"
                  className="text-sm font-bold tracking-tight text-white block"
                >
                  Efipay Checkout Seguro
                </span>
                <span className="text-xs text-slate-400 block">
                  Comercio verificado: CREDIULEP Educación Digital
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-mono-tabular">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              TLS 1.3 · PCI-DSS
            </span>
            <button
              onClick={resetAndClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar pasarela de pagos"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {approvedTx ? (
          /* Post-Order Approved State with Immediate Lesson Access */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Pago Aprobado por Efipay · Referencia {approvedTx.reference}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  ¡Tu acceso a las lecciones ya está activo!
                </h3>
                <p className="text-sm text-slate-600">
                  Comprado desde <strong className="text-slate-900">{approvedTx.buyerLocation}</strong> ·
                  Liberación instantánea completada en CREDIULEP.
                </p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs text-slate-500 block">Total procesado</span>
                <span className="text-2xl font-bold font-mono-tabular text-slate-900">
                  {approvedTx.amountFormatted}
                </span>
              </div>
            </div>

            {/* Receipt Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-200 text-sm">
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase">Datos del Estudiante</p>
                <p className="text-slate-900 font-medium">{approvedTx.buyerName}</p>
                <p className="text-slate-600 font-mono-tabular">{approvedTx.buyerDoc}</p>
                <p className="text-slate-600">{approvedTx.buyerEmail}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase">Detalles de Transacción Efipay</p>
                <p className="text-slate-900 font-medium">{approvedTx.methodLabel}</p>
                <p className="text-slate-600 font-mono-tabular">Fecha: {approvedTx.date}</p>
                <p className="text-emerald-700 font-medium">
                  Estado: Conciliado · Aula Virtual Habilitada
                </p>
              </div>
            </div>

            {/* Unlocked courses list */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Cursos habilitados en tu cuenta ({approvedTx.courseTitles.length})
              </p>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                {items.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{course.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {course.category} · {course.lessonsCount} lecciones · {course.totalDuration} · Acceso vitalicio
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const targetId = course.id;
                        resetAndClose();
                        onOpenCourseImmediately(targetId);
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Iniciar Lecciones Ahora</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="px-4 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Comprobante Efipay (.txt)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const firstId = items[0].id;
                  resetAndClose();
                  onOpenCourseImmediately(firstId);
                }}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Entrar al Aula Virtual — Lección 1</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form + Order Summary Split */
          <form onSubmit={handleProcessPayment} className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left 7 columns: Buyer info + Efipay Payment Method Selector */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200">
              {/* Step 1: Buyer & Anywhere Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    1. Datos del estudiante y ubicación de compra
                  </h3>
                  <span className="text-xs text-slate-500">Acceso inmediato al correo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="efipay-name"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Nombre completo (para tu certificado)
                    </label>
                    <input
                      id="efipay-name"
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="Ej. María Camila Vargas"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="efipay-email"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Correo electrónico
                    </label>
                    <input
                      id="efipay-email"
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="tu@correo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="efipay-doc"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Documento de identidad
                    </label>
                    <div className="flex gap-2">
                      <select
                        aria-label="Tipo de documento"
                        value={buyerDocType}
                        onChange={(e) =>
                          setBuyerDocType(e.target.value as 'CC' | 'CE' | 'NIT' | 'PAS')
                        }
                        className="px-2.5 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 font-mono-tabular focus:outline-none focus:ring-2 focus:ring-amber-600"
                      >
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="NIT">NIT</option>
                        <option value="PAS">PAS</option>
                      </select>
                      <input
                        id="efipay-doc"
                        type="text"
                        required
                        value={buyerDoc}
                        onChange={(e) => setBuyerDoc(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono-tabular focus:outline-none focus:ring-2 focus:ring-amber-600"
                        placeholder="Número de documento"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="efipay-location"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      ¿Desde dónde compras hoy? (CREDIULEP Global)
                    </label>
                    <div className="relative">
                      <select
                        id="efipay-location"
                        value={buyerLocation}
                        onChange={(e) => setBuyerLocation(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                      >
                        {BUYER_LOCATIONS.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                      <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Efipay Payment Method Tabs */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  2. Selecciona tu medio de pago en Efipay
                </h3>

                {/* Functional Segmented Method Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setMethod('pse')}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      method === 'pse'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>PSE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      method === 'card'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('wallet')}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      method === 'wallet'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Nequi / Davi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('qr')}
                    className={`px-2.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      method === 'qr'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Efipay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('cash')}
                    className={`col-span-2 sm:col-span-1 px-2.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      method === 'cash'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Efectivo</span>
                  </button>
                </div>

                {/* Method-Specific Form Panel */}
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                  {method === 'pse' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        Débito inmediato desde tu cuenta de ahorros o corriente a través de{' '}
                        <strong className="text-slate-900">PSE — Pagos Seguros en Línea</strong> con
                        confirmación automática en Efipay.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="pse-bank"
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            Entidad financiera
                          </label>
                          <select
                            id="pse-bank"
                            value={pseBank}
                            onChange={(e) => setPseBank(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                          >
                            {COLOMBIAN_BANKS.map((bank) => (
                              <option key={bank} value={bank}>
                                {bank}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="pse-person"
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            Tipo de cliente
                          </label>
                          <select
                            id="pse-person"
                            value={psePersonType}
                            onChange={(e) =>
                              setPsePersonType(e.target.value as 'Natural' | 'Jurídica')
                            }
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="Natural">Persona Natural</option>
                            <option value="Jurídica">Persona Jurídica (Empresa)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {method === 'card' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        Aceptamos tarjetas Visa, Mastercard, American Express y Diners emitidas en
                        cualquier país. Tokenización directa Efipay 3D-Secure.
                      </p>
                      <div>
                        <label
                          htmlFor="card-num"
                          className="block text-xs font-medium text-slate-700 mb-1"
                        >
                          Número de tarjeta
                        </label>
                        <input
                          id="card-num"
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono-tabular"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label
                            htmlFor="card-exp"
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            Vencimiento
                          </label>
                          <input
                            id="card-exp"
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono-tabular"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="card-cvc"
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            CVC / CVV
                          </label>
                          <input
                            id="card-cvc"
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono-tabular"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="card-cuotas"
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            Cuotas
                          </label>
                          <select
                            id="card-cuotas"
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono-tabular"
                          >
                            <option value="1">1 cuota</option>
                            <option value="3">3 cuotas</option>
                            <option value="6">6 cuotas</option>
                            <option value="12">12 cuotas</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {method === 'wallet' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        Recibe una notificación push en tu celular para autorizar el pago al
                        instante sin salir de donde estás.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="wallet-provider"
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            Billetera digital
                          </label>
                          <select
                            id="wallet-provider"
                            value={walletProvider}
                            onChange={(e) =>
                              setWalletProvider(e.target.value as 'Nequi' | 'Daviplata')
                            }
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="Nequi">Nequi</option>
                            <option value="Daviplata">Daviplata</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="wallet-phone"
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            Número de celular vinculado
                          </label>
                          <input
                            id="wallet-phone"
                            type="tel"
                            value={walletPhone}
                            onChange={(e) => setWalletPhone(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white font-mono-tabular"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {method === 'qr' && (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-28 h-28 bg-white p-2 rounded-lg border border-slate-300 shrink-0 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-900">
                          <rect x="8" y="8" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" />
                          <rect x="16" y="16" width="10" height="10" />
                          <rect x="66" y="8" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" />
                          <rect x="74" y="16" width="10" height="10" />
                          <rect x="8" y="66" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" />
                          <rect x="16" y="74" width="10" height="10" />
                          <rect x="44" y="12" width="8" height="8" />
                          <rect x="44" y="28" width="8" height="16" />
                          <rect x="40" y="50" width="16" height="8" />
                          <rect x="14" y="44" width="18" height="8" />
                          <rect x="64" y="46" width="10" height="10" />
                          <rect x="80" y="44" width="12" height="8" />
                          <rect x="44" y="68" width="12" height="12" />
                          <rect x="66" y="68" width="24" height="8" />
                          <rect x="66" y="82" width="10" height="10" />
                          <rect x="82" y="82" width="10" height="10" />
                        </svg>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p className="font-semibold text-slate-900 text-sm">
                          QR Interoperable Efipay · Pago en un paso
                        </p>
                        <p>
                          Escanea desde la app de tu banco o billetera móvil en cualquier lugar, o
                          haz clic en confirmar abajo para validar la lectura del código.
                        </p>
                        <p className="font-mono-tabular text-slate-800">
                          ID QR: EFI-QR-992041-CREDIULEP
                        </p>
                      </div>
                    </div>
                  )}

                  {method === 'cash' && (
                    <div className="space-y-2 text-xs text-slate-600">
                      <p className="font-semibold text-slate-900 text-sm">
                        Convenio Efecty / Baloto / Corresponsal Efipay
                      </p>
                      <p>
                        Se genera el PIN de recaudo{' '}
                        <span className="font-mono-tabular font-semibold text-slate-900">
                          Convenio Efipay #110942
                        </span>
                        . En esta tienda demostrativa puedes confirmar el pago de inmediato para
                        desbloquear las lecciones sin espera.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Right 5 columns: Order Summary & Submit CTA */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Resumen de tu compra</h3>
                  <span className="text-xs font-mono-tabular text-slate-500">
                    {items.length} {items.length === 1 ? 'curso' : 'cursos'}
                  </span>
                </div>

                {/* Itemized list */}
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {items.map((course) => (
                    <div key={course.id} className="flex items-start justify-between gap-3 text-sm">
                      <div>
                        <p className="font-semibold text-slate-900 leading-snug">{course.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {course.category} · {course.lessonsCount} lecciones · Acceso inmediato
                        </p>
                      </div>
                      <span className="font-mono-tabular font-semibold text-slate-900 shrink-0">
                        {formatPrice(course.priceCOP, course.priceUSD, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="coupon-input" className="text-slate-600 font-medium">
                      Cupón promocional (prueba: <span className="font-mono-tabular font-semibold text-slate-900">CREDIULEP15</span>)
                    </label>
                    {!discountApplied && (
                      <button
                        type="button"
                        onClick={() => {
                          setCouponInput('CREDIULEP15');
                          setDiscountApplied(true);
                        }}
                        className="text-amber-700 hover:underline font-medium cursor-pointer"
                      >
                        Aplicar 15% Dto.
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      id="coupon-input"
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Código de descuento"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono-tabular uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Validar
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-3 border-t border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal catálogo</span>
                    <span className="font-mono-tabular">
                      {formatPrice(rawTotalCOP, rawTotalUSD, currency)}
                    </span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Beneficio CREDIULEP15 (-15%)</span>
                      <span className="font-mono-tabular">
                        - {formatPrice(rawTotalCOP - finalCOP, rawTotalUSD - finalUSD, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 text-xs">
                    <span>Activación de Aula Virtual y Certificado</span>
                    <span className="font-mono-tabular text-emerald-700 font-medium">
                      Incluido ($0)
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Total a pagar</span>
                    <span className="text-xl font-bold font-mono-tabular text-slate-900">
                      {formattedTotal}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-400 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Procesando transacción en Efipay...</span>
                  ) : (
                    <>
                      <span>Pagar {formattedTotal} con Efipay y Acceder Ahora</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 text-center">
                  <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>
                    Liberación automática de las lecciones en el mismo segundo de aprobación.
                  </span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
