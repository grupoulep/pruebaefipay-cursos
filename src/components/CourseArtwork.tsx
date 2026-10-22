import React from 'react';
import { CourseVisualTheme } from '../data/courses';

interface CourseArtworkProps {
  theme: CourseVisualTheme;
  className?: string;
}

export const CourseArtwork: React.FC<CourseArtworkProps> = ({ theme, className = '' }) => {
  switch (theme) {
    case 'finance_ledger':
      return (
        <div
          className={`relative overflow-hidden bg-[#131924] text-stone-100 select-none ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 480 320"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="480" height="320" fill="#131924" />
            {/* Architectural grid */}
            <g stroke="#263145" strokeWidth="1" opacity="0.55">
              <line x1="0" y1="64" x2="480" y2="64" />
              <line x1="0" y1="128" x2="480" y2="128" />
              <line x1="0" y1="192" x2="480" y2="192" />
              <line x1="0" y1="256" x2="480" y2="256" />
              <line x1="96" y1="0" x2="96" y2="320" />
              <line x1="192" y1="0" x2="192" y2="320" />
              <line x1="288" y1="0" x2="288" y2="320" />
              <line x1="384" y1="0" x2="384" y2="320" />
            </g>
            {/* Soft warm glow */}
            <circle cx="370" cy="80" r="130" fill="#D97706" fillOpacity="0.14" />
            {/* Ledger Panel */}
            <rect
              x="44"
              y="42"
              width="392"
              height="236"
              rx="10"
              fill="#1B2333"
              stroke="#33415C"
              strokeWidth="1.2"
            />
            <text
              x="68"
              y="76"
              fill="#94A3B8"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              letterSpacing="0.06em"
            >
              PORTAFOLIO &amp; ESTRUCTURA DE CRÉDITO
            </text>
            <text
              x="68"
              y="108"
              fill="#F8FAFC"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
              fontSize="22"
            >
              +14.8% E.A. Real
            </text>
            <text
              x="328"
              y="106"
              fill="#F59E0B"
              fontFamily="JetBrains Mono, monospace"
              fontSize="12"
            >
              Ratio &lt; 25%
            </text>
            {/* Yield curve chart */}
            <path
              d="M68 222 C125 215, 165 186, 215 174 C265 162, 315 140, 410 112"
              stroke="#F59E0B"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M68 222 C125 215, 165 186, 215 174 C265 162, 315 140, 410 112 L410 246 L68 246 Z"
              fill="#F59E0B"
              fillOpacity="0.12"
            />
            {/* Data nodes */}
            <circle cx="144" cy="201" r="4.5" fill="#F59E0B" />
            <circle cx="238" cy="168" r="4.5" fill="#F59E0B" />
            <circle cx="332" cy="138" r="4.5" fill="#F59E0B" />
            <circle cx="410" cy="112" r="5.5" fill="#FBBF24" stroke="#1B2333" strokeWidth="2" />
            {/* Bar indicators */}
            <rect x="68" y="246" width="342" height="1" fill="#33415C" />
            <text x="68" y="264" fill="#94A3B8" fontFamily="JetBrains Mono, monospace" fontSize="10">
              Q1 LIQUIDEZ
            </text>
            <text x="190" y="264" fill="#94A3B8" fontFamily="JetBrains Mono, monospace" fontSize="10">
              Q2 DESAPALANCAMIENTO
            </text>
            <text x="348" y="264" fill="#F8FAFC" fontFamily="JetBrains Mono, monospace" fontSize="10">
              Q4 RENTA GLOBAL
            </text>
          </svg>
        </div>
      );

    case 'cloud_fullstack':
      return (
        <div
          className={`relative overflow-hidden bg-[#0F172A] text-slate-100 select-none ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 480 320"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="480" height="320" fill="#0F172A" />
            <circle cx="110" cy="70" r="140" fill="#0284C7" fillOpacity="0.15" />
            {/* Terminal window */}
            <rect
              x="40"
              y="38"
              width="400"
              height="244"
              rx="10"
              fill="#1E293B"
              stroke="#334155"
              strokeWidth="1.2"
            />
            <line x1="40" y1="70" x2="440" y2="70" stroke="#334155" strokeWidth="1" />
            <circle cx="62" cy="54" r="4" fill="#64748B" />
            <circle cx="76" cy="54" r="4" fill="#64748B" />
            <circle cx="90" cy="54" r="4" fill="#64748B" />
            <text
              x="112"
              y="58"
              fill="#94A3B8"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
            >
              efipay-webhook.controller.ts
            </text>
            {/* Code lines */}
            <text x="64" y="102" fill="#38BDF8" fontFamily="JetBrains Mono, monospace" fontSize="11.5">
              POST /api/v1/payments/efipay/checkout
            </text>
            <text x="64" y="128" fill="#E2E8F0" fontFamily="JetBrains Mono, monospace" fontSize="11">
              const tx = await efipay.createOrder(&#123;
            </text>
            <text x="84" y="150" fill="#FCD34D" fontFamily="JetBrains Mono, monospace" fontSize="11">
              methods: [&apos;PSE&apos;, &apos;CARD&apos;, &apos;NEQUI&apos;, &apos;QR&apos;],
            </text>
            <text x="84" y="172" fill="#A7F3D0" fontFamily="JetBrains Mono, monospace" fontSize="11">
              instantUnlock: true,
            </text>
            <text x="64" y="194" fill="#E2E8F0" fontFamily="JetBrains Mono, monospace" fontSize="11">
              &#125;);
            </text>
            {/* Architecture flow box */}
            <rect
              x="64"
              y="214"
              width="352"
              height="44"
              rx="6"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeOpacity="0.4"
            />
            <text x="82" y="240" fill="#38BDF8" fontFamily="JetBrains Mono, monospace" fontSize="11">
              HMAC-SHA256 VERIFIED · ACCESO AULA &lt; 150ms
            </text>
          </svg>
        </div>
      );

    case 'ecommerce_growth':
      return (
        <div
          className={`relative overflow-hidden bg-[#1C1917] text-stone-100 select-none ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 480 320"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="480" height="320" fill="#1C1917" />
            <circle cx="390" cy="240" r="140" fill="#EA580C" fillOpacity="0.16" />
            <rect
              x="44"
              y="40"
              width="392"
              height="240"
              rx="10"
              fill="#292524"
              stroke="#44403C"
              strokeWidth="1.2"
            />
            <text
              x="68"
              y="74"
              fill="#A8A29E"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
            >
              EMBUDO DE CONVERSIÓN MULTICANAL
            </text>
            {/* Funnel horizontal bars */}
            <rect x="68" y="96" width="340" height="28" rx="4" fill="#44403C" />
            <rect x="68" y="96" width="310" height="28" rx="4" fill="#F97316" fillOpacity="0.85" />
            <text x="80" y="114" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">
              1. Catálogo Categorizado (100%)
            </text>

            <rect x="68" y="138" width="340" height="28" rx="4" fill="#44403C" />
            <rect x="68" y="138" width="256" height="28" rx="4" fill="#FB923C" fillOpacity="0.9" />
            <text x="80" y="156" fill="#1C1917" fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="11">
              2. Selección &amp; Carrito (+68.4%)
            </text>

            <rect x="68" y="180" width="340" height="28" rx="4" fill="#44403C" />
            <rect x="68" y="180" width="218" height="28" rx="4" fill="#FDBA74" />
            <text x="80" y="198" fill="#1C1917" fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="11">
              3. Pago Efipay Aprobado (+42.1% CR)
            </text>

            <text x="68" y="246" fill="#F5F5F4" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="600">
              LTV : CAC = 4.6x · AOV +31%
            </text>
          </svg>
        </div>
      );

    case 'data_analytics':
      return (
        <div
          className={`relative overflow-hidden bg-[#111827] text-slate-100 select-none ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 480 320"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="480" height="320" fill="#111827" />
            <rect
              x="44"
              y="40"
              width="392"
              height="240"
              rx="10"
              fill="#1F2937"
              stroke="#374151"
              strokeWidth="1.2"
            />
            <text x="68" y="74" fill="#9CA3AF" fontFamily="JetBrains Mono, monospace" fontSize="11">
              SQL WINDOW FUNCTIONS &amp; COHORTES
            </text>
            {/* Cohort retention matrix cells */}
            <g transform="translate(68, 94)">
              <rect x="0" y="0" width="76" height="32" rx="4" fill="#059669" />
              <rect x="84" y="0" width="76" height="32" rx="4" fill="#10B981" fillOpacity="0.8" />
              <rect x="168" y="0" width="76" height="32" rx="4" fill="#10B981" fillOpacity="0.65" />
              <rect x="252" y="0" width="76" height="32" rx="4" fill="#10B981" fillOpacity="0.55" />

              <rect x="0" y="40" width="76" height="32" rx="4" fill="#059669" />
              <rect x="84" y="40" width="76" height="32" rx="4" fill="#10B981" fillOpacity="0.85" />
              <rect x="168" y="40" width="76" height="32" rx="4" fill="#10B981" fillOpacity="0.72" />

              <rect x="0" y="80" width="76" height="32" rx="4" fill="#059669" />
              <rect x="84" y="80" width="76" height="32" rx="4" fill="#10B981" fillOpacity="0.9" />

              <text x="18" y="20" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">100%</text>
              <text x="104" y="20" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">84%</text>
              <text x="188" y="20" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">76%</text>
              <text x="272" y="20" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">71%</text>

              <text x="18" y="60" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">100%</text>
              <text x="104" y="60" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">88%</text>
              <text x="188" y="60" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">81%</text>

              <text x="18" y="100" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">100%</text>
              <text x="104" y="100" fill="#FFF" fontFamily="JetBrains Mono, monospace" fontSize="11">92%</text>
            </g>
            <text x="68" y="250" fill="#E5E7EB" fontFamily="JetBrains Mono, monospace" fontSize="11.5">
              OVER (PARTITION BY cohorte ORDER BY mes)
            </text>
          </svg>
        </div>
      );

    case 'product_design':
      return (
        <div
          className={`relative overflow-hidden bg-[#18181B] text-zinc-100 select-none ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 480 320"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="480" height="320" fill="#18181B" />
            <rect
              x="44"
              y="40"
              width="392"
              height="240"
              rx="12"
              fill="#27272A"
              stroke="#3F3F46"
              strokeWidth="1.2"
            />
            {/* Concentric radius & Golden ratio guides */}
            <rect
              x="68"
              y="64"
              width="210"
              height="192"
              rx="8"
              fill="#18181B"
              stroke="#D97706"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <text x="86" y="106" fill="#FAFAFA" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="24">
              Aa Bb Cc
            </text>
            <text x="86" y="134" fill="#A1A1AA" fontFamily="JetBrains Mono, monospace" fontSize="11">
              60-30-10 · WCAG AA 4.5:1
            </text>
            <text x="86" y="164" fill="#F59E0B" fontFamily="JetBrains Mono, monospace" fontSize="11">
              r_in = r_out - pad
            </text>
            <rect x="86" y="188" width="140" height="36" rx="6" fill="#F59E0B" />
            <text x="106" y="210" fill="#18181B" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="11">
              Sistema de Tokens
            </text>
            {/* Right column spec */}
            <circle cx="356" cy="126" r="46" stroke="#71717A" strokeWidth="1.2" />
            <circle cx="356" cy="126" r="24" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="314" y="210" fill="#D4D4D8" fontFamily="JetBrains Mono, monospace" fontSize="11">
              1440px Grid
            </text>
            <text x="314" y="230" fill="#A1A1AA" fontFamily="JetBrains Mono, monospace" fontSize="10">
              68ch Measure
            </text>
          </svg>
        </div>
      );

    case 'remote_leadership':
      return (
        <div
          className={`relative overflow-hidden bg-[#172554] text-blue-50 select-none ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 480 320"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="480" height="320" fill="#172554" />
            <rect
              x="44"
              y="40"
              width="392"
              height="240"
              rx="10"
              fill="#1E3A8A"
              stroke="#3B82F6"
              strokeOpacity="0.4"
              strokeWidth="1.2"
            />
            <text x="68" y="74" fill="#93C5FD" fontFamily="JetBrains Mono, monospace" fontSize="11">
              SINCRONIZACIÓN GLOBAL ASÍNCRONA
            </text>
            {/* Timezone nodes */}
            <line x1="88" y1="145" x2="392" y2="145" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="104" cy="145" r="18" fill="#172554" stroke="#FBBF24" strokeWidth="2" />
            <text x="93" y="149" fill="#FBBF24" fontFamily="JetBrains Mono, monospace" fontSize="10">
              BOG
            </text>
            <text x="78" y="184" fill="#DBEAFE" fontFamily="JetBrains Mono, monospace" fontSize="10">
              UTC-5
            </text>

            <circle cx="240" cy="145" r="18" fill="#172554" stroke="#38BDF8" strokeWidth="2" />
            <text x="229" y="149" fill="#38BDF8" fontFamily="JetBrains Mono, monospace" fontSize="10">
              NYC
            </text>
            <text x="214" y="184" fill="#DBEAFE" fontFamily="JetBrains Mono, monospace" fontSize="10">
              UTC-4
            </text>

            <circle cx="376" cy="145" r="18" fill="#172554" stroke="#34D399" strokeWidth="2" />
            <text x="364" y="149" fill="#34D399" fontFamily="JetBrains Mono, monospace" fontSize="10">
              MAD
            </text>
            <text x="352" y="184" fill="#DBEAFE" fontFamily="JetBrains Mono, monospace" fontSize="10">
              UTC+2
            </text>

            <rect x="68" y="210" width="344" height="42" rx="6" fill="#172554" />
            <text x="86" y="235" fill="#F8FAFC" fontFamily="JetBrains Mono, monospace" fontSize="11">
              Ciclos de 6 Semanas · Entregas Sin Fronteras
            </text>
          </svg>
        </div>
      );
  }
};

export const HeroAnywhereIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden bg-[#131924] border border-slate-800 flex flex-col justify-between p-6 sm:p-8 text-white select-none">
      {/* Subtle architectural background grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Top row: Anywhere access indicator */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs text-slate-400 font-mono-tabular">
            CREDIULEP CAMPUS · MULTI-DISPOSITIVO
          </p>
          <p className="text-sm font-semibold text-slate-100 mt-0.5">
            Compra desde donde estés · Acceso en 0 segundos
          </p>
        </div>
        <span className="text-xs font-mono-tabular text-amber-400">
          Pasarela Oficial Efipay
        </span>
      </div>

      {/* Center visual: 3-Step Instant Journey Architecture */}
      <div className="relative z-10 my-6 space-y-4">
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-amber-400 font-mono-tabular">01 · DESDE CUALQUIER CIUDAD O PAÍS</p>
            <p className="text-sm font-medium text-white mt-0.5">
              Elige tu programa en el catálogo categorizado (COP o USD)
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-slate-400 shrink-0">6 Programas</span>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/90 border border-amber-500/40 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-amber-400 font-mono-tabular">02 · CHECKOUT INTEGRADO EFIPAY</p>
            <p className="text-sm font-medium text-white mt-0.5">
              PSE, Tarjetas Crédito/Débito, Nequi, Daviplata, QR y Efectivo
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-amber-300 shrink-0">Aprobación &lt; 3s</span>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-amber-400 font-mono-tabular">03 · LIBERACIÓN INMEDIATA DE LECCIONES</p>
            <p className="text-sm font-medium text-white mt-0.5">
              Reproductor interactivo, guías descargables y certificado digital
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-emerald-400 shrink-0">Activo 24/7</span>
        </div>
      </div>

      {/* Bottom bar: Supported locations & payment assurance */}
      <div className="relative z-10 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>Bogotá · Medellín · Cali · CDMX · Madrid · Miami</span>
        <span className="font-mono-tabular text-slate-300">TLS 1.3 · PCI-DSS Efipay</span>
      </div>
    </div>
  );
};
