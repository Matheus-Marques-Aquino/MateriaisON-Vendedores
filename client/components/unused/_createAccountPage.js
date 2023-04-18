import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';

class CreateAccountPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.state = {
            nome: '',
            sobrenome: '',
            email: '',
            nomeLoja: '',
            telefone: '',
            senha: '',
            senha2: '',
            prestador: '',
            vendedor: '',
            cpf: '',
            cnpj: '',
            servico: '',
            loading: false,
            inputsController: {    
                type: 0,            
                nomeLoja: {
                    display: 'block',
                }, 
                cnpj: {
                    display: 'block',
                }, 
                cpf: {
                    display: 'block',
                }, 
                servico: {
                    display: 'block',
                }, 
                foto: {
                    display: 'flex',
                }, 
                documento: {
                    display: 'flex',
                }                 
            }
        };
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    }
    validateInputs(){
        
    }
    changeAccountType(type){
        console.log(type)
        if (type == this.state.inputsController.type){return;}
        let inputsController = null
        if (type == 0){
            inputsController = {
                type: 0,                 
                cnpj: {
                    display: 'block',
                }, 
                nomeLoja: {
                    display: 'block',
                },
                cpf: {
                    display: 'none',
                }, 
                servico: {
                    display: 'none',
                }, 
                foto: {
                    display: 'none',
                }, 
                documento: {
                    display: 'none',
                }
            }
        }
        if (type == 1){
            inputsController = {
                type: 1,                 
                cnpj: {
                    display: 'block',
                }, 
                nomeLoja: {
                    display: 'block',
                },
                cpf: {
                    display: 'none',
                }, 
                servico: {
                    display: 'none',
                }, 
                foto: {
                    display: 'none',
                }, 
                documento: {
                    display: 'none',
                }
            }
        }
        if (inputsController == null){ return; }
        this.setState({ inputsController: inputsController });
    }
    displayErrors(){        
        if (this.errors.length > 0){return(<div style={{marginTop:'5px'}}>
            {this.errors.map((error, index)=>{
                let key = 'input_'+index
                return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>)
            })}
        </div>)}        
    }
    render(){
        console.log(this.state)
        let inputs = this.state.inputsController;
        let type = [
            {fornecedor: {color: '#FF7000'}, prestador: {color: '#8E8E8E'}}, 
            {fornecedor: {color: '#8E8E8E'}, prestador: {color: '#FF7000'}}
        ];
        
        return(<div style={{width:'100%'}}>
            <MainHeader/>
            <div style={{width:'100%', maxWidth:'670px', margin:'0 auto', marginTop:'40px', padding:'0 20px'}}>
                <div style={{textAlign:'center', marginBottom:'30px', fontSize:'20px', fontWeight:'bold'}}>CADASTRE-SE</div>
                <div style={{height:'27px', padding:'20px 0', marginBottom:'30px', display:'flex'}}>
                    <div style={{width:'50%'}}>
                        <div style={{width:'fit-content', paddingRight:'20px', marginLeft:'auto', lineHeight:'27px', textAlign:'right', fontSize:'18px', fontWeight:'bold', color:type[inputs.type].fornecedor.color, borderRight:'1px solid #ff7000'}} onClick={()=>{this.changeAccountType(0)}}>Fornecedor</div>
                    </div>
                    <div style={{width:'50%'}}>
                        <div style={{width:'fit-content', marginRight:'auto', paddingLeft:'20px', lineHeight:'27px', textAlign:'left', fontSize:'18px', fontWeight:'bold', color:type[inputs.type].prestador.color, borderLeft:'1px solid #ff7000'}} onClick={()=>{this.changeAccountType(1)}}>Prestador de Serviço</div>
                    </div>
                </div>
                <div style={{display:'flex'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nome' value={this.state.nome} placeholder='NOME' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='sobrenome' value={this.state.sobrenome} placeholder='SOBRENOME' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                </div>
                <div style={{display:'flex', marginTop:'10px'}}>
                    <div style={{width:'50%', paddingRight:'5px', display:this.state.inputsController.nomeLoja}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='nomeLoja' value={this.state.nomeLoja} placeholder='NOME DA LOJA' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px', display:this.state.inputsController.cnpj}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='cnpj' value={this.state.cnpj} placeholder='CNPJ' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                </div> 

                <div style={{marginTop:'10px'}}>
                    <div style={{display:'flex'}}>
                        <div style={{width:'50%', paddingRight:'5px', display:this.state.inputsController.cpf}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='cpf' value={this.state.cpf} placeholder='CPF' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{width:'50%', paddingLeft:'5px', display:this.state.inputsController.servico}}>
                            <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='servico' value={this.state.servico} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                    </div>
                    <div style={{display:'flex', marginTop:'10px', padding:'10px 0'}}>
                        <div style={{width:'50%', display:'flex', padding:'10px 0', marginRight:'5px', border:'1px solid #ff7000', borderRadius:'3px'}}>
                            <div style={{width:'fit-content', height:'30px', margin:'0 auto', lineHeight:'15px', fontSize:'13px', textAlign:'center', color:'#666'}}>
                                Foto de seu rosto<br/>
                                (Deve estar nitida, e sem nenhum acessório cobrindo sua face)
                            </div>
                            <div style={{width:'160px', height:'30px', marginRight:'auto', lineHeight:'30px', borderRadius:'3px', fontSize:'12px', textAlign:'center', backgroundColor:'#A5A5A5', color:'white', boxSizing:'border-box'}}>
                                <div style={{width:'fit-content', display:'flex', margin:'0 auto'}}>
                                    <div style={{width:'13px', height:'30x', backgroundImage:'url(/imgs/icons/icon-upload.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', marginRight:'5px'}}></div>
                                    <div>SUBIR IMAGEM</div>
                                </div>                            
                            </div>
                        </div>                    
                        <div style={{width:'50%', padding:'10px 0', marginLeft:'5px', border:'1px solid #ff7000', borderRadius:'3px', display:'flex'}}>                            
                            <div style={{width:'fit-content', height:'30px', margin:'0 auto', lineHeight:'15px', textAlign:'center', color:'#666'}}>
                                <div style={{width:'max-content'}}>
                                    Documento Legível<br/>
                                    <div style={{minWidth:'145px', whiteSpace:'nowrap', fontSize:'10px'}}>(frente e verso)</div>
                                </div>
                            </div>
                            <div style={{width:'160px', height:'30px', marginRight:'auto', lineHeight:'30px', borderRadius:'3px', fontSize:'12px', textAlign:'center', backgroundColor:'#A5A5A5', color:'white', boxSizing:'border-box'}}>
                                <div style={{width:'fit-content', display:'flex', margin:'0 auto'}}>
                                    <div style={{width:'13px', height:'30x', backgroundImage:'url(/imgs/icons/icon-upload.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', marginRight:'5px'}}></div>
                                    <div>SUBIR IMAGEM</div>
                                </div>                            
                            </div>
                        </div>                        
                    </div>  
                </div>                              
                <div style={{display:'flex', marginTop:'10px'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='email' value={this.state.email} placeholder='E-MAIL' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='telefone' value={this.state.telefone} placeholder='TELEFONE' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                </div>                
                <div style={{display:'flex', marginTop:'10px'}}>
                    <div style={{width:'50%', paddingRight:'5px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='senha' value={this.state.senha} placeholder='SENHA' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                    <div style={{width:'50%', paddingLeft:'5px'}}>
                        <CustomInput width='auto' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name='senha2' value={this.state.senha2} placeholder='CONFIRMAR SENHA' onChange={(e)=>{this.inputHandler(e)}}/>
                    </div>
                </div> 
                {this.displayErrors()}
                <div style={{margin:'0 auto', marginTop:'60px', width:'220px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'15px', textAlign:'center', fontSize:'17px', color:'white'}} onClick={()=>{this.validateInputs()}}>
                    CRIAR CONTA
                </div>
                <div style={{marginTop:'60px', fontSize:'11px'}}>
                    <span style={{color:'#333'}}>
                        Ao clicar em "Criar Conta", você concorda com os 
                        <a style={{textDecoration:'none', color:'#3395f5'}}>
                            Termos de Uso
                        </a> e 
                        <a style={{textDecoration:'none', color:'#007af3'}} onClick={()=>{history.push('/politica-de-privacidade')}}>
                                Política de Privacidade
                        </a>.
                    </span>
                </div>
            </div>
            <Waiting open={this.state.loading} size='60px'/>
        </div>);
    }
}
export default CreateAccountPage;