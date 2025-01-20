import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import IconPicker from "../IconPicker";
import axiosInstance from "../../api/axiosInstance";
import { useLocation } from "react-router-dom";

const AddCategoryForm = ({ onSuccess, initialData = {} }) => {
    const location = useLocation();

    const [errorMsg, setErrorMsg] = useState(null);

    const [formData, setFormData] = useState({
        name: initialData.name || "",
        icon: initialData.icon || "IoIcons.IoCard",
        transaction_type: initialData.transaction_type || "income",
        description: initialData.description || "",
    });

    const [errors, setErrors] = useState({
        name: "",
        icon: "",
        transaction_type: "",
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

    const handleIconChange = (icon) => {
        setFormData((prevData) => ({
            ...prevData,
            icon,
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

            const response = await axiosInstance.post("/api/categories/", formData);

            if (response.status === 201) {
                setErrorMsg("success");
                onSuccess(true);

                setFormData({
                    name: "",
                    icon: "IoIcons.IoCard",
                    transaction_type: "income",
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
                    name: apiErrors.name ? apiErrors.name.join(", ") : "",
                    icon: apiErrors.icon ? apiErrors.icon.join(", ") : "",
                    transaction_type: apiErrors.transaction_type ? apiErrors.transaction_type.join(", ") : "",
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
                    <p style={{ color: "blue" }}>Category created successfully!</p>
                ) : (
                    errorMsg
                )}
            </p>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Group className="mb-3">
                    <Form.Label>Category Name</Form.Label>
                    <div className="native-input-tag">
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter category name"
                        />
                    </div>
                    {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Transaction Type</Form.Label>
                    <div className="native-input-tag">
                        <Form.Select
                            name="transaction_type"
                            value={formData.transaction_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            {/* <option value="transfer">Transfer</option> */}
                        </Form.Select>
                    </div>
                    {errors.transaction_type && (
                        <Form.Text className="text-danger">{errors.transaction_type}</Form.Text>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Icon - Tap to change</Form.Label>
                    <div>
                        <IconPicker value={formData.icon} onChange={handleIconChange} />
                    </div>
                    {errors.icon && <Form.Text className="text-danger">{errors.icon}</Form.Text>}
                </Form.Group>
                <button className="native-submit-div-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </Form>
        </>
    );
};

export default AddCategoryForm;
