import MainContentHeader from "../../components/MainContentHeader";
import AddBudgetModel from "../../components/models/AddBudgetModel";
import BudgetItems from "../../components/item-sets/BudgetItems";
import { useState } from "react";


function Budget() {
    const [isPageContentChanged, setIsPageContentChanged] = useState(false);
    
    // Function to handle change/update in accounts details
    const handleContentChange = () => {
        setIsPageContentChanged(true);
    };

    const [show, setShow] = useState(false);
    const handleCloseAddBudgetModel = () => setShow(false);
    const handleShowAddBudgetModel = () => setShow(true);

    const handleMultipleCallbacks = () => {
        handleCloseAddBudgetModel();
        handleContentChange();
    };
    // Reset content change state after fetching new data
    const resetContentChangeState = () => {
        setIsPageContentChanged(false);
    };
    
    return (
        <div className="main-content-div">
            <MainContentHeader title="Budgets" actionName="Add Budget" actionValue={handleShowAddBudgetModel} />
                <AddBudgetModel show={show} handleClose={handleMultipleCallbacks}/>
            <div className="main-content-body">
                <BudgetItems resetContentChangeState={resetContentChangeState} isPageContentChanged={isPageContentChanged} />
            </div>
        </div>
    );
}

export default Budget;