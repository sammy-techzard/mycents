import MainContentHeader from "../../components/MainContentHeader";
import AddAccountModel from "../../components/models/AddAccountModel";
import AccountsItems from "../../components/item-sets/AccountsItems";
import { useState } from 'react';

function Accounts() {

    const [isPageContentChanged, setIsPageContentChanged] = useState(false);

    // Function to handle change/update in accounts details
    const handleContentChange = () => {
        setIsPageContentChanged(true);
    };

    const [show, setShow] = useState(false);
    const handleCloseAddAccountModel = () => setShow(false);
    const handleShowAddAccountModel = () => setShow(true);

    const handleMultipleCallbacks = () => {
        handleCloseAddAccountModel();
        handleContentChange();
    };
    // Reset content change state after fetching new data
    const resetContentChangeState = () => {
        setIsPageContentChanged(false);
    };

    return (
        <div className="main-content-div">
            <MainContentHeader title="Accounts" actionName="Add account" actionValue={handleShowAddAccountModel} />
            
            <AddAccountModel show={show} handleClose={handleMultipleCallbacks} />
            
            <div className="main-content-body">
                <AccountsItems resetContentChangeState={resetContentChangeState} isPageContentChanged={isPageContentChanged} />
            </div>
        </div>
    );
}

export default Accounts;