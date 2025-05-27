'use client';

import HeadUnitTable from './controller';

/**
 * HeadUnitPage component for displaying the fleet head units table.
 * This page renders the HeadUnitTable component which contains the Tabulator table.
 *
 * Changes made:
 * - Removed 'container' and 'mx-auto' from the main element's className to allow the content
 * to take full width, making the table fill the page horizontally.
 * - Reduced vertical padding from 'py-8' to 'py-2' to decrease the white space.
 */
export default function HeadUnitPage() {
  return (

    <main className="w-full py-0 px-0">
      <HeadUnitTable />
    </main>
  );
}
