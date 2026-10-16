'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useGetCustomerDetailsList,
  useDeleteCustomerDetails,
  useUpdateCustomerDetails,
} from '@/features/orders/api/customer-checkout-details'
import { CustomerDetailsDialog } from '@/features/orders/components/customer-details-dialog'
import { useNotifications } from '@/components/ui/notifications'
import type { CustomerCheckoutDetails } from '@/types'
import {
  Building2,
  Edit2,
  Home,
  MapPin,
  Plus,
  Star,
  Trash2,
  Bookmark,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const SavedAddressesCard: React.FC = () => {
  const { addNotification } = useNotifications()
  const { data: addresses = [], isLoading } = useGetCustomerDetailsList()
  const deleteMutation = useDeleteCustomerDetails()
  const updateMutation = useUpdateCustomerDetails()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<CustomerCheckoutDetails | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<CustomerCheckoutDetails | null>(null)

  const handleOpenAdd = () => {
    setEditingAddress(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: CustomerCheckoutDetails) => {
    setEditingAddress(item)
    setDialogOpen(true)
  }

  const handleSetDefault = async (item: CustomerCheckoutDetails) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        data: { is_default: true },
      })
      addNotification({
        type: 'success',
        title: 'Default Address Updated',
        message: `"${item.label || 'Address'}" set as your default delivery address.`,
      })
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.detail || 'Could not update default address.',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return
    try {
      await deleteMutation.mutateAsync(deleteConfirmItem.id)
      addNotification({
        type: 'success',
        title: 'Address Removed',
        message: 'Saved delivery address was successfully removed.',
      })
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error.response?.data?.detail || 'Could not delete address.',
      })
    } finally {
      setDeleteConfirmItem(null)
    }
  }

  const getLabelIcon = (label?: string) => {
    const lower = label?.toLowerCase()
    if (lower === 'home') return <Home className="h-3.5 w-3.5" />
    if (lower === 'work') return <Building2 className="h-3.5 w-3.5" />
    return <Bookmark className="h-3.5 w-3.5" />
  }

  return (
    <>
      <Card className="border border-border/70 shadow-xs gap-0 py-0 overflow-hidden">
        <CardHeader className="p-5 sm:p-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold font-display">
              Saved Delivery Addresses
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-0.5">
              Manage your saved shipping contacts and default address for faster checkout.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 shrink-0 self-start sm:self-auto font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add Address</span>
          </Button>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
              <div className="h-36 rounded-xl bg-muted/40 border border-border/60" />
              <div className="h-36 rounded-xl bg-muted/40 border border-border/60" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border/70 rounded-xl bg-muted/10">
              <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">No saved addresses yet</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Add your home or office address now to breeze through your next artwork checkout.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenAdd}
                className="mt-4 gap-1.5 font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Address</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={cn(
                    'relative p-4 rounded-xl border flex flex-col justify-between gap-3 transition-colors',
                    address.is_default
                      ? 'border-primary/40 bg-primary/[0.02] shadow-2xs'
                      : 'border-border/60 bg-card hover:border-border hover:bg-muted/10'
                  )}
                >
                  <div className="space-y-2">
                    {/* Header: Label + Default badge + Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted/60 text-foreground border border-border/40">
                          {getLabelIcon(address.label)}
                          <span>{address.label || 'Home'}</span>
                        </span>
                        {address.is_default && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 h-5 bg-primary/10 text-primary border-primary/25 font-medium"
                          >
                            Default Address
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEdit(address)}
                          title="Edit address"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteConfirmItem(address)}
                          title="Delete address"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{address.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{address.phone_number}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {address.shipping_address}, {address.city}
                      </p>
                      {address.description && (
                        <p className="text-[11px] text-muted-foreground/80 italic pt-0.5">
                          Note: {address.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer: Set as default button */}
                  {!address.is_default && (
                    <div className="pt-2 border-t border-border/40 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(address)}
                        disabled={updateMutation.isPending}
                        className="text-xs h-7 px-2 text-muted-foreground hover:text-primary gap-1 font-medium"
                      >
                        <Star className="h-3 w-3" />
                        <span>Set as default</span>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <CustomerDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingAddress}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deleteConfirmItem}
        onOpenChange={(open) => !open && setDeleteConfirmItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">
              Delete Saved Address?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &quot;{deleteConfirmItem?.label || 'this address'}&quot; from your saved delivery addresses? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Address
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
