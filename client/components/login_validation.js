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

class AccountValidatePage extends Component {
    constructor(props){
        super(props);this.state = { };
    }
    componentDidMount(){
        console.log(Meteor.userId())
        Tracker.autorun(function() {
            if (Meteor.userId()) {
                Meteor.subscribe('rooms');
            }
        });
        Meteor.subscribe('ProfileSettings', ()=>{
            let user = Meteor.users.findOne({'_id':Meteor.userId()}); 
            console.log(user);            
            if (!user){ Meteor.logout(); history.push('/entrar'); return; }
            if (!user.profile){ Meteor.logout(); history.push('/entrar'); return; }
            if (!user.profile.roles){ Meteor.logout(); history.push('/entrar'); return; }
                
            if (user.profile.roles.includes('admin')){ 
                history.push('/registrar'); 
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
                            Meteor.logout();
                            history.push('/entrar'); 
                            return;
                        }else{  history.push('/entrar'); return; }
                    }
                }
            }
        });        
    }
    render(){
        return(<div> </div>);
    }
}
export default AccountValidatePage;