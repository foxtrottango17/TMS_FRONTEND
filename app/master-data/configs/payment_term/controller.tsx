'use client';

import React, { useMemo } from 'react';
import { ColumnDefinition } from 'react-tabulator';
import TabulatorTable from '@/components/tabulator';
import { API_BASE_URL } from '@/lib/constants';

interface TableConfig {
  columns: ColumnDefinition[];
  url: string;
  method: 'GET' | 'POST';
  initSort: { column: string; dir: 'asc' | 'desc' }[];
}

function useTable(): TableConfig {
  const columns: ColumnDefinition[] = useMemo(() => [
    { 
      title: 'Term ID', 
      field: 'term_id', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Term Code', 
      field: 'term_code', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Description', 
      field: 'description', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Due Days', 
      field: 'due_days', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Is Prepaid', 
      field: 'is_prepaid', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Discount Percent', 
      field: 'discount_percent', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Discount Days', 
      field: 'discount_days', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Insert By', 
      field: 'insert_by', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Insert Date', 
      field: 'insert_date', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Update By', 
      field: 'update_by', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Update Date', 
      field: 'update_date', 
      headerSort: true,
      headerFilter: 'input',
    }
  ], []);

  return {
    columns,
    url: `${API_BASE_URL}/api/master-data/payment-terms/master-payment-terms/`,
    method: 'POST' as const,
    initSort: [{ column: 'term_id', dir: 'asc' as const }],
  };
}

export const DataTable = () => {
  const { columns, url, method, initSort } = useTable();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-2 border-b-0 bg-muted/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 m-0">Payment Terms</h2>
      </div>
      <div className="flex-1 min-h-0 [&_.tabulator-header]:border-t-0">
        <TabulatorTable
          id="payment-term-table"
          columns={columns}
          url={url}
          method={method}
          initSort={initSort}
          height="100%"
        />
      </div>
    </div>
  );
};

export default DataTable;