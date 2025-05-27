'use client';

import React, { useMemo } from 'react';
import { ColumnDefinition } from 'react-tabulator';
import TabulatorTable from '@/components/TabulatorTable';
import { API_BASE_URL } from '@/lib/constants';

interface HeadUnitTableConfig {
  columns: ColumnDefinition[];
  url: string;
  method: 'GET' | 'POST';
  initSort: { column: string; dir: 'asc' | 'desc' }[];
}

function useHeadUnitTable(): HeadUnitTableConfig {
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
    }
   
  ], []);

  return {
    columns,
    url: `${API_BASE_URL}/api/master-data/head/master-head/`,
    method: 'POST' as const,
    initSort: [{ column: 'description', dir: 'asc' as const }],
  };
}

export const HeadUnitTable = () => {
  const { columns, url, method, initSort } = useHeadUnitTable();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Fleet Head Units</h2>
      <TabulatorTable
        id="fleet-table"
        columns={columns}
        url={url}
        method={method}
        initSort={initSort}
        height="500px"
      />
    </div>
  );
};

export default HeadUnitTable;
