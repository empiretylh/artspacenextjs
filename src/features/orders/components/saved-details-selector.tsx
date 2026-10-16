'use client'

import React, { useState } from 'react'
import type { CustomerCheckoutDetails } from '@/types'
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
import { CustomerDetailsDialog } from './customer-details-dialog'
import { useDeleteCustomerDetails } from '../api/customer-checkout-details'
import { useNotifications } from '@/components/ui/notifications'
import { CheckCircle2, Edit2, MapPin, Plus, Trash2, Home, Building2, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SavedDetailsSelectorProps {
  savedDetails: CustomerCheckoutDetails[]
  selectedId: number | null
  onSelect: (detail: CustomerCheckoutDetails | null) => void
  isLoading?: boolean
}

export const SavedDetailsSelector: React.FC<SavedDetailsSelectorProps> = ({
  savedDetails,
  selectedId,
  onSelect,
  isLoading,
}) => {
  const { addNotification } = useNotifications()
  const deleteMutation = useDeleteCustomerDetails()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CustomerCheckoutDetails | null>(null)
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<CustomerCheckoutDetails | null>(null)

  const handleOpenAdd = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (e: React.MouseEvent, item: CustomerCheckoutDetails) => {
    e.stopPropagation()
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleOpenDelete = (e: React.MouseEvent, item: CustomerCheckoutDetails) => {
    e.stopPropagation()
    setDeleteConfirmItem(item)
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmItem) return
    try {
      await deleteMutation.mutateAsync(deleteConfirmItem.id)
      addNotification({
        type: 'success',
        title: 'Address Removed',
        message: 'Saved delivery address was successfully deleted.',
      })
      if (selectedId === deleteConfirmItem.id) {
        // Select next available or null
        const remaining = savedDetails.filter((d) => d.id !== deleteConfirmItem.id)
        onSelect(remaining.length > 0 ? remaining[0] : null)
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error.response?.data?.detail || 'Could not delete delivery address.',
      })
    } finally {
      setDeleteConfirmItem(null)
    }
  }

  const getLabelIcon = (label?: string) => {
    const lower = label?.toLowerCase()
    if (lower === 'home') return <Home className="h-3 w-3" />
    if (lower === 'work') return <Building2 className="h-3 w-3" />
    return <Bookmark className="h-3 w-3" />
  }

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-5 w-40 bg-muted rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-28 rounded-xl bg-muted/40 border border-border/50" />
          <div className="h-28 rounded-xl bg-muted/40 border border-border/50" />
        </div>
      </div>
    )
  }

  if (savedDetails.length === 0) {
    return (
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-border/70 bg-muted/10">
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span>Save addresses to speed up future checkouts</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleOpenAdd}
          className="text-xs h-8 gap-1.5 font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Address</span>
        </Button>

        <CustomerDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={editingItem}
          onSuccess={(saved) => {
            onSelect(saved)
          }}
        />
      </div>
    )
  }

  const isCustomMode = selectedId === null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Saved Addresses</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onSelect(isCustomMode ? savedDetails[0] : null)}
            className="text-xs h-7 px-2 text-primary hover:text-primary/90"
          >
            {isCustomMode ? 'Use saved address' : 'Enter new address'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenAdd}
            className="text-xs h-7 px-2.5 gap-1 font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </Button>
        </div>
      </div>

      {!isCustomMode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedDetails.map((item) => {
            const isSelected = selectedId === item.id
            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={cn(
                  'relative p-3.5 rounded-xl border transition-all text-left cursor-pointer group flex flex-col justify-between gap-2',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-2xs ring-1 ring-primary/20'
                    : 'border-border/60 bg-card hover:border-border hover:bg-muted/20'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/60 text-foreground border border-border/40">
                      {getLabelIcon(item.label)}
                      <span>{item.label || 'Home'}</span>
                    </span>
                    {item.is_default && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/25">
                        Default
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(e, item)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="Edit address"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenDelete(e, item)}
                      className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Delete address"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-primary ml-0.5 shrink-0" />
                    )}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">{item.phone_number}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.shipping_address}, {item.city}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <CustomerDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingItem}
        onSuccess={(saved) => {
          onSelect(saved)
        }}
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
    </div>
  )
}
