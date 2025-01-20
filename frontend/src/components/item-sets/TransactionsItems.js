import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance"; // Adjust the path as needed
import MainTransactionItem from "../item/MainTransactionItem"; // Create or adjust this component
import { useLocation } from "react-router-dom";
import SectionPreLoader from "../SectionPreloader";

const TransactionsItems = ({ isPageContentChanged, resetContentChangeState }) => {
    const location = useLocation(); // Get the current location
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch transactions
    const fetchTransactions = useCallback(async () => {
        setLoading(true); // Show loader
        setError(null); // Reset error state
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                return (window.location = `/login?logout=true&redirect=` + location.pathname);
            }

            // Add Authorization header to axiosInstance
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

            const response = await axiosInstance.get("/api/transactions/");
            setTransactions(response.data.results || response.data); // Adjust based on API response structure
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return (window.location = `/login?logout=true&redirect=` + location.pathname);
            } else {
                console.error("Error fetching transactions:", err);
                setError(err.message || "Failed to fetch transactions.");
                setLoading(false);
            }
        }
    }, [location]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    if (loading) {
        return <SectionPreLoader />;
    }

    if (error) {
        return <SectionPreLoader message={error} retryCallBack={fetchTransactions} />;
    }

    if (isPageContentChanged) {
        fetchTransactions();
        resetContentChangeState();
    }

    return (
        <div className="transactions-table-wrapper native-card">
            <div className="transactions-table-wrapper-hl">
                <table className="table table-unstriped table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Description</th>
                            <th>Account</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <MainTransactionItem key={transaction.id} transaction={transaction} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No transactions available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsItems;
