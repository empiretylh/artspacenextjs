'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  total: number // total items from backend
  page: number // current page
  limit: number // items per page
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  showLimitSelector?: boolean
}

export function Pagination({
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  showLimitSelector = true,
}: PaginationProps) {
  const lastPage = Math.max(1, Math.ceil(total / limit))

  const condensedLinks = useMemo(() => {
    const pages: (number | string)[] = []

    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('…')
      const start = Math.max(2, page - 2)
      const end = Math.min(lastPage - 1, page + 2)
      for (let i = start; i <= end; i++) pages.push(i)
      if (page < lastPage - 2) pages.push('…')
      pages.push(lastPage)
    }

    return pages
  }, [page, lastPage])

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Limit Selector */}
      {showLimitSelector ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page:</span>
          <Select
            value={String(limit)}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="w-[80px] h-9 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[3, 6, 10, 12, 20, 50, 100].map((option) => (
                <SelectItem key={option} value={String(option)} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div />
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {/* Prev */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-foreground"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Numbered Pages */}
        {condensedLinks.map((item, i) =>
          item === '…' ? (
            <div
              key={i}
              className="h-9 w-9 flex items-center justify-center text-muted-foreground/60 select-none"
            >
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={i}
              variant={item === page ? 'default' : 'outline'}
              className="h-9 min-w-9 px-3 p-0 rounded-lg text-xs font-semibold"
              onClick={() => onPageChange(item as number)}
            >
              {item}
            </Button>
          )
        )}

        {/* Next */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-foreground"
          disabled={page === lastPage}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
