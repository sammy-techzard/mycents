import React, { useState, useEffect } from "react";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Dropdown } from "react-bootstrap";
import * as IoIcons from "react-icons/io5"; // Adjust if more libraries are needed
import EditCategoryModel from "../models/EditCategoryModel";

const MainCategoryItem = ({ category }) => {

    const [showEditModal, setShowEditModal] = useState(false); // Modal visibility state
    const[IconComponent, setIconComponent] = useState(null);

    useEffect(() => {
        const loadIcon = async () => {
            if (!category.icon) return;

            const [trunk, iconName] = category.icon.split(".");

            let libraryPath;
            switch (trunk) {
                case "IoIcons":
                    libraryPath = "react-icons/io5";
                    break;
                case "FaIcons":
                    libraryPath = "react-icons/fa";
                    break;
                case "MdIcons":
                    libraryPath = "react-icons/md";
                    break;
                case "AiIcons":
                    libraryPath = "react-icons/ai";
                    break;
                default:
                    console.warn(`Unknown icon trunk: ${trunk}`);
                    return;
            }

            try {
                const iconModule = IoIcons; // Update this if using other libraries
                const Icon = iconModule[iconName];
                if (Icon) {
                    setIconComponent(() => Icon);
                } else {
                    console.warn(`Icon ${iconName} not found in ${libraryPath}.`);
                }
            } catch (error) {
                console.error("Error loading icon:", error);
            }
        };

        loadIcon();
    }, [category.icon]);

    const handleEditClick = () => setShowEditModal(true); // Show modal when edit is clicked
    const handleCloseModal = () => setShowEditModal(false); // Hide modal

    const handleTransactionsClick = () => {
        alert("View transactions clicked"); // Replace with actual transaction functionality
    };

    return (
        <div className="main-category-item">
            <div className="main-category-item-cont native-card">
                {/* Header Section */}
                <div className="main-category-item-header">
                    <div className="main-category-item-cont-icon">
                        <span>
                            {/* Dynamically render the icon */}
                            {IconComponent ? <IconComponent /> : <MoreVertRoundedIcon />}
                        </span>
                    </div>
                    <div className="main-category-item-cont-details">
                        <div className="main-category-item-cont-details-d">
                            <span>{category.name || "Category Name"}</span>
                            <span className="main-category-item-cont-details-list">
                                <span>{ category.transaction_type}</span>
                                <span>{category.transaction_count || "0"} transactions</span>
                            </span>
                        </div>
                        {/* Dropdown for actions */}
                        <Dropdown className="main-category-item-cont-details-dropper">
                            <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                                <span>
                                    <MoreVertRoundedIcon />
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleEditClick}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={handleTransactionsClick}>
                                    Transactions
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <EditCategoryModel
                show={showEditModal}
                handleClose={handleCloseModal}
                category={category}
            />
        </div>
    );
};

export default MainCategoryItem;
