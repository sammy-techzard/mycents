import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AddAccountForm from '../forms/AddAccountForm';

const AddAccountModel = ({ show, handleClose, account }) => {

    

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <AddAccountForm onSuccess={handleClose} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddAccountModel;
