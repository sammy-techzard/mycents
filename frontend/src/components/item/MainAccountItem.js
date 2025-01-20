import React, { useState, useEffect } from "react";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import * as IoIcons from "react-icons/io5";
import { Dropdown } from 'react-bootstrap';
import EditAccountModel from "../models/EditAccountModel";

const MainAccountItem = ({ account }) => {
    const [showEditModal, setShowEditModal] = useState(false); // Modal visibility state
    const [IconComponent, setIconComponent] = useState(null);

    useEffect(() => {
        const loadIcon = async () => {
            if (!account.icon) return;

            // Extract the trunk (library) and icon name
            const [trunk, iconName] = account.icon.split(".");

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
                // Add more cases as needed for other icon sets
                default:
                    console.warn(`Unknown icon trunk: ${trunk}`);
                    return;
            }

            try {
                // Dynamically import the library
                const iconModule = IoIcons; // await import(libraryPath);

                // Get the specific icon dynamically
                const Icon = iconModule[iconName];
                if (Icon) {
                    setIconComponent(() => Icon); // Set the icon as a React component
                } else {
                    console.warn(`Icon ${iconName} not found in ${libraryPath}.`);
                }
            } catch (error) {
                console.error("Error loading icon:", error);
            }
        };

        loadIcon();
    }, [account.icon]);
    const handleEditClick = () => setShowEditModal(true); // Show modal when edit is clicked
    const handleCloseModal = () => setShowEditModal(false); // Hide modal


    return (
        <div className="main-accounts-item">
            <div className="main-accounts-item-cont native-card">
                {/* Upper Section */}
                <div className="main-accounts-item-upper">
                    <div className="main-accounts-item-upper-icon">
                        <span>
                            {/* Render the dynamically loaded icon */}
                            {IconComponent ? <IconComponent /> : <CreditCardRoundedIcon />}
                        </span>
                    </div>
                    <div className="main-accounts-item-upper-detail">
                        <span>{account.name}</span>
                        <span className="main-accounts-item-upper-detail-decs">
                            {account.description || "No description available"}
                        </span>
                    </div>
                </div>

                {/* Lower Section */}
                <div className="main-accounts-item-lower">
                    <div className="main-accounts-item-lower-left">
                        <span>Total Balance</span>
                        <span className="main-accounts-item-lower-balance">
                            RWF {parseFloat(account.current_balance).toLocaleString()}
                        </span>
                    </div>
                    <Dropdown className="main-accounts-item-lower-right">
                        <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                            <span>
                                <MoreVertRoundedIcon />
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="main-accounts-item-lower-right-actions">
                            <span className="main-account-action-buttons"  onClick={handleEditClick}>Edit</span>
                            <span style={{display: "none"}} className="main-account-action-buttons">Delete</span>
                            <span className="main-account-action-buttons">Transactions</span>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <EditAccountModel
                show={showEditModal}
                handleClose={handleCloseModal}
                account={account}
            />
        </div>

    );
};

export default MainAccountItem;
