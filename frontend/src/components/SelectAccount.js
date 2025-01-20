import React, { useState, useEffect, useCallback } from "react";
import Form from "react-bootstrap/Form";
import axiosInstance from "../api/axiosInstance"; // Adjust the path as needed

const SelectAccount = ({ onAccountSelect, selectedAccount, filterBy }) => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Declare fetchAccounts outside the useEffect for better handling and retries
    const fetchAccounts = useCallback(async () => {
        setLoading(true); // Ensure the loader is shown during retry
        setErrorMsg(null); // Reset error state on retry
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                return window.location = '/logout'; // Redirect to login if no token
            }

            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
            const response = await axiosInstance.get('/api/finaccounts/'); // Correct API call based on your example
            setAccounts(response.data.results || response.data); // Adjust according to the actual response structure
            setLoading(false);
        } catch (error) {
            if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return window.location = `/login?logout=true&redirect=` + window.location.pathname;
            } else {
                console.error('Error fetching accounts:', error);
                setErrorMsg(error.message || "Failed to fetch accounts.");
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    // Optionally filter accounts based on `filterBy` (e.g., account type)
    const filteredAccounts = filterBy
        ? accounts.filter((account) => account.account_type === filterBy)
        : accounts;

    const handleChange = (e) => {
        const selectedAccount = accounts.find(
            (account) => account.id === parseInt(e.target.value)
        );
        onAccountSelect(selectedAccount);
    };

    return (
        <Form.Control
            as="select"
            onChange={handleChange}
            value={selectedAccount ? selectedAccount.id : ""}
            disabled={loading}
            required={true}
            placeholder="Select an account"
        >
            {loading ? (
                <option>Loading...</option>
            ) : (
                <>
                    {/* If there are no accounts, show "No accounts created" */}
                    {filteredAccounts.length === 0 ? (
                        <option value="">No accounts created</option>
                    ) : (
                        <>
                            <option value="">-- Select an account --</option>
                            {filteredAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    
                                    {account.name} - RWF {account.current_balance}
                                </option>
                            ))}
                        </>
                    )}
                </>
            )}
            {errorMsg && <option className="text-danger">{errorMsg}</option>}
        </Form.Control>
    );
};

export default SelectAccount;
