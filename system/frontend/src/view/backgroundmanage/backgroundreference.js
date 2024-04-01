import React from "react";
import BackNavigator from "../../components/navigator/backnavigator";
import UpdateUserInformation from "../../pages/UpdateUserInformation";

function BackReference()
{
    const new_token=localStorage.getItem('Token');
    const new_role=localStorage.getItem('role');
    if(new_token != '' && new_role=="ADMIN") return (
        <div>
            <BackNavigator/>
        </div>
    );
    else return(<p>Please Login in</p>);
}

export default BackReference;