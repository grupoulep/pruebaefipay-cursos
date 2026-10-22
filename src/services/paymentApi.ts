import { Course } from '../data/courses';

export interface PaymentOrderPayload {
  reference: string;
  amount: number;
  currency: 'COP' | 'USD';
  description: string;
  courseIds: string[];
  returnUrl: string;
}

const DEFAULT_API_ENDPOINT =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PAYMENT_API_URL)
    ? import.meta.env.VITE_PAYMENT_API_URL
    : 'https://api.efipay.co/v1/payment/generate-payment';

const DEFAULT_CHECKOUT_REDIRECT =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PAYMENT_CHECKOUT_URL)
    ? import.meta.env.VITE_PAYMENT_CHECKOUT_URL
    : 'https://api.efipay.co/v1/payment/checkout';

/**
 * Envía la orden de compra directamente a la API de pagos y redirige al usuario
 * a la URL de pago generada por el endpoint.
 */
export async function redirectToPaymentGateway(
  courses: Course[],
  currency: 'COP' | 'USD' = 'COP'
): Promise<void> {
  if (!courses || courses.length === 0) return;

  const totalAmount = courses.reduce(
    (sum, item) => sum + (currency === 'USD' ? item.priceUSD : item.priceCOP),
    0
  );

  const reference = `CREDIULEP-${Date.now()}`;
  const courseIds = courses.map((c) => c.id);
  const description = courses.map((c) => c.title).join(' | ');

  const currentOrigin =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : '';
  const returnUrl = `${currentOrigin}?status=approved&ref=${encodeURIComponent(
    reference
  )}&courses=${encodeURIComponent(courseIds.join(','))}`;

  // Guardar cursos en proceso para desbloqueo inmediato al retornar del pago
  if (typeof localStorage !== 'undefined') {
    try {
      const existingPurchased = JSON.parse(localStorage.getItem('crediulep_purchased') || '[]');
      const updatedPurchased = Array.from(new Set([...existingPurchased, ...courseIds]));
      localStorage.setItem('crediulep_purchased', JSON.stringify(updatedPurchased));
      localStorage.setItem(
        'crediulep_pending_order',
        JSON.stringify({
          reference,
          amount: totalAmount,
          currency,
          courseIds,
          timestamp: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage errors
    }
  }

  const requestBody = {
    payment: {
      reference,
      description,
      amount: totalAmount,
      currency_type: currency,
      has_tax: false,
      tax_value: 0,
    },
    advanced_options: {
      redirect_url: returnUrl,
      webhook_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/payment`,
      picture_url: '',
    },
    office: 1,
  };

  try {
    const apiToken =
      typeof import.meta !== 'undefined' && import.meta.env
        ? import.meta.env.VITE_PAYMENT_API_TOKEN || ''
        : '';
    const response = await fetch(DEFAULT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      const targetUrl = data?.url || data?.payment_url || data?.data?.url;
      if (targetUrl && typeof window !== 'undefined') {
        window.location.href = targetUrl;
        return;
      }
    }
  } catch {
    // Si la petición fetch directa es bloqueada por CORS en el navegador,
    // redirigimos directamente al endpoint de la API con los parámetros de la transacción.
  }

  const queryParams = new URLSearchParams({
    reference,
    amount: String(totalAmount),
    currency,
    description,
    redirect_url: returnUrl,
  });

  if (typeof window !== 'undefined') {
    window.location.href = `${DEFAULT_CHECKOUT_REDIRECT}?${queryParams.toString()}`;
  }
}
