'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, Download, Filter, Search, SortAsc, SortDesc } from 'lucide-react'

export interface DataColumn<Row> {
  key: keyof Row & string
  label: string
  sortable?: boolean
  render?: (row: Row) => React.ReactNode
}

export interface DataTableProps<Row> {
  columns: DataColumn<Row>[]
  data: Row[]
  idKey: keyof Row & string
  title: string
  subtitle?: string
  onExport?: (rows: Row[]) => void
  pageSize?: number
}

export function DataTable<Row extends Record<string, unknown>>({
  columns,
  data,
  idKey,
  title,
  subtitle,
  onExport,
  pageSize = 8,
}: DataTableProps<Row>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<keyof Row & string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<Row[keyof Row & string]>>(new Set())
  const [page, setPage] = useState(1)

  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase()
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key]
        return typeof value === 'string' && value.toLowerCase().includes(lowerSearch)
      })
    )
  }, [columns, data, searchTerm])

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDir === 'asc' ? aValue - bValue : bValue - aValue
      }
      return sortDir === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [filteredData, sortDir, sortKey])

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [page, pageSize, sortedData])

  const toggleRow = (id: Row[keyof Row & string]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set())
      return
    }
    setSelectedIds(new Set(paginatedData.map((row) => row[idKey] as Row[keyof Row & string])))
  }

  const selectedRows = useMemo(
    () => data.filter((row) => selectedIds.has(row[idKey] as Row[keyof Row & string])),
    [data, idKey, selectedIds]
  )

  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <CardHeader className="px-6 pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-[240px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setPage(1)
                }}
                placeholder="Search records"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-100 px-11 text-sm text-slate-900 outline-none transition focus:border-[#0A6C3F] focus:ring-2 focus:ring-[#0A6C3F]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            {onExport ? (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onExport(selectedRows.length ? selectedRows : data)}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto px-0 pb-6 pt-4">
        {selectedIds.size > 0 ? (
          <div className="mx-6 mb-4 flex items-center justify-between rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span>{selectedIds.size} selected</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                Clear selection
              </Button>
              <Badge variant="default" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                Bulk actions available
              </Badge>
            </div>
          </div>
        ) : null}

        <table className="min-w-full border-separate border-spacing-0 text-left text-sm md:text-base">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="w-16 px-6 py-4">
                <label className="inline-flex cursor-pointer items-center gap-2 text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-300 text-[#0A6C3F] focus:ring-[#0A6C3F]"
                    aria-label="Select all rows"
                  />
                </label>
              </th>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-left leading-none transition hover:text-slate-900 dark:hover:text-white"
                    onClick={() => {
                      if (!column.sortable) return
                      if (sortKey === column.key) {
                        setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                      } else {
                        setSortKey(column.key)
                        setSortDir('asc')
                      }
                    }}
                    aria-label={column.sortable ? `Sort by ${column.label}` : undefined}
                  >
                    {column.label}
                    {column.sortable ? (
                      sortKey === column.key ? (
                        sortDir === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4 opacity-40" />
                      )
                    ) : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length ? (
              paginatedData.map((row) => (
                <motion.tr
                  key={String(row[idKey])}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  <td className="px-6 py-4">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row[idKey] as Row[keyof Row & string])}
                        onChange={() => toggleRow(row[idKey] as Row[keyof Row & string])}
                        className="h-4 w-4 rounded border-slate-300 text-[#0A6C3F] focus:ring-[#0A6C3F]"
                        aria-label={`Select row ${String(row[idKey])}`}
                      />
                    </label>
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 align-top text-slate-700 dark:text-slate-300">
                      {column.render ? column.render(row) : String(row[column.key] ?? '-')}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">No records found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Showing {paginatedData.length} of {filteredData.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>
          <span className="min-w-[4rem] text-center">{page}/{pageCount}</span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}
