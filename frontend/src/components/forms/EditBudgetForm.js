import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

const EditBudgetForm = ({ budgetId, onSuccess, initialData = {} }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: initialData.name || "",
        category: initialData.category || "",
        period: initialData.period || "monthly", // Default to monthly
        amount: initialData.amount || "",
    });

    const [errors, setErrors] = useState({
        name: "",
        category: "",
        period: "",
        amount: "",
    });

    const [errorMsg, setErrorMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Fetch categories or other necessary data if not passed in initialData
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "", // Reset error for this field
        }));
    };

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
            const response = await axiosInstance.put(`/api/budgets/${budgetId}/`, formData);

            if (response.status === 200) {
                setErrorMsg("success");
                onSuccess(true);
                navigate("/app/budget");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return (window.location = `/login?logout=true&redirect=` + location.pathname);
            } else if (error.response?.data) {
                const apiErrors = error.response.data;
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: apiErrors.name ? apiErrors.name.join(", ") : "",
                    category: apiErrors.category ? apiErrors.category.join(", ") : "",
                    period: apiErrors.period ? apiErrors.period.join(", ") : "",
                    amount: apiErrors.amount ? apiErrors.amount.join(", ") : "",
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
            {errorMsg && (
                <p style={{ color: errorMsg === "success" ? "blue" : "red" }}>
                    {errorMsg === "success" ? "Budget updated successfully!" : errorMsg}
                </p>
            )}
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Group className="mb-3">
                    <Form.Label>Budget Name</Form.Label>
                    <div className="native-input-tag">
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter budget name"
                        />
                    </div>
                    {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Period</Form.Label>
                    <div className="native-input-tag">
                        <Form.Control
                            as="select"
                            name="period"
                            value={formData.period}
                            onChange={handleChange}
                            required
                        >
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </Form.Control>
                    </div>
                    {errors.period && <Form.Text className="text-danger">{errors.period}</Form.Text>}
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
                            placeholder="Enter budget amount"
                        />
                    </div>
                    {errors.amount && <Form.Text className="text-danger">{errors.amount}</Form.Text>}
                </Form.Group>

                <button className="native-submit-div-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update"}
                </button>
            </Form>
        </>
    );
};

export default EditBudgetForm;
