'use client';

import OrderDetailController from './controller';

interface PageProps {
  params: { orderId: string };
}

export default function Page({ params }: PageProps) {
  return (
    <main className="w-full h-[calc(100vh-4rem)] py-0 px-0">
      <OrderDetailController orderId={params.orderId} />
    </main>
  );
}