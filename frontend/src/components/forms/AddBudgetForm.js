import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../api/axiosInstance"; // Import the Axios instance
import { useLocation } from "react-router-dom";
import SelectCategory from "../SelectCategory"; // Import the SelectCategory component

const AddBudgetForm = ({ onSuccess, initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        category: initialData.category || "",
        amount: initialData.amount || "",
        period: initialData.period || "monthly", // Added period to the formData
    });
    const [errors, setErrors] = useState({
        name: "",
        category: "",
        amount: "",
        period: "",
    });
    const [errorMsg, setErrorMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation(); // Get the current location

    // Handle category selection from SelectCategory
    const handleCategorySelect = (category) => {
        setFormData((prevData) => ({
            ...prevData,
            category: category ? category.id  : "",
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            category: "", // Reset category error when a category is selected
        }));
    };

    // Handle input changes for other form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "", // Reset the error message for the specific field
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // Prevent further submissions if already submitting

        setIsSubmitting(true);

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            return (window.location = "/logout"); // Redirect to the login page
        }

        try {
            // Attach the access token to the axios instance headers
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

            // Make the API request to submit the budget
            const response = await axiosInstance.post("/api/budgets/", formData);

            if (response.status === 201) {
                setErrorMsg("success");
                onSuccess(true);

                // Optionally, reset the form after successful submission
                setFormData({
                    name: "",
                    category: "",
                    amount: "",
                    period: "monthly", // Reset period to default
                });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return (window.location = `/login?logout=true&redirect=${location.pathname}`); // Redirect to the login page
            } else if (error.response?.data) {
                const apiErrors = error.response.data;
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: apiErrors.name ? apiErrors.name.join(", ") : "",
                    category: apiErrors.category ? apiErrors.category.join(", ") : "",
                    amount: apiErrors.amount ? apiErrors.amount.join(", ") : "",
                    period: apiErrors.period ? apiErrors.period.join(", ") : "",
                }));
                setErrorMsg("Error occurred! Please try again.");
            } else {
                setErrorMsg("Error occurred! Please try again.");
            }
        } finally {
            setIsSubmitting(false); // Reset flag after request is complete
        }
    };

    return (
        <>
            <p style={{ color: "red" }}>
                {errorMsg === "success" ? (
                    <p style={{ color: "blue" }}>Budget created successfully!</p>
                ) : (
                    errorMsg
                )}
            </p>
            <Form onSubmit={handleSubmit} autoComplete="off">
                {/* Name Input */}
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
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

                {/* Category Selection using SelectCategory Component */}
                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <div className="native-input-tag">
                        <SelectCategory
                            onCategorySelect={handleCategorySelect}
                            selectedCategory={formData.category}
                            filterBy={"expense"} // Filter by expense categories only
                        />
                    </div>
                    {errors.category && <Form.Text className="text-danger">{errors.category}</Form.Text>}
                </Form.Group>

                {/* Amount Input */}
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

                {/* Period Input */}
                <Form.Group className="mb-3">
                    <Form.Label>Period</Form.Label>
                    <div className="native-input-tag">
                        <Form.Control
                            as="select"
                            name="period"
                            value={formData.period}
                            onChange={handleChange}
                        >
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </Form.Control>
                    </div>
                    {errors.period && <Form.Text className="text-danger">{errors.period}</Form.Text>}
                </Form.Group>

                {/* Submit Button */}
                <button className="native-submit-div-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </Form>
        </>
    );
};

export default AddBudgetForm;
