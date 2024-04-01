import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import UpdateUserInformation from "./pages/UpdateUserInformation";
import Sgood from './sellerview/sgood/sgood';
import Sorder from './sellerview/sorder/sorder';
import Sreference from './sellerview/sreference/sreference';
import Account from './view/account/account';
import FlightManage from "./view/backgroundmanage/FlightManage";
import HotelManage from "./view/backgroundmanage/HotelManage";
import SPRoomManage from "./view/backgroundmanage/SProomManage";
import TicketManage from "./view/backgroundmanage/TicketManage";
import BackReference from "./view/backgroundmanage/backgroundreference";
import FlightSearch from "./view/flight/FlightSearch";
import Homepage from './view/homepage/homepage';
import HotelSearch from "./view/hotel/HotelSearch";
import Order from './view/order/order';
import Reference from './view/reference/reference';
import Shopping from './view/shopping/shopping';


import Buyer from './pages/Buyer';
import CheckMain from './pages/CheckMain';
import CheckOrder from './pages/CheckOrder';
import Deal from './pages/Deal';
import Forget from "./pages/ForgetPossword";
import RLogin from './pages/RLogin';
import Seller from './pages/Seller';
import Orderinfoofflight from './view/comfirmorder/comfirmorder_flight';
import Orderinfoofhotel from './view/comfirmorder/comfirmorder_hotel';
import OrderCanceledView from './view/comfirmorder/ordercanceled';
import OrderSuccessView from './view/comfirmorder/ordersuccess';
import PassworderrView from './view/comfirmorder/passworderr';


function App() {
  const formData = [
    {
      order_id: '001',
      buyerId: '123',
      sellerId: '456',
      productName: 'Product A'
    },
    {
      order_id: '002',
      buyerId: '789',
      sellerId: '123',
      productName: 'Product B'
    },
    {
      order_id: '003',
      buyerId: '456',
      sellerId: '789',
      productName: 'Product C'
    },
    {
      order_id: '004',
      buyerId: '456',
      sellerId: '789',
      productName: 'Product C'
    },
    {
      order_id: '003',
      buyerId: '456',
      sellerId: '789',
      productName: 'Product C'
    }
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/homepage/*' element={<Homepage/>}/>
        <Route path='/reference' element={<Reference/>}/>
        <Route path='/order/*' element={<Order/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/shopping' element={<Shopping/>}/>
        <Route path='/sreference' element={<Sreference/>}/>
        <Route path='/sgood/*' element={<Sgood/>}/>
        <Route path='/sorder/*' element={<Sorder/>}/>
        <Route path='/hotelSearchPage/*' element={<HotelSearch/>}/>
        <Route path='/flightSearchPage/*' element={<FlightSearch/>}/>
        <Route path='/backreference' element={<BackReference/>}/>
        <Route path='/hotelManagePage' element={<HotelManage/>}/>
        <Route path='/flightManagePage' element={<FlightManage/>}/>
        <Route path='/sproomManagePage' element={<SPRoomManage/>}/>
        <Route path='/ticketManagePage' element={<TicketManage/>}/>
        <Route path="/" element={<Login/>}/>
        <Route path="dashboardPage" element={<Dashboard/>}/>
        <Route path="updateUserInformationPage" element={<UpdateUserInformation/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forget" element={<Forget/>}/>


        <Route path="/rLogin" element={<RLogin />} />
        <Route path="/checkmain" element={<CheckMain formData={formData}/>} />
        <Route path="/CheckOrder/:order_id" element={<CheckOrder />} />
        <Route path="/Deal" element={<Deal />} />
        <Route path="/Seller" element={<Seller />} />
        <Route path="/Buyer" element={<Buyer />} />
        <Route path="*" element={<NotFound/>}/>
        <Route path='/orderinfo/hotel' element={<Orderinfoofhotel/>}/>
        <Route path='/orderload' element={<OrderSuccessView/>}/>
        <Route path='/ordercanceled' element={<OrderCanceledView/>}/>
        <Route path='/ordersuccess' element={<OrderSuccessView/>}/>
        <Route path='/orderinfo/flight' element={<Orderinfoofflight/>}/>
        <Route path='/ordererror' element={<PassworderrView/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
 
