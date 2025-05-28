'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, Phone, FileText, Package, Warehouse } from "lucide-react";
import { ColumnDefinition } from 'react-tabulator';
import TabulatorTable from '@/components/tabulator';
import { API_BASE_URL } from '@/lib/constants';

interface OrderHeaderData {
  order_id: string;
  date: string;
  customer_name: string;
  contact_name: string;
  contact_phone: string;
  general_notes: string;
  status: string;
}

interface OrderDetailData {
  line_id: string;
  container_type: string;
  pickup_depot_address: string;
  warehouse_location: string;
  number_of_loading_doors: number;
  cargo_description: string;
  special_handling: string;
  preferred_pickup_time_range: string;
  estimated_loading_time: string;
  cutoff_date: string;
  cutoff_time: string;
  final_destination: string;
}

interface OrderDetailControllerProps {
  orderId: string;
}

const OrderDetailController: React.FC<OrderDetailControllerProps> = ({ orderId }) => {
  const router = useRouter();
  const [orderHeader, setOrderHeader] = useState<OrderHeaderData | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabulator columns configuration
  const columns: ColumnDefinition[] = useMemo(() => [
    { 
      title: 'Line ID', 
      field: 'line_id', 
      width: 100,
      headerSort: true,
      headerFilter: 'input',
      formatter: 'html',
      formatterParams: {
        target: '_self'
      }
    },
    { 
      title: 'Container Type', 
      field: 'container_type', 
      width: 150,
      headerSort: true,
      headerFilter: 'input',
      formatter: (cell) => {
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">${cell.getValue()}</span>`;
      }
    },
    { 
      title: 'Pickup Depot Address', 
      field: 'pickup_depot_address', 
      width: 250,
      headerSort: true,
      headerFilter: 'input',
      formatter: (cell) => {
        const value = cell.getValue();
        return `<div title="${value}" class="truncate">${value}</div>`;
      }
    },
    { 
      title: 'Warehouse Location', 
      field: 'warehouse_location', 
      width: 180,
      headerSort: true,
      headerFilter: 'input'
    },
    { 
      title: 'Loading Doors', 
      field: 'number_of_loading_doors', 
      width: 130,
      headerSort: true,
      headerFilter: 'number',
      hozAlign: 'center',
      formatter: (cell) => {
        return `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">${cell.getValue()}</span>`;
      }
    },
    { 
      title: 'Cargo Description', 
      field: 'cargo_description', 
      width: 250,
      headerSort: true,
      headerFilter: 'input',
      formatter: (cell) => {
        const value = cell.getValue();
        return `<div title="${value}" class="truncate">${value}</div>`;
      }
    },
    { 
      title: 'Special Handling', 
      field: 'special_handling', 
      width: 180,
      headerSort: true,
      headerFilter: 'input',
      formatter: (cell) => {
        const value = cell.getValue();
        return `<span class="text-sm font-medium text-orange-600 dark:text-orange-400">${value}</span>`;
      }
    },
    { 
      title: 'Pickup Time', 
      field: 'preferred_pickup_time_range', 
      width: 130,
      headerSort: true,
      headerFilter: 'input'
    },
    { 
      title: 'Loading Time', 
      field: 'estimated_loading_time', 
      width: 130,
      headerSort: true,
      headerFilter: 'input'
    },
    { 
      title: 'Cutoff Date', 
      field: 'cutoff_date', 
      width: 120,
      headerSort: true,
      headerFilter: 'input'
    },
    { 
      title: 'Cutoff Time', 
      field: 'cutoff_time', 
      width: 110,
      headerSort: true,
      headerFilter: 'input'
    },
    { 
      title: 'Final Destination', 
      field: 'final_destination', 
      width: 250,
      headerSort: true,
      headerFilter: 'input',
      formatter: (cell) => {
        const value = cell.getValue();
        return `<div title="${value}" class="truncate">${value}</div>`;
      }
    }
  ], []);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        
        // TODO: Uncomment when backend is ready
        // // Fetch order header
        // const headerResponse = await fetch(`${API_BASE_URL}/api/transactional/order/customer-order-header/${orderId}`);
        // if (!headerResponse.ok) {
        //   throw new Error('Failed to fetch order header');
        // }
        // const headerData = await headerResponse.json();
        // setOrderHeader(headerData);

        // // Fetch order details
        // const detailsResponse = await fetch(`${API_BASE_URL}/api/transactional/order/customer-order-details/${orderId}`);
        // if (!detailsResponse.ok) {
        //   throw new Error('Failed to fetch order details');
        // }
        // const detailsData = await detailsResponse.json();
        // setOrderDetails(detailsData);

        // Dummy data for testing UI
        const dummyHeaderData: OrderHeaderData = {
          order_id: orderId,
          date: "2024-01-15",
          customer_name: "Acme Corporation Ltd.",
          contact_name: "John Smith",
          contact_phone: "+1 (555) 123-4567",
          general_notes: "Priority shipment - handle with care. Customer requires photo confirmation upon delivery.",
          status: "Confirmed",
        };

        const dummyDetailsData: OrderDetailData[] = [
          {
            line_id: "001",
            container_type: "20ft Standard",
            pickup_depot_address: "123 Industrial Blvd, Port Terminal A, Los Angeles, CA 90731",
            warehouse_location: "Warehouse A - Bay 5",
            number_of_loading_doors: 3,
            cargo_description: "Electronics - Laptops and Computer Equipment (Fragile)",
            special_handling: "Temperature Controlled, Fragile Items",
            preferred_pickup_time_range: "08:00 - 10:00",
            estimated_loading_time: "2 hours",
            cutoff_date: "2024-01-14",
            cutoff_time: "16:00",
            final_destination: "456 Commerce St, New York, NY 10013",
          },
          {
            line_id: "002",
            container_type: "40ft High Cube",
            pickup_depot_address: "789 Logistics Way, Port Terminal B, Los Angeles, CA 90731",
            warehouse_location: "Warehouse B - Bay 12",
            number_of_loading_doors: 5,
            cargo_description: "Automotive Parts - Engine Components and Accessories",
            special_handling: "Heavy Lifting Equipment Required",
            preferred_pickup_time_range: "10:00 - 12:00",
            estimated_loading_time: "3 hours",
            cutoff_date: "2024-01-14",
            cutoff_time: "14:00",
            final_destination: "789 Industrial Park, Detroit, MI 48201",
          },
          {
            line_id: "003",
            container_type: "20ft Refrigerated",
            pickup_depot_address: "321 Cold Storage Dr, Port Terminal C, Los Angeles, CA 90731",
            warehouse_location: "Cold Storage - Section 3",
            number_of_loading_doors: 2,
            cargo_description: "Pharmaceutical Products - Temperature Sensitive Medications",
            special_handling: "Maintain 2-8°C, Chain of Custody Required",
            preferred_pickup_time_range: "06:00 - 08:00",
            estimated_loading_time: "1.5 hours",
            cutoff_date: "2024-01-14",
            cutoff_time: "18:00",
            final_destination: "555 Medical Center Dr, Chicago, IL 60611",
          },
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setOrderHeader(dummyHeaderData);
        setOrderDetails(dummyDetailsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };
  
  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!orderHeader) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Order not found</div>
      </div>
    );
  }

  return (
    <div className="p-0.5 overflow-auto h-full">
      <div className="flex flex-col gap-6 max-w-full">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground">Order ID: {orderHeader.order_id}</p>
          </div>
          <div className="ml-auto">
            <Badge className={getStatusColor(orderHeader.status)}>{orderHeader.status}</Badge>
          </div>
        </div>

        {/* Order Header Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Information
            </CardTitle>
            <CardDescription>General order details and customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                    <p className="text-lg font-semibold">{orderHeader.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p className="text-lg font-semibold">{orderHeader.customer_name}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                    <p className="text-lg font-semibold">{orderHeader.contact_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                    <p className="text-lg font-semibold">{orderHeader.contact_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* General Notes */}
            {orderHeader.general_notes && (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">General Notes</h4>
                  <p className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">{orderHeader.general_notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Details Section - Tabulator Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Container Details
            </CardTitle>
            <CardDescription>
              Detailed breakdown of all containers in this order ({orderDetails.length} containers)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96 [&_.tabulator-header]:border-t-0">
              <TabulatorTable
                id="order-detail-table"
                columns={columns}
                url={"url"}
                method={'POST'}
                initSort={[{ column: 'warehouse_id', dir: 'asc' as const }]}
                height="100%"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailController;