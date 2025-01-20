import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AddTransactionForm from "../forms/AddTransactionForm";

const AddTransactionModel = ({ show, handleClose, transaction }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Transaction</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddTransactionForm onSuccess={handleClose} initialData={transaction} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddTransactionModel;
