declare module 'tabulator-tables' {
  export interface Tabulator {
    new (selector: string | HTMLElement, options?: any): Tabulator;
    setData: (data: any[]) => void;
    setPage: (page: number) => void;
    getPage: () => number;
    getPageMax: () => number;
    getPageSize: () => number;
    getData: () => any[];
    destroy: () => void;
  }

  export interface ColumnDefinition {
    title: string;
    field: string;
    width?: number | string;
    hozAlign?: 'left' | 'center' | 'right';
    formatter?: (cell: any) => string | HTMLElement;
    headerSort?: boolean;
    visible?: boolean;
  }

  const Tabulator: Tabulator;
  export default Tabulator;
}
