import MainContentHeader from "../../components/MainContentHeader";
import AddTransactionModel from "../../components/models/AddTransactionModel";
import { useState } from "react";
import DashboardItems from "../../components/item-sets/DashboardItems";
function Dashboard() {
    const [isPageContentChanged, setIsPageContentChanged] = useState(false);

    // Function to handle change/update in transactions details
    const handleContentChange = () => {
        setIsPageContentChanged(true);
    };

    const [show, setShow] = useState(false);
    const handleCloseAddTransactionModel = () => setShow(false);
    const handleShowAddTransactionModel = () => setShow(true);

    const handleMultipleCallbacks = () => {
        handleCloseAddTransactionModel();
        handleContentChange();
    };

    // Reset content change state after fetching new data
    const resetContentChangeState = () => {
        setIsPageContentChanged(false);
    };

    return (
        <div className="main-content-div">
            <MainContentHeader 
                title="Transactions" 
                actionName="Add Transaction" 
                actionValue={handleShowAddTransactionModel} 
            />
            <AddTransactionModel 
                show={show} 
                handleClose={handleMultipleCallbacks} 
            />
            <div className="main-content-body">
                <DashboardItems 
                    resetContentChangeState={resetContentChangeState} 
                    isPageContentChanged={isPageContentChanged} 
                />
            </div>
        </div>
    );
}

export default Dashboard;
