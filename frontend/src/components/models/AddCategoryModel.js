import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AddCategoryForm from "../forms/AddCategoryForm";

const AddCategoryModel = ({ show, handleClose, category }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddCategoryForm onSuccess={handleClose} initialData={category} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddCategoryModel;
