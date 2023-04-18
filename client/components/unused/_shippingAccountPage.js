import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import VendorHeader from './subcomponents/vendorHeader';
import VendorMenu from './subcomponents/vendorMenu';

class ShippingAccountPage extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }
    render(){
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'45px', borderBottom:'1px solid #f7f7f7', backgroundColor:'#F7F7F7', display:'flex'}}>
                        <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px'}}>Editar Endereço</div>
                        <div style={{height:'27px', width:'75px', margin:'auto 0', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Salvar</div>
                        <div style={{height:'27px', width:'90px', margin:'auto 0', marginLeft:'10px', marginRight:'20px', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Rascunho</div>
                    </div> 
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Gerenciar serviços prestados:</div>
                        </div>                         
                        <div style={{height:'30px', lineHeight:'30px', marginLeft:'20px', marginBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                            Serviços:                        
                        </div>
                        <div style={{width:'100%', marginTop:'30px'}}>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default ShippingAccountPage;