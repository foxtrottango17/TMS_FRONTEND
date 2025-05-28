import MenuLayout from '@/components/menu-layout';

export default function OperationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MenuLayout>
      {children}
    </MenuLayout>
  )
}
