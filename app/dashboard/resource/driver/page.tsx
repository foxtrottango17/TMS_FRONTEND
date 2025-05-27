import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

export default function DriversPage() {
  // Sample data
  const drivers = [
    { id: "DRV-001", name: "John Doe", license: "CDL-A", phone: "555-123-4567", status: "Active", vehicle: "TRK-001" },
    {
      id: "DRV-002",
      name: "Jane Smith",
      license: "CDL-B",
      phone: "555-234-5678",
      status: "Active",
      vehicle: "TRK-002",
    },
    {
      id: "DRV-003",
      name: "Mike Johnson",
      license: "CDL-A",
      phone: "555-345-6789",
      status: "On Leave",
      vehicle: "TRK-003",
    },
    {
      id: "DRV-004",
      name: "Sarah Williams",
      license: "CDL-A",
      phone: "555-456-7890",
      status: "Active",
      vehicle: "TRK-005",
    },
    {
      id: "DRV-005",
      name: "Robert Brown",
      license: "CDL-B",
      phone: "555-567-8901",
      status: "Inactive",
      vehicle: "Unassigned",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Management</h1>
          <p className="text-muted-foreground">Manage and monitor your fleet drivers</p>
        </div>
        <Button className="sm:self-start">
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Drivers</CardTitle>
              <CardDescription>A list of all drivers in your fleet</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search drivers..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Assigned Vehicle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.id}</TableCell>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.license}</TableCell>
                    <TableCell className="hidden md:table-cell">{driver.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          driver.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : driver.status === "On Leave"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {driver.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{driver.vehicle}</TableCell>
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
