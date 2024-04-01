import React from 'react';
import { MDBInput } from 'mdb-react-ui-kit';
import PubSub from 'pubsub-js';
import { Alert } from 'react-native-web';

export default class WriteInput extends React.Component {

  state = {
    name:this.props.name,
    label:this.props.label,
  }

  postNewValue = (newValue) =>{
    const {name} = this.state
    console.log(newValue)
    this.setState({label:newValue})
    console.log("renew value")
    {name==="买方账户余额"?
    PubSub.publish("买方账户余额",{newBalance:newValue}):
    name==="卖方账户余额"?
    PubSub.publish("卖方账户余额",{newBalance:newValue}):
    name==="交易金额"?
    PubSub.publish("交易金额",{newMoney:newValue}):
    PubSub.publish("",
    {null:newValue})}
  }

  showAlert = (newValue) =>{
    if(window.confirm("确认修改？")){
      console.log(newValue);
      if(newValue < 0 || newValue > 100000){
        window.alert("金额异常！")
        window.location.reload();
      }else{
        this.postNewValue(newValue);
      }
    }
  }

  handleKeyUp = (event) =>{
    const {name, label} = this.state
    const {keyCode, target} = event
    if(keyCode !== 13) return
    const newValue = target.value
    this.showAlert(newValue)
  }

  render(){
    const {name, label} = this.state.label===undefined ? this.props : this.state;
    console.log(name, label)
    return (
        <div>
          {name}
          <MDBInput onKeyUp={this.handleKeyUp} label={label} id='form1' type='text' />
        </div>
      );
  }
}