import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import VendorHeader from './subcomponents/vendor_header';
import VendorMenu from './subcomponents/vendorMenu';
import { mask } from './subcomponents/widgets/mask';
import { GoogleMap, LoadScript, Autocomplete, Marker} from '@react-google-maps/api';
import { CepBrasil } from 'correios-brasil';

class AddressAccountPage extends Component {
    constructor(props){
        super(props);
        this.map = null;
        this.geocoder = null;
        this.state = {
            cep: '',
            rua: '',
            numero: '',
            bairro: '',
            complemento: '',
            estado: '',
            uf: '',
            pais: 'Brasil',
            lat: 0,
            lng: 0,
            displayMap: 'none',
            loading: true
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
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        if (name == 'cep'){ value = mask('cep', value); }
        this.setState({ [name]: value });
    }
    onLoad(map){
        this.setState({loading: false});
        if (this.state.lat != 0 && this.state.lng){
            this.setState({ displayMap: 'block' });
        }else{
            this.setState({ displayMap: 'none' });
        }
        this.map = map;
        this.map.setCoords = (lat, lng)=>{
            if (
                lat < this.state.lat + 0.0018 &&
                lat > this.state.lat - 0.0018 &&
                lng < this.state.lng + 0.0018 &&
                lng > this.state.lng - 0.0018 
            ){
                this.latitude = lat;
                this.longitude = lng;
            }else{
                this.map.panTo({ lat: this.state.lat, lng: this.state.lng });
                this.map.marker.setPosition({ lat: this.state.lat, lng: this.state.lng });
            }
        }
        if (this.geocoder == null){ this.geocoder = new google.maps.Geocoder(); }
        if (!this.map.marker){
            this.map.marker = new google.maps.Marker( {position: {lat:this.map.center.lat(), lng:this.map.center.lng()}, map: this.map} )
        }
    }
    mapCenterChange(){
        if (this.map != null){
            if (!this.map.marker){
                this.map.marker = new google.maps.Marker( {position: {lat:this.map.center.lat(), lng:this.map.center.lng()}, map: this.map} )            
            }else{
                this.map.marker.setPosition({lat: this.map.center.lat(), lng: this.map.center.lng()})            
                this.map.setCoords(this.map.center.lat(), this.map.center.lng())
            }
        }
    }    
    addressFormat(){
        if (this.state.cep == '' || this.state.rua == '' || this.state.numero == '' || this.state.bairro == '' || 
        this.state.cidade ==''|| this.state.estado == '' || this.uf == ''){ return ''; }
        let address = '';
        address += this.state.rua + ', ';
        address += this.state.numero + ' - ';
        address += this.state.bairro + ', ';
        address += this.state.cidade + ' - ';
        address += this.state.uf + ', ';
        address += this.state.cep + ', ';
        address += this.state.pais;
        return address;
    }
    applyAddress(){
        if (this.geocoder == null || this.state.loading){ return; }
        if (this.state.cep == '' || this.state.rua == '' || this.state.numero == '' || this.state.bairro == '' || 
        this.state.cidade ==''|| this.state.estado == '' || this.uf == ''){ return; }
        this.setState({ loading:true });
        let address = this.addressFormat();
        this.geocoder.geocode({'address': address}, (results, status)=>{
            if (status == google.maps.GeocoderStatus.OK) {                
                if (results.length > 0){
                    this.setState({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});                    
                }
                console.log(results);
                console.log(status)
            }else{
                this.setState({lat: 0, lng: 0});
                console.log(status)
            }
            if (this.state.lat != 0 && this.state.lng){
                this.setState({ displayMap: 'block', loading: false });
            }else{
                this.setState({ displayMap: 'none', loading: false });
            }
        });
    }
    autoFill(){
        if (this.state.loading){ return; }
        this.setState({ loading:true });
        console.log(this.state)
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
                uf: address.UF,
                loading: false 
            });
        })
    }
    render(){        
        return(
            <div>
            <VendorHeader/>
            <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]}>
                <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                    <VendorMenu />
                    <div style={{width:'100%', backgroundColor:'white'}}>
                        <div style={{width:'100%', height:'45px', borderBottom:'1px solid #f7f7f7', backgroundColor:'#F7F7F7', display:'flex'}}>
                            <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px'}}>Editar Endereço</div>
                            <div style={{height:'27px', width:'75px', margin:'auto 0', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Salvar</div>
                            <div style={{height:'27px', width:'90px', margin:'auto 0', marginLeft:'10px', marginRight:'20px', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Rascunho</div>
                        </div> 
                        <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                            <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Endereço comercial:</div>
                            </div>
                            <div style={{width:'450px', margin:'0 auto', marginTop:'30px', display:'flex'}}>
                                <div style={{width:'100%', marginRight:'10px'}}>
                                    <CustomInput width='auto' height='30px' margin='0 auto' inputStyle={{textAlign:'center'}} name='cep' value={this.state.cep} placeholder='CEP' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'200px', height:'30px', lineHeight:'30px', borderRadius:'15px', textAlign:'center', backgroundColor:'#FF7000', fontSize:'14px', color:'white', cursor:'poiter'}} onClick={()=>{this.autoFill()}}>
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
                            <div style={{width:'450px', margin:'0 auto', marginTop:'20px'}}>
                                <div style={{width:'130px', height:'30px', lineHeight:'30px', borderRadius:'15px', textAlign:'center', backgroundColor:'#FF7000', fontSize:'14px', color:'white', cursor:'poiter'}} onClick={()=>{this.applyAddress()}}>
                                    Atualizar
                                </div>
                            </div>
                            <div style={{width:'450px', height:'30px', lineHeight:'30px', margin:'10px auto', marginTop:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                Localização:
                            </div>
                            <div style={{width:'450px', height:'250px', margin:'0 auto', marginBottom:'20px', borderRadius:'3px', border:'1px solid #FF7000', backgroundColor:'white'}}>
                                <div style={{width:'100%', height:'100%', display:this.state.displayMap}}>
                                    <GoogleMap id='mainMap' mapContainerStyle={{height: '100%', width: '100%'}} clickableIcons={false} zoom={18} center={{lat: this.state.lat, lng: this.state.lng}} onLoad={this.onLoad.bind(this)} options={{disableDefaultUI: true}} onCenterChanged={this.mapCenterChange.bind(this)}>
                                    </GoogleMap>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>            
            </LoadScript>
            <Waiting open={this.state.loading} size='50px'/>
        </div>);
    }
}
export default AddressAccountPage;