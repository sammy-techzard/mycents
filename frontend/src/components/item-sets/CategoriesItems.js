import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance"; // Adjust the path as needed
import MainCategoryItem from "../item/MainCategoryItem"; // Create or adjust this component
import { useLocation } from "react-router-dom";
import SectionPreLoader from "../SectionPreloader";

const CategoriesItems = ({ isPageContentChanged, resetContentChangeState }) => {
    const location = useLocation(); // Get the current location
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        setLoading(true); // Show loader
        setError(null); // Reset error state
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                return (window.location = `/login?logout=true&redirect=` + location.pathname);
            }

            // Add Authorization header to axiosInstance
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

            const response = await axiosInstance.get("/api/categories/");
            setCategories(response.data.results || response.data); // Adjust based on API response structure
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
                return (window.location = `/login?logout=true&redirect=` + location.pathname);
            } else {
                console.error("Error fetching categories:", err);
                setError(err.message || "Failed to fetch categories.");
                setLoading(false);
            }
        }
    }, [location]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    if (loading) {
        return <SectionPreLoader />;
    }

    if (error) {
        return <SectionPreLoader message={error} retryCallBack={fetchCategories} />;
    }

    if (isPageContentChanged) {
        fetchCategories();
        resetContentChangeState();
    }

    return (
        <div className="main-categories-holder">
            {categories.length > 0 ? (
                categories.map((category) => (
                    <MainCategoryItem key={category.id} category={category} />
                ))
            ) : (
                <div>No categories available.</div>
            )}
        </div>
    );
};

export default CategoriesItems;
