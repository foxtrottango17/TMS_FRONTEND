// 'use client'; // Keep this if it's a Next.js client component

import React from 'react';
import { ReactTabulator, ColumnDefinition } from 'react-tabulator';
import 'tabulator-tables/dist/css/tabulator.min.css';
import api from '@/lib/api'; // <--- Import your configured Axios instance

// Type for AJAX response - describes the expected backend response structure
type AjaxResponse = {
  result: any[];
  last_page?: number;
  total?: number;
  [key: string]: any;
};

// Type for AJAX request function (matching Tabulator's signature)
type AjaxRequestFunction = (
  url: string,
  config: RequestInit, // Tabulator still provides this, but we'll map to Axios config
  params: Record<string, any> // Tabulator's pagination, sort, filter parameters
) => Promise<AjaxResponse>;

// Type for AJAX response function (matching Tabulator's signature)
type AjaxResponseFunction = (
  url: string,
  params: Record<string, any>,
  response: any // This will be the Axios response.data
) => { data: any[]; last_page: number; total: number; }; // Tabulator expects this structure for remote pagination

// Props definition for the reusable TabulatorTable component
type TabulatorTableProps = {
  id: string;
  height?: string;
  columns: ColumnDefinition[];
  url: string; // This will be the relative path to your API endpoint
  method: 'GET' | 'POST';
  initSort?: { column: string; dir: 'asc' | 'desc' }[];
};

/**
 * A reusable React component that wraps ReactTabulator.
 * It provides common configurations for a Tabulator table,
 * allowing specific table settings to be passed via props.
 * It now leverages a pre-configured Axios instance for API calls,
 * benefiting from interceptors for authentication and token refresh.
 */
export default function TabulatorTable({
  id,
  height = '500px',
  columns,
  url,
  method,
  initSort = [],
}: TabulatorTableProps) {
  // Memoize columns to prevent unnecessary re-renders of the table
  const memoizedColumns = React.useMemo(() => {
    return columns.map((col) => {
      // If width is not explicitly set, don't include it to let Tabulator auto-calculate
      const { width, ...restCol } = col;
      return {
        ...restCol,
        minWidth: Math.max(100, (col.title?.length || 0) * 10 || 100), // Ensure minWidth is at least 100
        // Only include width if it's explicitly set and not a boolean
        ...(width && typeof width !== 'boolean' ? { width } : {})
      };
    });
  }, [columns]);

  // Define Tabulator options using useMemo for performance
  const options = React.useMemo(() => ({
    height,
    data: null, // Data will be loaded remotely by ajaxRequestFunc
    movableColumns: true,

    selectableRange: 1,
    selectableRangeColumns: true,
    selectableRangeRows: true,

    filterMode: 'remote', // Filters will be sent to the backend
    sortMode: 'remote',   // Sorts will be sent to the backend
    columnHeaderSortMulti: true,
    headerSortTristate: true,
    initialSort: initSort,

    layout: 'fitColumns',
    resizableColumnFit: true,

    pagination: true,
    paginationMode: 'remote', // Pagination handled by the backend
    paginationSize: 100,
    paginationSizeSelector: [10, 25, 50, 100],
    paginationInitialPage: 1,
    paginationCounter: 'rows',

    ajaxURL: url, // Tabulator still needs a base URL, but Axios will handle the full path
    ajaxConfig: {
      method,
      // Axios interceptors handle headers like Authorization, so no need to set them here.
      // However, 'Content-Type' is good to keep if your backend expects it for all requests.
      headers: {
        'Content-Type': 'application/json',
      },
      // Axios handles credentials by default if `withCredentials` is true on the instance,
      // or if your backend is on the same origin.
    },

    // This is where we integrate Axios
    ajaxRequestFunc: (async (
      tabulatorUrl: string, // This is the URL provided by Tabulator (e.g., '/my-data-endpoint')
      tabulatorConfig: RequestInit, // The config Tabulator built (method, headers, etc.)
      params: Record<string, any> // Tabulator's pagination, sort, filter parameters
    ) => {
      

      // // Transform Tabulator sort format to match your backend expectations
      // if (params.sort && Array.isArray(params.sort)) {
      //   console.log('Original sort params:', params.sort);
      //   // Tabulator sends sort as an array of objects: [{column: "field", dir: "asc"}]
      //   // Keep this format or transform as needed for your backend
      //   params.sort = params.sort.map((sortItem: any) => ({
      //     field: sortItem.column,
      //     dir: sortItem.dir
      //   }));
      //   console.log('Transformed sort params:', params.sort);
      // }

      console.log('Tabulator requesting:', tabulatorUrl, 'with params:', params);
      console.log('Tabulator config:', tabulatorConfig);

      try {
        let axiosResponse;
        if (method === 'GET') {
          // For GET requests, params go into `params` property of Axios config
          axiosResponse = await api.get<AjaxResponse>(tabulatorUrl, { params });
        } else {
          // For POST/other requests, params go into the request body
          axiosResponse = await api.post<AjaxResponse>(tabulatorUrl, params);
        }

        console.log('Axios response data:', axiosResponse.data);
        return axiosResponse.data; // Return the data directly, Axios interceptors handled the rest
      } catch (error) {
        console.error('Error in Tabulator ajaxRequestFunc (via Axios):', error);
        // Axios interceptors should handle 401 and redirect,
        // but if other errors occur, re-throw to allow Tabulator to show its error UI.
        throw error;
      }
    }) as unknown as AjaxRequestFunction, // Cast to the correct type for Tabulator

    dataSendParams: {
      // These map Tabulator's internal parameter names to what your backend expects
      page: 'page', // Tabulator's 'page' param will be sent as 'page' to backend
      size: 'pageSize', // Tabulator's 'size' param will be sent as 'pageSize' to backend
      sort: 'sort', // Tabulator's 'sort' array will be sent as 'sort'
      filter: 'filter', // Tabulator's 'filter' array will be sent as 'filter'
      // Add other mappings if your backend uses different names (e.g., 'pageNumber', 'limit')
    },

    // This function transforms the backend response into a format Tabulator understands
    ajaxResponse: ((
      url: string,
      params: Record<string, any>,
      response: any // This is the `axiosResponse.data` from the ajaxRequestFunc
    ) => {
      console.log('Processing API response:', response);
      
      // Check if response has 'data' field (your API format)
      if (response && Array.isArray(response.data)) {
        return {
          data: response.data, // The actual array of data rows
          last_page: response.last_page || Math.ceil((response.total_count || response.data.length) / 100), // Calculate pages
          total: response.total_count || response.data.length, // Use total_count from your API or fallback to array length
        };
      }
      
      // Fallback to the original format if 'data' field is not present
      return {
        data: response.result || [], // Fallback to result array if exists
        last_page: response.last_page || 1, // The total number of pages
        total: response.total || (Array.isArray(response.result) ? response.result.length : 0), // The total number of rows
      };
    }) as AjaxResponseFunction, // Cast to the correct type for Tabulator

    editTriggerEvent: 'dblclick',

    clipboard: true,
    clipboardCopyStyled: false,
    clipboardCopyConfig: {
      rowHeaders: [],
      columnHeaders: false,
    },
    clipboardCopyRowRange: 'range',
    clipboardPasteParser: 'range',
    clipboardPasteAction: 'range',

    rowFormatter: function (row: any) {
      const data = row.getData() as { deleted?: boolean };
      if (data.deleted) {
        const el = row.getElement();
        el.style.backgroundColor = '#f8d7da';
        el.style.textDecoration = 'line-through';
      }
    },

    columnDefaults: {
      headerSort: true,
      headerHozAlign: 'center',
      editor: 'input',
      resizable: 'header',
      minWidth: 100,
    },
  }), [height, url, method, initSort, memoizedColumns]); // Added memoizedColumns to dependencies

  return (
    <ReactTabulator
      id={id.startsWith('#') ? id.slice(1) : id} // Ensure ID is clean
      columns={memoizedColumns}
      options={options}
    />
  );
}