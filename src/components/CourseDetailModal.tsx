import React from 'react';
import {
  X,
  Check,
  PlayCircle,
  Lock,
  ShoppingBag,
  ArrowRight,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { Course, formatPrice } from '../data/courses';
import { CourseArtwork } from './CourseArtwork';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  currency: 'COP' | 'USD';
  isPurchased: boolean;
  isInCart: boolean;
  onAddToCart: (course: Course) => void;
  onBuyNowEfipay: (course: Course) => void;
  onOpenClassroom: (courseId: string, lessonId?: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  currency,
  isPurchased,
  isInCart,
  onAddToCart,
  onBuyNowEfipay,
  onOpenClassroom,
}) => {
  if (!course) return null;

  const installmentCOP = Math.round(course.priceCOP / 3);
  const installmentUSD = Math.round(course.priceUSD / 3);

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-course-title"
    >
      <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl max-w-5xl w-full overflow-hidden shadow-xl my-6">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{course.category}</span>
            <span aria-hidden="true">·</span>
            <span>Nivel {course.level}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{course.totalDuration}</span>
            <span aria-hidden="true">·</span>
            <span>{course.lessonsCount} lecciones</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar detalle del curso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contiguous PDP 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-8 gap-8 items-start max-h-[82vh] overflow-y-auto">
          {/* Left 7 columns: Artwork, Outcomes, Syllabus, Instructor */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-lg overflow-hidden border border-slate-200 aspect-[4/3] max-h-72 w-full">
              <CourseArtwork theme={course.visualTheme} className="w-full h-full" />
            </div>

            <div className="space-y-3">
              <h2
                id="pdp-course-title"
                className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance"
              >
                {course.title}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">{course.subtitle}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                <span className="font-semibold text-slate-900 font-mono-tabular">
                  {course.rating.toFixed(2)} ★ ({course.reviewsCount} reseñas)
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  {course.studentsCount.toLocaleString('es-CO')} estudiantes activos
                </span>
                <span aria-hidden="true">·</span>
                <span>Idioma: Español con recursos descargables</span>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Lo que dominarás en este programa
              </h3>
              <ul className="space-y-2.5">
                {course.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Syllabus / Modules & Lessons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Contenido del curso y acceso a lecciones
                </h3>
                <span className="text-xs text-slate-500 font-mono-tabular">
                  {course.lessonsCount} lecciones · {course.totalDuration}
                </span>
              </div>

              <div className="space-y-4">
                {course.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-900">{mod.title}</h4>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {mod.lessons.map((lesson) => {
                        const canPlay = isPurchased || lesson.isFreePreview;
                        return (
                          <div
                            key={lesson.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-mono-tabular">Lección {lesson.number}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono-tabular">{lesson.duration}</span>
                                {lesson.isFreePreview && !isPurchased && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-amber-700 font-medium">
                                      Vista previa libre
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm font-semibold text-slate-900">{lesson.title}</p>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {lesson.summary}
                              </p>
                            </div>

                            {canPlay ? (
                              <button
                                onClick={() => {
                                  onClose();
                                  onOpenClassroom(course.id, lesson.id);
                                }}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>
                                  {isPurchased ? 'Ver lección' : 'Probar lección 1'}
                                </span>
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Se activa al pagar</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Bio */}
            <div className="p-5 rounded-lg bg-white border border-slate-200 space-y-2">
              <p className="text-xs text-slate-500 uppercase">Docente Titular</p>
              <p className="text-base font-bold text-slate-900">{course.instructor.name}</p>
              <p className="text-xs text-slate-600">
                {course.instructor.role} · {course.instructor.organization}
              </p>
              <p className="text-sm text-slate-700 pt-1 leading-relaxed">{course.instructor.bio}</p>
            </div>
          </div>

          {/* Right 5 columns: Sticky Contiguous Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-0 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="space-y-2 border-b border-slate-200 pb-5">
              <p className="text-xs text-slate-500">
                Matrícula digital CREDIULEP · Acceso vitalicio inmediato
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono-tabular text-slate-900">
                  {formatPrice(course.priceCOP, course.priceUSD, currency)}
                </span>
                <span className="text-sm text-slate-400 line-through font-mono-tabular">
                  {formatPrice(course.originalPriceCOP, Math.round(course.priceUSD * 1.45), currency)}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-mono-tabular">
                O en 3 cuotas de {formatPrice(installmentCOP, installmentUSD, currency)} con
                tarjeta vía Efipay
              </p>
            </div>

            {/* Anywhere Benefit */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
              <Globe className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">
                  Compra y estudia desde donde estés
                </p>
                <p className="mt-0.5 leading-relaxed">{course.anywhereBenefit}</p>
              </div>
            </div>

            {/* Action CTAs */}
            {isPurchased ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  Ya tienes acceso completo a todas las lecciones de este curso.
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenClassroom(course.id);
                  }}
                  className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Entrar al Aula Virtual Ahora</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onBuyNowEfipay(course);
                  }}
                  className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>Comprar Ahora con Efipay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAddToCart(course)}
                  className="w-full py-3 px-5 border border-slate-300 hover:border-slate-900 text-slate-900 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isInCart ? 'En tu carrito · Ver carrito' : 'Agregar al carrito'}</span>
                </button>
              </div>
            )}

            {/* Efipay Payment Methods Summary */}
            <div className="pt-4 border-t border-slate-200 space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between font-medium text-slate-900">
                <span>Pasarela de pagos integrada Efipay</span>
                <span className="font-mono-tabular text-amber-700">100% En Línea</span>
              </div>
              <p className="leading-relaxed">
                Medios habilitados: PSE (Todos los bancos en Colombia), Tarjetas Visa / Mastercard /
                Amex nacionales e internacionales, Nequi, Daviplata, Código QR y Efectivo.
              </p>
              <div className="flex items-center gap-2 text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Activación instantánea de las {course.lessonsCount} lecciones al aprobar el pago.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
