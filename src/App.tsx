import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  ArrowRight,
  PlayCircle,
  Check,
  CreditCard,
  ShieldCheck,
  Globe,
  BookOpen,
} from 'lucide-react';
import {
  COURSES,
  CATEGORIES,
  CategoryFilter,
  Course,
  EfipayTransaction,
  TESTIMONIALS,
  formatPrice,
} from './data/courses';
import { CourseArtwork, HeroAnywhereIllustration } from './components/CourseArtwork';
import { EfipayCheckoutModal } from './components/EfipayCheckoutModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { ClassroomPlayer } from './components/ClassroomPlayer';
import { CartSlideOver } from './components/CartSlideOver';

export default function App() {
  // Active view: 'storefront' or 'classroom'
  const [activeView, setActiveView] = useState<'storefront' | 'classroom'>('storefront');

  // Filter, Search, Sort & Currency
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todos los cursos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [currency, setCurrency] = useState<'COP' | 'USD'>('COP');

  // Cart & Purchased State (persisted in localStorage)
  const [cartIds, setCartIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('crediulep_cart');
      return saved ? JSON.parse(saved) : ['crs-fullstack-cloud'];
    } catch {
      return ['crs-fullstack-cloud'];
    }
  });

  const [purchasedIds, setPurchasedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('crediulep_purchased');
      return saved ? JSON.parse(saved) : ['crs-finanzas-credito'];
    } catch {
      return ['crs-finanzas-credito'];
    }
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('crediulep_completed_lessons');
      return saved ? JSON.parse(saved) : ['les-fin-1'];
    } catch {
      return ['les-fin-1'];
    }
  });

  const [transactions, setTransactions] = useState<EfipayTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('crediulep_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [efipayItems, setEfipayItems] = useState<Course[]>([]);
  const [isEfipayOpen, setIsEfipayOpen] = useState<boolean>(false);

  // Classroom state
  const [classroomCourseId, setClassroomCourseId] = useState<string>('crs-finanzas-credito');
  const [classroomInitialLessonId, setClassroomInitialLessonId] = useState<string | undefined>(
    undefined
  );

  // Toast notification for cart actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('crediulep_cart', JSON.stringify(cartIds));
  }, [cartIds]);

  useEffect(() => {
    localStorage.setItem('crediulep_purchased', JSON.stringify(purchasedIds));
  }, [purchasedIds]);

  useEffect(() => {
    localStorage.setItem('crediulep_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('crediulep_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const cartCourses = useMemo(
    () => COURSES.filter((c) => cartIds.includes(c.id) && !purchasedIds.includes(c.id)),
    [cartIds, purchasedIds]
  );

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCat =
        selectedCategory === 'Todos los cursos' || course.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.subtitle.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.instructor.name.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceCOP - b.priceCOP;
      if (sortBy === 'price-desc') return b.priceCOP - a.priceCOP;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.studentsCount - a.studentsCount;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (course: Course) => {
    if (purchasedIds.includes(course.id)) {
      handleOpenClassroom(course.id);
      return;
    }
    if (cartIds.includes(course.id)) {
      setIsCartOpen(true);
      return;
    }
    setCartIds((prev) => [...prev, course.id]);
    showToast(`"${course.title}" agregado al carrito`);
  };

  const handleRemoveFromCart = (courseId: string) => {
    setCartIds((prev) => prev.filter((id) => id !== courseId));
  };

  const handleBuyNowEfipay = (course: Course) => {
    setEfipayItems([course]);
    setIsEfipayOpen(true);
  };

  const handleCheckoutCartWithEfipay = () => {
    if (cartCourses.length === 0) {
      const firstUnpurchased = COURSES.find((c) => !purchasedIds.includes(c.id)) || COURSES[0];
      setEfipayItems([firstUnpurchased]);
    } else {
      setEfipayItems(cartCourses);
    }
    setIsCartOpen(false);
    setIsEfipayOpen(true);
  };

  const handlePaymentSuccess = (tx: EfipayTransaction, firstCourseId: string) => {
    setPurchasedIds((prev) => Array.from(new Set([...prev, ...tx.courseIds])));
    setCartIds((prev) => prev.filter((id) => !tx.courseIds.includes(id)));
    setTransactions((prev) => [tx, ...prev]);
    setClassroomCourseId(firstCourseId);
    showToast(`Pago aprobado (${tx.reference}). Tus lecciones están activas.`);
  };

  const handleOpenClassroom = (courseId: string, lessonId?: string) => {
    setClassroomCourseId(courseId);
    setClassroomInitialLessonId(lessonId);
    setActiveView('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompleteLesson = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const activeClassroomCourse =
    COURSES.find((c) => c.id === classroomCourseId) || COURSES[0];

  const latestBuyerName = transactions[0]?.buyerName || 'Andrés Felipe Martínez';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900">
      {/* Strict 3-Zone Top Navigation Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('storefront');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            CREDIULEP
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#catalogo"
              onClick={() => setActiveView('storefront')}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Catálogo
            </a>
            <a
              href="#mis-cursos"
              onClick={(e) => {
                if (activeView === 'classroom') {
                  e.preventDefault();
                  setActiveView('storefront');
                }
              }}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Mis Cursos ({purchasedIds.length})
            </a>
            <a
              href="#aula-inmediata"
              onClick={(e) => {
                e.preventDefault();
                handleOpenClassroom(purchasedIds[0] || COURSES[0].id);
              }}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Aula Virtual
            </a>
            <a
              href="#testimonios"
              onClick={() => setActiveView('storefront')}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Resultados
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Carrito Efipay ({cartCourses.length})
            </button>
          </div>
        </div>
      </header>

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-3"
        >
          <Check className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'classroom' ? (
          <ClassroomPlayer
            course={activeClassroomCourse}
            initialLessonId={classroomInitialLessonId}
            isPurchased={purchasedIds.includes(activeClassroomCourse.id)}
            currency={currency}
            completedLessons={completedLessons}
            onToggleCompleteLesson={handleToggleCompleteLesson}
            onBuyCourseNow={handleBuyNowEfipay}
            onBackToCatalog={() => setActiveView('storefront')}
            studentName={latestBuyerName}
          />
        ) : (
          <div id="top" className="space-y-20 pb-20">
            {/* SECTION 1: Storefront Hero + Full-Width Proof Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                {/* Left 7 columns: Value Proposition & Primary Focal Anchor */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6 py-2">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-amber-700">
                        CREDIULEP · Educación Digital Sin Fronteras
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Pasarela Oficial Integrada Efipay</span>
                      <span aria-hidden="true">·</span>
                      <span>Acceso en el mismo segundo</span>
                    </div>

                    <h1
                      className="font-bold text-slate-900 tracking-tight text-balance leading-[1.12]"
                      style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                    >
                      Compra tu curso desde donde estés y entra a clase al instante.
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                      En <strong className="text-slate-900">CREDIULEP</strong> eliminamos las
                      esperas de matriculación. Explora nuestro catálogo categorizado, realiza tu
                      pago seguro con <strong className="text-slate-900">Efipay</strong> (PSE,
                      Tarjetas, Nequi, Daviplata o QR desde cualquier ciudad) y reproduce tu
                      primera lección de inmediato.
                    </p>
                  </div>

                  {/* Single Primary CTA + Secondary Action */}
                  <div className="space-y-5 pt-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href="#catalogo"
                        className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                      >
                        <span>Explorar Catálogo de Cursos</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleOpenClassroom(purchasedIds[0] || COURSES[0].id)}
                        className="px-5 py-3.5 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <PlayCircle className="w-4 h-4 text-amber-600" />
                        <span>Entrar al Aula Virtual Demo</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-1">
                      <span>✓ Pagos en COP o USD desde cualquier país</span>
                      <span>✓ Libera el 100% de las lecciones al aprobar Efipay</span>
                      <span>✓ Certificado verificable incluido</span>
                    </div>
                  </div>
                </div>

                {/* Right 5 columns: Architectural Multi-Device & Efipay Illustration */}
                <div className="lg:col-span-5 flex">
                  <HeroAnywhereIllustration />
                </div>
              </div>

              {/* Full-Width 4-Column Quantitative Proof Row below Hero Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
                <div className="space-y-1">
                  <p className="text-2xl font-bold font-mono-tabular text-slate-900">
                    14,720+ alumnos
                  </p>
                  <p className="text-xs text-slate-600">
                    Comprando y estudiando desde 18 países y más de 95 ciudades en 2026
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold font-mono-tabular text-slate-900">
                    &lt; 1.2 segundos
                  </p>
                  <p className="text-xs text-slate-600">
                    Tiempo promedio de liberación del Aula Virtual tras pago aprobado en Efipay
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold font-mono-tabular text-slate-900">
                    5 canales Efipay
                  </p>
                  <p className="text-xs text-slate-600">
                    PSE, Tarjetas Crédito/Débito, Nequi, Daviplata, Código QR y Efecty
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold font-mono-tabular text-slate-900">
                    4.91 / 5.00 ★
                  </p>
                  <p className="text-xs text-slate-600">
                    Calificación verificada en 2,164 evaluaciones de estudiantes graduados
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2: Categorized Course Catalog (Tienda Virtual) */}
            <section
              id="catalogo"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-amber-700 uppercase">
                    Tienda Virtual Educativa · Catálogo Categorizado
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                    Programas diseñados para aprender y aplicar desde donde estés
                  </h2>
                </div>

                {/* Currency Switcher & Instant Checkout Trigger */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setCurrency('COP')}
                      className={`px-3 py-1.5 rounded-md font-mono-tabular font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        currency === 'COP'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Pesos (COP $)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-1.5 rounded-md font-mono-tabular font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Dólares (USD $)
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Filter Controls Bar: Category Segmented Buttons + Search + Sort */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Category Tabs (Functional Interactive Filter Buttons) */}
                <div
                  role="tablist"
                  aria-label="Filtrar cursos por categoría"
                  className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-lg overflow-x-auto"
                >
                  {CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative min-w-[230px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar curso, tema o docente..."
                      aria-label="Buscar curso en el catálogo"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <select
                    aria-label="Ordenar catálogo por"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as 'popular' | 'price-asc' | 'price-desc' | 'rating'
                      )
                    }
                    className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-600"
                  >
                    <option value="popular">Ordenar: Más estudiados</option>
                    <option value="rating">Ordenar: Mejor calificación</option>
                    <option value="price-asc">Precio: Menor a mayor</option>
                    <option value="price-desc">Precio: Mayor a menor</option>
                  </select>
                </div>
              </div>

              {/* 3-Column Product Grid with Uniform Aspect Ratio & Clean Unboxed Metadata */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                  <p className="text-base font-bold text-slate-900">
                    No encontramos cursos que coincidan con tu búsqueda
                  </p>
                  <p className="text-xs text-slate-500">
                    Intenta con otra palabra clave o restablece el filtro de categorías.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('Todos los cursos');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Ver todos los cursos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => {
                    const isPurchased = purchasedIds.includes(course.id);
                    const isInCart = cartIds.includes(course.id);

                    return (
                      <article
                        key={course.id}
                        className="group bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div>
                          {/* Lead with 4:3 Imagery */}
                          <div
                            onClick={() => setDetailCourse(course)}
                            className="aspect-[4/3] w-full overflow-hidden border-b border-slate-100 cursor-pointer"
                          >
                            <CourseArtwork
                              theme={course.visualTheme}
                              className="w-full h-full transition-transform duration-200 group-hover:scale-[1.02]"
                            />
                          </div>

                          {/* Card Body */}
                          <div className="p-6 space-y-3">
                            {/* Unboxed Metadata with Typographic Separators (Zero-Pill Rule) */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                              <span className="uppercase tracking-wider font-medium text-slate-600">
                                {course.category}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-tabular">
                                {course.lessonsCount} lecciones
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-tabular">{course.totalDuration}</span>
                            </div>

                            {/* Course Name 16px SemiBold */}
                            <h3 className="text-base font-semibold text-slate-900 leading-snug">
                              <button
                                type="button"
                                onClick={() => setDetailCourse(course)}
                                className="text-left hover:text-amber-700 transition-colors cursor-pointer"
                              >
                                {course.title}
                              </button>
                            </h3>

                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {course.subtitle}
                            </p>

                            {/* Instructor & Rating Metadata */}
                            <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                              <span className="text-slate-700 font-medium">
                                {course.instructor.name}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-tabular text-slate-900 font-semibold">
                                {course.rating.toFixed(2)} ★
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-tabular">
                                {course.studentsCount.toLocaleString('es-CO')} alumnos
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Aligned Price Baseline & Immediate Actions */}
                        <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-4">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-xs text-slate-500 block">
                                {isPurchased ? 'Estado en tu cuenta' : 'Pago único vía Efipay'}
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold font-mono-tabular text-slate-900">
                                  {formatPrice(course.priceCOP, course.priceUSD, currency)}
                                </span>
                                {!isPurchased && (
                                  <span className="text-xs text-slate-400 line-through font-mono-tabular">
                                    {formatPrice(
                                      course.originalPriceCOP,
                                      Math.round(course.priceUSD * 1.45),
                                      currency
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setDetailCourse(course)}
                              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              Ver temario
                            </button>
                          </div>

                          {isPurchased ? (
                            <button
                              type="button"
                              onClick={() => handleOpenClassroom(course.id)}
                              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                            >
                              <PlayCircle className="w-4 h-4 text-amber-400" />
                              <span>Acceso Inmediato · Ir a las Lecciones</span>
                            </button>
                          ) : (
                            <div className="grid grid-cols-2 gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleBuyNowEfipay(course)}
                                className="py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Comprar Efipay</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAddToCart(course)}
                                className="py-2.5 px-3 border border-slate-300 hover:border-slate-900 text-slate-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>{isInCart ? 'Ver Carrito' : 'Al Carrito'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* SECTION 3: Mis Cursos con Acceso Inmediato + Pasarela Efipay + Testimonios */}
            <section
              id="mis-cursos"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 scroll-mt-20"
            >
              {/* Unlocked Courses Strip */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-amber-700 uppercase">
                      Aula Virtual CREDIULEP · Acceso Inmediato
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Tus cursos habilitados para estudiar ahora mismo ({purchasedIds.length})
                    </h2>
                    <p className="text-xs text-slate-600">
                      Cada curso que compras en Efipay aparece aquí al instante con todas sus
                      lecciones, autoevaluaciones y plantillas listas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckoutCartWithEfipay}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Probar Checkout Efipay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COURSES.filter((c) => purchasedIds.includes(c.id)).map((course) => {
                    const allLessonIds = course.modules.flatMap((m) =>
                      m.lessons.map((l) => l.id)
                    );
                    const doneCount = allLessonIds.filter((id) =>
                      completedLessons.includes(id)
                    ).length;

                    return (
                      <div
                        key={course.id}
                        className="p-4 rounded-lg bg-[#FAF9F6] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{course.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">
                              {doneCount}/{allLessonIds.length} lecciones completadas
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">{course.title}</h3>
                          <p className="text-xs text-slate-600">
                            Docente: {course.instructor.name}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenClassroom(course.id)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Continuar Lecciones</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Efipay Transactions Log if user completed any purchase */}
                {transactions.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Tus transacciones recientes verificadas por Efipay
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="py-2 pr-4 font-medium">Referencia Efipay</th>
                            <th className="py-2 pr-4 font-medium">Fecha</th>
                            <th className="py-2 pr-4 font-medium">Ubicación de Compra</th>
                            <th className="py-2 pr-4 font-medium">Medio de Pago</th>
                            <th className="py-2 text-right font-medium">Monto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono-tabular">
                          {transactions.map((tx) => (
                            <tr key={tx.reference} className="text-slate-700">
                              <td className="py-2.5 pr-4 font-semibold text-slate-900">
                                {tx.reference}
                              </td>
                              <td className="py-2.5 pr-4">{tx.date}</td>
                              <td className="py-2.5 pr-4 font-sans">{tx.buyerLocation}</td>
                              <td className="py-2.5 pr-4 font-sans">{tx.methodLabel}</td>
                              <td className="py-2.5 text-right font-semibold text-slate-900">
                                {tx.amountFormatted}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Attributable Student Testimonials & Claim-to-Proof Adjacency */}
              <div id="testimonios" className="space-y-8 scroll-mt-20">
                <div className="max-w-2xl space-y-2">
                  <p className="text-xs font-semibold text-amber-700 uppercase">
                    Resultados Verificados · Compra Desde Donde Estés
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                    Profesionales que compraron con Efipay e iniciaron sus lecciones al instante
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {TESTIMONIALS.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                          <span className="font-semibold text-amber-700 font-mono-tabular">
                            {item.outcomeMetric}
                          </span>
                          <span>{item.paymentMethodUsed}</span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-1">
                        <p className="text-sm font-bold text-slate-900">{item.studentName}</p>
                        <p className="text-xs text-slate-600">
                          {item.role} · {item.organization}
                        </p>
                        <p className="text-xs text-slate-500 pt-0.5 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.location}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-slate-500">
          <div className="space-y-1">
            <p className="font-bold text-slate-900 text-sm">CREDIULEP</p>
            <p>
              Tienda virtual de cursos educativos · Compra desde donde estés con pasarela integrada
              Efipay y acceso inmediato a las lecciones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#catalogo"
              onClick={() => setActiveView('storefront')}
              className="hover:text-slate-900 transition-colors"
            >
              Catálogo Categorizado
            </a>
            <button
              type="button"
              onClick={handleCheckoutCartWithEfipay}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Checkout Efipay
            </button>
            <button
              type="button"
              onClick={() => handleOpenClassroom(purchasedIds[0] || COURSES[0].id)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Aula Virtual
            </button>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pagos protegidos por Efipay</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Course Detail Modal (Contiguous Purchase Module PDP) */}
      <CourseDetailModal
        course={detailCourse}
        onClose={() => setDetailCourse(null)}
        currency={currency}
        isPurchased={detailCourse ? purchasedIds.includes(detailCourse.id) : false}
        isInCart={detailCourse ? cartIds.includes(detailCourse.id) : false}
        onAddToCart={handleAddToCart}
        onBuyNowEfipay={handleBuyNowEfipay}
        onOpenClassroom={handleOpenClassroom}
      />

      {/* Shopping Cart Slide-Over Drawer */}
      <CartSlideOver
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartCourses}
        currency={currency}
        onToggleCurrency={setCurrency}
        onRemoveFromCart={handleRemoveFromCart}
        onProceedToEfipay={handleCheckoutCartWithEfipay}
      />

      {/* Integrated Efipay Payment Gateway Modal */}
      <EfipayCheckoutModal
        isOpen={isEfipayOpen}
        onClose={() => setIsEfipayOpen(false)}
        items={efipayItems}
        currency={currency}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenCourseImmediately={(courseId) => handleOpenClassroom(courseId)}
      />
    </div>
  );
}
