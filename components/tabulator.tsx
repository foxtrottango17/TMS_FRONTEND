// 'use client'; // Keep this if it's a Next.js client component

import React, { useEffect, useRef } from 'react';
import { ReactTabulator, ColumnDefinition } from 'react-tabulator';
import { useTheme } from 'next-themes';
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
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
 * Hook to detect system dark mode preference
 */
const useSystemDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};

// Import the CSS directly (Next.js will handle the bundling)
import '@/styles/tabulator-dark-theme.css';

/**
 * Hook to toggle dark theme class
 */
const useDarkThemeCSS = (isDark: boolean) => {
  useEffect(() => {
    const element = document.documentElement;
    
    if (isDark) {
      element.classList.add('dark-theme');
    } else {
      element.classList.remove('dark-theme');
    }
    
    return () => {
      element.classList.remove('dark-theme');
    };
  }, [isDark]);
};

/**
 * A reusable React component that wraps ReactTabulator.
 * It provides common configurations for a Tabulator table,
 * allowing specific table settings to be passed via props.
 * It now leverages a pre-configured Axios instance for API calls,
 * benefiting from interceptors for authentication and token refresh.
 * It also supports automatic dark theme loading based on next-themes.
 */
export default function TabulatorTable({
  id,
  height = '500px',
  columns,
  url,
  method,
  initSort = [],
}: TabulatorTableProps) {
  // Get theme from next-themes
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
  // Create a ref to store the Tabulator instance
  const tableRef = useRef<any>(null);
  
  // Load dark theme CSS conditionally
  useDarkThemeCSS(isDarkTheme);

  // Memoize columns to prevent unnecessary re-renders of the table
  const memoizedColumns = React.useMemo(() => {
    console.log('Original columns:', columns);
    const processedColumns = columns.map((col) => {
      // If width is not explicitly set, don't include it to let Tabulator auto-calculate
      const { width, ...restCol } = col;
      const processedCol = {
        ...restCol,
        minWidth: Math.max(100, (col.title?.length || 0) * 10 || 100), // Ensure minWidth is at least 100
        // Only include width if it's explicitly set and not a boolean
        ...(width && typeof width !== 'boolean' ? { width } : {})
      };
      console.log(`Processed column ${col.field || 'unknown'}:`, processedCol);
      return processedCol;
    });
    console.log('All processed columns:', processedColumns);
    return processedColumns;
  }, [columns]);

// Update your TabulatorTable options to enable scrolling instead of hiding columns

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

    // THESE ARE THE KEY CHANGES FOR SCROLLING:
    layout: 'fitDataTable', // Changed from 'fitDataTable' to 'fitColumns'
    responsiveLayout: false, // Disable responsive layout completely - this was hiding your columns!
    // Remove responsiveLayoutCollapseStartOpen since we're disabling responsive layout
    resizableColumnFit: false,
    
    // Enable horizontal scrolling
    scrollHorizontal: true, // This enables horizontal scrolling
    columnHeaderVertAlign: 'middle',

    pagination: true,
    paginationMode: 'remote', // Pagination handled by the backend
    paginationSize: 100,
    paginationSizeSelector: [10, 25, 50, 100],
    paginationInitialPage: 1,
    paginationCounter: 'rows',

    ajaxURL: url,
    ajaxConfig: {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    },

    // ... rest of your existing configuration (ajaxRequestFunc, ajaxResponse, etc.)
    ajaxRequestFunc: (async (
      tabulatorUrl: string,
      tabulatorConfig: RequestInit,
      params: Record<string, any>
    ) => {
      console.log('Tabulator requesting:', tabulatorUrl, 'with params:', params);
      console.log('Tabulator config:', tabulatorConfig);

      try {
        let axiosResponse;
        if (method === 'GET') {
          axiosResponse = await api.get<AjaxResponse>(tabulatorUrl, { params });
        } else {
          axiosResponse = await api.post<AjaxResponse>(tabulatorUrl, params);
        }

        console.log('Axios response data:', axiosResponse.data);
        return axiosResponse.data;
      } catch (error) {
        console.error('Error in Tabulator ajaxRequestFunc (via Axios):', error);
        throw error;
      }
    }) as unknown as AjaxRequestFunction,

    dataSendParams: {
      page: 'page',
      size: 'pageSize',
      sort: 'sort',
      filter: 'filter',
    },

    ajaxResponse: ((
      url: string,
      params: Record<string, any>,
      response: any
    ) => {
      console.log('Processing API response:', response);
      
      if (response && Array.isArray(response.data)) {
        return {
          data: response.data,
          last_page: response.last_page || Math.ceil((response.total_count || response.data.length) / 100),
          total: response.total_count || response.data.length,
        };
      }
      
      return {
        data: response.result || [],
        last_page: response.last_page || 1,
        total: response.total || (Array.isArray(response.result) ? response.result.length : 0),
      };
    }) as AjaxResponseFunction,

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
        el.style.backgroundColor = isDarkTheme ? '#5a2d31' : '#f8d7da';
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
  }), [height, url, method, initSort, memoizedColumns, isDarkTheme]);

  // Handle window resize and sidebar toggle
  useEffect(() => {
    if (!tableRef.current) return;
    
    const handleResize = () => {
      const table = tableRef.current?.table;
      if (table) {
        // Force recalculate column widths on resize
        table.setHeight();
        table.redraw(true);
      }
    };
    
    // Initial setup
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [id]);

  return (
    <div 
      className={`${isDarkTheme ? 'tabulator-dark-theme' : ''} w-full overflow-hidden`}
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        padding: '0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <ReactTabulator
        ref={tableRef}
        id={id.startsWith('#') ? id.slice(1) : id} // Ensure ID is clean
        columns={memoizedColumns}
        options={{
          ...options,
          // Ensure the theme is set to false to prevent Tabulator from applying its own theme
          theme: false,
          // Add the dark theme class to the Tabulator element when in dark mode
          dataId: isDarkTheme ? 'tabulator-dark-theme' : '',
        }}
      />
    </div>
  );
}