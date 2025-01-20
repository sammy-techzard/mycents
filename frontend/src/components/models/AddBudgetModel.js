import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AddBudgetForm from '../forms/AddBudgetForm';

const AddBudgetModel = ({ show, handleClose }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddBudgetForm onSuccess={handleClose} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddBudgetModel;
