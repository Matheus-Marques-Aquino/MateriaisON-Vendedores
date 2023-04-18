import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import { validator } from './subcomponents/widgets/validationHelper';
import { mask } from './subcomponents/widgets/mask';

class CreateAccountPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.state = {
            nome: '',
            sobrenome: '',
            email: '',
            senha: '',
            senha2: '',
            cpf: '',
            cpfAccept: false,
            termAccept: false,
            loading: false,
            vendor: false,
            service: false,
        };
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        if (name == 'cpf'){ value = mask( 'cpf', value ); }
        this.setState({ [name]: value });
    }
    validateInputs(){
        if (this.state.loading){ return; }
        this.errors = [];
        this.setState({loading: true})
        if (!validator('nome', this.state.nome, 'nome').result){ this.errors.push(validator('nome', this.state.nome, 'nome').message); }
        if (!validator('nome', this.state.sobrenome, 'sobrenome').result){ this.errors.push(validator('nome', this.state.sobrenome, 'sobrenome').message); }
        if (!validator('cpf', this.state.cpf, 'CPF').result){ this.errors.push(validator('cpf', this.state.cpf, 'CPF').message); }
        if (!validator('email', this.state.email, 'e-mail').result){ this.errors.push(validator('email', this.state.nome, 'e-mail').message); }
        if (!validator('senha', this.state.senha, 'senha').result){ this.errors.push(validator('senha', this.state.senha, 'senha').message); }
        if (this.state.senha != this.state.senha2){ this.errors.push('As senhas inseridas não são iguais.'); }
        if (!this.state.vendor && !this.state.service){this.errors.push('Você deve escolher uma das opções acima para configurarmos seu tipo de conta.'); } 
        if (!this.state.cpfAccept){this.errors.push('Você deve confirmar que o CPF é seu e coincide com os dados inseridos acima.'); }
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
                cpf: this.state.cpf,
                confirmedCPF: 'Eu confirmo que este CPF é meu e que confere com o nome e sobrenome informados acima.',
                acceptedTerms: 'Eu concordo com os Termos de Uso e Política de Privacidade.',
                roles: [ 'user' ],
                parceiro:{}
            }            
        }
        if (this.state.vendor){ options.profile.roles.push('vendor'); }
        if (this.state.service){ options.profile.roles.push('service'); }
        console.log(options)
        Accounts.createUser(options , (error)=>{
            if (error) { 
                console.log(error) ;
                this.errors.push('Ocorreu um erro durante o cadastro, verifique os dados inseridos e tente novamente.');    
                this.setState({ loading: false })            
            }else{ 
                this.setState({ loading: false });
                console.log(this.state)
                Meteor.loginWithPassword(this.state.email, this.state.senha, (error, result)=>{
                    if (!error){
                        history.push('/entrar');                      
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
        if (Meteor.userId()){
            Meteor.logout();
        }         
        let select=[{color:'#666', weight:'normal'}, {color:'#666', weight:'normal'}];
        
        if (this.state.vendor){ select[0].color = '#FF7000'; select[0].weight = 'bold' }      
        if (this.state.service){ select[1].color = '#FF7000'; select[1].weight = 'bold' }  

        console.log(select)
        console.log(this.state)

        return(<div style={{width:'100%'}}>
            <MainHeader/>
            <div style={{width:'100%', margin:'0 auto', maxWidth:'670px'}}>
                <div style={{width:'100%', marginTop:'40px'}}>
                    <div style={{textAlign:'center', marginBottom:'30px', fontSize:'20px', fontWeight:'bold'}}>CADASTRE-SE</div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'50%', paddingRight:'5px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nome' value={this.state.nome} placeholder='NOME' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='sobrenome' value={this.state.sobrenome} placeholder='SOBRENOME' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                    </div>
                    <div style={{marginTop:'10px'}}>
                        <CustomInput width='auto' height='30px' inputStyle={{textAlign:'center'}} name='cpf' value={this.state.cpf} placeholder='CPF' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>    
                    <div style={{marginTop:'10px', display:'flex'}}>
                        <CustomToggle name='cpfAccept' value={this.state.cpfAccept} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{paddingTop:'1px', paddingLeft:'6px', margin:'auto 0', color:'#666', fontSize:'12px'}}>
                            Eu confirmo que este CPF é meu e que confere com o nome e sobrenome informados acima.
                        </span>
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
                    <div style={{paddingTop:'15px', paddingLeft:'6px', margin:'auto 0', fontWeight:'bold', color:'#666', fontSize:'14px'}}>
                        Selecione uma ou mais opções abaixo:
                    </div>
                    <div style={{display:'flex', marginTop:'15px'}}>
                        <CustomToggle name='vendor' value={this.state.vendor} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:select[0].weight, fontSize:'13px', color:select[0].color}}>
                            Sou fornecedor de materiais de contrução.
                        </span>
                    </div>                    
                    <div style={{display:'flex', marginTop:'15px', paddingBottom:'10px'}}>
                        <CustomToggle name='service' value={this.state.service} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:select[1].weight, fontSize:'13px', color:select[1].color}}>
                            Sou prestador de serviços.
                        </span>
                    </div>
                    <div style={{paddingTop:'25px', display:'flex', width:'100%', maxWidth:'670px', borderTop:'1px solid #FF700070'}}>
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
export default CreateAccountPage;