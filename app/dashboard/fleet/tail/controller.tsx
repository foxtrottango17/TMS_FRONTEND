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
      title: 'Tail ID', 
      field: 'tail_id', 
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
    url: `${API_BASE_URL}/api/master-data/tail/master-tail/`,
    method: 'POST' as const,
    initSort: [{ column: 'tail_id', dir: 'asc' as const }],
  };
}

export const DataTable = () => {
  const { columns, url, method, initSort } = useTable();

  return (
    <div className="p-0 h-full flex flex-col">
      <h2 className="text-lg font-semibold px-2 pt-1">Tail Units</h2>
      <div className="flex-1 min-h-0">
        <TabulatorTable
          id="tail-table"
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