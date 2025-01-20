import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance"; // Adjust the path as needed
import MainBudgetItem from "../item/MianBudgetItem";
import { useLocation } from "react-router-dom";
import SectionPreLoader from "../SectionPreloader";

const BudgetItems = ({ isPageContentChanged, resetContentChangeState }) => {
    const location = useLocation();
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch budgets
    const fetchBudgets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                return (window.location = `/login?logout=true&redirect=` + location.pathname);
            }

            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

            const response = await axiosInstance.get("/api/budgets/");
            setBudgets(response.data.results || response.data); // Adjust based on API response structure
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return (window.location = `/login?logout=true&redirect=` + location.pathname);
            } else {
                console.error("Error fetching budgets:", err);
                setError(err.message || "Failed to fetch budgets.");
                setLoading(false);
            }
        }
    }, [location]);

    useEffect(() => {
        fetchBudgets();
    }, [fetchBudgets]);

    if (loading) {
        return <SectionPreLoader />;
    }

    if (error) {
        return <SectionPreLoader message={error} retryCallBack={fetchBudgets} />;
    }

    if (isPageContentChanged) {
        fetchBudgets();
        resetContentChangeState();
    }

    return (
        <div className="main-budget-holder">
            {budgets.length > 0 ? (
                budgets.map((budget) => (
                    <MainBudgetItem key={budget.id} budget={budget} />
                ))
            ) : (
                <div>No budgets available.</div>
            )}
        </div>
    );
};

export default BudgetItems;
