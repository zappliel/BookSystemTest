import React from 'react';
import { MDBInput } from 'mdb-react-ui-kit';

export default class ReadInput extends React.Component{
    render(){
        const {name, label} = this.props
        return (
            <div>
                {name}
                <MDBInput
                label={label}
                placeholder='Readonly input here'
                id='formControlReadOnly'
                type='text'
                readonly
                />
            </div>
        );
    }
}