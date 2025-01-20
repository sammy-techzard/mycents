import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../api/axiosInstance";
import { useLocation } from "react-router-dom";
import SelectCategory from "../SelectCategory";
import SelectAccount from "../SelectAccount";

const AddTransactionForm = ({ onSuccess, initialData = {} }) => {
    const location = useLocation();

    const [errorMsg, setErrorMsg] = useState(null);
    const [formData, setFormData] = useState({
        category: initialData.category || "",
        account: initialData.account || "",
        transaction_type: initialData.transaction_type || "income",
        amount: initialData.amount || "",
        description: initialData.description || "",
    });
    const [errors, setErrors] = useState({
        category: "",
        account: "",
        transaction_type: "",
        amount: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            return (window.location = "/logout");
        }

        try {
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

            const response = await axiosInstance.post("/api/transactions/", formData);

            if (response.status === 201) {
                setErrorMsg("success");
                onSuccess(true);

                setFormData({
                    category: "",
                    account: "",
                    transaction_type: "income",
                    amount: "",
                    description: "",
                });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return (window.location = `/login?logout=true&redirect=` + location.pathname);
            } else if (error.response?.data) {
                const apiErrors = error.response.data;
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    category: apiErrors.category ? apiErrors.category.join(", ") : "",
                    account: apiErrors.account ? apiErrors.account.join(", ") : "",
                    transaction_type: apiErrors.transaction_type ? apiErrors.transaction_type.join(", ") : "",
                    amount: apiErrors.amount ? apiErrors.amount.join(", ") : "",
                    description: apiErrors.description ? apiErrors.description.join(", ") : "",
                }));
                setErrorMsg("Error occurred! Please try again.");
            } else {
                setErrorMsg("Error occurred! Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <p style={{ color: "red" }}>
                {errorMsg === "success" ? (
                    <p style={{ color: "blue" }}>Transaction created successfully!</p>
                ) : (
                    errorMsg
                )}
            </p>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Group className="mb-3">
                    <Form.Label>Transaction Type</Form.Label>
                    <div className="native-input-tag">
                        <Form.Select
                            name="transaction_type"
                            value={formData.transaction_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="" selected>
                                Select Type
                            </option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </Form.Select>
                    </div>
                    {errors.transaction_type && (
                        <Form.Text className="text-danger">{errors.transaction_type}</Form.Text>
                    )}
                </Form.Group>

                {/* Render SelectCategory only if transaction_type is set */}
                {formData.transaction_type && (
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <div className="native-input-tag">
                            <SelectCategory
                                name="category"
                                value={formData.category}
                                onCategorySelect={(selectedCategory) =>
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        category: selectedCategory.id,
                                    }))
                                }
                                selectedCategory={formData.category}
                                filterBy={formData.transaction_type} // Pass the transaction type to filter categories
                            />
                        </div>
                        {errors.category && <Form.Text className="text-danger">{errors.category}</Form.Text>}
                    </Form.Group>
                )}

                {/* Add the SelectAccount component with the proper handler */}
                <Form.Group className="mb-3">
                    <Form.Label>Account</Form.Label>
                    <div className="native-input-tag">
                        <SelectAccount
                            onAccountSelect={(selectedAccount) =>
                                setFormData((prevData) => ({
                                    ...prevData,
                                    account: selectedAccount.id, // Update formData with selected account ID
                                }))
                            }
                            selectedAccount={formData.account}
                        />
                    </div>
                    {errors.account && <Form.Text className="text-danger">{errors.account}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <div className="native-input-tag">
                        <Form.Control
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            placeholder="Enter amount"
                        />
                    </div>
                    {errors.amount && <Form.Text className="text-danger">{errors.amount}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <div className="native-input-tag">
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter description"
                        />
                    </div>
                    {errors.description && <Form.Text className="text-danger">{errors.description}</Form.Text>}
                </Form.Group>

                <button className="native-submit-div-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </Form>
        </>
    );
};

export default AddTransactionForm;
