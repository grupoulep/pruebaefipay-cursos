import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  CheckCircle2,
  Lock,
  Download,
  Award,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { Course, Lesson, formatPrice } from '../data/courses';
import { CourseArtwork } from './CourseArtwork';

interface ClassroomPlayerProps {
  course: Course;
  initialLessonId?: string;
  isPurchased: boolean;
  currency: 'COP' | 'USD';
  completedLessons: string[];
  onToggleCompleteLesson: (lessonId: string) => void;
  onBuyCourseNow: (course: Course) => void;
  onBackToCatalog: () => void;
  studentName: string;
}

export const ClassroomPlayer: React.FC<ClassroomPlayerProps> = ({
  course,
  initialLessonId,
  isPurchased,
  currency,
  completedLessons,
  onToggleCompleteLesson,
  onBuyCourseNow,
  onBackToCatalog,
  studentName,
}) => {
  const allLessons: Lesson[] = course.modules.flatMap((m) => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || allLessons[0]?.id || ''
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressSeconds, setProgressSeconds] = useState<number>(48);
  const [activeTab, setActiveTab] = useState<'resumen' | 'evaluacion' | 'apuntes' | 'certificado'>(
    'resumen'
  );

  // Quiz state per lesson
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Notes state persisted per lesson
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [notesSavedFeedback, setNotesSavedFeedback] = useState<boolean>(false);

  const activeLesson =
    allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  const isLessonUnlocked = isPurchased || Boolean(activeLesson?.isFreePreview);
  const isCurrentLessonCompleted = completedLessons.includes(activeLesson.id);

  const totalCourseLessons = allLessons.length;
  const completedInCourseCount = allLessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const completionPercentage = Math.round(
    (completedInCourseCount / Math.max(1, totalCourseLessons)) * 100
  );

  // Load saved notes when switching lessons
  useEffect(() => {
    const saved = localStorage.getItem(`crediulep_notes_${activeLesson.id}`);
    setStudentNotes(
      saved ||
        `Apuntes personales para "${activeLesson.title}":\n- Aplicar concepto clave en mi proyecto esta semana.\n`
    );
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setIsPlaying(false);
    setProgressSeconds(42);
  }, [activeLesson.id, activeLesson.title]);

  // Simulated interactive player timer
  useEffect(() => {
    if (!isPlaying) return;
    const totalSecs = activeLesson.durationMinutes * 60;
    const interval = setInterval(() => {
      setProgressSeconds((prev) => {
        if (prev + 4 >= totalSecs) {
          setIsPlaying(false);
          return totalSecs;
        }
        return prev + Math.round(4 * playbackSpeed);
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, activeLesson.durationMinutes]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`crediulep_notes_${activeLesson.id}`, studentNotes);
    setNotesSavedFeedback(true);
    setTimeout(() => setNotesSavedFeedback(false), 1800);
  };

  const handleDownloadResource = (lesson: Lesson) => {
    const blob = new Blob([lesson.resourceContent], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = lesson.resourceTitle;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCertificate = () => {
    const certText = [
      '====================================================================',
      '               CERTIFICADO DE FINALIZACIÓN ACADÉMICA                ',
      '               CREDIULEP — EDUCACIÓN SIN FRONTERAS                  ',
      '====================================================================',
      '',
      `Otorgado a:           ${studentName || 'Estudiante CREDIULEP'}`,
      `Programa Aprobado:    ${course.title}`,
      `Categoría:            ${course.category} · Nivel ${course.level}`,
      `Intensidad Horaria:   ${course.totalDuration} (${course.lessonsCount} módulos prácticos)`,
      `Docente Titular:      ${course.instructor.name} (${course.instructor.organization})`,
      `Fecha de Emisión:     ${new Date().toLocaleDateString('es-CO', { dateStyle: 'long' })}`,
      `Código Verificable:   CERT-ULEP-${course.id.toUpperCase()}-2026`,
      '',
      '====================================================================',
      'Verificado digitalmente por CREDIULEP Campus Virtual.',
    ].join('\n');

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado_CREDIULEP_${course.slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex + 1 < allLessons.length
      ? allLessons[currentLessonIndex + 1]
      : null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Classroom Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <button
            onClick={onBackToCatalog}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al catálogo de cursos</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Aula Virtual CREDIULEP</span>
            <span aria-hidden="true">·</span>
            <span>Docente: {course.instructor.name}</span>
            <span aria-hidden="true">·</span>
            <span>
              {isPurchased
                ? 'Matrícula Activa (Acceso Completo)'
                : 'Modo Vista Previa (Lección 1 Libre)'}
            </span>
          </div>
        </div>

        {/* Course Progress / Purchase Status */}
        <div className="flex items-center gap-4 shrink-0">
          {isPurchased ? (
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-right">
              <div className="text-xs text-slate-500 font-mono-tabular">
                Progreso del curso: {completedInCourseCount}/{totalCourseLessons} lecciones (
                {completionPercentage}%)
              </div>
              <div className="w-44 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-amber-600 transition-transform duration-200 origin-left"
                  style={{ transform: `scaleX(${completionPercentage / 100})` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => onBuyCourseNow(course)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Pagar y Desbloquear Curso (
              {formatPrice(course.priceCOP, course.priceUSD, currency)})
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Classroom Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Interactive Video/Slide Player + Lesson Content Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {isLessonUnlocked ? (
            <>
              {/* Interactive Lesson Visual Player */}
              <div className="rounded-xl overflow-hidden bg-[#0F172A] border border-slate-800 text-white shadow-sm">
                {/* Visual Slide / Interactive Canvas */}
                <div className="relative aspect-[16/9] w-full bg-[#131924] p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
                  {/* Background subtle course artwork */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <CourseArtwork theme={course.visualTheme} className="w-full h-full" />
                  </div>

                  {/* Top Slide Kicker */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 pb-3">
                    <span className="font-mono-tabular">
                      LECCIÓN {activeLesson.number} · {course.category.toUpperCase()}
                    </span>
                    <span className="font-mono-tabular text-amber-400">
                      CREDIULEP STREAMING HD
                    </span>
                  </div>

                  {/* Center Lesson Slide Content */}
                  <div className="relative z-10 my-auto py-4 space-y-4 max-w-2xl">
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug text-balance">
                      {activeLesson.title}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {activeLesson.summary}
                    </p>
                    <div className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 font-mono-tabular text-xs text-amber-300 overflow-x-auto whitespace-pre">
                      {activeLesson.practicalFormulaOrCode}
                    </div>
                  </div>

                  {/* Bottom Interactive Overlay */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2">
                    <span>Docente: {course.instructor.name}</span>
                    <span className="font-mono-tabular">
                      {isPlaying ? 'Reproduciendo en vivo...' : 'En pausa · Listo para reproducir'}
                    </span>
                  </div>
                </div>

                {/* Player Control Bar */}
                <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Reproducir lección</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs font-mono-tabular text-slate-300">
                      {formatTime(progressSeconds)} / {activeLesson.duration}
                    </span>
                  </div>

                  {/* Timeline scrubber */}
                  <div className="flex-1 min-w-[140px] max-w-xs hidden sm:block">
                    <input
                      type="range"
                      aria-label="Progreso de reproducción de la lección"
                      min={0}
                      max={activeLesson.durationMinutes * 60}
                      value={progressSeconds}
                      onChange={(e) => setProgressSeconds(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Speed & Complete Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                      {[1, 1.25, 1.5, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`px-2 py-1 text-xs font-mono-tabular rounded transition-colors cursor-pointer ${
                            playbackSpeed === spd
                              ? 'bg-amber-600 text-white font-semibold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onToggleCompleteLesson(activeLesson.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                        isCurrentLessonCompleted
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isCurrentLessonCompleted ? 'Completada' : 'Marcar completada'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Navigation & Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setActiveTab('resumen')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'resumen'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Guía y Recursos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('evaluacion')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'evaluacion'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Autoevaluación</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('apuntes')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'apuntes'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Mis Apuntes</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('certificado')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'certificado'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Certificado</span>
                  </button>
                </div>

                {nextLesson && (
                  <button
                    onClick={() => setActiveLessonId(nextLesson.id)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Siguiente: Lección {nextLesson.number}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tab Content Panels */}
              {activeTab === 'resumen' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Conceptos clave de la Lección {activeLesson.number}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-[68ch]">
                      {activeLesson.summary}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase">
                      Puntos de aplicación inmediata
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {activeLesson.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="font-mono-tabular font-semibold text-amber-700">
                            0{idx + 1}.
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Downloadable Resource Box */}
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Material descargable para estudiar sin conexión</p>
                      <p className="text-sm font-semibold text-slate-900 font-mono-tabular mt-0.5">
                        {activeLesson.resourceTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadResource(activeLesson)}
                      className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Plantilla (.txt)</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'evaluacion' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">
                      Comprobación práctica · Lección {activeLesson.number}
                    </p>
                    <h3 className="text-base font-bold text-slate-900">
                      {activeLesson.quiz.question}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {activeLesson.quiz.options.map((opt, idx) => {
                      const isSelected = selectedQuizOption === idx;
                      const isCorrect = idx === activeLesson.quiz.correctIndex;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedQuizOption(idx);
                            setQuizSubmitted(false);
                          }}
                          className={`w-full text-left p-3.5 rounded-lg border text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'border-slate-900 bg-slate-50 font-medium text-slate-900'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isSelected && (
                            <span className="text-xs font-semibold shrink-0">
                              {isCorrect ? '✓ Correcto' : '× Revisar'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={selectedQuizOption === null}
                      onClick={() => {
                        setQuizSubmitted(true);
                        if (
                          selectedQuizOption === activeLesson.quiz.correctIndex &&
                          !isCurrentLessonCompleted
                        ) {
                          onToggleCompleteLesson(activeLesson.id);
                        }
                      }}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Verificar Respuesta
                    </button>
                  </div>

                  {quizSubmitted && selectedQuizOption !== null && (
                    <div
                      className={`p-4 rounded-lg border text-xs leading-relaxed ${
                        selectedQuizOption === activeLesson.quiz.correctIndex
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <p className="font-semibold mb-1">
                        {selectedQuizOption === activeLesson.quiz.correctIndex
                          ? '¡Respuesta correcta! Lección marcada como completada.'
                          : 'Explicación académica:'}
                      </p>
                      <p>{activeLesson.quiz.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'apuntes' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Cuaderno de notas sincronizado en tu navegador
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tus apuntes se conservan automáticamente para que continúes estudiando desde
                        donde estés.
                      </p>
                    </div>
                    {notesSavedFeedback && (
                      <span className="text-xs font-medium text-emerald-700">
                        ✓ Apuntes guardados
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={5}
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    className="w-full p-3.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    placeholder="Escribe aquí tus conclusiones, fórmulas o tareas de implementación..."
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Guardar Apuntes de la Lección
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'certificado' && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
                  <div className="p-6 rounded-xl bg-[#FAF9F6] border border-slate-300 text-center space-y-4">
                    <p className="text-xs font-mono-tabular text-amber-700 uppercase">
                      CREDIULEP · CERTIFICACIÓN ACADÉMICA VERIFICABLE
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900">{course.title}</h3>
                    <p className="text-sm text-slate-600">
                      Se certifica que{' '}
                      <strong className="text-slate-900">
                        {studentName || 'Estudiante Activo CREDIULEP'}
                      </strong>{' '}
                      cursa y aplica las competencias prácticas de{' '}
                      <strong className="text-slate-900">{course.category}</strong> con una
                      intensidad de {course.totalDuration}.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono-tabular">
                      <span>ID: CERT-ULEP-{course.id.toUpperCase()}</span>
                      <span>·</span>
                      <span>Docente: {course.instructor.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-600">
                      Progreso actual: {completedInCourseCount} de {totalCourseLessons} lecciones
                      completadas ({completionPercentage}%).
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadCertificate}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Certificado Verificable (.txt)</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Locked Lesson State */
            <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center space-y-5">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <p className="text-xs font-mono-tabular text-slate-500">
                  LECCIÓN {activeLesson.number} · REQUIERE MATRÍCULA ACTIVA
                </p>
                <h2 className="text-2xl font-bold text-slate-900">{activeLesson.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Adquiere este curso desde donde estés y desbloquea todas las{' '}
                  {course.lessonsCount} lecciones al instante.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onBuyCourseNow(course)}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>
                    Pagar Ahora ({formatPrice(course.priceCOP, course.priceUSD, currency)})
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Columns: Course Syllabus & Lesson Selector */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Plan de Estudios del Curso</h2>
            <span className="text-xs font-mono-tabular text-slate-500">
              {course.lessonsCount} lecciones
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {course.modules.map((mod) => (
              <div key={mod.id}>
                <div className="px-4 py-2.5 bg-slate-50/60 text-xs font-semibold text-slate-700">
                  {mod.title}
                </div>
                <div className="divide-y divide-slate-100">
                  {mod.lessons.map((lesson) => {
                    const isSelected = lesson.id === activeLesson.id;
                    const isCompleted = completedLessons.includes(lesson.id);
                    const canAccess = isPurchased || lesson.isFreePreview;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full text-left p-4 transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                          isSelected ? 'bg-amber-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono-tabular font-semibold text-slate-700">
                              {lesson.number}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">{lesson.duration}</span>
                            {lesson.isFreePreview && !isPurchased && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-amber-700 font-medium">Libre</span>
                              </>
                            )}
                          </div>
                          <p
                            className={`text-sm leading-snug ${
                              isSelected
                                ? 'font-bold text-slate-900'
                                : 'font-medium text-slate-800'
                            }`}
                          >
                            {lesson.title}
                          </p>
                        </div>

                        <div className="shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2
                              className="w-4 h-4 text-emerald-600"
                              aria-label="Lección completada"
                            />
                          ) : canAccess ? (
                            <Play
                              className={`w-4 h-4 ${
                                isSelected ? 'text-amber-600' : 'text-slate-400'
                              }`}
                            />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};
