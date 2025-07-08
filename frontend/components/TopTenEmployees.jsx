"use client";
import React, { useState, useEffect, useMemo } from "react";
import { getTopTenEmployees, getDepartments } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, Users, Building } from "lucide-react";
import { Container } from "@/components/ui/container";

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

function TopTenEmployees() {
    const [topEmployees, setTopEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("TopTenEmployees component mounted");
        fetchTopEmployees();
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchTopEmployees();
    }, [selectedDepartment]);

    const fetchTopEmployees = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedDepartment && selectedDepartment !== "All") {
                params.department = selectedDepartment;
            }
            const response = await getTopTenEmployees(params);
            setTopEmployees(response.data.top_employees);
            console.log("Top employees fetched:", response.data.top_employees);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching top employees:", err);
        } finally {
            setLoading(false);
        }
    };

    // Departments for filtering
    const fetchDepartments = async () => {
        try {
            const response = await getDepartments();

            setDepartments(response);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching departments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        // fetchTopEmployees will be called automatically due to useEffect dependency
    };

    if (loading) {
        return <div>Loading users...</div>;
    }

    return (
        <div>
            <Container>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Top Performers
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Filter by Department:
                            </label>
                            <select
                                value={selectedDepartment}
                                onChange={handleDepartmentChange}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topEmployees.map((employee, index) => (
                                <div
                                    key={employee.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                                        index < 3
                                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                                            : "bg-gray-50 border-gray-200"
                                    }`}
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
        </div>
    );
}

export default TopTenEmployees;
