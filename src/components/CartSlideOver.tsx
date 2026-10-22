import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingCart,
  ArrowRight,
  BookmarkPlus,
  FolderOpen,
} from 'lucide-react';
import { Course, formatPrice } from '../data/courses';
import { CourseIconBadge } from './CourseArtwork';

export interface SavedCartBundle {
  id: string;
  name: string;
  courseIds: string[];
  createdAt: string;
}

interface CartSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Course[];
  allCourses: Course[];
  savedCarts: SavedCartBundle[];
  currency: 'COP' | 'USD';
  onRemoveFromCart: (courseId: string) => void;
  onSaveCurrentCart: (name: string) => void;
  onLoadSavedCart: (courseIds: string[]) => void;
  onDeleteSavedCart: (id: string) => void;
  onPaySavedCart: (courseIds: string[]) => void;
  onProceedToPay: () => void;
}

export const CartSlideOver: React.FC<CartSlideOverProps> = ({
  isOpen,
  onClose,
  cartItems,
  allCourses,
  savedCarts,
  currency,
  onRemoveFromCart,
  onSaveCurrentCart,
  onLoadSavedCart,
  onDeleteSavedCart,
  onPaySavedCart,
  onProceedToPay,
}) => {
  const [cartLabel, setCartLabel] = useState('');

  if (!isOpen) return null;

  const subtotalCOP = cartItems.reduce((sum, item) => sum + item.priceCOP, 0);
  const subtotalUSD = cartItems.reduce((sum, item) => sum + item.priceUSD, 0);

  const handleSaveBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    const defaultName = `Carrito #${savedCarts.length + 1} (${cartItems.length} ${
      cartItems.length === 1 ? 'curso' : 'cursos'
    })`;
    onSaveCurrentCart(cartLabel.trim() || defaultName);
    setCartLabel('');
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-purple-950/40 backdrop-blur-xs flex justify-end transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl shadow-purple-950/20 border-l border-purple-100 rounded-l-3xl overflow-hidden animate-fade-in">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-purple-100 flex items-center justify-between bg-white/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="text-base font-bold text-purple-950">
                Carrito de Cursos
              </h2>
              <p className="text-xs text-purple-900/60 font-mono-tabular">
                {cartItems.length} {cartItems.length === 1 ? 'curso seleccionado' : 'cursos seleccionados'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-purple-900/60 hover:text-purple-950 hover:bg-purple-50 rounded-2xl transition-all cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-400 border border-purple-100 flex items-center justify-center mx-auto shadow-xs">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <p className="text-base font-bold text-purple-950">
                Tu carrito actual está vacío
              </p>
              <p className="text-xs text-purple-900/60 max-w-xs mx-auto leading-relaxed">
                Selecciona uno o varios cursos para guardarlos en tu lista o pagarlos juntos al instante.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-purple-50 border border-purple-100/90 rounded-3xl overflow-hidden bg-white shadow-xs">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 bg-white flex gap-3.5 items-center hover:bg-purple-50/40 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-purple-200 flex items-center justify-center shrink-0 shadow-xs">
                      <CourseIconBadge theme={item.visualTheme} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-purple-950 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-bold font-mono-tabular text-purple-800">
                          {formatPrice(item.priceCOP, item.priceUSD, currency)}
                        </span>
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-xs text-purple-400 hover:text-red-600 p-1 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                          aria-label={`Quitar ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Current Cart Box with Soft Rounded Edges */}
              <form
                onSubmit={handleSaveBundle}
                className="p-5 rounded-3xl bg-purple-50/60 border border-purple-100 space-y-3 shadow-xs"
              >
                <label
                  htmlFor="save-cart-name"
                  className="block text-xs font-bold text-purple-950"
                >
                  Guardar este carrito para comprar varios carritos
                </label>
                <div className="flex gap-2">
                  <input
                    id="save-cart-name"
                    type="text"
                    value={cartLabel}
                    onChange={(e) => setCartLabel(e.target.value)}
                    placeholder="Nombre del carrito (opcional)"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-purple-200/80 rounded-2xl text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-semibold rounded-2xl inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Guardar</span>
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Saved Carts List */}
          {savedCarts.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-purple-100">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-950 uppercase tracking-wider">
                <FolderOpen className="w-4 h-4 text-purple-700" />
                <span>Carritos Guardados ({savedCarts.length})</span>
              </div>
              <div className="space-y-3">
                {savedCarts.map((bundle) => {
                  const bundleCourses = allCourses.filter((c) =>
                    bundle.courseIds.includes(c.id)
                  );
                  const bundleCOP = bundleCourses.reduce((s, c) => s + c.priceCOP, 0);
                  const bundleUSD = bundleCourses.reduce((s, c) => s + c.priceUSD, 0);

                  return (
                    <div
                      key={bundle.id}
                      className="p-4 rounded-3xl border border-purple-100 bg-white space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-purple-950">{bundle.name}</p>
                          <p className="text-xs text-purple-900/60 font-mono-tabular">
                            {bundleCourses.length} cursos ·{' '}
                            {formatPrice(bundleCOP, bundleUSD, currency)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteSavedCart(bundle.id)}
                          className="p-1.5 text-purple-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all cursor-pointer"
                          aria-label="Eliminar carrito guardado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onLoadSavedCart(bundle.courseIds)}
                          className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100/70 border border-purple-100 text-purple-950 text-xs font-semibold rounded-2xl transition-all cursor-pointer active:scale-95"
                        >
                          Cargar
                        </button>
                        <button
                          type="button"
                          onClick={() => onPaySavedCart(bundle.courseIds)}
                          className="flex-1 py-2 px-3 bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold rounded-2xl shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          Pagar este
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-purple-50/50 border-t border-purple-100 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-purple-950 text-sm">Total a pagar</span>
              <span className="text-2xl font-bold font-mono-tabular text-purple-950">
                {formatPrice(subtotalCOP, subtotalUSD, currency)}
              </span>
            </div>

            <button
              onClick={onProceedToPay}
              className="w-full py-4 px-5 bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-purple-700/25 transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
            >
              <span>Pagar Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
