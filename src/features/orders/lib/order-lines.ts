import { getImage } from '@/lib/utils'
import { Order } from '@/types'

/**
 * One row of an order summary, normalised across the two order kinds.
 *
 * ARTWORK orders nest the artwork inside each item; MERCH orders carry
 * store_lines, whose title, artist, price and thumbnail are frozen copies taken
 * at purchase time. Neither shape needs a live product lookup, and the merch
 * lines are the only source of display data for a MERCH order — `items` is
 * always empty there, so a screen that reads `items` alone renders a blank
 * summary and the buyer pays without ever seeing what they bought.
 */
export interface OrderLine {
   key: string
   title: string
   /** Artist name only; callers add their own "by" prefix. */
   artist: string
   /** Merch colourway and size, empty for an artwork line. */
   variant: string
   image: string
   quantity: number
   unit_price: string | number
   artwork_id: string | null
}

export const isMerchOrder = (order: Order): boolean => order.order_type === 'MERCH'

const merchVariant = (line: { product_type_name: string; color_name: string; size: string }) =>
   [
      line.product_type_name,
      [line.color_name, line.size].filter(Boolean).join(' / '),
   ]
      .filter(Boolean)
      .join(' · ')

export const getOrderLines = (order: Order): OrderLine[] => {
   if (isMerchOrder(order)) {
      return (order.store_lines || []).map((line) => ({
         key: `merch-${line.id}`,
         title: line.product_title,
         artist: line.artist_name || 'Featured Artist',
         variant: merchVariant(line),
         image: getImage(line.thumbnail_url),
         quantity: line.quantity,
         unit_price: line.unit_price,
         artwork_id: line.artwork_id_snapshot,
      }))
   }

   return (order.items || []).map((item) => {
      const artwork = item.artwork
      const profile = artwork?.artist_profile
      return {
         key: `artwork-${item.id}`,
         title: artwork?.title || 'Artwork',
         artist: profile
            ? `${profile.first_name} ${profile.last_name}`
            : artwork?.artist_name || 'Featured Artist',
         variant: '',
         image: getImage(artwork?.image),
         quantity: item.quantity,
         unit_price: item.price_at_purchase || artwork?.price || 0,
         artwork_id: artwork?.id ?? null,
      }
   })
}
