"use client";
import Employees from "../../components/Employees";
import HoursWorked from "../../components/HoursWorked";
import PTO from "../../components/PTO";
import { useState, useEffect } from "react";
import { getDepartments } from "@/lib/api";

export default function Dashboard() {
    const [departments, setDepartments] = useState([]);

    // Fetch departments when the component mounts - passed to child components
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getDepartments();
                setDepartments(data);
            } catch (error) {
                console.error("Failed to fetch departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    return (
        <div>
            <div className="text-center py-10">
                <h1 className="text-5xl font-bold text-gray-900 mb-3">
                    Happy Pizza Co. 🍕
                </h1>
                <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-px bg-orange-500"></div>
                    <p className="text-lg text-gray-600 font-medium">
                        Dashboard
                    </p>
                    <div className="w-12 h-px bg-orange-500"></div>
                </div>
            </div>
            <Employees departments={departments} />
            <HoursWorked departments={departments} />
            <PTO departments={departments} />
        </div>
    );
}
