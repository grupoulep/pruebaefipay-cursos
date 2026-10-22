import React from 'react';
import {
  X,
  Check,
  PlayCircle,
  Lock,
  ShoppingCart,
  ArrowRight,
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
  onBuyNow: (course: Course) => void;
  onOpenClassroom: (courseId: string, lessonId?: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  currency,
  isPurchased,
  isInCart,
  onAddToCart,
  onBuyNow,
  onOpenClassroom,
}) => {
  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-course-title"
    >
      <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl max-w-4xl w-full overflow-hidden shadow-xl my-6">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{course.category}</span>
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
          {/* Left 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-lg overflow-hidden border border-slate-200 aspect-[16/9] w-full">
              <CourseArtwork theme={course.visualTheme} className="w-full h-full" />
            </div>

            <h2
              id="pdp-course-title"
              className="text-2xl font-bold text-slate-900 text-balance"
            >
              {course.title}
            </h2>

            {/* Syllabus / Modules & Lessons */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Lecciones incluidas</h3>
              <div className="space-y-3">
                {course.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                      <h4 className="text-xs font-semibold text-slate-900">{mod.title}</h4>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {mod.lessons.map((lesson) => {
                        const canPlay = isPurchased || lesson.isFreePreview;
                        return (
                          <div
                            key={lesson.id}
                            className="p-3.5 flex items-center justify-between gap-3"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs text-slate-500 font-mono-tabular">
                                {lesson.number} · {lesson.duration}
                              </span>
                              <p className="text-sm font-semibold text-slate-900">{lesson.title}</p>
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
                                <span>Ver</span>
                              </button>
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5 columns: Sticky Contiguous Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-0 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="space-y-1 border-b border-slate-200 pb-4">
              <span className="text-xs text-slate-500 block">Valor del curso</span>
              <span className="text-3xl font-bold font-mono-tabular text-slate-900 block">
                {formatPrice(course.priceCOP, course.priceUSD, currency)}
              </span>
            </div>

            {isPurchased ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenClassroom(course.id);
                }}
                className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Entrar a las Lecciones</span>
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onBuyNow(course);
                  }}
                  className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>Pagar Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAddToCart(course)}
                  className="w-full py-3 px-5 border border-slate-300 hover:border-slate-900 text-slate-900 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {isInCart ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Guardado en el carrito</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Agregar al carrito</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
