"use client";
import React, { useState, useEffect } from "react";
import { getEmployees } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertCircle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Trophy, Users, Building, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";

//dynamic trophy icon based on rank
const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return (
        <span className="w-5 h-5 flex items-center justify-center text-sm font-semibold text-gray-500">
            #{rank}
        </span>
    );
};

// Skeleton component for employee cards - for loading state
const EmployeeSkeleton = () => (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 border-gray-200">
        <div className="flex items-center gap-4">
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
        <div className="text-right">
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-12" />
        </div>
    </div>
);

function Employees({ departments }) {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [topEmployees, setTopEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [loading, setLoading] = useState(true);
    const [isChangingDepartment, setIsChangingDepartment] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEmployeeData();
    }, [selectedDepartment]);

    const fetchEmployeeData = async () => {
        try {
            // for when the user changes the department filter, to use while loading new data
            if (topEmployees.length > 0) {
                setIsChangingDepartment(true);
            } else {
                setLoading(true);
            }

            const params = {};
            // If a specific department is selected, add it to the params
            if (selectedDepartment && selectedDepartment !== "All") {
                params.department = selectedDepartment;
            }

            // Fetch employees from the API
            const response = await getEmployees(params);

            // Small delay to make transition feel smoother
            await new Promise((resolve) => setTimeout(resolve, 300));

            setTopEmployees(response.data.top_employees);
            setEmployeeCount(response.data.employee_count);
            console.log("Employees fetched!", response.data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching top employees:", err);
        } finally {
            setLoading(false);
            setIsChangingDepartment(false);
        }
    };

    //Function to change the department filter
    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
    };

    // Renders error message if there's an error
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

    // If loading and no employees are available yet, show skeletons
    if (loading && topEmployees.length === 0) {
        return (
            <div>
                <Container>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl pb-2">
                                <Users className="w-5 h-5" />
                                Employee Overview
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Filter by Department:
                                </label>
                                <Skeleton className="h-10 w-48" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Employee Count Skeleton */}
                            <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <Skeleton className="h-16 w-24 mx-auto mb-2" />
                                <Skeleton className="h-6 w-64 mx-auto" />
                            </div>

                            {/* Top Employees Skeleton */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                    <Trophy className="w-5 h-5" />
                                    Top Performers by Hours Worked
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {[...Array(10)].map((_, index) => (
                                    <EmployeeSkeleton key={index} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </div>
        );
    }

    // Render the employee overview when data loads
    return (
        <div>
            <Container>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl pb-2">
                            <Users className="w-5 h-5" />
                            Employee Overview
                        </CardTitle>

                        {/* Filter */}
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

                                {/* // Show loader icon when changing department */}
                                {isChangingDepartment && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Employee Count Section */}
                        <div className="text-center mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 transition-all duration-300">
                            <div
                                className={`text-5xl font-bold text-blue-600 mb-2 transition-all duration-300 ${
                                    isChangingDepartment
                                        ? "opacity-50"
                                        : "opacity-100"
                                }`}
                            >
                                {employeeCount}
                            </div>
                            <p
                                className={`text-gray-600 text-lg transition-all duration-300 ${
                                    isChangingDepartment
                                        ? "opacity-50"
                                        : "opacity-100"
                                }`}
                            >
                                {selectedDepartment === "All"
                                    ? "Total employees across all departments"
                                    : `Employees in ${selectedDepartment}`}
                            </p>
                        </div>

                        {/* Top Employees Section */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Trophy className="w-5 h-5" />
                                Top Employees by Hours Worked
                                {isChangingDepartment && (
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500 ml-2" />
                                )}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {isChangingDepartment
                                ? // Show skeletons while changing departments
                                  [
                                      ...Array(
                                          Math.max(10, topEmployees.length)
                                      ),
                                  ].map((_, index) => (
                                      <EmployeeSkeleton
                                          key={`skeleton-${index}`}
                                      />
                                  ))
                                : topEmployees.map((employee, index) => (
                                      <div
                                          key={employee.employee_id}
                                          className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2 ${
                                              index < 3
                                                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                                                  : "bg-gray-50 border-gray-200"
                                          }`}
                                          style={{
                                              animationDelay: `${index * 50}ms`,
                                              animationDuration: "300ms",
                                              animationFillMode: "both",
                                          }}
                                      >
                                          <div className="flex items-center gap-4">
                                              {/* Rank */}
                                              <div className="flex items-center justify-center">
                                                  {getRankIcon(index + 1)}
                                              </div>
                                              {/* Employee Info */}
                                              <div className="flex-1">
                                                  <h3 className="font-semibold text-gray-900">
                                                      {employee.name}
                                                  </h3>
                                                  <div className="flex items-center gap-2 mt-1">
                                                      <Building className="w-4 h-4 text-gray-400" />
                                                      <Badge
                                                          variant="secondary"
                                                          className={
                                                              employee.departmentColor
                                                          }
                                                      >
                                                          {employee.department}
                                                      </Badge>
                                                  </div>
                                              </div>
                                          </div>

                                          {/* Hours */}
                                          <div className="text-right">
                                              <div className="flex items-center gap-2">
                                                  <Clock className="w-4 h-4 text-gray-400" />
                                                  <span className="text-2xl font-bold text-gray-900">
                                                      {Math.floor(
                                                          employee.total_hours
                                                      )}
                                                  </span>
                                              </div>
                                              <span className="text-sm text-gray-500">
                                                  hours
                                              </span>
                                          </div>
                                      </div>
                                  ))}
                        </div>
                    </CardContent>
                </Card>
            </Container>

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
        </div>
    );
}

export default Employees;
