import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink
} from 'mdb-react-ui-kit';

export default function card() {
  return (
    <MDBCard>
      <MDBCardBody>
        <MDBCardTitle>Card title</MDBCardTitle>
        <MDBCardSubTitle>Card subtitle</MDBCardSubTitle>
        <MDBCardText>
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </MDBCardText>
        <MDBCardLink href='#'>Card link</MDBCardLink>
        <MDBCardLink href='#'>Another link</MDBCardLink>
      </MDBCardBody>
    </MDBCard>
  );
}