import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import { mask } from './subcomponents/widgets/mask';
import { CepBrasil } from 'correios-brasil';
import { LoadScript, Autocomplete} from '@react-google-maps/api';

class AccountSecondStepPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.start = true;
        this.state = {
            page: 0,
            cep: '',            
            rua:'',
            numero:'',
            complemento:'',
            bairro:'',
            cidade:'',
            estado:'',
            UF:''            
        };
    }

    getState(UF){
        switch(UF){
            case '':
                return ''
                break;

                case 'AC': 
                    return 'Acre';
                    break;

                case 'AL': 
                    return 'Alagoas';
                    break;
                
                case 'AP': 
                    return 'Amapá';
                    break;
                
                case 'AM': 
                    return 'Amazonas';
                    break;
                
                case 'BA': 
                    return 'Bahia';
                    break;
                
                case 'CE': 
                    return 'Ceará';
                    break;
                
                case 'DF': 
                    return 'Distrito Federal';
                    break;
                
                case 'ES': 
                    return 'Espírito Santo';
                    break;
                
                case 'GO': 
                    return 'Goiás';
                    break;
                
                case 'MA': 
                    return 'Maranhão';
                    break;
                
                case 'MT': 
                    return 'Mato Grosso';
                    break;

                case 'MS': 
                    return 'Mato Grosso do Sul';
                    break;
                
                case 'MG': 
                    return 'Minas Gerais';
                    break;
                
                case 'PA': 
                    return 'Pará';
                    break;
                
                case 'PB': 
                    return 'Paraíba';
                    break;
                
                case 'PR': 
                    return 'Paraná';
                    break;
                
                case 'PE': 
                    return 'Pernambuco';
                    break;
                
                case 'PI': 
                    return 'Piauí';
                    break;
                
                case 'RJ': 
                    return 'Rio de Janeiro';
                    break;
                
                case 'RN': 
                    return 'Rio Grande do Norte';
                    break;
                
                case 'RS': 
                    return 'Rio Grande do Sul';
                    break;
                
                case 'RO': 
                    return 'Rondônia';
                    break;
                
                case 'RR': 
                    return 'Roraima';
                    break;
                
                case 'SC': 
                    return 'Santa Catarina';
                    break;
                
                case 'SP': 
                    return 'São Paulo';
                    break;
                
                case 'SE': 
                    return 'Sergipe';
                    break;
                
                case 'TO': 
                    return 'Tocantins';
                    break;                
                
                default:
                    return '';
                    break;                
        }
    }

    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        if (name == 'cep'){ 
            value = mask('cep', value );
        }
        this.setState({ [name]: value });
    }
    displayErrors(width){
        if (this.errors.length > 0){return(<div style={{maxWidth:width, margin:'0 auto'}}>
            {this.errors.map((error, index)=>{
                let key = 'input_'+index
                return(<div style={{color:'red', fontSize:'14px'}} key={key}>{error}</div>)
            })}
        </div>)}        
    }
    validateCEP(){
        if (this.state.loading){ return; }
        this.setState({ loading:true })
        this.errors = [];
        let address = {
            cep: this.state.cep,
            rua:'',
            numero:'',
            complemento:'',
            bairro:'',
            cidade:'',
            estado:'',
            UF:'',
        }
        let correios = new CepBrasil();
        if (this.state.cep == '' || this.state.cep == undefined || this.state.cep.length < 9){
            this.errors.push('É necessario preecher o CEP para prosseguir.');
            this.setState({ loading:false })
            return;
        }
        correios.consultarCEP(this.state.cep).then((response) => {
            if (response.bairro != ''){ address.bairro = response.bairro; } 
            if (response.localidade != ''){ address.cidade = response.localidade; }
            if (response.logradouro != ''){ address.rua = response.logradouro; }
            if (response.uf != ''){ address.UF = response.uf;} 
            address.estado = this.getState(address.UF);
            if (correios.checkForError(response).message){
                this.errors.push(correios.checkForError(response).message);
                this.setState({ loading:false })
                return;
            }
            this.setState({ 
                rua: address.rua,
                bairro: address.bairro,
                cidade: address.cidade,
                estado: address.estado,
                UF: address.UF,
                page: 1,
                loading: false 
            });
        })
    }
    validateInputs(){
        if (this.state.loading){ return; }
        this.setState({ loading:true });
        this.errors = [];
        if (this.state.numero == ''){
            this.errors.push('O campo número é obrigatório.')
            this.setState({loading:false});
            return;
        }
        let address = {
            cep: this.state.cep,            
            rua: this.state.rua,
            numero: this.state.numero,
            complemento: this.state.complemento,
            bairro: this.state.bairro,
            cidade: this.state.cidade,
            estado: this.state.estado,
            UF: this.state.UF
        }
        Meteor.call('AccountSecondStep', address, (error)=>{
            if (error){
                this.errors.push(error.reason);
            }else{
                history.push('/entrar')
            }
            this.setState({loading:false});
        });
    }
    displayAddressPage(page){
        if (page == 0){
           return(<div>
                <div style={{width:'100%', textAlign:'center', marginBottom:'30px', fontSize:'20px', fontWeight:'bold'}}>PREENCHA SEU CEP</div>
                <div style={{maxWidth:'330px', textSize:'12px', margin:'0 auto', color:'#888'}}>Precisamos do seu CEP para confirmar sua localização.</div>
                <div style={{maxWidth:'210px', margin:'20px auto', marginTop:'60px'}}>
                    <CustomInput maxWidth='210px' height='30px' margin='0 auto' inputStyle={{textAlign:'center'}} name='cep' value={this.state.cep} placeholder='CEP' onChange={(e)=>{this.inputHandler(e)}}/>
                </div>
                {this.displayErrors('330px')}
                <div style={{margin:'0 auto', marginTop:'40px', width:'180px', height:'40px', lineHeight:'40px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'15px', textAlign:'center', fontSize:'17px', color:'white', cursor:'pointer'}} onClick={()=>{this.validateCEP()}}>
                    CONFIRMAR
                </div> 
                <Waiting open={this.state.loading} size='60px'/>
           </div>); 
        }
        if (page == 1){
            return(
            <div>
                <div style={{width:'100%', textAlign:'center', marginBottom:'30px', fontSize:'20px', fontWeight:'bold'}}>ENDEREÇO COMERCIAL</div>
                    <div style={{maxWidth:'670px', margin:'0 auto', padding:'0 20px'}}>
                        <div style={{maxWidth:'670px', margin:'0 auto', marginTop:'60px'}}>
                            <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center'}} name='cep' value={this.state.cep} placeholder='CEP' onChange={(e)=>{}}/>
                        </div>
                        <div style={{maxWidth:'670px', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                            <div style={{width:'80%', marginRight:'5px'}}>
                                <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center'}} name='rua' value={this.state.rua} placeholder='Rua' onChange={(e)=>{}}/>
                            </div>
                            <div style={{width:'20%', marginLeft:'5px'}}>
                                <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginLeft:'5px'}} name='numero' value={this.state.numero} placeholder='Número' onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                        </div>
                        <div style={{Maxwidth:'670px', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                            <div style={{width:'50%', marginRight:'5px'}}>
                                <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginRight:'5px'}} name='complemento' value={this.state.complemento} placeholder='Complemento (opcional)' onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                            <div style={{width:'50%', marginLeft:'5px'}}>
                                <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginLeft:'5px'}} name='bairro' value={this.state.bairro} placeholder='Bairro' onChange={(e)=>{}}/>
                            </div>
                        </div>
                        <div style={{MaxWidth:'670px', margin:'20px auto', marginTop:'10px', display:'flex'}}>
                            <div style={{width:'50%', marginRight:'5px'}}>
                                <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginRight:'5px'}} name='estado' value={this.state.estado} placeholder='Estado' onChange={(e)=>{}}/>
                            </div>
                            <div style={{width:'50%', marginLeft:'5px'}}>
                                <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginLeft:'5px'}} name='cidade' value={this.state.cidade} placeholder='Cidade' onChange={(e)=>{}}/>
                            </div>
                        </div>
                        {this.displayErrors('400px')}
                        <div style={{maxWidth:'400px', margin:'0 auto', display:'flex'}}>
                            <div style={{margin:'0 auto', marginTop:'40px', width:'150px', height:'35px', lineHeight:'35px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'15px', textAlign:'center', fontSize:'15px', color:'white', cursor:'pointer'}} onClick={()=>{this.setState({page: 0})}}>
                                VOLTAR
                            </div>
                            <div style={{margin:'0 auto', marginTop:'40px', width:'150px', height:'35px', lineHeight:'35px', backgroundColor:'#3395f5', border:'2px solid #3395f5', borderRadius:'15px', textAlign:'center', fontSize:'15px', color:'white', cursor:'pointer'}} onClick={()=>{this.validateInputs()}}>
                                CONFIRMAR
                            </div>
                        </div>                        
                    </div> 
                    <Waiting open={this.state.loading} size='60px'/>                
            </div>); 
        }
    }
    render(){
        console.log(Meteor.userId())
        if (this.start){
            this.start = false;
            if (!Meteor.userId()){ history.push('/entrar'); }
            Meteor.subscribe('userProfile', ()=>{
                let user = Profile.findOne({'_id': Meteor.userId()});
                if (!user.profile.roles){ history.push('/registrar'); }
                if (!Array.isArray(user.profile.roles)){ history.push('/registrar'); }
                if (user.profile.roles.length == 1){
                    if (user.profile.roles[0] == 'user' ){ history.push('/entrar'); }
                }
                user.profile.roles.map(role=>{
                    if (role == 'fornecedor'){
                        if (user.funcionario.fornecedor.address){
                            history.push('/entrar');
                        }
                    }
                    if (role == 'prestador'){
                        if (user.funcionario.prestador.address){
                            history.push('/entrar');
                        }
                    }
                    if (role == 'on-hold'){ history.push('/entrar'); }
                });
            });
        }
        return(<div style={{width:'100%'}}>
            <MainHeader/>
            <div style={{width:'100%', maxWidth:'670px', margin:'0 auto', marginTop:'40px'}}>
                {this.displayAddressPage(this.state.page)}
            </div>
        </div>);
    }
}
export default AccountSecondStepPage;
