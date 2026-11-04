'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNotifications } from '@/components/ui/notifications'
import {
  productTypeInputSchema,
  useCreateProductType,
  useUpdateProductType,
  type ProductTypeFormValues,
} from '../../api/admin-product-types'
import type { ProductType, ProductTypeInput } from '@/types'

const CATEGORIES = [
  { value: 'APPAREL', label: 'Apparel' },
  { value: 'MUG', label: 'Mug' },
  { value: 'TOTE', label: 'Tote bag' },
  { value: 'BOOK', label: 'Book' },
  { value: 'OTHER', label: 'Other' },
] as const

const emptyValues: ProductTypeFormValues = {
  name: '',
  category: 'APPAREL',
  base_price: '',
  currency: 'MMK',
  default_royalty_percent: '10',
  is_colorable: true,
  is_active: true,
  sort_order: '0',
}

const toFormValues = (type: ProductType): ProductTypeFormValues => ({
  name: type.name,
  category: type.category,
  base_price: String(type.base_price),
  currency: type.currency,
  default_royalty_percent: String(type.default_royalty_percent),
  is_colorable: type.is_colorable,
  is_active: type.is_active,
  sort_order: String(type.sort_order),
})

interface ProductTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  editValue?: ProductType | null
}

/**
 * Product types are the template every item inherits price, currency and
 * preview geometry from, so this form deliberately has no artwork field.
 */
export const ProductTypeDialog = ({ isOpen, onClose, editValue }: ProductTypeDialogProps) => {
  const { addNotification } = useNotifications()
  const createType = useCreateProductType()
  const updateType = useUpdateProductType()

  const form = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeInputSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (!isOpen) return
    form.reset(editValue ? toFormValues(editValue) : emptyValues)
  }, [isOpen, editValue, form])

  const onSubmit = async (values: ProductTypeFormValues) => {
    // preview_config is the renderer contract, not a brand setting. Admins tune
    // it per product; the type keeps whatever the seeder gave it.
    const payload: ProductTypeInput = {
      name: values.name,
      category: values.category,
      base_price: values.base_price,
      currency: values.currency,
      default_royalty_percent: values.default_royalty_percent,
      preview_config: editValue?.preview_config ?? {},
      is_colorable: values.is_colorable,
      is_active: values.is_active,
      sort_order: Number(values.sort_order),
    }
    try {
      if (editValue) {
        await updateType.mutateAsync({ id: editValue.id, data: payload })
        addNotification({ type: 'success', title: 'Product type updated' })
      } else {
        await createType.mutateAsync(payload)
        addNotification({ type: 'success', title: 'Product type created' })
      }
      onClose()
    } catch (error) {
      const detail = (error as { data?: { detail?: string } })?.data?.detail
      addNotification({
        type: 'error',
        title: 'Could not save the product type',
        message: detail,
      })
    }
  }

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={onClose}
      title={editValue ? 'Edit product type' : 'New product type'}
      description="Base price, currency and the artist royalty share that items of this type inherit."
      size="lg"
      formId="product-type-form"
      submitText="Save product type"
      isSubmitting={createType.isPending || updateType.isPending}
    >
      <Form {...form}>
        <form id="product-type-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Classic T-Shirt" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base price</FormLabel>
                  <FormControl>
                    <Input inputMode="decimal" placeholder="39000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input placeholder="MMK" maxLength={3} autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="default_royalty_percent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Royalty %</FormLabel>
                  <FormControl>
                    <Input inputMode="decimal" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort order</FormLabel>
                <FormControl>
                  <Input inputMode="numeric" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-6 pt-1">
            <FormField
              control={form.control}
              name="is_colorable"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Has a colourway to swap</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Active</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </FormDialog>
  )
}
