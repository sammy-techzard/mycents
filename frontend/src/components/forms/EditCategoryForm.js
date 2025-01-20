import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import IconPicker from "../IconPicker";
import axiosInstance from "../../api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

const EditCategoryForm = ({ categoryId, onSuccess, initialData = {} }) => {
    const location = useLocation(); // Get the current location
    const navigate = useNavigate(); // Navigate for redirection

    const [formData, setFormData] = useState({
        name: initialData.name || "",
        icon: initialData.icon || "IoIcons.IoApps", // Default icon
        description: initialData.description || "",
    });

    const [errors, setErrors] = useState({
        name: "",
        icon: "",
        description: "",
    });

    const [errorMsg, setErrorMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleIconChange = (icon) => {
        setFormData((prevData) => ({
            ...prevData,
            icon, // Update icon field
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions

        setIsSubmitting(true);
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            return (window.location = "/logout"); // Redirect to login
        }

        try {
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
            const response = await axiosInstance.put(`/api/categories/${categoryId}/`, formData);

            if (response.status === 200) {
                setErrorMsg("success");
                onSuccess(true); // Notify parent component of success
                navigate("/app/categories");
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
            {errorMsg && (
                <p style={{ color: errorMsg === "success" ? "blue" : "red" }}>
                    {errorMsg === "success"
                        ? "Category updated successfully!"
                        : errorMsg}
                </p>
            )}
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
                    <Form.Label>Icon - Tap to change</Form.Label>
                    <div>
                        <IconPicker value={formData.icon} onChange={handleIconChange} />
                    </div>
                    {errors.icon && <Form.Text className="text-danger">{errors.icon}</Form.Text>}
                </Form.Group>
                <button className="native-submit-div-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update"}
                </button>
            </Form>
        </>
    );
};

export default EditCategoryForm;
