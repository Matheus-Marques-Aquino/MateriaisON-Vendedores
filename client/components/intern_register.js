import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import { validator } from './subcomponents/widgets/validation_helper';
import { mask } from './subcomponents/widgets/mask';

class InterAccountCreatePage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.successText = '';
        this.genders = ['Masculino', 'Feminino', 'Outro'];
        this.state = {
            nome: '',
            sobrenome: '',
            celular: '',
            gender: '',
            nascimento: '',
            email: '',
            senha: '',
            senha2: '',
            storeName: '',
            workingSince: '',
            cpf: '',
            cnpj: '',
            razaoSocial: '',
            loading: true,
            vendor: false,
            service: false,
            verified: false,
            displayOnly: false,
            limitedAccess: false
        };
    }
    componentDidMount(){
        console.log(Meteor.userId())
        if (!Meteor.userId()){ history.push('/cadastre-se'); return; }            
        Meteor.subscribe('ProfileSettings', ()=>{
            let user = Meteor.users.findOne({'_id': Meteor.userId()});
            console.log(user);
            if (!user){ history.push('/cadastre-se'); user = {}; return; }
            if (!user.profile){ history.push('/cadastre-se'); user.profile = {}; return; }
            if (!user.profile.roles){ history.push('/cadastre-se'); user.profile.roles = []; return; }
            if (!user.profile.roles.includes('admin')){ console.log(user); history.push('/cadastre-se'); return; }
            console.log(user);
            this.setState({loading: false});
        });
    }
    inputHandler(event){
        this.successText = '';
        let name = event.target.name;
        let value = event.target.value;
        if (name == 'cpf'){ value = mask('cpf', value ); }
        if (name == 'cnpj'){ value = mask('cnpj', value); }
        if (name == 'nascimento'){ value = mask('birthday', value); } 
        if (name == 'celular'){ value = mask('phone', value); } 
        if (name == 'workingSince_Y'){ if (value != ''){ if (!(/^\d+$/.test(value))){ value = this.state.workingSince_Y.toString(); } } }
        this.setState({ [name]: value });
        console.log(this.state)
    }
    validateInputs(){
        this.successText = '';
        if (this.state.loading){ return; }
        this.errors = [];
        this.setState({loading: true})
        if (!validator('nome', this.state.nome, 'nome').result){ this.errors.push(validator('nome', this.state.nome, 'nome').message); }
        if (!validator('nome', this.state.sobrenome, 'sobrenome').result){ this.errors.push(validator('nome', this.state.sobrenome, 'sobrenome').message); }
        if (this.state.gender != 'Masculino' && this.state.gender != 'Feminino' && this.state.gender != 'Outro'){
            this.errors.push('Você deve selecionar um gênero.')
        }
        if (this.state.storeName.length > 0){
            if (this.state.storeName.length < 3){
                this.errors.push('O nome da loja de ter ao menos 3 caracteres.');
            }
        }
        if (this.state.cpf.length > 0){
            if (!validator('cpf', this.state.cpf, 'CPF').result){ this.errors.push(validator('cpf', this.state.cpf, 'CPF').message); }
        }
        if (this.state.cnpj.length > 0){
            if (!validator('cnpj', this.state.cnpj, 'CNPJ').result){ this.errors.push(validator('cnpj', this.state.cnpj, 'CNPJ').message); }
        }  
        if (this.state.nascimento.length > 0){
            if (!validator('deMaior', this.state.nascimento, 'deMaior').result){ this.errors.push(validator('deMaior', this.state.nascimento, 'deMaior').message); }
        }
        if (this.state.celular.length > 0){
            if (!validator('telefone', this.state.celular, 'celular').result){ this.errors.push(validator('telefone', this.state.celular, 'celular').message); }
        }
        if (!validator('email', this.state.email, 'e-mail').result){ this.errors.push(validator('email', this.state.nome, 'e-mail').message); }
        if (!validator('senha', this.state.senha, 'senha').result){ this.errors.push(validator('senha', this.state.senha, 'senha').message); }
        if (this.state.senha != this.state.senha2){ this.errors.push('As senhas inseridas não são iguais.'); }
        if (!this.state.vendor && !this.state.service){this.errors.push('Você deve escolher uma das opções acima para configurarmos seu tipo de conta.'); } 
        if (this.errors.length > 0){ 
            this.setState({ loading: false });
            return; 
        }
        this.createAccount();
    }
    createAccount(){
        let roles = [ 'user' ];
        if (this.state.vendor){ roles.push('vendor'); }
        if (this.state.service){ roles.push('service'); }
        let options = {
            username: this.state.email.toLowerCase(),
            email: this.state.email.toLowerCase(),
            cellphone: this.state.celulat,
            password: this.state.senha,
            firstName: this.state.nome,
            lastName: this.state.sobrenome,
            genter: this.state.gender,
            birthday: this.state.birthday,
            //workingSince: this.state.workingSince_M + '/' + this.state.workingSince_Y,
            cpf: this.state.cpf,
            cnpj: this.state.cnpj,
            razaoSocial: this.state.razaoSocial,
            storeName: this.state.storeName,
            roles: roles,     
            accounts: {},
            verified: this.state.verified,
            limitedAccess: this.state.limitedAccess,
            displayOnly: this.state.displayOnly        
        };
        console.log(options)
        Meteor.call('AdminCreateAccount', options, (error, result)=>{
            if (error){
                console.log(error) ;
                this.errors.push('Ocorreu um erro durante o cadastro, verifique os dados inseridos e tente novamente.');    
                this.setState({ loading: false });  
            }else{
                this.successText = 'Cadastro efetuado com sucesso!';
                console.log(result)
                this.setState({ 
                    nome: '',
                    sobrenome: '',
                    email: '',
                    celular: '',
                    gender: 'Selecione um gênero',
                    workingSince_M: '',
                    workingSince_Y: '',
                    senha: '',
                    senha2: '',
                    storeName: '',
                    razaoSocial: '',
                    cpf: '',
                    cnpj: '',
                    vendor: false,
                    service: false,
                    verified: false, 
                    displayOnly: false,
                    limitedAccess: false,
                    loading: false
                });
            }
            

        });
        
        /*Accounts.createUser(options , (error)=>{
            if (error) { 
                console.log(error) ;
                this.errors.push('Ocorreu um erro durante o cadastro, verifique os dados inseridos e tente novamente.');    
                this.setState({ loading: false });            
            }else{ 
                this.successText = 'Cadastro efetuado com sucesso!';
                this.setState({ 
                    nome: '',
                    sobrenome: '',
                    email: '',
                    gender: 'Selecione um gênero',
                    senha: '',
                    senha2: '',
                    storeName: '',
                    cpf: '',
                    cnpj: '',
                    loading: false,
                    vendor: false,
                    service: false,
                    verified: false 
                });
                console.log(this.state); 
                Meteor.loginWithPassword(this.state.email, this.state.senha, (error, result)=>{
                    if (!error){
                        history.push('/index');                      
                    }else{
                        this.errors.push(error.message);  
                        this.setState({ loading: false }); 
                    }
                })
            }            
        })*/
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
        //if (Meteor.userId()){ Meteor.logout() }         
        let select=[{color:'#666', weight:'normal'}, {color:'#666', weight:'normal'}];
        
        if (this.state.vendor){ select[0].color = '#FF7000'; select[0].weight = 'bold' }      
        if (this.state.service){ select[1].color = '#FF7000'; select[1].weight = 'bold' }
        
        let month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        console.log(select)
        console.log(this.state)

        return(<div style={{width:'100%'}}>
            <MainHeader/>            
            <div style={{width:'100%', margin:'0 auto', maxWidth:'670px'}}>
                <div style={{width:'100%', marginTop:'40px'}}>
                    <div style={{textAlign:'center', marginBottom:'30px', fontSize:'20px', fontWeight:'bold'}}>CADASTRE-SE</div>
                    <div style={{display:'flex'}}>
                        <div style={{width:'50%', paddingRight:'25px'}}>
                            <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='nome' placeholder='NOME' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{width:'50%', paddingLeft:'25px'}}>
                            <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='sobrenome' value={this.state.sobrenome} placeholder='SOBRENOME' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                    </div>
                    <div style={{width:'100%', marginTop:'10px', display:'flex', paddingRight:'10px'}}>
                        <div style={{width:'50%', height:'32px', float:'left'}}>
                            <div style={{position:'relative', paddingRight:'5px'}}>
                                <CustomSelect boxStyle={{position:'absolute', top:'31px', zIndex:'45', borderRight:'0px', overflow:'hidden', overflowY:'hidden', width:'100%'}} dropStyle={{width:'100%', borderBottom:'1px solid #FF7000', borderTop:'0px'}} containStyle={{width:'100%'}} width='100%' height='32px' select={this.genders} name={'gender'} start={-1} startText='Selecione um gênero' value={this.state.gender} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>                            
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px'}}>
                            <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='nascimento' value={this.state.nascimento} placeholder='DATA DE NASCIMENTO' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                    </div>       
                    <div style={{marginTop:'10px'}}>
                        <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='cpf' value={this.state.cpf} placeholder='CPF' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div> 
                    <div style={{marginTop:'10px'}}>
                        <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='storeName' value={this.state.storeName} placeholder='NOME FANTASIA' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div> 
                    <div style={{marginTop:'10px'}}>
                        <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='razaoSocial' value={this.state.razaoSocial} placeholder='RAZÃO SOCIAL' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div> 
                    <div style={{marginTop:'10px'}}>
                        <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='cnpj' value={this.state.cnpj} placeholder='CNPJ' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>                          
                    <div style={{marginTop:'15px'}}>
                        <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='email' value={this.state.email} placeholder='E-MAIL' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>       
                    <div style={{marginTop:'15px'}}>
                        <input style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='celular' value={this.state.celular} placeholder='CELULAR' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>          
                    <div style={{display:'flex', marginTop:'10px'}}>
                        <div style={{width:'50%', paddingRight:'25px'}}>
                            <input type='password' style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='senha' value={this.state.senha} placeholder='SENHA' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{width:'50%', paddingLeft:'25px'}}>
                            <input type='password' style={{width:'100%', height:'30px', padding:'0px 20px', margin:'0px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='senha2' value={this.state.senha2} placeholder='CONFIRMAR SENHA' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>                        
                    </div>
                    <div style={{paddingTop:'15px', paddingLeft:'6px', margin:'auto 0', fontWeight:'bold', color:'#666', fontSize:'14px'}}>
                        Selecione uma ou mais categorias:
                    </div>
                    <div style={{display:'flex', marginTop:'15px'}}>
                        <CustomToggle name='vendor' value={this.state.vendor} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:select[0].weight, fontSize:'13px', color:select[0].color}}>
                            Fornecedor de materiais de contrução.
                        </span>
                    </div>                    
                    <div style={{display:'flex', marginTop:'15px', paddingBottom:(this.state.service)?'0px':'10px'}}>
                        <CustomToggle name='service' value={this.state.service} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:select[1].weight, fontSize:'13px', color:select[1].color}}>
                            Pestador de serviços.
                        </span>                        
                    </div> 
                    {/*<div style={{height:'30px', padding:'10px 0px 5px 22px', margin:'auto 0', lineHeight:'30px', fontSize:'13px', color:'#666', display:(this.state.service)?'flex':'none', position:'relative'}}>
                        <div style={{paddingRight:'5px'}}>Trabalhando na área desde:</div>
                        <CustomSelect boxStyle={{width:'100%', maxHeight:'180px', zIndex:'45', borderRight:'0px', overflow:'hidden', overflowY:'scroll', position:'relative', top:'-1px', right:'0px', bottom:'0px', left:'0px'}} dropStyle={{width:'100%', borderBottom:'1px solid #FF7000', borderTop:'0px'}} containStyle={{width:'120px'}} width='120px' height='30px' select={month} name={'workingSince_M'} start={0} value={this.state.gender} onChange={(e)=>{this.inputHandler(e)}}/>
                        <CustomInput width='90px' height='28px' margin='0px' style={{marginLeft:'5px'}} inputStyle={{textAlign:'center'}} name='workingSince_Y' value={this.state.workingSince_Y} placeholder='ANO' autoComplete='new-password' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>*/}
                    <div style={{display:'flex', padding:'10px 0 0 0', borderTop:'1px solid #FF700050'}}>
                        <CustomToggle name='verified' value={this.state.verified} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:(this.state.verified) ? 'bold' : 'normal', fontSize:'13px', color:(this.state.verified) ? '#FF7000' : '#666'}}>
                            Tornar perfil verificado.
                        </span>
                    </div> 
                    <div style={{display:'flex', padding:'15px 0 10px 0'}}>
                        <CustomToggle name='limitedAccess' value={this.state.limitedAccess} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:(this.state.limitedAccess) ? 'bold' : 'normal', fontSize:'13px', color:(this.state.limitedAccess) ? '#FF7000' : '#666'}}>
                            Manter perfil como Perfil Guia.
                        </span>
                    </div>
                    {/*<div style={{display:'flex', padding:'15px 0 10px 0'}}>
                        <CustomToggle name='displayOnly' value={this.state.displayOnly} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                        <span style={{width:'100%', paddingLeft:'6px', margin:'auto 0', fontWeight:(this.state.displayOnly) ? 'bold' : 'normal', fontSize:'13px', color:(this.state.displayOnly) ? '#FF7000' : '#666'}}>
                            Manter perfil como vitrine.
                        </span>
                    </div>*/}           
                    <div style={{fontSize:'14px', color:'#3BCD38', display:(this.successText != '') ? 'block' : 'none'}}>{this.successText}</div>                           
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
export default InterAccountCreatePage;