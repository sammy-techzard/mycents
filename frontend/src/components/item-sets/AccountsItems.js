import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance"; // Adjust the path as needed
import MainAccountItem from "../item/MainAccountItem";
import { useLocation } from "react-router-dom";
import SectionPreLoader from "../SectionPreloader";

const AccountsItems = ({ isPageContentChanged , resetContentChangeState}) => {
    
    const location = useLocation(); // Get the current location
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Declare fetchAccounts outside the useEffect
    const fetchAccounts = useCallback(async () => {
        setLoading(true); // Ensure the loader is shown during retry
        setError(null); // Reset error state on retry
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                return window.location = `/login?logout=true&redirect=` + location.pathname;
            }

            // Add Authorization header to axiosInstance
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

            const response = await axiosInstance.get("/api/finaccounts/");
            setAccounts(response.data.results || response.data); // Adjust based on API response structure
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return window.location = `/login?logout=true&redirect=` + location.pathname;
            } else {
                console.error("Error fetching accounts:", err);
                setError(err.message || "Failed to fetch accounts.");
                setLoading(false);
            }
        }
    }, [location]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    if (loading) {
        return <SectionPreLoader />;
    }

    if (error) {
        return <SectionPreLoader message={error} retryCallBack={fetchAccounts} />;
    }

    if(isPageContentChanged) {
        fetchAccounts();
        resetContentChangeState();
    }
    

    return (
        <div className="main-accounts-holder">
            {accounts.length > 0 ? (
                accounts.map((account) => (
                    <MainAccountItem key={account.id} account={account} />
                ))
            ) : (
                <div>No accounts available.</div>
            )}
        </div>
    );
};

export default AccountsItems;
