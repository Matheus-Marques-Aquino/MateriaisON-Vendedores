import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';
import { Services } from '../../../imports/collections/services';
import { ServicesOnHold } from '../../../imports/collections/services_onhold';
import { mask } from '../subcomponents/widgets/mask';
import { GoogleMap, LoadScript, Autocomplete, Marker} from '@react-google-maps/api';
import { CepBrasil } from 'correios-brasil';
import { getUF } from '../subcomponents/widgets/get_UF';
import { getState } from '../subcomponents/widgets/get_state';
import { validator } from '../subcomponents/widgets/validation_helper';

class ServiceAddressPage extends Component {
    constructor(props){
        super(props);
        this.geocoder = null;
        this.start = true;
        this.errors = [];
        this.successText = '';
        this.state = {
            cep: '',
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            complemento: '',
            estado: '',
            UF: '',
            pais: 'Brasil',
            lat: 0,
            lng: 0,
            valid: true,
            canFill:false,
            loading: true
        };
    }
    componentDidMount(){
        if (this.start){
            this.start = false;
            if (!Meteor.userId()){ 
                Meteor.logout();
                history.push('/entrar'); 
            }
            Meteor.subscribe('ProfileSettings', ()=>{
                let user = Meteor.users.findOne({'_id': Meteor.userId()});
                if (!user){ history.push('/index'); return; }
                if (!user.profile.roles.includes('service')){ history.push('/index'); return; }
                Meteor.subscribe('ServiceSettings', ()=>{  
                    let service = Services.findOne({'service_id': Meteor.userId()});
                    if (!service){ service = ServicesOnHold.findOne({'service_id': Meteor.userId()})}
                    if (!service ){ history.push('/index'); return; }
                    if (!service.address){ this.setState({loading: false}); return; }
                    let address = service.address;
                    if (!address.coords){ address.coords = {}; }
                    if (!address.coords.selected){ address.coords.selected = {lat:0, lng:0}; }
                    if (!address.coords.address){ address.coords.address = {lat:0, lng:0}; }
                    if (address.valid != undefined){
                        if (address.valid == false){
                            this.errors.push('Não foi possível validar seu endereço, verifique se seus dados foram inseridos corretamente.')
                        }
                    }
                    this.setState({
                        cep: (address.cep) ? address.cep : '',
                        rua: (address.rua) ? address.rua : '',
                        numero: (address.numero) ? address.numero : '',
                        bairro: (address.bairro) ? address.bairro : '',
                        cidade: (address.cidade) ? address.cidade : '',
                        complemento: (address.complemento) ? address.complemento : '',
                        estado: (address.estado) ? address.estado : '',
                        UF: (address.UF) ? address.UF : '',
                        pais: (address.pais) ? address.pais : '',
                        lat: (address.coords.address.lat) ? address.coords.address.lat : '',
                        lng: (address.coords.address.lng) ? address.coords.address.lng : '',
                        canFill: (address.cep.length == 9),
                        loading: false
                    })
                });
            });
        }
    }
    onLoad(){
        if (this.geocoder == null){ this.geocoder = new google.maps.Geocoder(); }
    }
    inputHandler(e){
        this.successText = '';
        let name = e.target.name;
        let value = e.target.value;
        if (name == 'cep'){ 
            value = mask('cep', value); 
            if (value.length == 9){
                this.setState({canFill:true, cep:value});
                return;
            }else{
                if (value.length > 9){ return; }
                this.setState({cep:value, canFill:false})
            }
            
        }
        this.setState({ [name]: value });
    }
    addressFormat(){
        if (this.state.cep == '' || this.state.rua == '' || this.state.numero == '' || this.state.bairro == '' || 
        this.state.cidade ==''|| this.state.estado == '' || this.state.UF == ''){ return ''; }
        let address = '';
        address += this.state.rua + ', ';
        address += this.state.numero + ' - ';
        address += this.state.bairro + ', ';
        address += this.state.cidade + ' - ';
        address += this.state.UF + ', ';
        address += this.state.cep + ', ';
        address += this.state.pais;
        return address;
    }
    saveAddress(){
        this.setState({ loading:true });
        this.errors = [];
        if (this.geocoder == null || this.state.loading){ 
            this.errors.push('Ocorreu um erro de conexão, atualize a página e tente novamente.');
            return; 
        }
        let address = this.state;
        let UF = '';
        let valid= true
        let stateIndex = validator('estado', address.estado, '').result;
        if (address.cep.length < 9){ this.errors.push('O CEP preechido não é válido'); }
        if (address.rua.length < 3){ this.errors.push('O campo "Rua" é obrigatório.'); }
        if (address.numero.length < 1){ this.errors.push('O campo "Número" é obrigatório.'); }
        if (address.bairro.length < 3){ this.errors.push('O campo "Bairro" é obrigatório.'); }
        if (address.cidade.length < 3){ this.errors.push('O campo "Cidade" é obrigatório'); }
        if (address.estado.length < 3){ this.errors.push('O campo "Estado" é obrigatório.'); }else{
            if (stateIndex == -1){ 
                this.errors.push( validator('estado', address.estado, '').message);
            }else{
                UF = getUF(stateIndex);
                if (!UF){ 
                    UF = this.state.UF;
                }             
            }
        }       
        if (this.errors.length > 0){
            this.setState({ loading:false });
            return; 
        }        
        let pack = {
            cep: address.cep,
            rua: address.rua,
            numero: address.numero,
            bairro: address.bairro,
            cidade: address.cidade,
            estado: address.estado,
            UF: address.UF,
            pais: address.pais,
            coords: {},
            valid: valid
        }
        address = this.addressFormat();
        this.geocoder.geocode({'address': address}, (results, status)=>{
            if (status == google.maps.GeocoderStatus.OK) {                
                if (results.length > 0){
                    pack.coords = {
                        selected:{
                            lat: results[0].geometry.location.lat(), 
                            lng: results[0].geometry.location.lng()
                        },
                        address:{
                            lat: results[0].geometry.location.lat(), 
                            lng: results[0].geometry.location.lng()
                        }                         
                    };
                    pack.valid = true;
                    this.setState({
                        lat: results[0].geometry.location.lat(), 
                        lng: results[0].geometry.location.lng(), 
                        valid: true
                    }); 
                    Meteor.call('saveServiceAddress', pack, (error)=>{
                        if (error){
                            console.log(error);
                            this.errors.push(error.reason);
                        }else{
                            this.successText = 'Seu endereço foi autalizado com sucesso!'
                        }
                        this.setState({loading: false})
                    })
                }
            }else{
                this.errors.push('Não foi possível confirmar seu endereço, verifique se todos os campos foram preechidos corretamente');
                pack.coords = {
                    selected:{
                        lat: 0, 
                        lng: 0
                    },
                    address:{
                        lat: 0,
                        lng: 0
                    }
                };
                pack.valid = false;
                this.setState({
                    lat: 0, 
                    lng: 0, 
                    valid: false
                });
                Meteor.call('saveServiceAddress', pack, (error)=>{
                    if (error){
                        console.log(error);
                        this.errors.push(error.reason);
                    }else{
                        this.errors.push('Não foi possível validar seu endereço, verifique se seus dados foram inseridos corretamente.')
                        this.successText = 'Seu endereço foi autalizado.';                                                
                    }
                    this.setState({loading: false})
                })
            }            

        });
    }
    autoFill(){ 
        this.successText = '';     
        console.log(this.state)  
        if (this.state.loading){ return; }
        if (!this.state.canFill){ return; }
        this.setState({ loading:true });
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
        };
        let correios = new CepBrasil();
        if (this.state.cep == '' || this.state.cep == undefined || this.state.cep.length < 9){
            this.errors.push('O campo "CEP" é obrigatório.');
            this.setState({ loading:false })
            return;
        }
        correios.consultarCEP(this.state.cep).then((response) => {
            if (response.bairro != ''){ address.bairro = response.bairro; } 
            if (response.localidade != ''){ address.cidade = response.localidade; }
            if (response.logradouro != ''){ address.rua = response.logradouro; }
            if (response.uf != ''){ address.UF = response.uf;} 
            address.estado = getState(address.UF);
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
                loading: false 
            });
        })
    }
    displayErrors(){
        return(
        <div style={{marginTop:'20px', fontSize:'14px', color:'#FF1414'}}>
            {this.errors.map((error, index)=>{
                let key = 'error_' + index;
                return(<div key={key}>{ error }</div>);
            })}
        </div>);        
    }
    render(){        
        return(
            <div>
            <VendorHeader/>
            <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]} onLoad={()=>{this.onLoad();}}>
                <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                    <VendorMenu />
                    <div style={{width:'100%', backgroundColor:'white'}}>
                        <div style={{width:'100%', height:'45px', borderBottom:'1px solid #FF7000', backgroundColor:'#F7F7F7', display:'flex', position:'sticky', top:'0', zIndex:'30'}}>
                            <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px', fontWeight:'bold', color:'#555'}}>Editar Endereço</div>
                            <div style = {{margin:'auto', fontSize:'14px', paddingLeft:'20px', color:'#3BCD38', fontWeight:'bold'}}>{this.successText}</div>
                            <div style={{height:'27px', width:'75px', margin:'auto 20px', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000', cursor:'pointer'}} onClick={()=>{ this.saveAddress(); }}>Salvar</div>
                        </div> 
                        <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                            <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Endereço:</div>
                            </div>
                            <div style={{maxWidth:'450px', margin:'0 auto', marginTop:'30px', fontSize:'14px', color:'#666'}}> Insira abaixo seu enedereço residencial ou comercial. </div>
                            <div style={{width:'450px', margin:'0 auto', marginTop:'30px', display:'flex'}}>                                
                                <div style={{width:'100%', marginRight:'10px'}}>
                                    <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center'}} name='cep' value={this.state.cep} placeholder='CEP' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'194px', height:'26px', lineHeight:'26px', border:'3px solid #FF7000', borderRadius:'15px', textAlign:'center', backgroundColor:(this.state.canFill) ? '#FF7000' : 'white', fontSize:'14px', color:(this.state.canFill) ? 'white' : '#FF7000', fontWeight:(this.state.canFill) ? 'normal' : 'bold',  cursor:'pointer'}} onClick={()=>{this.autoFill()}}>
                                    PREENCHER
                                </div>
                            </div>
                            <div style={{width:'450px', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                                <div style={{width:'80%', marginRight:'5px'}}>
                                    <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center'}} name='rua' value={this.state.rua} placeholder='Rua' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'20%', marginLeft:'5px'}}>
                                    <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginLeft:'5px'}} name='numero' value={this.state.numero} placeholder='Número' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                            <div style={{width:'450px', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                                <div style={{width:'50%', marginRight:'5px'}}>
                                    <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginRight:'5px'}} name='complemento' value={this.state.complemento} placeholder='Complemento (opcional)' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'50%', marginLeft:'5px'}}>
                                    <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginLeft:'5px'}} name='bairro' value={this.state.bairro} placeholder='Bairro' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                            <div style={{width:'450px', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                                <div style={{width:'50%', marginRight:'5px'}}>
                                    <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginRight:'5px'}} name='estado' value={this.state.estado} placeholder='Estado' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'50%', marginLeft:'5px'}}>
                                    <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center', marginLeft:'5px'}} name='cidade' value={this.state.cidade} placeholder='Cidade' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                            {this.displayErrors()}                            
                        </div>
                    </div>
                </div>            
            </LoadScript>
            <Waiting open={this.state.loading} size='50px'/>
        </div>);
    }
}
export default ServiceAddressPage;