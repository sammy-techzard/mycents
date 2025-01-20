import MainContentHeader from "../../components/MainContentHeader";
// import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
// import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import AddCategoryModel from "../../components/models/AddCategoryModel";
import { useState } from 'react';
import CategoriesItems from "../../components/item-sets/CategoriesItems";

function Categories() {
    const [isPageContentChanged, setIsPageContentChanged] = useState(false);
    
        // Function to handle change/update in accounts details
        const handleContentChange = () => {
            setIsPageContentChanged(true);
        };
    
        const [show, setShow] = useState(false);
        const handleCloseAddCategoryModel = () => setShow(false);
        const handleShowAddCategoryModel = () => setShow(true);
    
        const handleMultipleCallbacks = () => {
            handleCloseAddCategoryModel();
            handleContentChange();
        };
        // Reset content change state after fetching new data
        const resetContentChangeState = () => {
            setIsPageContentChanged(false);
        };
    return (
        <div className="main-content-div">
            <MainContentHeader title="Categories" actionName="Add Category" actionValue={handleShowAddCategoryModel}/>
            <AddCategoryModel show={show} handleClose={handleMultipleCallbacks} />
            <div className="main-content-body">
                <CategoriesItems resetContentChangeState={resetContentChangeState} isPageContentChanged={isPageContentChanged} />   
            </div>
        </div>
    );
}

export default Categories;