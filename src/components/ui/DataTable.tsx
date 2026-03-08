/**
 * ============================================
 * DATA TABLE COMPONENT
 * ============================================
 * Generic reusable table with pagination, search, filters, and sorting
 */

import { useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { Search, X } from 'lucide-react';
import { Card } from './Card';

export interface Column<T> {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  render?: (row: T) => React.ReactNode;
  getValue?: (row: T) => any;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  actions?: (row: T) => React.ReactNode;
}

type Order = 'asc' | 'desc';

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No hay datos disponibles',
  actions,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<Order>('asc');

  // Handle search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter((row) => {
      return columns.some((column) => {
        if (column.filterable === false) return false;

        const value = column.getValue ? column.getValue(row) : row[column.id];
        if (value === null || value === undefined) return false;

        return String(value)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;

    const column = columns.find((col) => col.id === orderBy);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = column.getValue ? column.getValue(a) : a[orderBy];
      const bValue = column.getValue ? column.getValue(b) : b[orderBy];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, orderBy, order, columns]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(0);
  };

  return (
    <Card className="overflow-hidden">
      {/* Search Bar */}
      {searchable && (
        <div className="border-b border-border p-4">
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <Search className="mr-2 size-4 text-muted-foreground" />,
              endAdornment: searchQuery && (
                <IconButton size="small" onClick={handleClearSearch}>
                  <X className="size-4" />
                </IconButton>
              ),
            }}
            size="small"
          />
        </div>
      )}

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ width: column.width }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions && <TableCell align="right">Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.render
                        ? column.render(row)
                        : column.getValue
                        ? column.getValue(row)
                        : row[column.id]}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Card>
  );
}
