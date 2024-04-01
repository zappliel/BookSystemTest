import { MDBInput } from "mdb-react-ui-kit";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function TopUpConfirmation({ show, title, message, onConfirm, onCancel }) {
    const [showModal, setShowModal] = useState(false);


    return (
        <>
            <Modal show={true} onHide={setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2>请输入验证码</h2>
                    <MDBInput wrapperClass='mb-4' label='验证码' id='form5' type='text' />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onCancel}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={onConfirm}>
                        确认
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TopUpConfirmation;