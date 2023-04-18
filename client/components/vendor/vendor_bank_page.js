import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import CustomSelect from '../subcomponents/widgets/customSelect';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold';
import { mask } from '../subcomponents/widgets/mask';
import { validator } from '../subcomponents/widgets/validation_helper';

class VendorBankPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.successText = '';
        this.accountType = ['Conta Corrente', 'Conta Poupança'];
        this.state = {            
            accountOuwner: '',
            cpfCnpj: '',
            bankName: '',
            accountType: 'Selecione o tipo de conta',
            typeIndex: -1,
            agencia: '',
            agenciaDigito: '',
            conta: '',
            contaDigito: '',
            loading: true
        };
    }
    componentDidMount(){
        if (!Meteor.userId()){ 
            Meteor.logout();
            history.push('/entrar'); 
        }
        Meteor.subscribe('ProfileSettings', ()=>{
            let user = Meteor.users.findOne({'_id': Meteor.userId()});
            if (!user){ return; }
            if (!user.profile.roles.includes('vendor')){ history.push('/index') }
            Meteor.subscribe('VendorSettings', ()=>{
                let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
                if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()})}
                if (!vendor){ 
                    history.push('/index');    
                    return; 
                }                
                let bankData = {
                    accountOuwner: '',
                    cpfCnpj: '',
                    bankName: '',
                    accountType: '',
                    typeIndex: -1,
                    agencia: '',
                    agenciaDigito: '',
                    conta: '',
                    contaDigito: ''
                };
                let data = vendor.bankData;
                if (data){                   
                    console.log(data) 
                    data.agencia = (data.agencia) ? data.agencia.split('-') : ['', ''];
                    data.conta =  (data.conta) ? data.conta.split('-')  : ['', '']; 
                    bankData = {
                        accountOuwner: (data.titular) ? data.titular : '',
                        cpfCnpj: (data.CPFCNPJ) ? data.CPFCNPJ : '',
                        bankName: (data.banco) ? data.banco : '',
                        accountType: (data.tipo) ? data.tipo : '',
                        typeIndex: (data.tipo) ? this.accountType.indexOf(data.tipo) : -1,
                        agencia: (data.agencia[0]) ? data.agencia[0] : '',
                        agenciaDigito: (data.agencia[1]) ? data.agencia[1] : '',
                        conta: (data.conta[0]) ? data.conta[0] : '',
                        contaDigito: (data.conta[1]) ? data.conta[1] : '' 
                    }
                }
                this.setState({
                    accountOuwner: bankData.accountOuwner,
                    cpfCnpj: bankData.cpfCnpj,
                    bankName: bankData.bankName,
                    accountType: bankData.accountType,
                    typeIndex: bankData.typeIndex,
                    agencia: bankData.agencia,
                    agenciaDigito: bankData.agenciaDigito,
                    conta: bankData.conta,
                    contaDigito: bankData.contaDigito,
                    loading: false
                });                
            });
        });
    }
    inputHandler(e){
        this.successText = '';
        let name = e.target.name;
        let value = e.target.value;
        if (name == 'cpfCnpj'){ value = mask('cpf/cnpj', value); }
        if (name == 'agencia' || name == 'agenciaDigito' || name == 'conta' || name == 'contaDigito'){
            if (value != ''){
                if (!(/^\d+$/.test(value))){                 
                    value = this.state[name].toString(); 
                } 
            }
            switch(name){
                case 'agencia':
                    if (value.length > 4){ value = this.state[name].toString(); }
                    break;
                case 'agenciaDigito':
                    if (value.length > 1){ value = this.state[name].toString(); }
                    break;
                case 'conta':
                    if (value.length > 13){ value = this.state[name].toString(); }
                    break;
                case 'contaDigito':
                    if (value.length > 2){ value = this.state[name].toString(); }
                    break;
            }
        }        
        this.setState({ [name]: value });
    }
    saveBankData(){
        if (this.state.loading){return;}
        this.errors = [];
        this.setState({ loading:true });
        let pack = {
            accountOuwner: this.state.accountOuwner,
            cpfCNPJ: this.state.cpfCnpj,
            bankName: this.state.bankName,
            accountType: this.state.accountType ? this.state.accountType : '',
            agencia: (this.state.agenciaDigito == '') ? this.state.agencia : (this.state.agencia + '-' + this.state.agenciaDigito),
            conta: (this.state.contaDigito == '') ? this.state.conta : (this.state.conta + '-' + this.state.contaDigito)
        }
        if (pack.accountOuwner.length < 5){ this.errors.push('Insira o nome completo do titular da conta bancária.'); }
        if (pack.cpfCNPJ.length == ''){ 
            this.errors.push('Insira o CPF ou CNPJ do titular da conta bancária.'); 
        }else{            
            if (pack.cpfCNPJ.length < 14){ 
                this.errors.push('O CPF inserido não é válido.'); 
            }else{
                if (pack.cpfCNPJ.length == 14){
                    if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(pack.cpfCNPJ))){ 
                        this.errors.push('O CNPJ inserido não é válido.');
                    }
                }else{
                    if (pack.cpfCNPJ.length > 14 && pack.cpfCNPJ.length < 18){ 
                        this.errors.push('O CNPJ inserido não é válido');        
                    }else{
                        if (pack.cpfCNPJ.length == 18){
                            if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(pack.cpfCNPJ))){ 
                                console.log('d')
                                this.errors.push('O CNPJ inserido não é válido');
                            }
                        }
                    }
                }  
            }              
        }
        if (pack.bankName.length == ''){ this.errors.push('Insira o nome do banco.');}
        if (pack.accountType == '' || pack.accountType == 'Selecione o tipo de conta'){ this.errors.push('seleicone o tipo de conta.'); }
        if (pack.agencia.length < 3){ this.errors.push('Digite o número da agência.'); }
        if (pack.conta.length < 3){ this.errors.push('Digite o número da conta.'); }
        if (this.errors.length > 0){
            this.setState({loading: false});
            return;
        }
        Meteor.call('vendorSaveBankAccount', pack, (error)=>{
            if (error){
                this.errors.push(error.reason);
                console.log(error)
            }else{
                this.successText = 'Seus dados foram salvos com sucesso!';
            }
            this.setState({loading: false});
        })
    }
    displayErrors(){        
        if (this.errors.length > 0){return(<div style={{margin:'20px 0px 10px 19px'}}>
            {this.errors.map((error, index)=>{
                let key = 'input_'+index
                return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>);                               
            })}
        </div>)
        }      
    }
    render(){
        //if (!Meteor.userId()){ Meteor.logout(); history.push('/entrar'); }
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'45px', borderBottom:'1px solid #FF7000', backgroundColor:'#F7F7F7', display:'flex', position:'sticky', top:'0', zIndex:'30'}}>
                        <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px', fontWeight:'bold', color:'#555'}}>Editar Dados Bancários</div>
                        <div style = {{margin:'auto', fontSize:'14px', paddingLeft:'20px', color:'#3BCD38', fontWeight:'bold'}}>{this.successText}</div>
                        <div style={{height:'27px', width:'75px', margin:'auto 20px', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000', cursor:'pointer'}} onClick={()=>{this.saveBankData()}}>Salvar</div>                        
                    </div> 
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Dados bancários:</div>
                        </div>  
                        {this.displayErrors()}
                        <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                            <div style={{width:'185px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}><span style={{color:'#FF1414'}}>*</span>Titular da conta bancária</div>
                            <CustomInput style={{maxWidth:'280px'}} width='100%' height='30px' margin='auto 19px' name='accountOuwner' placeholder='Nome completo' inputStyle={{textAlign:'center'}} value={this.state.accountOuwner} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div> 
                        <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                            <div style={{width:'220px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}><span style={{color:'#FF1414'}}>*</span>CPF ou CNPJ da conta bancária</div>
                            <CustomInput style={{maxWidth:'280px'}} width='100%' height='30px' margin='auto 19px' name='cpfCnpj' placeholder='CPF/CNPJ' inputStyle={{textAlign:'center'}} value={this.state.cpfCnpj} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>   
                        <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                            <div style={{width:'175px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}><span style={{color:'#FF1414'}}>*</span>Banco</div>
                            <CustomInput style={{maxWidth:'280px'}} width='100%' height='30px' margin='auto 19px' name='bankName' placeholder='Banco' inputStyle={{textAlign:'center'}} value={this.state.bankName} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div> 
                        <div style={{marginTop:'15px', padding:'5px 0', color:'#555', position:'relative'}}>
                            <div style={{width:'175px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}><span style={{color:'#FF1414'}}>*</span>Tipo de conta</div>
                            <CustomSelect select={this.accountType} start={this.state.typeIndex} startText='Selecione um tipo de conta' style={{maxWidth:'235px', left:'19px', position:'absolute'}} boxStyle={{ width:'235px', position:'absolute', top:'58px', left:'19px', zIndex:'45', borderRight:'0px'}} dropStyle={{width:'235px', borderBottom:'1px solid #FF700', borderTop:'0px'}} width='235px' height='32px' name='accountType' value={this.state.accountType} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{display:'flex'}}>
                            <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                                <div style={{width:'100px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}><span style={{color:'#FF1414'}}>*</span>Agência</div>
                                <CustomInput type='number' style={{maxWidth:'100px'}} width='100%' height='30px' margin='auto 19px' name='agencia' placeholder='Agência' inputStyle={{textAlign:'center'}} value={this.state.agencia} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                            <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                                <div style={{width:'50px', margin:'auto 0', marginBottom:'5px', fontSize:'14px', fontWeight:'bold'}}>Dígito</div>
                                <CustomInput type='number' style={{maxWidth:'50px'}} width='100%' height='30px' margin='auto 0' name='agenciaDigito' value={this.state.agenciaDigito} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                        </div>
                        <div style={{display:'flex', marginBottom:'20px'}}>
                            <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                                <div style={{width:'100px', margin:'auto 0', marginBottom:'5px', marginLeft:'19px', fontSize:'14px', fontWeight:'bold'}}><span style={{color:'#FF1414'}}>*</span>Conta</div>
                                <CustomInput type='number' style={{maxWidth:'100px'}} width='100%' height='30px' margin='auto 19px' name='conta' placeholder='Conta' inputStyle={{textAlign:'center'}} value={this.state.conta} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                            <div style={{marginTop:'15px', padding:'5px 0', color:'#555'}}>
                                <div style={{width:'50px', margin:'auto 0', marginBottom:'5px', fontSize:'14px', fontWeight:'bold'}}>Dígito</div>
                                <CustomInput type='number' style={{maxWidth:'50px'}} width='100%' height='30px' margin='auto 0' name='contaDigito' value={this.state.contaDigito} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Waiting open={this.state.loading} size='60px' />
            </div>
        </div>);
    }
}
export default VendorBankPage;