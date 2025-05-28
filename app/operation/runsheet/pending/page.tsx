import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, FileText, Download } from "lucide-react"

export default function PendingRunsheetPage() {
  // Sample data
  const runsheets = [
    {
      id: "RS-001",
      date: "2023-06-15",
      driver: "John Doe",
      vehicle: "TRK-001",
      orders: 5,
      status: "Pending Approval",
    },
    {
      id: "RS-002",
      date: "2023-06-15",
      driver: "Jane Smith",
      vehicle: "TRK-002",
      orders: 3,
      status: "Pending Assignment",
    },
    {
      id: "RS-003",
      date: "2023-06-16",
      driver: "Unassigned",
      vehicle: "Unassigned",
      orders: 4,
      status: "Pending Assignment",
    },
    {
      id: "RS-004",
      date: "2023-06-16",
      driver: "Mike Johnson",
      vehicle: "TRK-003",
      orders: 6,
      status: "Pending Approval",
    },
    {
      id: "RS-005",
      date: "2023-06-17",
      driver: "Sarah Williams",
      vehicle: "TRK-005",
      orders: 2,
      status: "Pending Assignment",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Runsheets</h1>
          <p className="text-muted-foreground">Manage and process pending runsheets</p>
        </div>
        <Button className="sm:self-start">
          <Plus className="mr-2 h-4 w-4" /> Create Runsheet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Pending Runsheets</CardTitle>
              <CardDescription>A list of all pending runsheets</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search runsheets..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Driver</TableHead>
                  <TableHead className="hidden lg:table-cell">Vehicle</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runsheets.map((runsheet) => (
                  <TableRow key={runsheet.id}>
                    <TableCell className="font-medium">{runsheet.id}</TableCell>
                    <TableCell>{runsheet.date}</TableCell>
                    <TableCell className="hidden md:table-cell">{runsheet.driver}</TableCell>
                    <TableCell className="hidden lg:table-cell">{runsheet.vehicle}</TableCell>
                    <TableCell>{runsheet.orders}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          runsheet.status === "Pending Approval"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {runsheet.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                        <FileText className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="mr-1 h-4 w-4" />
                        Export
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
