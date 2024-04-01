import React, { useState } from "react";
import { MDBBtn, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from "mdb-react-ui-kit";

function LoginAlert() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div>
            <MDBBtn color="primary" onClick={toggleModal}>
                Open Modal
            </MDBBtn>
            <MDBModal isOpen={isModalOpen} toggle={toggleModal}>
                <MDBModalHeader toggle={toggleModal}>Modal Title</MDBModalHeader>
                <MDBModalBody>
                    <p>Modal Content</p>
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={toggleModal}>
                        Close
                    </MDBBtn>
                    <MDBBtn color="primary">Save changes</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </div>
    );
}

export default LoginAlert;
