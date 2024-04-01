import React from "react";
import Snavigator from "../../components/snavigator/snavigator";
import UpdateUserInformation from "../../pages/UpdateUserInformation";
import './sreference.css';

function Sreference()
{
    return(
        <div>
            <UpdateUserInformation style={{top:'0'}}/>
            <Snavigator/>
        </div>
        
    );
}

export default Sreference;