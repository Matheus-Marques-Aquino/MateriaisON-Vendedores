import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import { mask } from '../subcomponents/widgets/mask';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import CustomSelect from '../subcomponents/widgets/customSelect';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';

class ServiceBankPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            accountOuwner: '',
            cpfCnpj: '',
            bankName: '',
            agencia: '',
            agenciaDigito: '',
            conta: '',
            contaDigito: ''
        };
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        if (name == 'cpfCnpj'){ value = mask('cpf/cnpj', value); }
        this.setState({ [name]: value });
    }
    render(){
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'45px', borderBottom:'1px solid #FF7000', backgroundColor:'#f7f7f7', display:'flex', position:'sticky', top:'0', zIndex:'30'}}>
                        <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px'}}>Editar Dados Bancários</div>
                        <div style={{height:'27px', width:'75px', margin:'auto 20px', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Salvar</div>                        
                    </div> 
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Dados bancários:</div>
                        </div>  
                        <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                            <div style={{width:'175px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}>Titular da conta bancária</div>
                            <CustomInput style={{maxWidth:'280px'}} width='100%' height='30px' margin='auto 19px' name='accountOuwner' inputStyle={{textAlign:'center'}} placeholder='Nome completo' value={this.state.accountOuwner} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div> 
                        <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                            <div style={{width:'195px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}>CPF/CNPJ da conta bancária</div>
                            <CustomInput style={{maxWidth:'280px'}} width='100%' height='30px' margin='auto 19px' name='cpfCnpj' inputStyle={{textAlign:'center'}} placeholder='CPF/CNPJ' value={this.state.cpfCnpj} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>   
                        <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                            <div style={{width:'175px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}>Banco</div>
                            <CustomInput style={{maxWidth:'280px'}} width='100%' height='30px' margin='auto 19px' name='bankName' inputStyle={{textAlign:'center'}} placeholder='Banco' value={this.state.bankName} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div> 
                        <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                            <div style={{width:'175px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}>Tipo de conta</div>
                            <CustomSelect select={['Selecione o tipo de conta', 'Conta Corrente', 'Conta Poupança']} style={{maxWidth:'302px', marginLeft:'19px'}} width='100%' height='32px' name='name' value={this.state.accountType} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{display:'flex'}}>
                            <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                                <div style={{width:'100px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}>Agência</div>
                                <CustomInput type='number' style={{maxWidth:'100px'}} width='100%' height='30px' margin='auto 19px' name='agencia' value={this.state.agencia} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                            <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                                <div style={{width:'50px', margin:'auto 0', marginBottom:'5px', fontSize:'14px', fontWeight:'bold'}}>Dígito</div>
                                <CustomInput type='number' style={{maxWidth:'50px'}} width='100%' height='30px' margin='auto 0' name='agenciaDigito' value={this.state.agenciaDigito} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                        </div>
                        <div style={{display:'flex', marginBottom:'20px'}}>
                            <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                                <div style={{width:'100px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}>Conta</div>
                                <CustomInput type='number' style={{maxWidth:'100px'}} width='100%' height='30px' margin='auto 19px' name='conta' value={this.state.conta} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                            <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                                <div style={{width:'50px', margin:'auto 0', marginBottom:'5px', fontSize:'14px', fontWeight:'bold'}}>Dígito</div>
                                <CustomInput type='number' style={{maxWidth:'50px'}} width='100%' height='30px' margin='auto 0' name='contaDigito' value={this.state.contaDigito} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default ServiceBankPage;