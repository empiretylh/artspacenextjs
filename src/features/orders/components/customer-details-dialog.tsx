'use client'

import React, { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useNotifications } from '@/components/ui/notifications'
import { useGetDeliveryCharges } from '../api/get-delivery-charges'
import {
  useCreateCustomerDetails,
  useUpdateCustomerDetails,
  customerCheckoutDetailsInputSchema,
  CustomerCheckoutDetailsFormValues,
} from '../api/customer-checkout-details'
import type { CustomerCheckoutDetails, CreateCustomerCheckoutDetailsInput } from '@/types'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomerDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: CustomerCheckoutDetails | null
  onSuccess?: (savedRecord: CustomerCheckoutDetails) => void
}

const PRESET_LABELS = ['Home', 'Work', 'Other'] as const

export const CustomerDetailsDialog: React.FC<CustomerDetailsDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}) => {
  const { addNotification } = useNotifications()
  const { data: deliveryCharges, isLoading: isLoadingCharges } = useGetDeliveryCharges()
  const createMutation = useCreateCustomerDetails()
  const updateMutation = useUpdateCustomerDetails()
  const isEditing = !!initialData

  const form = useForm<CustomerCheckoutDetailsFormValues>({
    resolver: zodResolver(customerCheckoutDetailsInputSchema),
    defaultValues: {
      label: 'Home',
      name: '',
      phone_number: '',
      shipping_address: '',
      city: '',
      description: '',
      is_default: false,
    },
  })

  const [selectedPreset, setSelectedPreset] = useState<(typeof PRESET_LABELS)[number]>('Home')

  useEffect(() => {
    if (open) {
      if (initialData) {
        const exactCity =
          deliveryCharges?.find(
            (c) => c.city.trim().toLowerCase() === initialData.city.trim().toLowerCase()
          )?.city || initialData.city

        const initialLabel = initialData.label || 'Home'
        const isPreset = PRESET_LABELS.includes(initialLabel as (typeof PRESET_LABELS)[number])
        setSelectedPreset(isPreset ? (initialLabel as (typeof PRESET_LABELS)[number]) : 'Other')

        form.reset({
          label: initialLabel,
          name: initialData.name,
          phone_number: initialData.phone_number,
          shipping_address: initialData.shipping_address,
          city: exactCity,
          description: initialData.description || '',
          is_default: !!initialData.is_default,
        })
        form.setValue('city', exactCity, { shouldValidate: true })
      } else {
        setSelectedPreset('Home')
        form.reset({
          label: 'Home',
          name: '',
          phone_number: '',
          shipping_address: '',
          city: '',
          description: '',
          is_default: false,
        })
      }
    }
  }, [open, initialData, form, deliveryCharges])

  const handlePresetSelect = (preset: (typeof PRESET_LABELS)[number]) => {
    setSelectedPreset(preset)
    if (preset === 'Other') {
      form.setValue('label', '', { shouldDirty: true })
    } else {
      form.setValue('label', preset, { shouldDirty: true })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onSubmit = async (values: CustomerCheckoutDetailsFormValues) => {
    try {
      const finalLabel =
        selectedPreset === 'Other'
          ? values.label?.trim() || 'Other'
          : selectedPreset

      const payload: CreateCustomerCheckoutDetailsInput = {
        label: finalLabel,
        name: values.name,
        phone_number: values.phone_number,
        shipping_address: values.shipping_address,
        city: values.city,
        description: values.description || '',
        is_default: !!values.is_default,
      }

      let result: CustomerCheckoutDetails
      if (isEditing && initialData) {
        result = await updateMutation.mutateAsync({
          id: initialData.id,
          data: payload,
        })
        addNotification({
          type: 'success',
          title: 'Address Updated',
          message: 'Saved delivery details updated successfully.',
        })
      } else {
        result = await createMutation.mutateAsync(payload)
        addNotification({
          type: 'success',
          title: 'Address Saved',
          message: 'New delivery address added to your address book.',
        })
      }
      onSuccess?.(result)
      onOpenChange(false)
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: isEditing ? 'Failed to Update Address' : 'Failed to Save Address',
        message: error.response?.data?.detail || 'An error occurred while saving delivery details.',
      })
    }
  }

  return (
    <FormDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={isEditing ? 'Edit Delivery Details' : 'Add New Delivery Address'}
      description={
        isEditing
          ? 'Update your saved contact and shipping information below.'
          : 'Save your delivery details for faster checkout on future orders.'
      }
      icon={<MapPin className="w-4 h-4" />}
      size="lg"
      formId="customer-details-form"
      submitText={isEditing ? 'Update Address' : 'Save Address'}
      cancelText="Cancel"
      isSubmitting={isSubmitting}
    >
      <Form {...form}>
        <form
          id="customer-details-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Label Pills */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium">
              Address Label
            </FormLabel>
            <div className="flex items-center gap-2">
              {PRESET_LABELS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer',
                    selectedPreset === preset
                      ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border/60'
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
            {selectedPreset === 'Other' && (
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem className="pt-1">
                    <FormControl>
                      <Input
                        placeholder="e.g. Studio, Vacation Home"
                        className="h-10 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Recipient Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Recipient Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter recipient full name"
                    className="h-10 text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 0912345678"
                      className="h-10 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">City / Township</FormLabel>
                  <Select
                    key={`${field.value || 'empty'}-${deliveryCharges?.length || 0}`}
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    disabled={isLoadingCharges}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 text-sm w-full">
                        <SelectValue placeholder="Select city">
                          {field.value || undefined}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deliveryCharges?.map((charge) => (
                        <SelectItem key={charge.id} value={charge.city}>
                          <div className="flex items-center justify-between w-full gap-2">
                            <span>{charge.city}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              +{charge.charges} MMK
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Street Address */}
          <FormField
            control={form.control}
            name="shipping_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Street Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed address (house number, street name, ward)"
                    className="min-h-[80px] resize-none text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Delivery Instructions */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Delivery Instructions{' '}
                  <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Special delivery notes or gate/floor directions"
                    className="min-h-[64px] resize-none text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Set as Default Checkbox */}
          <FormField
            control={form.control}
            name="is_default"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border border-border/60 p-3 bg-muted/20">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-0.5 leading-none">
                  <FormLabel className="text-sm font-medium cursor-pointer">
                    Set as default address
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    This address will be automatically selected for future checkouts.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormDialog>
  )
}
