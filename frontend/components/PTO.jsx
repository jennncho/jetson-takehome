"use client";
import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Clock, AlertCircle, Loader2 } from "lucide-react";
import { getPTOMetrics } from "@/lib/api";
import { Container } from "@/components/ui/container";

// Skeleton component for metric cards for loading state
const MetricCardSkeleton = ({ icon: Icon, iconColor }) => (
    <Card className="min-h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-[14px] w-32 bg-gray-200 rounded animate-pulse" />
            <Icon className={`h-4 w-4 ${iconColor} opacity-30`} />
        </CardHeader>
        <CardContent>
            <div className="h-[32px] w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-[14px] w-24 bg-gray-200 rounded animate-pulse" />
        </CardContent>
    </Card>
);

const PTOMetricsDashboard = ({ departments }) => {
    const [ptoData, setPtoData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isChangingFilters, setIsChangingFilters] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [selectedDate, setSelectedDate] = useState("");

    // Fetch PTO data function
    const fetchPTOData = async () => {
        try {
            //To make loading process smoother
            if (ptoData) {
                setIsChangingFilters(true);
            } else {
                setLoading(true);
            }

            const params = {};
            // If a department is selected, add it to the params
            if (selectedDepartment && selectedDepartment !== "All") {
                params.department = selectedDepartment;
            }
            // If a date is selected, add it to the params
            if (selectedDate) {
                params.date = selectedDate;
            }

            //fetch PTO metrics data from API
            const response = await getPTOMetrics(params);

            // Add a small delay to make the transition feel smoother
            await new Promise((resolve) => setTimeout(resolve, 300));

            setPtoData(response.data);
            console.log("PTO data fetched!", response.data);
        } catch (err) {
            console.error("Failed to fetch PTO data:", err);
            setError(err.message || "Failed to fetch PTO data");
        } finally {
            setLoading(false);
            setIsChangingFilters(false);
        }
    };

    // Fetch data when filters change (only if date is selected)
    useEffect(() => {
        if (selectedDate) {
            fetchPTOData();
        } else {
            // Reset data when no date selected
            setPtoData(null);
        }
    }, [selectedDepartment, selectedDate]);

    // Handle department change
    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };

    // Handle date change
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error}</span>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (loading) {
        return (
            <Container>
                <Card>
                    <div className="p-6 max-w-7xl mx-auto space-y-6">
                        {/* Header */}
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                PTO Metrics Dashboard
                            </h2>
                            <p className="text-muted-foreground">
                                Track paid time off usage by department and date
                            </p>
                        </div>

                        {/* Filters Skeleton */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Department:
                                </label>
                                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Date:
                                </label>
                                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Metric Cards Skeleton */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <MetricCardSkeleton
                                icon={Users}
                                iconColor="text-blue-600"
                            />
                            <MetricCardSkeleton
                                icon={Clock}
                                iconColor="text-green-600"
                            />
                        </div>
                    </div>
                </Card>
            </Container>
        );
    }

    const employeeCount = ptoData?.pto_employees_count || 0;
    const hoursTotal = ptoData?.pto_hours_taken || 0;
    const showData = selectedDate && ptoData;
    const showPlaceholder = !selectedDate;

    return (
        <Container className="py-8">
            <Card>
                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            PTO Metrics Dashboard
                        </h2>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Department:
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                    disabled={isChangingFilters}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                                >
                                    <option value="All">All Departments</option>
                                    {departments &&
                                        departments.length > 0 &&
                                        departments.map((dept) => (
                                            <option
                                                key={dept.name}
                                                value={dept.name}
                                            >
                                                {dept.name}
                                            </option>
                                        ))}
                                </select>
                                {isChangingFilters && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Date:
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                disabled={isChangingFilters}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {isChangingFilters ? (
                            // Show skeletons while changing filters
                            <>
                                <MetricCardSkeleton
                                    icon={Users}
                                    iconColor="text-blue-600"
                                />
                                <MetricCardSkeleton
                                    icon={Clock}
                                    iconColor="text-green-600"
                                />
                            </>
                        ) : (
                            // Show data or placeholder
                            <>
                                {/* Employee Count */}
                                <Card
                                    className="min-h-[140px] animate-in fade-in slide-in-from-bottom-2"
                                    style={{
                                        animationDelay: "0ms",
                                        animationDuration: "300ms",
                                        animationFillMode: "both",
                                    }}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Employees on PTO
                                        </CardTitle>
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className={`text-2xl font-bold ${
                                                showPlaceholder
                                                    ? "text-gray-400"
                                                    : "text-blue-600"
                                            }`}
                                        >
                                            {showPlaceholder
                                                ? "0"
                                                : employeeCount}
                                            <span className="text-sm font-normal text-muted-foreground ml-1">
                                                employees
                                            </span>
                                        </div>
                                        <CardDescription className="mt-1">
                                            {showPlaceholder
                                                ? "Please select a date to view data"
                                                : `On ${selectedDate} ${
                                                      selectedDepartment !==
                                                      "All"
                                                          ? `in ${selectedDepartment}`
                                                          : ""
                                                  }`}
                                        </CardDescription>
                                    </CardContent>
                                </Card>

                                {/* Hours Total */}
                                <Card
                                    className="min-h-[140px] animate-in fade-in slide-in-from-bottom-2"
                                    style={{
                                        animationDelay: "50ms",
                                        animationDuration: "300ms",
                                        animationFillMode: "both",
                                    }}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total PTO Hours
                                        </CardTitle>
                                        <Clock className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className={`text-2xl font-bold ${
                                                showPlaceholder
                                                    ? "text-gray-400"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {showPlaceholder
                                                ? "0"
                                                : hoursTotal.toLocaleString()}
                                            <span className="text-sm font-normal text-muted-foreground ml-1">
                                                hours
                                            </span>
                                        </div>
                                        <CardDescription className="mt-1">
                                            {showPlaceholder
                                                ? "Please select a date to view data"
                                                : showData && employeeCount > 0
                                                ? `Average: ${(
                                                      hoursTotal / employeeCount
                                                  ).toFixed(
                                                      1
                                                  )} hours per employee`
                                                : "No PTO hours recorded"}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </Card>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slide-in-from-bottom-2 {
                    from {
                        transform: translateY(8px);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                .animate-in {
                    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }

                .fade-in {
                    animation-name: fade-in;
                }

                .slide-in-from-bottom-2 {
                    animation-name: slide-in-from-bottom-2;
                }
            `}</style>
        </Container>
    );
};

export default PTOMetricsDashboard;
