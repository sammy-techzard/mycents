import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import axiosInstance from "../api/axiosInstance"; // Import the Axios instance

const SelectCategory = ({ onCategorySelect, selectedCategory, filterBy }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Fetch categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    return (window.location = '/logout'); // Redirect to login if no token
                }

                axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
                const response = await axiosInstance.get('/api/categories/');
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setErrorMsg('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []); // Empty array ensures this effect runs once when the component is mounted

    const handleChange = (e) => {
        const selectedCategory = categories.find(
            (category) => category.id === parseInt(e.target.value)
        );
        onCategorySelect(selectedCategory);
    };

    // Optionally filter categories based on `filterBy` (income or expense)
    const filteredCategories = filterBy
        ? categories.filter((category) => category.transaction_type === filterBy)
        : categories;

    return (
        <Form.Control
            as="select"
            onChange={handleChange}
            value={selectedCategory ? selectedCategory.id : ""}
            disabled={loading}
            required={true}
            placeholder="Select a category"
        >
            {loading ? (
                <option>Loading...</option>
            ) : (
                <>
                    {/* If there are no categories, show "No categories created" */}
                    {filteredCategories.length === 0 ? (
                        <option value="">No categories created</option>
                    ) : (
                        <>
                            <option value="">-- Select a category --</option>
                            {filteredCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name} ({category.transaction_type})
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

export default SelectCategory;
