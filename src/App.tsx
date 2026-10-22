import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  ArrowRight,
  PlayCircle,
  Check,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import {
  COURSES,
  CATEGORIES,
  CategoryFilter,
  Course,
  formatPrice,
} from './data/courses';
import { CourseArtwork, CourseIconBadge } from './components/CourseArtwork';
import { CourseDetailModal } from './components/CourseDetailModal';
import { ClassroomPlayer } from './components/ClassroomPlayer';
import { CartSlideOver, SavedCartBundle } from './components/CartSlideOver';
import { redirectToPaymentGateway } from './services/paymentApi';

export default function App() {
  // Active view: 'storefront' or 'classroom'
  const [activeView, setActiveView] = useState<'storefront' | 'classroom'>('storefront');

  // Filter, Search, Sort & Currency
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todos los cursos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [currency] = useState<'COP' | 'USD'>('COP');

  // Cart & Purchased State (persisted in localStorage)
  const [cartIds, setCartIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('crediulep_cart');
      return saved ? JSON.parse(saved) : ['crs-fullstack-cloud'];
    } catch {
      return ['crs-fullstack-cloud'];
    }
  });

  const [savedCarts, setSavedCarts] = useState<SavedCartBundle[]>(() => {
    try {
      const saved = localStorage.getItem('crediulep_saved_carts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);

  // Classroom state
  const [classroomCourseId, setClassroomCourseId] = useState<string>('crs-finanzas-credito');
  const [classroomInitialLessonId, setClassroomInitialLessonId] = useState<string | undefined>(
    undefined
  );

  // Toast notification for cart actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check return URL params from payment gateway redirect
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const coursesParam = params.get('courses');
    if (status === 'approved' && coursesParam) {
      const unlockedIds = coursesParam.split(',').filter(Boolean);
      if (unlockedIds.length > 0) {
        setPurchasedIds((prev) => Array.from(new Set([...prev, ...unlockedIds])));
        setCartIds((prev) => prev.filter((id) => !unlockedIds.includes(id)));
        setClassroomCourseId(unlockedIds[0]);
        setActiveView('classroom');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('crediulep_cart', JSON.stringify(cartIds));
    }
  }, [cartIds]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('crediulep_saved_carts', JSON.stringify(savedCarts));
    }
  }, [savedCarts]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('crediulep_purchased', JSON.stringify(purchasedIds));
    }
  }, [purchasedIds]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('crediulep_completed_lessons', JSON.stringify(completedLessons));
    }
  }, [completedLessons]);

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
        course.category.toLowerCase().includes(q);
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
    showToast(`Curso guardado en el carrito`);
  };

  const handleRemoveFromCart = (courseId: string) => {
    setCartIds((prev) => prev.filter((id) => id !== courseId));
  };

  const handleSaveCurrentCart = (name: string) => {
    if (cartCourses.length === 0) return;
    const newBundle: SavedCartBundle = {
      id: `cart-${Date.now()}`,
      name,
      courseIds: cartCourses.map((c) => c.id),
      createdAt: new Date().toLocaleDateString('es-CO'),
    };
    setSavedCarts((prev) => [newBundle, ...prev]);
    showToast(`"${name}" guardado con éxito`);
  };

  const handleLoadSavedCart = (courseIds: string[]) => {
    setCartIds((prev) => Array.from(new Set([...prev, ...courseIds])));
    showToast('Cursos cargados al carrito actual');
  };

  const handleDeleteSavedCart = (id: string) => {
    setSavedCarts((prev) => prev.filter((b) => b.id !== id));
  };

  const handlePaySavedCart = (courseIds: string[]) => {
    const itemsToPay = COURSES.filter((c) => courseIds.includes(c.id));
    if (itemsToPay.length > 0) {
      redirectToPaymentGateway(itemsToPay, currency);
    }
  };

  const handleBuyCourseDirect = (course: Course) => {
    redirectToPaymentGateway([course], currency);
  };

  const handleCheckoutCartDirect = () => {
    if (cartCourses.length > 0) {
      redirectToPaymentGateway(cartCourses, currency);
    }
  };

  const handleOpenClassroom = (courseId: string, lessonId?: string) => {
    setClassroomCourseId(courseId);
    setClassroomInitialLessonId(lessonId);
    setActiveView('classroom');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleCompleteLesson = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const activeClassroomCourse =
    COURSES.find((c) => c.id === classroomCourseId) || COURSES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FF] text-slate-900">
      {/* Top Navigation Bar with Soft Rounded Edges and Purple Accents */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100/80 px-4 sm:px-8 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('storefront');
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-purple-500/25 transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-purple-200" />
            </div>
            <span className="text-xl font-bold tracking-tight text-purple-950 whitespace-nowrap shrink-0">
              CREDIULEP
            </span>
          </a>

          {/* Zone 2: Navigation Link */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-purple-900/70">
            <a
              href="#catalogo"
              onClick={() => setActiveView('storefront')}
              className="px-3.5 py-1.5 rounded-xl hover:text-purple-900 hover:bg-purple-50 transition-all duration-200 whitespace-nowrap shrink-0"
            >
              Catálogo
            </a>
          </nav>

          {/* Zone 3: Top-Right Shopping Cart Icon Button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrito de compras"
              className="relative p-2.5 text-purple-950 bg-white border border-purple-200/80 hover:border-purple-400 hover:bg-purple-50/80 rounded-2xl shadow-xs transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 text-purple-800" />
              {cartCourses.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold font-mono-tabular bg-purple-700 text-white rounded-full leading-none shadow-xs animate-pop">
                  {cartCourses.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Soft Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-950 to-indigo-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-purple-950/30 border border-purple-800/80 text-xs font-semibold flex items-center gap-3 animate-fade-in"
        >
          <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
            <Check className="w-3.5 h-3.5" />
          </div>
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
            onBuyCourseNow={handleBuyCourseDirect}
            onBackToCatalog={() => setActiveView('storefront')}
            studentName="Estudiante CREDIULEP"
          />
        ) : (
          <div id="top" className="space-y-12 pb-24">
            {/* SECTION 1: Softened Hero Section with Purple Palette and Smooth Animations */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
              <div className="relative rounded-3xl bg-gradient-to-br from-white via-purple-50/50 to-purple-100/30 border border-purple-100 p-8 sm:p-14 shadow-sm overflow-hidden animate-fade-in">
                {/* Decorative floating blur circles */}
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-200/30 blur-3xl pointer-events-none animate-float" />
                <div className="absolute -bottom-10 left-1/3 w-72 h-72 rounded-full bg-indigo-200/25 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 text-purple-800 text-xs font-semibold tracking-wide border border-purple-200/60 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Aprende desde cualquier lugar</span>
                  </div>

                  <h1
                    className="font-bold text-purple-950 tracking-tight text-balance leading-[1.12]"
                    style={{ fontSize: 'clamp(2.15rem, 4vw, 3.5rem)' }}
                  >
                    Compra tu curso desde donde estés y entra a clase al instante.
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a
                      href="#catalogo"
                      className="px-7 py-4 bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-purple-700/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Explorar Catálogo de Cursos</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: Categorized Course Catalog — Softened Rectangles & Animations */}
            <section
              id="catalogo"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20"
            >
              {/* Category Segmented Buttons + Search + Sort with Rounded Pill/Rectangle Styling */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 bg-white rounded-3xl border border-purple-100/90 shadow-xs">
                <div
                  role="tablist"
                  aria-label="Filtrar cursos por categoría"
                  className="flex items-center gap-1.5 p-1.5 bg-purple-50/70 rounded-2xl overflow-x-auto"
                >
                  {CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer active:scale-95 ${
                          isActive
                            ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                            : 'text-purple-900/70 hover:text-purple-950 hover:bg-white/80'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 px-2 pb-2 lg:pb-0">
                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar curso..."
                      aria-label="Buscar curso en el catálogo"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-purple-50/40 border border-purple-200/80 rounded-2xl text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all"
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
                    className="px-3.5 py-2.5 text-xs bg-purple-50/40 border border-purple-200/80 rounded-2xl text-purple-950 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="popular">Ordenar: Populares</option>
                    <option value="price-asc">Precio: Menor a mayor</option>
                    <option value="price-desc">Precio: Mayor a menor</option>
                  </select>
                </div>
              </div>

              {/* 3-Column Product Grid: Soft Rounded Rectangles with Smooth Animations */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white border border-purple-100 rounded-3xl p-12 text-center space-y-3 shadow-xs">
                  <p className="text-base font-bold text-purple-950">
                    No encontramos cursos que coincidan con tu búsqueda
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('Todos los cursos');
                      setSearchQuery('');
                    }}
                    className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-2xl transition-all cursor-pointer"
                  >
                    Ver todos los cursos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredCourses.map((course) => {
                    const isPurchased = purchasedIds.includes(course.id);
                    const isInCart = cartIds.includes(course.id);

                    return (
                      <article
                        key={course.id}
                        className="group bg-white border border-purple-100/90 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300/80"
                      >
                        {/* Artwork with Soft Top Corners */}
                        <div>
                          <div
                            onClick={() => setDetailCourse(course)}
                            className="h-40 w-full overflow-hidden cursor-pointer relative"
                          >
                            <CourseArtwork
                              theme={course.visualTheme}
                              className="w-full h-full"
                            />
                          </div>

                          <div className="p-6 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100/80 flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110">
                              <CourseIconBadge theme={course.visualTheme} className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-bold text-purple-950 leading-snug">
                              <button
                                type="button"
                                onClick={() => setDetailCourse(course)}
                                className="text-left hover:text-purple-700 transition-colors cursor-pointer"
                              >
                                {course.title}
                              </button>
                            </h3>
                          </div>
                        </div>

                        {/* Card Footer: Soft Edges & Purple Icon Buttons */}
                        <div className="px-6 pb-6 pt-3 border-t border-purple-50 flex items-center justify-between gap-3">
                          <span className="text-base font-bold font-mono-tabular text-purple-950">
                            {formatPrice(course.priceCOP, course.priceUSD, currency)}
                          </span>

                          <div className="flex items-center gap-2">
                            {isPurchased ? (
                              <button
                                type="button"
                                onClick={() => handleOpenClassroom(course.id)}
                                title="Ir a las lecciones"
                                aria-label={`Ir a las lecciones de ${course.title}`}
                                className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-2xl transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs cursor-pointer active:scale-95"
                              >
                                <PlayCircle className="w-4 h-4 text-purple-300" />
                                <span>Lecciones</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(course)}
                                  title={isInCart ? 'Guardado en el carrito' : 'Guardar en carrito'}
                                  aria-label={`Agregar ${course.title} al carrito`}
                                  className={`p-2.5 border rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 ${
                                    isInCart
                                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                                      : 'border-purple-200 hover:border-purple-400 text-purple-800 bg-white hover:bg-purple-50/50'
                                  }`}
                                >
                                  {isInCart ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <ShoppingCart className="w-4 h-4" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleBuyCourseDirect(course)}
                                  title="Pagar ahora"
                                  aria-label={`Pagar ${course.title}`}
                                  className="px-4 py-2.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-2xl shadow-md shadow-purple-700/20 transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  <span>Pagar</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Clean Footer with Softened Top Rounded Border and Purple Accents */}
      <footer className="bg-white border-t border-purple-100 rounded-t-3xl py-10 px-4 sm:px-8 mt-12 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-purple-900/60">
          <div className="space-y-1">
            <p className="font-bold text-purple-950 text-sm">CREDIULEP</p>
            <p>
              Tienda virtual de cursos educativos · Compra desde donde estés con acceso inmediato a
              las lecciones.
            </p>
          </div>
        </div>
      </footer>

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={detailCourse}
        onClose={() => setDetailCourse(null)}
        currency={currency}
        isPurchased={detailCourse ? purchasedIds.includes(detailCourse.id) : false}
        isInCart={detailCourse ? cartIds.includes(detailCourse.id) : false}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyCourseDirect}
        onOpenClassroom={handleOpenClassroom}
      />

      {/* Shopping Cart Slide-Over Drawer */}
      <CartSlideOver
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartCourses}
        allCourses={COURSES}
        savedCarts={savedCarts}
        currency={currency}
        onRemoveFromCart={handleRemoveFromCart}
        onSaveCurrentCart={handleSaveCurrentCart}
        onLoadSavedCart={handleLoadSavedCart}
        onDeleteSavedCart={handleDeleteSavedCart}
        onPaySavedCart={handlePaySavedCart}
        onProceedToPay={handleCheckoutCartDirect}
      />
    </div>
  );
}
