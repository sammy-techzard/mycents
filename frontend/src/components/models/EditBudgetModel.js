import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditBudgetForm from "../forms/EditBudgetForm";

const EditBudgetModel = ({ show, handleClose, budget }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EditBudgetForm
                    key={budget.id}
                    budgetId={budget.id}
                    initialData={budget}
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

export default EditBudgetModel;
