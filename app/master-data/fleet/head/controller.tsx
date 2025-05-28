'use client';

import React, { useMemo } from 'react';
import { ColumnDefinition } from 'react-tabulator';
import TabulatorTable from '@/components/tabulator';
import { API_BASE_URL } from '@/lib/constants';

// Using the correct type from react-tabulator

interface TableConfig {
  columns: ColumnDefinition[];
  url: string;
  method: 'GET' | 'POST';
  initSort: { column: string; dir: 'asc' | 'desc' }[];
}

function useTable(): TableConfig {
  const columns: ColumnDefinition[] = useMemo(() => [
    { 
      title: 'Head ID', 
      field: 'head_id', 
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
      title: 'License Plate', 
      field: 'license_plate', 
      headerSort: true,
      headerFilter: 'input',
    },    
    { 
      title: 'STNK Expiry', 
      field: 'stnk_expiry', 
      headerSort: true,
      headerFilter: 'input',
    },   
    { 
      title: 'Liter Full', 
      field: 'liter_full', 
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
    url: `${API_BASE_URL}/api/master-data/head/master-head/`,
    method: 'POST' as const,
    initSort: [{ column: 'head_id', dir: 'asc' as const }],
  };
}

export const DataTable = () => {
  const { columns, url, method, initSort } = useTable();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="px-4 py-2 border-b-0 bg-muted/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 m-0">Head Units</h2>
      </div>
      <div className="flex-1 min-h-0 [&_.tabulator-header]:border-t-0">
        <TabulatorTable
          id="head-table"
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