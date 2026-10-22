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
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(`crediulep_notes_${activeLesson.id}`);
      setStudentNotes(
        saved ||
          `Apuntes personales para "${activeLesson.title}":\n- Aplicar concepto clave en mi proyecto esta semana.\n`
      );
    }
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
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`crediulep_notes_${activeLesson.id}`, studentNotes);
    }
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Classroom Bar with Soft Edges and Purple Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-purple-100 shadow-sm">
        <div className="space-y-1">
          <button
            onClick={onBackToCatalog}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al catálogo de cursos</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-purple-950">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-purple-900/60">
            <span>Docente: {course.instructor.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-purple-700">
              {isPurchased
                ? 'Matrícula Activa'
                : 'Modo Vista Previa (Lección 1 Libre)'}
            </span>
          </div>
        </div>

        {/* Course Progress */}
        <div className="flex items-center gap-4 shrink-0">
          {isPurchased ? (
            <div className="bg-purple-50/70 border border-purple-100 rounded-2xl px-5 py-3 text-right">
              <div className="text-xs text-purple-950 font-bold font-mono-tabular">
                Progreso: {completedInCourseCount}/{totalCourseLessons} lecciones (
                {completionPercentage}%)
              </div>
              <div className="w-44 h-2 bg-purple-200/60 rounded-full overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-transform duration-300 origin-left"
                  style={{ transform: `scaleX(${completionPercentage / 100})` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => onBuyCourseNow(course)}
              className="px-5 py-3 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-2xl shadow-md shadow-purple-700/20 transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
            >
              Pagar y Desbloquear Curso ({formatPrice(course.priceCOP, course.priceUSD, currency)})
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Classroom Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Player & Lesson Panels */}
        <div className="lg:col-span-8 space-y-6">
          {isLessonUnlocked ? (
            <>
              {/* Soft Rounded Player Container */}
              <div className="rounded-3xl overflow-hidden bg-[#1A0B2E] border border-purple-900/60 text-white shadow-xl shadow-purple-950/20">
                {/* Visual Slide */}
                <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-[#1E1138] via-[#2A164E] to-[#120721] p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <CourseArtwork theme={course.visualTheme} className="w-full h-full" />
                  </div>

                  {/* Top Slide Kicker */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-purple-200 border-b border-purple-800/60 pb-3">
                    <span className="font-mono-tabular font-semibold">
                      LECCIÓN {activeLesson.number} · {course.category.toUpperCase()}
                    </span>
                    <span className="font-mono-tabular text-purple-300">
                      CREDIULEP STREAMING
                    </span>
                  </div>

                  {/* Center Lesson Slide Content */}
                  <div className="relative z-10 my-auto py-4 space-y-4 max-w-2xl">
                    <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug text-balance">
                      {activeLesson.title}
                    </h2>
                    <p className="text-sm text-purple-200/90 leading-relaxed">
                      {activeLesson.summary}
                    </p>
                    <div className="p-4 rounded-2xl bg-[#120721]/90 border border-purple-800/80 font-mono-tabular text-xs text-purple-200 overflow-x-auto whitespace-pre">
                      {activeLesson.practicalFormulaOrCode}
                    </div>
                  </div>

                  {/* Bottom Interactive Overlay */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-purple-300/80 pt-2">
                    <span>Docente: {course.instructor.name}</span>
                    <span className="font-mono-tabular">
                      {isPlaying ? 'Reproduciendo...' : 'Pausado'}
                    </span>
                  </div>
                </div>

                {/* Player Control Bar with Soft Rounded Controls */}
                <div className="px-5 sm:px-7 py-4 bg-[#120721] border-t border-purple-900/70 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Reproducir</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs font-mono-tabular text-purple-200">
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
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>

                  {/* Speed & Complete Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-purple-950/70 p-1 rounded-xl border border-purple-800/60">
                      {[1, 1.25, 1.5, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`px-2 py-1 text-xs font-mono-tabular rounded-lg transition-colors cursor-pointer ${
                            playbackSpeed === spd
                              ? 'bg-purple-600 text-white font-semibold'
                              : 'text-purple-300 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => onToggleCompleteLesson(activeLesson.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer active:scale-95 ${
                        isCurrentLessonCompleted
                          ? 'bg-purple-800/80 text-purple-200 border border-purple-600'
                          : 'bg-purple-950/90 hover:bg-purple-900 text-purple-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{isCurrentLessonCompleted ? 'Completada' : 'Marcar completada'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Tabs Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-3xl border border-purple-100 shadow-xs">
                <div className="flex items-center gap-1.5 p-1 bg-purple-50/70 rounded-2xl">
                  <button
                    onClick={() => setActiveTab('resumen')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'resumen'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-purple-900/70 hover:text-purple-950'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Guía y Recursos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('evaluacion')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'evaluacion'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-purple-900/70 hover:text-purple-950'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Autoevaluación</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('apuntes')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'apuntes'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-purple-900/70 hover:text-purple-950'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Mis Apuntes</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('certificado')}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      activeTab === 'certificado'
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-purple-900/70 hover:text-purple-950'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Certificado</span>
                  </button>
                </div>

                {nextLesson && (
                  <button
                    onClick={() => setActiveLessonId(nextLesson.id)}
                    className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Siguiente: Lección {nextLesson.number}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tab Content Panels with Soft Rounded Corners */}
              {activeTab === 'resumen' && (
                <div className="bg-white border border-purple-100 rounded-3xl p-7 space-y-6 shadow-xs">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-purple-950">
                      Conceptos de la Lección {activeLesson.number}
                    </h3>
                    <p className="text-sm text-purple-900/70 leading-relaxed max-w-[68ch]">
                      {activeLesson.summary}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                      Puntos de aplicación inmediata
                    </h4>
                    <ul className="space-y-2.5 text-sm text-purple-900/80">
                      {activeLesson.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="font-mono-tabular font-bold text-purple-700">
                            0{idx + 1}.
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Downloadable Resource Box */}
                  <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-purple-900/60">Material descargable</p>
                      <p className="text-sm font-bold text-purple-950 font-mono-tabular mt-0.5">
                        {activeLesson.resourceTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadResource(activeLesson)}
                      className="px-4 py-2.5 bg-white border border-purple-200 hover:border-purple-400 text-purple-950 text-xs font-semibold rounded-xl transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-700" />
                      <span>Descargar Plantilla (.txt)</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'evaluacion' && (
                <div className="bg-white border border-purple-100 rounded-3xl p-7 space-y-5 shadow-xs">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-purple-700">
                      Comprobación práctica · Lección {activeLesson.number}
                    </p>
                    <h3 className="text-base font-bold text-purple-950">
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
                          className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'border-purple-600 bg-purple-50 font-semibold text-purple-950 shadow-xs'
                              : 'border-purple-100 hover:border-purple-200 bg-white text-purple-900/80 hover:bg-purple-50/30'
                          }`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isSelected && (
                            <span className="text-xs font-bold shrink-0">
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
                      className="px-6 py-3 bg-purple-700 hover:bg-purple-600 disabled:bg-purple-200 text-white text-xs font-semibold rounded-2xl transition-all whitespace-nowrap shrink-0 shadow-md shadow-purple-700/20 active:scale-95 cursor-pointer"
                    >
                      Verificar Respuesta
                    </button>
                  </div>

                  {quizSubmitted && selectedQuizOption !== null && (
                    <div
                      className={`p-5 rounded-2xl border text-xs leading-relaxed ${
                        selectedQuizOption === activeLesson.quiz.correctIndex
                          ? 'bg-purple-50 border-purple-200 text-purple-950'
                          : 'bg-amber-50 border-amber-200 text-amber-950'
                      }`}
                    >
                      <p className="font-bold mb-1">
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
                <div className="bg-white border border-purple-100 rounded-3xl p-7 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-purple-950">
                        Cuaderno de notas sincronizado
                      </h3>
                      <p className="text-xs text-purple-900/60">
                        Tus notas se guardan automáticamente para continuar estudiando desde donde estés.
                      </p>
                    </div>
                    {notesSavedFeedback && (
                      <span className="text-xs font-semibold text-purple-700">
                        ✓ Guardado
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={5}
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    className="w-full p-4 text-sm border border-purple-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all text-purple-950"
                    placeholder="Escribe aquí tus conclusiones o fórmulas..."
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      Guardar Apuntes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'certificado' && (
                <div className="bg-white border border-purple-100 rounded-3xl p-7 space-y-6 shadow-xs">
                  <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-purple-50/40 to-purple-50/80 border border-purple-200 text-center space-y-4 shadow-2xs">
                    <p className="text-xs font-mono-tabular text-purple-700 font-bold uppercase tracking-wider">
                      CREDIULEP · CERTIFICACIÓN ACADÉMICA VERIFICABLE
                    </p>
                    <h3 className="text-2xl font-bold text-purple-950">{course.title}</h3>
                    <p className="text-sm text-purple-900/70">
                      Se certifica que{' '}
                      <strong className="text-purple-950">
                        {studentName || 'Estudiante Activo CREDIULEP'}
                      </strong>{' '}
                      cursa y aplica las competencias prácticas de{' '}
                      <strong className="text-purple-950">{course.category}</strong> con una
                      intensidad de {course.totalDuration}.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-purple-900/60 font-mono-tabular">
                      <span>ID: CERT-ULEP-{course.id.toUpperCase()}</span>
                      <span>·</span>
                      <span>Docente: {course.instructor.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-purple-900/70">
                      Progreso: {completedInCourseCount} de {totalCourseLessons} lecciones
                      completadas ({completionPercentage}%).
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadCertificate}
                      className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-2xl shadow-md shadow-purple-700/20 transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Certificado Verificable (.txt)</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Locked Lesson State with Soft Rounded Rectangles */
            <div className="bg-white border border-purple-100 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-sm">
              <div className="w-14 h-14 rounded-3xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <p className="text-xs font-mono-tabular font-bold text-purple-700">
                  LECCIÓN {activeLesson.number} · REQUIERE MATRÍCULA ACTIVA
                </p>
                <h2 className="text-2xl font-bold text-purple-950">{activeLesson.title}</h2>
                <p className="text-sm text-purple-900/70 leading-relaxed">
                  Adquiere este curso desde donde estés y desbloquea todas las{' '}
                  {course.lessonsCount} lecciones al instante.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onBuyCourseNow(course)}
                  className="px-7 py-3.5 bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-purple-700/25 transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
                >
                  <span>
                    Pagar Ahora ({formatPrice(course.priceCOP, course.priceUSD, currency)})
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Columns: Course Syllabus & Lesson Selector with Soft Rounded Corners */}
        <aside className="lg:col-span-4 bg-white border border-purple-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 bg-purple-50/60 border-b border-purple-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-purple-950">Plan de Estudios</h2>
            <span className="text-xs font-mono-tabular font-bold text-purple-700">
              {course.lessonsCount} lecciones
            </span>
          </div>

          <div className="divide-y divide-purple-50">
            {course.modules.map((mod) => (
              <div key={mod.id}>
                <div className="px-5 py-3 bg-purple-50/30 text-xs font-bold text-purple-900/80">
                  {mod.title}
                </div>
                <div className="divide-y divide-purple-50/60">
                  {mod.lessons.map((lesson) => {
                    const isSelected = lesson.id === activeLesson.id;
                    const isCompleted = completedLessons.includes(lesson.id);
                    const canAccess = isPurchased || lesson.isFreePreview;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full text-left p-4 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          isSelected ? 'bg-purple-50/90' : 'hover:bg-purple-50/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-purple-900/60">
                            <span className="font-mono-tabular font-bold text-purple-700">
                              {lesson.number}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">{lesson.duration}</span>
                            {lesson.isFreePreview && !isPurchased && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-purple-700 font-bold">Libre</span>
                              </>
                            )}
                          </div>
                          <p
                            className={`text-sm leading-snug ${
                              isSelected
                                ? 'font-bold text-purple-950'
                                : 'font-semibold text-purple-900/80'
                            }`}
                          >
                            {lesson.title}
                          </p>
                        </div>

                        <div className="shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2
                              className="w-4 h-4 text-purple-700"
                              aria-label="Lección completada"
                            />
                          ) : canAccess ? (
                            <Play
                              className={`w-4 h-4 ${
                                isSelected ? 'text-purple-700' : 'text-purple-300'
                              }`}
                            />
                          ) : (
                            <Lock className="w-4 h-4 text-purple-300" />
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
