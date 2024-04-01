import React from "react";
import { Route, Routes } from "react-router-dom";
import Navigator from "../../components/navigator/navigator";
import Orderflight from "../../components/orderflight/orderflight";
import Ordergood from "../../components/ordergood/ordergood";
import Orderhotel from "../../components/orderhotel/orderhotel";

const Order = () =>{
    return(
        <div>
            <Routes>
                <Route path='/good/*' element={<Ordergood/>} />
                <Route path='/ticket/*' element={<Orderflight/>} />
                <Route path='/hotel/*' element={<Orderhotel/>} />
            </Routes>
            <Navigator style={{zIndex:999}}/>
        </div>
    );
}

export default Order;