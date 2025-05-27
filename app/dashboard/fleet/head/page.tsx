'use client';

import HeadUnitTable from './controller';

/**
 * HeadUnitPage component for displaying the fleet head units table.
 * This page renders the HeadUnitTable component which contains the Tabulator table.
 */
export default function HeadUnitPage() {
  return (
    <main className="container mx-auto py-8">
      <HeadUnitTable />
    </main>
  );
}
