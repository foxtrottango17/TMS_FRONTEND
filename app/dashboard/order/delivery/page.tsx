import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

export default function DeliveryOrdersPage() {
  // Sample data
  const orders = [
    {
      id: "DO-001",
      customer: "Acme Corp",
      origin: "Warehouse A",
      destination: "Customer Site 1",
      status: "In Transit",
      driver: "John Doe",
      vehicle: "TRK-001",
    },
    {
      id: "DO-002",
      customer: "XYZ Industries",
      origin: "Warehouse B",
      destination: "Customer Site 2",
      status: "Pending",
      driver: "Unassigned",
      vehicle: "Unassigned",
    },
    {
      id: "DO-003",
      customer: "Global Logistics",
      origin: "Warehouse A",
      destination: "Customer Site 3",
      status: "Delivered",
      driver: "Jane Smith",
      vehicle: "TRK-002",
    },
    {
      id: "DO-004",
      customer: "Tech Solutions",
      origin: "Warehouse C",
      destination: "Customer Site 4",
      status: "Pending",
      driver: "Unassigned",
      vehicle: "Unassigned",
    },
    {
      id: "DO-005",
      customer: "Retail Chain",
      origin: "Warehouse B",
      destination: "Customer Site 5",
      status: "In Transit",
      driver: "Mike Johnson",
      vehicle: "TRK-003",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Orders</h1>
          <p className="text-muted-foreground">Manage and track delivery orders</p>
        </div>
        <Button className="sm:self-start">
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>A list of all delivery orders</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Origin</TableHead>
                  <TableHead className="hidden lg:table-cell">Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Driver</TableHead>
                  <TableHead className="hidden lg:table-cell">Vehicle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.origin}</TableCell>
                    <TableCell className="hidden lg:table-cell">{order.destination}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : order.status === "In Transit"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.driver}</TableCell>
                    <TableCell className="hidden lg:table-cell">{order.vehicle}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
