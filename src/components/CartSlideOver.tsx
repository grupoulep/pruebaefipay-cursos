import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Course, formatPrice } from '../data/courses';
import { CourseArtwork } from './CourseArtwork';

interface CartSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Course[];
  currency: 'COP' | 'USD';
  onToggleCurrency: (curr: 'COP' | 'USD') => void;
  onRemoveFromCart: (courseId: string) => void;
  onProceedToEfipay: () => void;
}

export const CartSlideOver: React.FC<CartSlideOverProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onToggleCurrency,
  onRemoveFromCart,
  onProceedToEfipay,
}) => {
  if (!isOpen) return null;

  const subtotalCOP = cartItems.reduce((sum, item) => sum + item.priceCOP, 0);
  const subtotalUSD = cartItems.reduce((sum, item) => sum + item.priceUSD, 0);

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
            <ShoppingBag className="w-5 h-5 text-slate-900" />
            <h2 id="cart-drawer-title" className="text-base font-bold text-slate-900">
              Tu Carrito en CREDIULEP ({cartItems.length})
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Currency Switcher inside Cart */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">Moneda de visualización:</span>
            <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-md">
              <button
                type="button"
                onClick={() => onToggleCurrency('COP')}
                className={`px-2.5 py-1 rounded font-mono-tabular font-semibold transition-colors cursor-pointer ${
                  currency === 'COP'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                COP $
              </button>
              <button
                type="button"
                onClick={() => onToggleCurrency('USD')}
                className={`px-2.5 py-1 rounded font-mono-tabular font-semibold transition-colors cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD $
              </button>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-base font-semibold text-slate-900">
                Tu carrito está vacío en este momento
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Explora el catálogo categorizado de CREDIULEP y agrega los cursos que quieras
                estudiar desde donde estés.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 bg-white flex gap-3.5 items-start">
                  <div className="w-20 h-14 rounded overflow-hidden shrink-0 border border-slate-200">
                    <CourseArtwork theme={item.visualTheme} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 truncate">{item.category}</p>
                    <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold font-mono-tabular text-slate-900">
                        {formatPrice(item.priceCOP, item.priceUSD, currency)}
                      </span>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="text-xs text-slate-400 hover:text-red-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        aria-label={`Quitar ${item.title} del carrito`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Quitar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600 text-xs">
                <span>Acceso inmediato a todas las lecciones</span>
                <span className="font-mono-tabular text-emerald-700 font-medium">Incluido</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Subtotal a pagar</span>
                <span className="text-xl font-bold font-mono-tabular text-slate-900">
                  {formatPrice(subtotalCOP, subtotalUSD, currency)}
                </span>
              </div>
            </div>

            <button
              onClick={onProceedToEfipay}
              className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <span>Pagar con Pasarela Efipay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
              <span>PSE · Tarjetas · Nequi · Daviplata · QR Efipay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
