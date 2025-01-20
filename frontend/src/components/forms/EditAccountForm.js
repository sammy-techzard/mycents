import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import IconPicker from "../IconPicker";
import axiosInstance from "../../api/axiosInstance"; // Import the Axios instance
import { useLocation, useNavigate } from "react-router-dom";


const EditAccountForm = ({ accountId, onSuccess, initialData = {} }) => {
    const location = useLocation(); // Get the current location
    
    const [errorMsg, setErrorMsg] = useState(null);

    const [formData, setFormData] = useState({
        name: initialData.name || "",
        icon: initialData.icon || "IoIcons.IoCard", // Default icon
        description: initialData.description || "",
    });

    const [errors, setErrors] = useState({
        name: "",
        icon: "",
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
            [name]: "", // Reset the error message for the specific field
        }));
    };

    const handleIconChange = (icon) => {
        setFormData((prevData) => ({
            ...prevData,
            icon, // Update the icon field when a new icon is selected
        }));
    };
    const navigate = useNavigate(); // Get the navigate function
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        
            // Make the API request
            const response = await axiosInstance.put(`/api/finaccounts/${accountId}/`, formData);
        
            // Handle successful response
            if (response.status === 200) {
                setErrorMsg("success");
                onSuccess(true);
                navigate("/app/accounts");
            }
        
        } catch (error) {
            if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return (window.location = `/login?logout=true&redirect=` + location.pathname); // Redirect to login
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
            setIsSubmitting(false); // Reset flag after request is complete
        }
    };

    return (
        <>
            {errorMsg && (
                <p style={{ color: errorMsg === "success" ? "blue" : "red" }}>
                    {errorMsg === "success"
                        ? "Account updated successfully!"
                        : errorMsg}
                </p>
            )}
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Group className="mb-3">
                    <Form.Label>Account Name</Form.Label>
                    <div className="native-input-tag">
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter account name"
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
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <div className="native-text-tag">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter a description (optional)"
                        />
                    </div>
                    {errors.description && (
                        <Form.Text className="text-danger">{errors.description}</Form.Text>
                    )}
                </Form.Group>
                <button className="native-submit-div-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update"}
                </button>
            </Form>
        </>
    );
};

export default EditAccountForm;
