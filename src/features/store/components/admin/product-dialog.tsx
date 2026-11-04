'use client'

import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { FormDialog } from '@/components/common/dialogs/form-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNotifications } from '@/components/ui/notifications'
import { useGetProductTypes } from '../../api/get-product-types'
import { useGetArtwork } from '@/features/service/artspace/get-artwork'
import {
  productInputSchema,
  toVariantPayload,
  useCreateProduct,
  useUpdateProduct,
  type ProductFormValues,
} from '../../api/admin-products'
import type { Product, ProductInput, StorePreviewConfig } from '@/types'

const newVariant = (index: number) => ({
  color_name: '',
  color_hex: '#1A1B22',
  size: 'One size',
  sku: '',
  price_modifier: '0',
  stock: null as number | null,
  is_active: true,
  sort_order: index,
})

const blankValues = (): ProductFormValues => ({
  title: '',
  description: '',
  product_type: '',
  artwork: '',
  price_override: '',
  royalty_percent: '',
  is_published: false,
  print_x: '0.3',
  print_y: '0.25',
  print_w: '0.4',
  print_h: '0.45',
  variants: [newVariant(0)],
})

// Mirrors the renderer fallback in components/product-preview.tsx, so a product
// seeded before anyone tuned its print area still previews where the art lands.
const readPrintArea = (config?: StorePreviewConfig | null) => ({
  print_x: String(config?.print_area?.x ?? 0.3),
  print_y: String(config?.print_area?.y ?? 0.25),
  print_w: String(config?.print_area?.w ?? 0.4),
  print_h: String(config?.print_area?.h ?? 0.45),
})

const toFormValues = (product: Product): ProductFormValues => ({
  title: product.title,
  description: product.description ?? '',
  product_type: product.product_type.id,
  artwork: product.artwork,
  price_override: product.price_override ? String(product.price_override) : '',
  royalty_percent: product.royalty_percent ? String(product.royalty_percent) : '',
  is_published: product.is_published,
  ...readPrintArea(product.preview_config),
  variants: (product.variants ?? []).map((variant, index) => ({
    id: variant.id,
    color_name: variant.color_name,
    color_hex: variant.color_hex,
    size: variant.size,
    sku: variant.sku,
    price_modifier: String(variant.price_modifier),
    stock: variant.stock,
    is_active: variant.is_active,
    sort_order: variant.sort_order ?? index,
  })),
})

const apiErrorDetail = (error: unknown) => {
  const data = (error as { data?: Record<string, unknown> })?.data
  return (
    (data?.detail as string) ||
    (data?.is_published as string[] | undefined)?.[0] ||
    (data?.artwork as string[] | undefined)?.[0] ||
    (data?.title as string[] | undefined)?.[0] ||
    'The item could not be saved.'
  )
}

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  editValue?: Product | null
}

/**
 * The manual match the feature starts from: an admin names the item, pastes an
 * artwork id, and the form reads that artwork back — title, artist and whether
 * the artist has licensed merch rights — before anything is saved.
 */
export const ProductDialog = ({ isOpen, onClose, editValue }: ProductDialogProps) => {
  const { addNotification } = useNotifications()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const { data: typePage } = useGetProductTypes()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productInputSchema),
    defaultValues: blankValues(),
  })

  const variants = useFieldArray({ control: form.control, name: 'variants' })
  const selectedArtworkId = form.watch('artwork')
  const selectedTypeId = form.watch('product_type')

  // Only fetch once the id looks complete, or every keystroke of a UUID fires a 404.
  const { data: artworkResponse } = useGetArtwork({
    artworkId: selectedArtworkId,
    queryConfig: { enabled: Boolean(isOpen && selectedArtworkId.length >= 30) },
  })
  const resolvedArtwork = artworkResponse ?? null

  useEffect(() => {
    if (!isOpen) return
    form.reset(editValue ? toFormValues(editValue) : blankValues())
    // Only the identity of the record being edited should reseed the form;
    // re-running on the type fetch would clobber in-progress input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editValue?.id])

  const onSubmit = async (values: ProductFormValues) => {
    const preview_config: StorePreviewConfig = {
      ...(editValue?.preview_config ?? {}),
      print_area: {
        x: Number(values.print_x),
        y: Number(values.print_y),
        w: Number(values.print_w),
        h: Number(values.print_h),
      },
    }
    const payload: ProductInput = {
      title: values.title,
      description: values.description,
      product_type: values.product_type,
      artwork: values.artwork,
      price_override: values.price_override.trim() || null,
      royalty_percent: values.royalty_percent.trim() || null,
      hero_asset: editValue?.hero_asset ?? null,
      is_published: values.is_published,
      preview_config,
      variants: toVariantPayload(values.variants),
    }

    try {
      if (editValue) {
        await updateProduct.mutateAsync({ id: editValue.id, data: payload })
        addNotification({ type: 'success', title: 'Item updated' })
      } else {
        await createProduct.mutateAsync(payload)
        addNotification({ type: 'success', title: 'Item created' })
      }
      onClose()
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Could not save the item',
        message: apiErrorDetail(error),
      })
    }
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={editValue ? 'Edit item' : 'New item'}
      description="One item is one artwork printed on one product type."
      size="xl"
      formId="store-product-form"
      submitText="Save item"
      isSubmitting={createProduct.isPending || updateProduct.isPending}
    >
      <Form {...form}>
        <form id="store-product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Rice Fields - Classic T-Shirt" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="product_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a shape" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(typePage?.results ?? []).map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} - {String(type.base_price)} {type.currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {selectedTypeId ? null : (
                    <p className="text-[11px] text-muted-foreground">
                      The shape decides base price, currency and the default print area.
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artwork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artwork id</FormLabel>
                  <FormControl>
                    <Input placeholder="Artwork UUID" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="p-3 rounded-lg border border-border/60 bg-muted/20 text-xs space-y-1">
            {resolvedArtwork ? (
              <>
                <p className="font-semibold text-foreground">
                  Matching to &ldquo;{resolvedArtwork.title}&rdquo;
                </p>
                <p className="text-muted-foreground">
                  by {resolvedArtwork.artist_name || 'the artist'} · {resolvedArtwork.visibility}
                </p>
                <p
                  className={
                    resolvedArtwork.mas_store_eligible
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-destructive'
                  }
                >
                  {resolvedArtwork.mas_store_eligible
                    ? 'The artist has licensed merch rights on this artwork.'
                    : 'Not licensed for MAS Store. The artist must enable merch rights before this item can be published.'}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Paste an artwork id to confirm which painting this prints.
              </p>
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price_override"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price override</FormLabel>
                  <FormControl>
                    <Input inputMode="decimal" placeholder="blank = base price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="royalty_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Royalty %</FormLabel>
                  <FormControl>
                    <Input inputMode="decimal" placeholder="blank = type default" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">Print area (0 to 1 of the mockup)</legend>
            <div className="grid grid-cols-4 gap-3">
              {(['print_x', 'print_y', 'print_w', 'print_h'] as const).map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase">{key.slice(6)}</FormLabel>
                      <FormControl>
                        <Input inputMode="decimal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Options</legend>
            {variants.fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 sm:grid-cols-12 gap-2 items-end">
                <div className="sm:col-span-3">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.color_name`}
                    render={({ field: colorField }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Colour</FormLabel>
                        <FormControl>
                          <Input placeholder="Black" autoComplete="off" {...colorField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.color_hex`}
                    render={({ field: hexField }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Hex</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span
                              className="size-6 shrink-0 rounded border border-border/60"
                              style={{ backgroundColor: hexField.value }}
                            />
                            <Input placeholder="#1A1B22" autoComplete="off" {...hexField} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.size`}
                    render={({ field: sizeField }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Size</FormLabel>
                        <FormControl>
                          <Input placeholder="M" autoComplete="off" {...sizeField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.sku`}
                    render={({ field: skuField }) => (
                      <FormItem>
                        <FormLabel className="text-xs">SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="TEE-BLK-M" autoComplete="off" {...skuField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.price_modifier`}
                    render={({ field: modifierField }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Price plus/minus</FormLabel>
                        <FormControl>
                          <Input inputMode="decimal" {...modifierField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end pb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => variants.remove(index)}
                    disabled={variants.fields.length === 1}
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => variants.append(newVariant(variants.fields.length))}
            >
              <Plus className="size-4" /> Add option
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Colour and size together are unique on one item, and a SKU is required per option.
            </p>
          </fieldset>

          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0 pt-1">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">Published to the storefront</FormLabel>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormDialog>
  )
}
