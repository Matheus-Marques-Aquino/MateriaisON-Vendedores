import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import { validator } from '../subcomponents/widgets/validationHelper';
import { mask } from '../subcomponents/widgets/mask';
import validateDate from 'validate-date';

class VendorCreateAccountPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.state = {
            nome: '',
            sobrenome: '',
            storeName: '',
            email: '',
            senha: '',
            senha2: '',
            termAccept: false,
            loading: false,
            vendor: false
        };
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }
    validateInputs(){
        if (this.state.loading){ return; }
        this.errors = [];
        this.setState({loading: true})
        if (!validator('nome', this.state.nome, 'nome').result){ this.errors.push(validator('nome', this.state.nome, 'nome').message); }
        if (!validator('nome', this.state.sobrenome, 'sobrenome').result){ this.errors.push(validator('nome', this.state.sobrenome, 'sobrenome').message); }
        if (!validator('email', this.state.email, 'e-mail').result){ this.errors.push(validator('email', this.state.nome, 'e-mail').message); }
        if (!validator('senha', this.state.senha, 'senha').result){ this.errors.push(validator('senha', this.state.senha, 'senha').message); }
        if (this.state.senha != this.state.senha2){ this.errors.push('As senhas inseridas não são iguais.'); }        
        if (!this.state.termAccept){this.errors.push('Você deve concordar com os Termos de Uso e com a Política de Privacidade da MateriaisON.'); }        
        if (this.errors.length > 0){ 
            this.setState({ loading: false })
            return; 
        }
        this.createAccount();
    }
    createAccount(){
        let nome = this.state.nome+' '+this.state.sobrenome;
        let options = {
            username: this.state.email.toLowerCase(),
            email: this.state.email.toLowerCase(),
            password: this.state.senha,
            confirmPassword: this.state.senha2,
            profile: {
                name: nome,
                firstName: this.state.nome,
                lastName: this.state.sobrenome,
                acceptedTerms: 'Eu concordo com os Termos de Uso e Política de Privacidade.',
                roles: [ 'user', 'vendor' ]
            }            
        }
        Accounts.createUser(options , (error)=>{
            if (error) { 
                console.log(error) ;
                this.errors.push(error.reason);    
                this.setState({ loading: false })            
            }else{ 
                this.setState({ loading: false });
                console.log(this.state)
                Meteor.loginWithPassword(this.state.email, this.state.senha, (error, result)=>{
                    if (!error){
                        history.push('/perfil-do-fornecedor');                      
                    }else{
                        this.errors.push(error.message);  
                        this.setState({ loading: false }); 
                    }
                })
            }            
        })
    }
    displayErrors(){        
        if (this.errors.length > 0){return(<div style={{marginTop:'10px'}}>
            {this.errors.map((error, index)=>{
                let key = 'input_'+index
                return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>)
            })}
        </div>)} 
        return(<div style={{width:'100%', marginTop:'40px'}}></div>);       
    }
    render(){      
        //if (Meteor.userId()){ Meteor.logout();  }         
        let select=[{color:'#666', weight:'normal'}, {color:'#666', weight:'normal'}];
        
        if (this.state.vendor){ select[0].color = '#FF7000'; select[0].weight = 'bold' }      
        if (this.state.service){ select[1].color = '#FF7000'; select[1].weight = 'bold' }  

        return(<div style={{width:'100%'}}>
            <MainHeader/>
            <div style={{width:'100%', height:'320px', backgroundColor:'#FF7000', color:'white'}}>
                
            </div>
            <div style={{width:'100%', margin:'0 auto', maxWidth:'670px'}}>
                <div style={{width:'100%', marginTop:'40px'}}>
                    <div style={{textAlign:'center', marginBottom:'30px', fontSize:'20px', fontWeight:'bold'}}>SEJA NOSSO PARCEIRO</div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'50%', paddingRight:'5px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nome' value={this.state.nome} placeholder='NOME' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='sobrenome' value={this.state.sobrenome} placeholder='SOBRENOME' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                    </div>                    
                    <div style={{marginTop:'15px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='email' value={this.state.email} placeholder='E-MAIL' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>                
                    <div style={{display:'flex', marginTop:'10px'}}>
                        <div style={{width:'50%', paddingRight:'5px'}}>
                            <CustomInput type='password' width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='senha' value={this.state.senha} placeholder='SENHA' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                            <CustomInput type='password' width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='senha2' value={this.state.senha2} placeholder='CONFIRMAR SENHA' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>                        
                    </div>
                    <div style={{paddingTop:'25px', display:'flex', width:'100%', maxWidth:'670px'}}>
                        <CustomToggle name='termAccept' value={this.state.termAccept} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{paddingTop:'1px', paddingLeft:'6px', margin:'auto 0', color:'#666', fontSize:'12px'}}>
                            Eu concordo com os 
                            <a style={{textDecoration:'none', color:'#3395f5'}}>Termos de Uso </a> e 
                            <a style={{textDecoration:'none', color:'#007af3'}} onClick={()=>{history.push('/politica-de-privacidade')}}> Política de Privacidade</a>.
                        </span>
                    </div>                     
                    {this.displayErrors()}
                    <div style={{margin:'0 auto', marginTop:'20px', marginBottom:'20px', width:'220px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'15px', textAlign:'center', fontSize:'17px', color:'white', cursor:'pointer'}} onClick={()=>{this.validateInputs()}}>
                        CRIAR CONTA
                    </div>                    
                </div>
                <Waiting open={this.state.loading} size='50px'/>
            </div>
        </div>);
    }
}
export default VendorCreateAccountPage;