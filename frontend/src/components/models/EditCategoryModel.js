import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditCategoryForm from "../forms/EditCategoryForm";

const EditCategoryModel = ({ show, handleClose, category }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EditCategoryForm
                    key={category.id}
                    categoryId={category.id}
                    initialData={category}
                    onSuccess={handleClose}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCategoryModel;
