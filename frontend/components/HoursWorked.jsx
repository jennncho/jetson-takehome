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
import {
    Clock,
    Timer,
    AlertCircle,
    BarChart3,
    Loader2,
} from "lucide-react";
import { getHoursMetrics } from "@/lib/api";
import { Container } from "@/components/ui/container";


// Skeleton component for metric cards for loading state
const MetricCardSkeleton = ({ icon: Icon, iconColor }) => (
    <Card className="min-h-[140px] min-w-[200px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-[14px] w-32 bg-gray-200 rounded animate-pulse" />{" "}
            <Icon className={`h-4 w-4 ${iconColor} opacity-30`} />
        </CardHeader>
        <CardContent>
            <div className="h-[32px] w-20 bg-gray-200 rounded animate-pulse mb-2" />{" "}
            <div className="h-[14px] w-24 bg-gray-200 rounded animate-pulse" />{" "}
        </CardContent>
    </Card>
);

const HoursWorked = ({ departments }) => {
    const [hoursData, setHoursData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChangingDepartment, setIsChangingDepartment] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState("All");

    // Fetch data on component mount and when department changes
    useEffect(() => {
        fetchHoursData();
    }, [selectedDepartment]);

    // Fetch hours data function
    const fetchHoursData = async () => {
        try {
            // Don't show full loading on initial mount, but show changing state for department switches
            if (hoursData) {
                setIsChangingDepartment(true);
            } else {
                setLoading(true);
            }

            const params = {};
            // If a department is selected, include it in the params
            if (selectedDepartment && selectedDepartment !== "All") {
                params.department = selectedDepartment;
            }

            // Fetch hours metrics from the API
            const response = await getHoursMetrics(params);
        
            // Add a small delay to make the transition feel smoother
            await new Promise((resolve) => setTimeout(resolve, 300));

            setHoursData(response.data);
            console.log("Fetched hours data!", response.data);
        } catch (err) {
            console.error("Failed to fetch hours data:", err);
            setError(err.message || "Failed to fetch hours data");
        } finally {
            setLoading(false);
            setIsChangingDepartment(false);
        }
    };

    // Handle department change
    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };


    // If there's an error, show an alert
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

    // If loading and no data, show skeletons
    if (loading && !hoursData) {
        return (
            <Container className="py-8">
                <Card>
                    <div className="p-6 max-w-7xl mx-auto space-y-6">
                        {/* Header Skeleton */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Hours Metrics Dashboard
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Filter by Department:
                                </label>
                                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Metric Cards Skeleton */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <MetricCardSkeleton
                                icon={Clock}
                                iconColor="text-blue-600"
                            />
                            <MetricCardSkeleton
                                icon={Timer}
                                iconColor="text-green-600"
                            />
                            <MetricCardSkeleton
                                icon={AlertCircle}
                                iconColor="text-red-600"
                            />
                            <MetricCardSkeleton
                                icon={BarChart3}
                                iconColor="text-purple-600"
                            />
                        </div>
                    </div>
                </Card>
            </Container>
        );
    }


    const totalHours = hoursData
        ? hoursData.regular_hours + hoursData.overtime_hours
        : 0;

    return (
        <Container className="pt-8">
            <Card>
                <div className="p-6 max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Hours Metrics Dashboard
                            </h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Filter by Department:
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                    disabled={isChangingDepartment}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

                                {isChangingDepartment && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {hoursData && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {isChangingDepartment ? (
                                // Show skeletons while changing departments
                                <>
                                    <MetricCardSkeleton
                                        icon={Clock}
                                        iconColor="text-blue-600"
                                    />
                                    <MetricCardSkeleton
                                        icon={Timer}
                                        iconColor="text-green-600"
                                    />
                                    <MetricCardSkeleton
                                        icon={AlertCircle}
                                        iconColor="text-red-600"
                                    />
                                    <MetricCardSkeleton
                                        icon={BarChart3}
                                        iconColor="text-purple-600"
                                    />
                                </>
                            ) : (
                                // Show actual data
                                <>
                                    {/* Average Workday Length */}
                                    <Card
                                        className="animate-in fade-in slide-in-from-bottom-2"
                                        style={{
                                            animationDelay: "0ms",
                                            animationDuration: "300ms",
                                            animationFillMode: "both",
                                        }}
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Average Workday Length
                                            </CardTitle>
                                            <Clock className="h-4 w-4 text-blue-600" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-blue-600">
                                                {hoursData.average_workday_length.toFixed(
                                                    1
                                                )}
                                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                                    hours
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Regular Hours */}
                                    <Card
                                        className="animate-in fade-in slide-in-from-bottom-2"
                                        style={{
                                            animationDelay: "50ms",
                                            animationDuration: "300ms",
                                            animationFillMode: "both",
                                        }}
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Regular Hours
                                            </CardTitle>
                                            <Timer className="h-4 w-4 text-green-600" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-green-600">
                                                {hoursData.regular_hours.toLocaleString()}
                                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                                    hours
                                                </span>
                                            </div>
                                            <CardDescription className="mt-1">
                                                {(
                                                    (hoursData.regular_hours /
                                                        totalHours) *
                                                    100
                                                ).toFixed(1)}
                                                % of total hours
                                            </CardDescription>
                                        </CardContent>
                                    </Card>

                                    {/* Overtime Hours */}
                                    <Card
                                        className="animate-in fade-in slide-in-from-bottom-2"
                                        style={{
                                            animationDelay: "100ms",
                                            animationDuration: "300ms",
                                            animationFillMode: "both",
                                        }}
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Overtime Hours
                                            </CardTitle>
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-red-600">
                                                {hoursData.overtime_hours.toLocaleString()}
                                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                                    hours
                                                </span>
                                            </div>
                                            <CardDescription className="mt-1">
                                                {(
                                                    (hoursData.overtime_hours /
                                                        totalHours) *
                                                    100
                                                ).toFixed(1)}
                                                % of total hours
                                            </CardDescription>
                                        </CardContent>
                                    </Card>

                                    {/* Total Summary */}
                                    <Card
                                        className="animate-in fade-in slide-in-from-bottom-2 min-h-[140px]"
                                        style={{
                                            animationDelay: "150ms",
                                            animationDuration: "300ms",
                                            animationFillMode: "both",
                                        }}
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Hours Summary
                                            </CardTitle>
                                            <BarChart3 className="h-4 w-4 text-purple-600" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-purple-600">
                                                {totalHours.toLocaleString()}
                                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                                    hours
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>
                    )}
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

export default HoursWorked;
