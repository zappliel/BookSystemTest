import React from "react";
import Navigator from "../../components/navigator/navigator";
import UpdateUserInformation from "../../pages/UpdateUserInformation";
import BackNavigator from "../../components/navigator/backnavigator";

function Reference()
{
        return(
        <div>
        <Navigator/>
        <UpdateUserInformation style={{top:'0'}}/>
        </div>
        
    );
}

export default Reference; 