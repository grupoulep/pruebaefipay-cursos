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
      className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-slate-900" />
            <h2 id="cart-drawer-title" className="text-base font-bold text-slate-900">
              Carrito de Cursos ({cartItems.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <p className="text-base font-semibold text-slate-900">
                Tu carrito actual está vacío
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Selecciona uno o varios cursos con el ícono de carrito para guardarlos o pagarlos juntos.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 bg-white flex gap-3.5 items-center">
                    <div className="w-11 h-11 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
                      <CourseIconBadge theme={item.visualTheme} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs font-bold font-mono-tabular text-slate-700">
                          {formatPrice(item.priceCOP, item.priceUSD, currency)}
                        </span>
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-xs text-slate-400 hover:text-red-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                          aria-label={`Quitar ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Current Cart Box for buying multiple carts */}
              <form
                onSubmit={handleSaveBundle}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
              >
                <label
                  htmlFor="save-cart-name"
                  className="block text-xs font-semibold text-slate-700"
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
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
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
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase">
                <FolderOpen className="w-4 h-4 text-amber-600" />
                <span>Carritos Guardados ({savedCarts.length})</span>
              </div>
              <div className="space-y-2.5">
                {savedCarts.map((bundle) => {
                  const bundleCourses = allCourses.filter((c) =>
                    bundle.courseIds.includes(c.id)
                  );
                  const bundleCOP = bundleCourses.reduce((s, c) => s + c.priceCOP, 0);
                  const bundleUSD = bundleCourses.reduce((s, c) => s + c.priceUSD, 0);

                  return (
                    <div
                      key={bundle.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{bundle.name}</p>
                          <p className="text-xs text-slate-500 font-mono-tabular">
                            {bundleCourses.length} cursos ·{' '}
                            {formatPrice(bundleCOP, bundleUSD, currency)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onDeleteSavedCart(bundle.id)}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                          aria-label="Eliminar carrito guardado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onLoadSavedCart(bundle.courseIds)}
                          className="flex-1 py-1.5 px-2.5 bg-white border border-slate-300 hover:border-slate-900 text-slate-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                        >
                          Cargar al carrito
                        </button>
                        <button
                          type="button"
                          onClick={() => onPaySavedCart(bundle.courseIds)}
                          className="flex-1 py-1.5 px-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                        >
                          Pagar este carrito
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
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Total a pagar</span>
              <span className="text-xl font-bold font-mono-tabular text-slate-900">
                {formatPrice(subtotalCOP, subtotalUSD, currency)}
              </span>
            </div>

            <button
              onClick={onProceedToPay}
              className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
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
