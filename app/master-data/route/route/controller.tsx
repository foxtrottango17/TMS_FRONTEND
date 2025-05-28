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
      title: 'Route ID', 
      field: 'route_id', 
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
      title: 'From', 
      field: 'from_x', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'To', 
      field: 'to_x', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Distance', 
      field: 'distance', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Est Dur', 
      field: 'est_dur', 
      headerSort: true,
      headerFilter: 'input',
    },
    { 
      title: 'Toll', 
      field: 'toll', 
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
    url: `${API_BASE_URL}/api/master-data/route/master-route/`,
    method: 'POST' as const,
    initSort: [{ column: 'route_id', dir: 'asc' as const }],
  };
}

export const DataTable = () => {
  const { columns, url, method, initSort } = useTable();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-2 border-b-0 bg-muted/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 m-0">Routes</h2>
      </div>
      <div className="flex-1 min-h-0 [&_.tabulator-header]:border-t-0">
        <TabulatorTable
          id="route-table"
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