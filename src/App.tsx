import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  ArrowRight,
  PlayCircle,
  Check,
  CreditCard,
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
    localStorage.setItem('crediulep_cart', JSON.stringify(cartIds));
  }, [cartIds]);

  useEffect(() => {
    localStorage.setItem('crediulep_saved_carts', JSON.stringify(savedCarts));
  }, [savedCarts]);

  useEffect(() => {
    localStorage.setItem('crediulep_purchased', JSON.stringify(purchasedIds));
  }, [purchasedIds]);

  useEffect(() => {
    localStorage.setItem('crediulep_completed_lessons', JSON.stringify(completedLessons));
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
    showToast(`"${name}" guardado`);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompleteLesson = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const activeClassroomCourse =
    COURSES.find((c) => c.id === classroomCourseId) || COURSES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
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

          {/* Zone 2: Catalog Navigation Link */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#catalogo"
              onClick={() => setActiveView('storefront')}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Catálogo
            </a>
          </nav>

          {/* Zone 3: Top-Right Shopping Cart Icon Button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrito de compras"
              className="relative p-2.5 text-slate-900 bg-white border border-slate-300 hover:border-slate-900 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCourses.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold font-mono-tabular bg-amber-600 text-white rounded-md leading-none">
                  {cartCourses.length}
                </span>
              )}
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
            onBuyCourseNow={handleBuyCourseDirect}
            onBackToCatalog={() => setActiveView('storefront')}
            studentName="Estudiante CREDIULEP"
          />
        ) : (
          <div id="top" className="space-y-12 pb-20">
            {/* SECTION 1: Simplified Storefront Hero */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
              <div className="max-w-3xl space-y-6">
                <h1
                  className="font-bold text-slate-900 tracking-tight text-balance leading-[1.12]"
                  style={{ fontSize: 'clamp(2rem, 3.8vw, 3.25rem)' }}
                >
                  Compra tu curso desde donde estés y entra a clase al instante.
                </h1>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#catalogo"
                    className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <span>Explorar Catálogo de Cursos</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 2: Categorized Course Catalog — Only Course Name with Icons */}
            <section
              id="catalogo"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20"
            >
              {/* Interactive Filter Controls Bar: Category Segmented Buttons + Search + Sort */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar curso..."
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
                    <option value="popular">Ordenar: Populares</option>
                    <option value="price-asc">Precio: Menor a mayor</option>
                    <option value="price-desc">Precio: Mayor a menor</option>
                  </select>
                </div>
              </div>

              {/* 3-Column Product Grid: Course Name + Icons Only */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                  <p className="text-base font-bold text-slate-900">
                    No encontramos cursos que coincidan con tu búsqueda
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => {
                    const isPurchased = purchasedIds.includes(course.id);
                    const isInCart = cartIds.includes(course.id);

                    return (
                      <article
                        key={course.id}
                        className="group bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {/* Icon Visual Header + Course Name with Icon */}
                        <div>
                          <div
                            onClick={() => setDetailCourse(course)}
                            className="h-36 w-full overflow-hidden border-b border-slate-100 cursor-pointer"
                          >
                            <CourseArtwork
                              theme={course.visualTheme}
                              className="w-full h-full transition-transform duration-200 group-hover:scale-[1.02]"
                            />
                          </div>

                          <div className="p-5 flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                              <CourseIconBadge theme={course.visualTheme} className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900 leading-snug">
                              <button
                                type="button"
                                onClick={() => setDetailCourse(course)}
                                className="text-left hover:text-amber-700 transition-colors cursor-pointer"
                              >
                                {course.title}
                              </button>
                            </h3>
                          </div>
                        </div>

                        {/* Card Footer: Price + Icon Action Buttons */}
                        <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                          <span className="text-base font-bold font-mono-tabular text-slate-900">
                            {formatPrice(course.priceCOP, course.priceUSD, currency)}
                          </span>

                          <div className="flex items-center gap-2">
                            {isPurchased ? (
                              <button
                                type="button"
                                onClick={() => handleOpenClassroom(course.id)}
                                title="Ir a las lecciones"
                                aria-label={`Ir a las lecciones de ${course.title}`}
                                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                <PlayCircle className="w-4 h-4 text-amber-400" />
                                <span>Lecciones</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(course)}
                                  title={isInCart ? 'Guardado en el carrito' : 'Guardar en carrito'}
                                  aria-label={`Agregar ${course.title} al carrito`}
                                  className={`p-2.5 border rounded-lg transition-colors cursor-pointer ${
                                    isInCart
                                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                                      : 'border-slate-300 hover:border-slate-900 text-slate-800 bg-white'
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
                                  className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
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

      {/* Clean Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="space-y-1">
            <p className="font-bold text-slate-900 text-sm">CREDIULEP</p>
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

      {/* Shopping Cart Slide-Over Drawer (Supports Multiple Courses & Saving Multiple Carts) */}
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
