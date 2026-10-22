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
      className="fixed inset-0 z-40 bg-purple-950/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-course-title"
    >
      <div className="bg-white border border-purple-100 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl shadow-purple-950/20 my-6 transition-all">
        {/* Top Bar with Soft Edges */}
        <div className="px-6 py-4 bg-white border-b border-purple-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-900/60">
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              {course.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{course.totalDuration}</span>
            <span aria-hidden="true">·</span>
            <span>{course.lessonsCount} lecciones</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-purple-900/50 hover:text-purple-950 hover:bg-purple-50 rounded-2xl transition-all cursor-pointer"
            aria-label="Cerrar detalle del curso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-8 gap-8 items-start max-h-[82vh] overflow-y-auto">
          {/* Left 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-purple-100 aspect-[16/9] w-full shadow-sm">
              <CourseArtwork theme={course.visualTheme} className="w-full h-full" />
            </div>

            <h2
              id="pdp-course-title"
              className="text-2xl font-bold text-purple-950 text-balance leading-snug"
            >
              {course.title}
            </h2>

            {/* Syllabus with Soft Rounded Rectangles */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-purple-950">Lecciones del programa</h3>
              <div className="space-y-3">
                {course.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-2xs"
                  >
                    <div className="px-4 py-2.5 bg-purple-50/60 border-b border-purple-100 text-purple-950">
                      <h4 className="text-xs font-bold">{mod.title}</h4>
                    </div>
                    <div className="divide-y divide-purple-50">
                      {mod.lessons.map((lesson) => {
                        const canPlay = isPurchased || lesson.isFreePreview;
                        return (
                          <div
                            key={lesson.id}
                            className="p-4 flex items-center justify-between gap-3 hover:bg-purple-50/30 transition-colors"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs text-purple-900/60 font-mono-tabular">
                                {lesson.number} · {lesson.duration}
                              </span>
                              <p className="text-sm font-bold text-purple-950">{lesson.title}</p>
                            </div>

                            {canPlay ? (
                              <button
                                onClick={() => {
                                  onClose();
                                  onOpenClassroom(course.id, lesson.id);
                                }}
                                className="px-3.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs active:scale-95 cursor-pointer"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Ver</span>
                              </button>
                            ) : (
                              <Lock className="w-4 h-4 text-purple-300 shrink-0" />
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

          {/* Right 5 columns: Sticky Purchase Box with Soft Rounded Edges */}
          <div className="lg:col-span-5 lg:sticky lg:top-0 bg-gradient-to-br from-white via-purple-50/30 to-purple-50/70 border border-purple-100 rounded-3xl p-7 space-y-6 shadow-sm">
            <div className="space-y-1.5 border-b border-purple-100 pb-5">
              <span className="text-xs font-semibold text-purple-900/60 block">Valor del curso</span>
              <span className="text-3xl font-bold font-mono-tabular text-purple-950 block">
                {formatPrice(course.priceCOP, course.priceUSD, currency)}
              </span>
            </div>

            {isPurchased ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenClassroom(course.id);
                }}
                className="w-full py-4 px-5 bg-purple-900 hover:bg-purple-800 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-purple-900/20 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
              >
                <PlayCircle className="w-4 h-4 text-purple-300" />
                <span>Entrar a las Lecciones</span>
              </button>
            ) : (
              <div className="space-y-3.5">
                <button
                  onClick={() => {
                    onClose();
                    onBuyNow(course);
                  }}
                  className="w-full py-4 px-5 bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-purple-700/25 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
                >
                  <span>Pagar Ahora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onAddToCart(course)}
                  className="w-full py-3.5 px-5 bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 text-purple-950 text-sm font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-95 shadow-2xs"
                >
                  {isInCart ? (
                    <>
                      <Check className="w-4 h-4 text-purple-600" />
                      <span>Guardado en el carrito</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-purple-700" />
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
