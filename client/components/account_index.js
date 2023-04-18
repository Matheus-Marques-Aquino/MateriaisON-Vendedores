import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import VendorHeader from './subcomponents/vendor_header';
import VendorMenu from './subcomponents/vendorMenu';

class AccountIndexPage extends Component {
    constructor(props){
        super(props);

        this.state = {

        };
    }
    componentDidMount(){
        Meteor.subscribe('ProfileSettings', ()=>{
            let user = Meteor.users.findOne({'_id':Meteor.userId()}); console.log(user);
            if (!user){ Meteor.logout(); history.push('/entrar'); return; }
            if (!user.profile){ Meteor.logout(); history.push('/entrar'); return; }
            if (!user.profile.roles){ Meteor.logout(); history.push('/entrar'); return; }
                
            if (user.profile.roles.includes('admin')){ 
                history.push('/registro'); 
                return;
            }else{if (user.profile.roles.includes('vendor')){ 
                    history.push('/perfil-do-fornecedor'); 
                    return;
                }else{
                    if (user.profile.roles.includes('service')){ 
                        history.push('/perfil-do-prestador-de-servico'); 
                        return;
                    }else{
                        if (user.profile.roles.includes('user')){
                            history.push('/entrar'); 
                            return;
                        }else{ Meteor.logout(); history.push('/entrar'); return; }
                    }
                }
            }
        });
        
    }
    render(){
        if (!Meteor.userId()){ history.push('/entrar'); return; }
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Resumo:</div>
                        </div>
                        <div style={{width:'100%', marginTop:'30px'}}>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default AccountIndexPage;