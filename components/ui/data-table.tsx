import * as React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  className?: string;
}

export function DataTable<T>({ data, columns, keyExtractor, className = '' }: DataTableProps<T>) {
  return (
    <div className={`w-full overflow-auto ${className}`}>
      {/* Desktop View */}
      <table className="hidden w-full caption-bottom text-sm md:table">
        <thead className="[&_tr]:border-b [&_tr]:border-brand-200 dark:[&_tr]:border-brand-800">
          <tr className="border-b transition-colors hover:bg-brand-50/50 data-[state=selected]:bg-brand-100 dark:hover:bg-brand-800/50 dark:data-[state=selected]:bg-brand-800">
            {columns.map((col, index) => (
              <th
                key={index}
                className={`h-12 px-4 text-left align-middle font-medium text-brand-500 dark:text-brand-400 ${
                  col.className || ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center align-middle text-brand-500 dark:text-brand-400"
              >
                No results.
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={keyExtractor(item)}
                className={`border-b border-brand-100 transition-colors hover:bg-brand-50/50 data-[state=selected]:bg-brand-100 dark:border-brand-800/50 dark:hover:bg-brand-800/50 dark:data-[state=selected]:bg-brand-800 ${
                  rowIndex % 2 === 0 ? 'bg-white dark:bg-brand-950' : 'bg-brand-50/20 dark:bg-brand-900/20'
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`p-4 align-middle ${col.className || ''}`}>
                    {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-brand-500 dark:text-brand-400">
            No results.
          </div>
        ) : (
          data.map((item) => (
            <div
              key={keyExtractor(item)}
              className="rounded-lg border border-brand-200 bg-white p-4 shadow-sm dark:border-brand-800 dark:bg-brand-950"
            >
              {columns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="flex flex-col mb-2 last:mb-0"
                >
                  <span className="text-xs font-medium text-brand-500 dark:text-brand-400">
                    {col.header}
                  </span>
                  <span className="text-sm text-brand-950 dark:text-brand-50">
                    {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
