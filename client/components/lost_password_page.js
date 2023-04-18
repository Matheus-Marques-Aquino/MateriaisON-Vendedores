import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import history from './subcomponents/widgets/history';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import { Profile } from '../../imports/collections/profile';
import VendorFooter from './subcomponents/vendor_footer';

class LostPasswordPage extends Component {
    constructor(props){
        super(props);
        this.error = '';
        this.success = '';
        this.state = {
            email: '',
            loading: false
        }
    }
    componentDidMount(){     
        console.log(Meteor.userId())      
        if (Meteor.userId()){                                
            Meteor.subscribe('ProfileSettings', ()=>{                    
                let user = Meteor.users.findOne({'_id': Meteor.userId()});
                if (!user){ return; }
                if (!user.profile){ return; }
                if (!user.profile.roles){ return; }
                if (user.profile.roles.includes('vendor') || user.profile.roles.includes('service')){
                    history.push('/index');
                    return;
                }
            });               
        }        
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }
    inputSubmit(){
        if (this.state.loading){ return; }
        this.setState({ loading: true })
        this.error = '';
        this.success = '';
        let email = this.state.email.toLowerCase()
        if (!(email.includes('@') && email.includes('.'))){ 
            this.error = 'Informe um endereço de email válido.'
            this.setState({ 
                loading: false                
            }); 
            return;
        }
        Meteor.call('profile.forgetPassword', email, (error, result)=>{
            if (!error){                
                this.success = 'Foi enviado um e-mail com intruções para a recuração da conta!';
                this.setState({
                    loading:false
                });                                
            }else{
                this.error = error.reason;
                console.log(error)
                this.setState({
                    loading:false
                })
            }
        })
    }
    displayError(){
        if (this.error != ''){
            return(<div style={{color:'red', padding:'10px 5px', fontSize:'14px'}}>{this.error}</div>)
        }else{
            if (this.success == ''){
                return (<div style={{padding:'10px'}}></div>)
            }
        }
    }
    displaySuccess(){
        if (this.success != ''){
            return(<div style={{color:'#32CD32', padding:'10px 5px', fontSize:'14px'}}>{this.success}</div>)
        }
    }
    render(){
        console.log(this.state)
        return(<div style={{width:'100%'}}>
            <MainHeader page='login'/>
            <div style={{width:'100%', maxWidth:'350px', margin:'0 auto', marginTop:'40px'}}>
            <div style={{fontWeight:'bold', textAlign:'center'}}>ESQUECI A SENHA</div>
                <div style={{marginTop:'40px'}}>
                    <span style={{fontSize:'14px', lineHeight:'25px'}}>Digite e-mail de cadastrado abaixo</span>
                    <div style={{padding:'0 10px', border:'1px solid #ff7000', backgroundColor:'white', borderRadius:'3px', marginTop:'10px'}}>
                        <input id='email' style={{height:'30px', width:'100%', lineHeight:'30px', fontSize:'14px', textAlign:'center', border:'0px'}} value={this.state.email} onChange={this.inputHandler.bind(this)} placeholder='ENDEREÇO DE E-MAIL' name='email' onKeyDown={(e)=>{if (e.key==='Enter'){this.inputSubmit()}}}/>
                    </div>
                </div> 
                {this.displayError()}   
                {this.displaySuccess()}  
                <div style={{margin:'0 auto', marginTop:'50px', width:'175px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'25px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.inputSubmit()}}>ENVIAR</div>
                <div style={{width:'100%', textAlign:'center', fontSize:'14px', marginTop:'20px'}}>Não tem uma conta?</div>
                <div style={{width:'fit-content', margin:'3px auto', fontSize:'16px', color:' #007AF3', fontWeight:'600', cursor:'pointer'}} onClick={()=>{if (!this.state.loading){history.push('/cadastre-se')}}}>CLIQUE AQUI</div>
                {/*<div style={{margin:'50px 0', fontSize:'11px'}}><span style={{color:'#333'}}>Ao clicar em "Entrar", você concorda com os <a style={{textDecoration:'none', color:'#007AF3', cursor:'pointer'}}>Termos de Uso</a> e <a style={{textDecoration:'none', color:'#007AF3', cursor:'pointer'}} onClick={()=>{}}>Política de Privacidade</a>.</span></div>*/}
            </div>
            <VendorFooter />
            <Waiting open={this.state.loading} size='60px'/>
        </div>);
    }
}
export default LostPasswordPage;