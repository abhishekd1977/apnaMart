import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart } from '@/hooks/useCart'
import { usePlaceOrder } from '@/hooks/useOrders'

const schema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  paymentMethod: z.enum(['COD', 'ONLINE'], { required_error: 'Select a payment method' }),
})

type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { data: cart } = useCart()
  const placeOrder = usePlaceOrder()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'COD' },
  })

  function onSubmit(data: FormData) {
    const { paymentMethod, ...addressFields } = data
    placeOrder.mutate({
      shippingAddress: {
        line1: addressFields.line1,
        line2: addressFields.line2 ?? '',
        city: addressFields.city,
        state: addressFields.state,
        pincode: addressFields.pincode,
        country: 'India',
      },
      paymentMethod,
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-3">
              <div>
                <input {...register('line1')} placeholder="Address Line 1 *"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1.message}</p>}
              </div>
              <input {...register('line2')} placeholder="Address Line 2 (optional)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input {...register('city')} placeholder="City *"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <input {...register('state')} placeholder="State *"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
              </div>
              <div>
                <input {...register('pincode')} placeholder="Pincode *"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-2">
              {(['COD', 'ONLINE'] as const).map((method) => (
                <label key={method} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" value={method} {...register('paymentMethod')} className="accent-primary-500" />
                  <span className="text-gray-700">{method === 'COD' ? 'Cash on Delivery' : 'Pay Online'}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-72">
          <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            {cart?.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1">
                <span className="truncate pr-2">{item.bookTitle} × {item.quantity}</span>
                <span className="shrink-0">₹{item.subtotal}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>₹{cart?.total ?? 0}</span>
            </div>
            <button
              type="submit"
              disabled={placeOrder.isPending}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-md transition-colors"
            >
              {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
