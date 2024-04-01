import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmationModal({ title, message, confirmText, cancelText, onConfirm, onCancel }) {

    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    const handleCancel = () => {
        onCancel();
        handleClose();
    };

    return (
        <>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={"handleCancel"}>
                        {cancelText}
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        {confirmText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ConfirmationModal;