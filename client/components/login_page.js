import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import history from './subcomponents/widgets/history';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import { Profile } from '../../imports/collections/profile';
import VendorFooter from './subcomponents/vendor_footer';

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.start = true;
        this.state = {
            roles: [],
            email: '',
            senha: '',
            _id: '',
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
                if (user.profile.roles.includes('admin')){
                    history.push('/registrar'); 
                    return;
                }else{
                    if (user.profile.roles.includes('vendor')){
                        history.push('perfil-do-fornecedor');
                        return;
                    }else{
                        if (user.profile.roles.includes('service')){
                            history.push('/perfil-do-prestador-de-servico'); 
                            return;       
                        }else{
                            this.errors.push('Está página é direcionada somente a vendedores e prestadores de serviços');
                            return;
                        }                
                    }
                }
            });               
        }        
    }
    /*componentDidUpdate(){
        console.log(Meteor.userId())
        if (Meteor.userId()){
            Meteor.subscribe('ProfileSettings', ()=>{
                let user = Meteor.users.findOne({'_id': Meteor.userId()});
                console.log(user)
                if (!this.state._id){ this.setState({_id: Meteor.userId()}) }
                if (!user){ return; }
                if (!user.profile){ return; }
                if (!user.profile.roles){ return; }
                if (user.profile.roles.length > 0){
                    if (user.profile.roles.includes('admin')){
                        history.push('/registrar');
                        return;
                    }
                    if (user.profile.roles.includes('vendor') || user.profile.roles.includes('service')){
                        history.push('/index');
                        return;
                    }
                }
            });
        }
    }*/
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }
    inputSubmit(){
        if (this.state.loading){ return; }
        this.errors = [];
        this.setState({ loading: true })
        Meteor.loginWithPassword(this.state.email, this.state.senha, (error, result)=>{
            if (error){
                this.errors.push('O e-mail ou senha informados são inválidos.');                
            }else{ history.push('/validar'); }
            this.setState({ loading: false })
        });
    }
    displayErrors(){      
        if (this.errors.length > 0){return(<div style={{margin:'10px 0'}}>
            {this.errors.map((error, index)=>{
                let key = 'input_'+index
                return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>)
            })}
        </div>)}        
    }    
    render(){
        console.log(Meteor.userId());
        if (Meteor.userId()){ history.push('/validar')}
        //console.log(this.state);
        return(<div style={{width:'100%'}}>
            <MainHeader page='login'/>
            <div style={{width:'100%', maxWidth:'350px', margin:'0 auto', marginTop:'40px'}}>
                <div style={{textAlign:'center', marginBottom:'30px', fontSize:'20px', fontWeight:'bold'}}>ENTRAR</div>
                <div>
                    <div style={{height:'30px', lineHeight:'30px', fontSize:'14px'}}>E-mail</div>
                    <input id='login' style={{width:'100%', boxSizing:'border-box', padding:'7px', fontSize:'17px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}} value={this.state.email} onChange={this.inputHandler.bind(this)} name='email' onKeyDown={(e)=>{if (e.key==='Enter'){document.getElementById('senha').focus()}}} autoCapitalize="none"/>
                </div>                
                <div style={{marginTop:'10px'}}>
                    <did style={{width:'100%', display:'flex'}}>
                        <div style={{height:'30px', lineHeight:'30px', fontSize:'14px'}}>Senha</div>
                        {/*<div style={{height:'30px', lineHeight:'30px', fontSize:'14px', marginLeft:'auto', color:'#007AF3', cursor:'pointer'}} onClick={()=>{history.push('/esqueci-a-senha');}}>Perdi a Senha</div>*/}
                    </did>
                    <input id='senha' type='password' style={{width:'100%', boxSizing:'border-box', padding:'7px', fontSize:'17px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white'}} value={this.state.senha} onChange={this.inputHandler.bind(this)} name='senha' onKeyDown={(e)=>{if (e.key==='Enter'){this.inputSubmit()}}}/>
                </div>
                {this.displayErrors()}
                <div style={{margin:'0 auto', marginTop:'40px', width:'175px', height:'30px', lineHeight:'30px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'25px', textAlign:'center', fontSize:'15px', color:'white', cursor:'pointer'}} onClick={()=>{this.inputSubmit()}}>ENTRAR</div>
                <div style={{width:'100%', textAlign:'center', fontSize:'14px', marginTop:'20px'}}>Não tem uma conta?</div>
                <div style={{width:'fit-content', margin:'3px auto', fontSize:'16px', color:' #007AF3', fontWeight:'600', cursor:'pointer'}} onClick={()=>{if (!this.state.loading){history.push('/cadastre-se')}}}>CLIQUE AQUI</div>
                {/*<div style={{margin:'50px 0', fontSize:'11px'}}><span style={{color:'#333'}}>Ao clicar em "Entrar", você concorda com os <a style={{textDecoration:'none', color:'#007AF3', cursor:'pointer'}}>Termos de Uso</a> e <a style={{textDecoration:'none', color:'#007AF3', cursor:'pointer'}} onClick={()=>{}}>Política de Privacidade</a>.</span></div>*/}
            </div>
            <VendorFooter />
            <Waiting open={this.state.loading} size='60px'/>
        </div>);
    }
}
export default LoginPage;