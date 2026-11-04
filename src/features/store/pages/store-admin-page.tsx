'use client'

import React, { useState } from 'react'
import { Plus, Pencil, Trash2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { useNotifications } from '@/components/ui/notifications'
import { useGetProducts } from '../api/get-products'
import { useGetProductTypes } from '../api/get-product-types'
import { useDeleteProduct } from '../api/admin-products'
import { useDeleteProductType } from '../api/admin-product-types'
import { ProductTypeDialog } from '../components/admin/product-type-dialog'
import { ProductDialog } from '../components/admin/product-dialog'
import type { Product, ProductType } from '@/types'

/**
 * Admin catalogue for MAS Store.
 *
 * Authorisation lives on the server (`IsAdminUser` on every store write); this
 * screen is the form, not the gate. A non-staff visitor sees empty tables and
 * 403s on save, which is the same contract the rest of the app relies on.
 */
const errorDetail = (error: unknown) => {
  const data = (error as { data?: { detail?: string } })?.data
  return data?.detail || 'Please try again.'
}

const DeletePrompt = ({
  open,
  onOpenChange,
  title,
  onConfirm,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onConfirm: () => void
  isPending: boolean
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          Orders already placed keep their frozen copies of this item, so removing it
          never rewrites anyone&apos;s purchase history.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={isPending}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

const ProductTypesTab = () => {
  const { addNotification } = useNotifications()
  const { data, isLoading, error } = useGetProductTypes()
  const deleteType = useDeleteProductType()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ProductType | null>(null)
  const [pendingDelete, setPendingDelete] = useState<ProductType | null>(null)

  const types = data?.results ?? []

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (error)
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <ShieldAlert className="size-4" />
        Product types could not be loaded. This screen is for staff accounts only.
      </div>
    )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="size-4" /> New product type
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Base price</TableHead>
              <TableHead className="text-right">Royalty %</TableHead>
              <TableHead>Colourable</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-semibold">{type.name}</TableCell>
                <TableCell className="text-muted-foreground">{type.category}</TableCell>
                <TableCell className="text-right">
                  {String(type.base_price)} {type.currency}
                </TableCell>
                <TableCell className="text-right">{String(type.default_royalty_percent)}</TableCell>
                <TableCell>{type.is_colorable ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Badge variant={type.is_active ? 'default' : 'secondary'}>
                    {type.is_active ? 'Active' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${type.name}`}
                      onClick={() => {
                        setEditing(type)
                        setDialogOpen(true)
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${type.name}`}
                      onClick={() => setPendingDelete(type)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {types.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No product types yet. Create the shape first, then build items on it.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProductTypeDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editValue={editing}
      />
      <DeletePrompt
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete ${pendingDelete?.name ?? 'product type'}?`}
        isPending={deleteType.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteType.mutate(pendingDelete.id, {
            onSuccess: () => {
              addNotification({ type: 'success', title: 'Product type deleted' })
              setPendingDelete(null)
            },
            onError: (error) =>
              addNotification({
                type: 'error',
                title: 'Could not delete the product type',
                message: errorDetail(error),
              }),
          })
        }}
      />
    </div>
  )
}

const ItemsTab = () => {
  const { addNotification } = useNotifications()
  const { data, isLoading, error } = useGetProducts({ filters: { limit: 100 } })
  const deleteItem = useDeleteProduct()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const products = data?.results ?? []

  if (isLoading) return <Skeleton className="h-40 w-full" />
  if (error)
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <ShieldAlert className="size-4" />
        Items could not be loaded. This screen is for staff accounts only.
      </div>
    )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="size-4" /> New item
        </Button>
      </div>

      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Artwork matched</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Options</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-semibold max-w-[240px] truncate">{product.title}</TableCell>
                <TableCell className="text-muted-foreground max-w-[220px] truncate">
                  {product.artwork_title}
                  <span className="block text-[11px]">by {product.artist_name || '—'}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{product.product_type?.name}</TableCell>
                <TableCell className="text-right">
                  {String(product.price)} {product.currency}
                </TableCell>
                <TableCell className="text-right">{product.variants?.length ?? 0}</TableCell>
                <TableCell>
                  <Badge variant={product.is_published ? 'default' : 'secondary'}>
                    {product.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${product.title}`}
                      onClick={() => {
                        setEditing(product)
                        setDialogOpen(true)
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${product.title}`}
                      onClick={() => setPendingDelete(product)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nothing in the catalogue yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProductDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editValue={editing}
      />
      <DeletePrompt
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete ${pendingDelete?.title ?? 'item'}?`}
        isPending={deleteItem.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteItem.mutate(pendingDelete.id, {
            onSuccess: () => {
              addNotification({ type: 'success', title: 'Item deleted' })
              setPendingDelete(null)
            },
            onError: (error) =>
              addNotification({
                type: 'error',
                title: 'Could not delete the item',
                message: errorDetail(error),
              }),
          })
        }}
      />
    </div>
  )
}

export const StoreAdminPage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 py-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground">
          MAS Store
        </h1>
        <p className="text-sm text-muted-foreground">
          Build each item by matching one artwork to one product type. The artist
          licenses the artwork from their own listing; publishing here is blocked
          until that flag is on.
        </p>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="types">Product types</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="pt-2">
          <ItemsTab />
        </TabsContent>
        <TabsContent value="types" className="pt-2">
          <ProductTypesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
