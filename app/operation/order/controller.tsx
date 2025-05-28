'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const columns: ColumnDefinition[] = useMemo(() => [
    { 
      title: 'Order ID', 
      field: 'order_id',
      headerSort: true,
      headerFilter: 'input',
      formatter: (cell) => {
        const value = cell.getValue();
        const elem = document.createElement('a');
        elem.href = '#';
        elem.className = 'text-blue-600 hover:text-blue-800 hover:underline';
        elem.textContent = value;
        elem.onclick = (e) => {
          e.preventDefault();
          router.push(`/operation/order/${value}`);
        };
        return elem;
      },
    },
    { 
      title: 'Date', 
      field: 'date', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'No of Containers', 
      field: 'no_of_containers', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Customer ID', 
      field: 'customer_id', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Customer Name', 
      field: 'customer_name', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Contact name', 
      field: 'contact_name', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'General Notes', 
      field: 'general_notes', 
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
    url: `${API_BASE_URL}/api/transactional/order/customer-order-header/`,
    method: 'POST' as const,
    initSort: [{ column: 'order_id', dir: 'asc' as const }],
  };
}

export const DataTable = () => {
  const { columns, url, method, initSort } = useTable();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-2 border-b-0 bg-muted/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 m-0">Orders</h2>
      </div>
      <div className="flex-1 min-h-0 [&_.tabulator-header]:border-t-0">
        <TabulatorTable
          id="customer-order-table"
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