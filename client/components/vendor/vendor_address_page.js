import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';
import { mask } from '../subcomponents/widgets/mask';
import { GoogleMap, LoadScript, Autocomplete, Marker} from '@react-google-maps/api';
import { CepBrasil } from 'correios-brasil';
import { getState } from '../subcomponents/widgets/get_state';
import { validator } from '../subcomponents/widgets/validation_helper'
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold';
class VendorAddressPage extends Component {
    constructor(props){
        super(props);
        this.map = null;
        this.geocoder = null;
        this.start = true;
        this.errors = [];
        this.successText = [];
        this.selected = { lat: 0, lng: 0 };
        this._selected = { lat: 0, lng: 0 };
        this.state = {     
            canFill: false,
            cep: '',
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            complemento: '',
            estado: '',
            UF: '',
            pais: 'Brasil',
            address: { lat: 0, lng: 0 },
            displayMap: 'none',
            complete: 0,
            loading: true
        };
    }
    componentDidMount(){
        if (this.start){
            this.start = false;
            Meteor.subscribe('VendorSettings', ()=>{
                let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
                if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()}); }
                let displayMap = 'none';
                if (vendor.address){
                    let address = vendor.address;                    
                    if (!address.coords){ address.coords = {}; }
                    if (!address.coords.selected){ address.coords.selected = {lat: 0, lng: 0}; }
                    if (!address.coords.address){ address.coords.address = {lat: 0, lng: 0}; }else{ displayMap = 'block' }
                    this.selected = address.coords.selected;
                    this.setState({
                        cep: address.cep ? address.cep : '',
                        rua: address.rua ? address.rua : '',
                        numero: address.numero ? address.numero : '',
                        bairro: address.bairro ? address.bairro : '',
                        complemento: address.complemento ? address.complemento : '',
                        cidade: address.cidade ? address.cidade : '',
                        estado: address.estado ? address.estado : '',
                        UF: address.UF ? address.UF : '',
                        pais: address.pais ? address.pais : '',
                        address: address.coords.address,
                        loading: (this.state.complete < 1),
                        complete: (this.state.complete + 1),
                        displayMap: displayMap,
                        canFill: true                    
                    });
                }else{
                    this.setState({
                        loading: (this.state.complete < 1),
                        complete: (this.state.complete + 1),
                        displayMap: displayMap
                    });
                }      
            })
        }
    }
    inputHandler(e){
        this.successText = '';
        let name = e.target.name;
        let value = e.target.value;
        if (name == 'cep'){ 
            value = mask('cep', value); 
            if (validator('cep', value, 'CEP').result){
                this.setState({ canFill: true, cep: value });
                return;
            }else{
                this.setState({ canFill: false, cep: value });
                return;
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
    onLoad(map){
        let displayMap = 'none';               
        if (this.state.address.lat != 0 && this.state.address.lng != 0){ displayMap = 'block'; }
        this.setState({ 
            loading: (this.state.complete < 1),
            complete: this.state.complete + 1,
            displayMap: displayMap
        });        
        this.map = map;
        this.map.setCoords = (lat, lng)=>{
            if (
                lat < this.selected.lat + 0.0018 &&
                lat > this.selected.lat - 0.0018 &&
                lng < this.selected.lng + 0.0018 &&
                lng > this.selected.lng - 0.0018 
            ){
                this.selected = {lat: lat, lng: lng};
            }else{
                this.selected = {lat: lat, lng: lng};
                this.map.panTo({lat: lat, lng: lng});
                this.map.marker.setPosition({lat: lat, lng: lng});
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
                let lat = this.map.center.lat();
                let lng = this.map.center.lng();
                this.selected = {lat: lat, lng: lng};
                this._selected = this.selected;
                this.map.marker = new google.maps.Marker( {position: {lat: lat, lng: lng}, map: this.map} )            
            }else{
                if (this.selected.lat != this._selected.lat && this.selected.lng != this._selected.lng && this.successText != ''){
                    this.successText = '';
                    this._selected = this.selected;
                    this.setState({displayMap: this.state.displayMap});
                }
                let lat = this.map.center.lat();
                let lng = this.map.center.lng();
                this.selected = {lat: lat, lng: lng};                
                this.map.marker.setPosition({lat: lat, lng: lng});        
                this.map.setCoords(lat, lng);                
            }
        }
    }
    applyAddress(){        
        this.setState({ loading:true });
        this.successText = '';        
        this.errors = [];
        if (this.geocoder == null || this.state.loading){ return; }
        if (this.state.cep == '' || this.state.rua == '' || this.state.numero == '' || this.state.bairro == '' || 
        this.state.cidade ==''|| this.state.estado == '' || this.state.UF == ''){ 
            this.errors.push('É necessário preecher todos os campos obrigatórios.')
            this.setState({ loading:false });
            return; 
        }        
        let address = this.addressFormat();
        this.geocoder.geocode({'address': address}, (results, status)=>{
            if (status == google.maps.GeocoderStatus.OK) {                
                if (results.length > 0){
                    let coords = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};
                    this.selected = coords;
                    this.setState({address: coords});                                                       
                }
            }else{
                let coords = {lat: 0, lng: 0};
                this.selected = coords;
                this.setState({address: coords});
            }
            if (this.state.address.lat != 0 && this.state.address.lng != 0){
                this.setState({ displayMap: 'block', loading: false });
                this.saveAddress(1);
            }else{
                this.selected = {lat: 0, lng: 0}; 
                this.setState({ displayMap: 'none', loading: false });
            }
        });
    }
    autoFill(){   
        this.successText = '';
        if (!this.state.canFill){ return; }     
        if (this.state.loading){ return; }        
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
        }
        let correios = new CepBrasil();
        if (this.state.cep == '' || this.state.cep == undefined || this.state.cep.length < 9){
            this.errors.push('É necessário preecher o CEP para prosseguir.');
            this.setState({ loading: false })
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
                this.setState({ loading:false, canFill:false })
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
    saveAddress(display){
        this.errors = [];
        let pack = {
            cep: this.state.cep,
            rua: this.state.rua,
            numero: this.state.numero,
            bairro: this.state.bairro,
            cidade: this.state.cidade,
            complemento: this.state.complemento,
            estado: this.state.estado,
            UF: this.state.UF,
            pais: this.state.pais,
            coords: {address: this.state.address, selected: this.selected}
        }
        if (!validator('cep', pack.cep, 'CEP').result && pack.cep.length > 0){
            this.errors.push('O CEP informado não é válido.')
        }
        for (let key in pack){
            if (key != 'complemento' && pack[key] == '' ){ 
                let error = 'Preecha todos os campos obrigatórios e clique em "Atualizar".';
                if (!this.errors.includes(error)){ this.errors.push(error); }
                
            }
        }
        if (this.errors.length > 0){
            this.setState({ loading: false });
            return;
        }
        if (!this.state.loading && this.state.displayMap == 'block'){
            this.setState({ loading: true });
            Meteor.call('saveVendorAddress', pack, (error)=>{
                if (error){                    
                    this.errors.push(error.reason);
                }else{
                    if (display != 1){
                        this.successText = 'Seu perfil foi atualizado com sucesso!';
                        this._selected = this.selected;
                    }
                }
                this.setState({ loading: false });
            });
        }        
    }
    render(){       
        //if (!Meteor.userId()){ Meteor.logout(); history.push('/entrar'); }
        let fillButton = ['white', '#FF7000', 'bold'];
        let saveButton = ['white', '#FF7000', 'bold'];
        if (this.state.canFill){ fillButton = ['#FF7000', 'white', 'normal']; }
        if (this.state.displayMap == 'block' && this.successText == ''){ saveButton = ['#FF7000', 'white', 'normal']; }
        return(
            <div>
            <VendorHeader/>
            <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={["places"]}>
                <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                    <VendorMenu />
                    <div style={{width:'100%', backgroundColor:'white'}}>
                        <div style={{width:'100%', height:'45px', borderBottom:'1px solid #FF7000', backgroundColor:'#F7F7F7', display:'flex', position:'sticky', top:'0', zIndex:'30'}}>
                            <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px', fontWeight:'bold', color:'#555'}}>Editar Endereço</div>
                            <div style = {{margin:'auto', fontSize:'14px', paddingLeft:'20px', color:'#3BCD38', fontWeight:'bold'}}>{this.successText}</div>
                            <div style={{height:'21px', width:'75px', margin:'auto 20px', marginLeft:'auto', lineHeight:'21px', border:'3px solid #FF7000', textAlign:'center', color:saveButton[1], borderRadius:'15px', backgroundColor:saveButton[0], fontWeight:saveButton[2], cursor:'pointer'}} onClick={()=>{ this.saveAddress(); }}>Salvar</div>                            
                        </div> 
                        <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                            <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Endereço comercial:</div>
                            </div>
                            <div style={{width:'450px', height:'fit-content', margin:'30px auto 20px auto'}}>
                                <div style={{fontSize:'12px', lineHeight:'15px', color:'#555'}}>Informe seu endereço comercial para que seja possível calcular o valor do frete e támbem definir o local de retirada dos pedidos.</div> 
                            </div>
                            <div style={{width:'450px', margin:'0 auto', display:'flex'}}>
                                <div style={{width:'100%', marginRight:'10px'}}>
                                    <input style={{width:'100%', height:'30px', maxWidth:'261px', padding:'0px 20px', margin:'0 auto', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='cep' value={this.state.cep} placeholder='CEP' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'194px', height:'24px', lineHeight:'25px', border:'3px solid #FF7000', borderRadius:'15px', textAlign:'center', backgroundColor:fillButton[0], fontSize:'14px', color:fillButton[1], fontWeight:fillButton[2],  cursor:'pointer'}} onClick={()=>{this.autoFill()}}>
                                    PREENCHER
                                </div>
                            </div>
                            <div style={{width:'450px', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                                <div style={{width:'80%'}}>
                                    <input style={{width:'100%', height:'30px', maxWidth:'308px', padding:'0px 20px', margin:'0 auto', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='rua' value={this.state.rua} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'20%'}}>
                                    <input style={{width:'100%', height:'30px', maxWidth:'60px', padding:'0px 20px', margin:'0 auto', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='numero' value={this.state.numero} placeholder='Número' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                            <div style={{width:'450px', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                                <div style={{width:'50%', marginRight:'5px'}}>
                                    <input style={{width:'100%', height:'30px', maxWidth:'185px', padding:'0px 20px', margin:'0 auto', marginRight:'5px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='complemento' value={this.state.complemento} placeholder='Complemento (opcional)' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'50%', marginLeft:'5px'}}>
                                    <input style={{width:'100%', height:'30px', maxWidth:'185px', padding:'0px 20px', margin:'0 auto', marginLeft:'5px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='bairro' value={this.state.bairro} placeholder='Bairro' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                            <div style={{width:'450px', margin:'0 auto', marginTop:'10px', display:'flex'}}>
                                <div style={{width:'50%', marginRight:'5px'}}>
                                    <input style={{width:'100%', height:'30px', maxWidth:'185px', padding:'0px 20px', margin:'0 auto', marginRight:'5px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='estado' value={this.state.estado} placeholder='Estado' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{width:'50%', marginLeft:'5px'}}>
                                    <input style={{width:'100%', height:'30px', maxWidth:'185px', padding:'0px 20px', margin:'0 auto', marginLeft:'5px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='cidade' value={this.state.cidade} placeholder='Cidade' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                                <div style={{width:'450px', margin:'20px auto 0px auto', display:'flex'}}>
                                    <div style={{minWidth:'130px', height:'30px', lineHeight:'30px', borderRadius:'15px', textAlign:'center', backgroundColor:'#FF7000', fontSize:'14px', color:'white', cursor:'pointer'}} onClick={()=>{this.applyAddress()}}>
                                        Atualizar
                                    </div>
                                    <div style={{margin:'auto 20px', fontSize:'11px', lineHeight:'15px', color:'#555'}}>Clique em "Atualizar" para confirmar sua localização.</div> 
                                </div>
                                
                            
                            {this.displayErrors()}
                            <div style={{display:this.state.displayMap}}>
                                <div style={{width:'460px', height:'fit-content', lineHeight:'30px', margin:'10px auto', marginTop:'30px', fontSize:'12px', color:'#555'}}>
                                    <div style={{fontWeight:'bold', fontSize:'15px'}}>Localização:</div>
                                    <div style={{margin:'0px 0px 10px', lineHeight:'15px'}}>Aponte no mapa a localização exata de seu estabelecimento onde será retirado os pedidos e clique em "Salvar".</div>                                    
                                </div>                                    
                                <div style={{width:'460px', height:'250px', margin:'0 auto', marginBottom:'20px', borderRadius:'3px', border:'1px solid #FF7000', backgroundColor:'white'}}>
                                    <div style={{width:'100%', height:'100%'}}>
                                        <GoogleMap id='mainMap' mapContainerStyle={{height: '100%', width: '100%'}} clickableIcons={false} zoom={18} center={{lat: this.selected.lat, lng: this.selected.lng}} onLoad={this.onLoad.bind(this)} options={{disableDefaultUI: true}} onCenterChanged={this.mapCenterChange.bind(this)}>
                                        </GoogleMap>
                                    </div>
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
export default VendorAddressPage;