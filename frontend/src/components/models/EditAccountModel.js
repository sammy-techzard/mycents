import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import EditAccountForm from '../forms/EditAccountForm';

const EditAccountModel = ({ show, handleClose, account }) => {

    

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <EditAccountForm key={account.id} accountId={account.id} initialData={account} onSuccess={handleClose} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditAccountModel;
