import React, { useState } from "react";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Dropdown } from "react-bootstrap";
import EditBudgetModal from "../models/EditBudgetModel";
const MainBudgetItem = ({ budget }) => {
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditClick = () => setShowEditModal(true);
    const handleCloseModal = () => setShowEditModal(false);

    const handlePercentange = (remaining_amount, amount) => {
        return ((remaining_amount / amount) * 100).toFixed(0);  
    }

    const handleTransactionsClick = () => {
        alert("View transactions clicked"); // Replace with actual functionality
    };

    return (
        <div className="main-budget-item">
            <div className="main-budget-item-cont native-card">
                {/* Header Section */}
                <div className="main-budget-item-cont-header">
                    <span className="main-budget-item-cont-header-details-name-period">
                        <span>{budget.name || "Budget Name"}</span>
                        <span className="main-budget-item-cont-header-period">
                            {budget.period }
                        </span>
                    </span>
                    <span className="main-budget-item-cont-header-details-cF">
                        <span className="main-budget-item-cont-header-cat">
                            {budget.category_name || "Category Name"}
                        </span>
                        {/* Dropdown for actions */}
                        <span className="main-budget-item-cont-header-drop-down">
                            <Dropdown>
                                <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                                    <MoreVertRoundedIcon />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleEditClick}>Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={handleTransactionsClick}>
                                        Transactions
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </span>
                    </span>
                </div>
                {/* Footer Section */}
                <div className="main-budget-item-cont-footer">
                    <span className="main-budget-item-cont-percentage">
                        <span
                            style={{
                                width: `${handlePercentange(budget.remaining_amount, budget.amount) || 0}%`,
                            }}
                            className="main-budget-item-cont-percentage-load"
                        ></span>
                    </span>
                    <span className="main-budget-item-cont-percent-value">
                        <span>{`${handlePercentange(budget.remaining_amount, budget.amount) || 0}%`} Remaining</span>
                        <span>
                            {`RWF ${budget.remaining_amount || 0} / RWF ${
                                budget.amount || 0
                            }`}
                        </span>
                    </span>
                </div>
            </div>
            {/* Edit Modal */}
            <EditBudgetModal
                show={showEditModal}
                handleClose={handleCloseModal}
                budget={budget}
            />
        </div>
    );
};

export default MainBudgetItem;
