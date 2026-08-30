import { ChevronLeft, ChevronRight } from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
}

function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav
      aria-label="Paginação"
      className={cn("flex items-center gap-2", className)}
    >
      <IconButton
        aria-label="Página anterior"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden />
      </IconButton>
      {Array.from({ length: pageCount }, (_, index) => {
        const pageNumber = index + 1
        const isActive = pageNumber === page

        return (
          <button
            key={pageNumber}
            type="button"
            aria-label={`Página ${pageNumber}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
              isActive
                ? "bg-brand text-white"
                : "border border-input bg-white text-gray-700 hover:bg-gray-200"
            )}
          >
            {pageNumber}
          </button>
        )
      })}
      <IconButton
        aria-label="Próxima página"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight aria-hidden />
      </IconButton>
    </nav>
  )
}

export { Pagination }
