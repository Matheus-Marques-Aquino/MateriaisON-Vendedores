import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import VendorHeader from './subcomponents/vendor_header';
import VendorMenu from './subcomponents/vendorMenu';
import { GoogleMap, LoadScript, DistanceMatrixService, Autocomplete, Marker} from '@react-google-maps/api';
import { CepBrasil } from 'correios-brasil';
import { distanceBetween} from './subcomponents/widgets/distance_helper';

class OrderPage extends Component {
    constructor(props){
        super(props);
        this.map = null;
        this.geocoder = null;
        this.errors = null;
        this.distanceMatrix = null
        this.state = {
            rua: ['Alameda Terracota', 'Rua Coronel Camisão'],
            numero: ['185', '91'],
            bairro: ['Ceramica', 'Oswaldo Cruz'],
            cidade: ['São Caetano do Sul', 'São Caetano Sul'],
            uf: ['SP', 'SP'],
            cep: ['09530-190', '09571-020'],
            pais: ['Brasil', 'Brasil'],
            lat: [0, 0],
            lng: [0, 0],
            ready: [false, false],
            center: {lat: 0, lng: 0, onCenter: false},
            distance: '',
            distanceMatrix: {distance: {text: ''}},
            loading: true
        };
    }    
    addressFormat(){
        if (this.state.cep == '' || this.state.rua == '' || this.state.numero == '' || this.state.bairro == '' || 
        this.state.cidade ==''|| this.state.estado == '' || this.uf == ''){ return ''; }
        let address = ['', ''];

        address[0] += this.state.rua[0] + ', ';
        address[0] += this.state.numero[0] + ' - ';
        address[0] += this.state.bairro[0] + ', ';
        address[0] += this.state.cidade[0] + ' - ';
        address[0] += this.state.uf[0] + ', ';
        address[0] += this.state.cep[0] + ', ';
        address[0] += this.state.pais[0];

        address[1] += this.state.rua[1] + ', ';
        address[1] += this.state.numero[1] + ' - ';
        address[1] += this.state.bairro[1] + ', ';
        address[1] += this.state.cidade[1] + ' - ';
        address[1] += this.state.uf[1] + ', ';
        address[1] += this.state.cep[1] + ', ';
        address[1] += this.state.pais[1];
        return address;
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }
    matrixLoad(matrix){
        if (this.distanceMatrix == null){
            this.distanceMatrix = matrix;
        }     
    }
    onLoad(map){
        if (this.state.lat != 0 && this.state.lng){
            this.setState({ displayMap: 'block' });
        }else{
            this.setState({ displayMap: 'none' });
        }
        this.map = map;  
        this.map.center = {lat:0, lng:0};          
        if (this.geocoder == null){ 
            this.geocoder = new google.maps.Geocoder();            
            let address = this.addressFormat();
            // GET LAT AND LNG
            this.geocoder.geocode({'address': address[0]}, (results, status)=>{
                if (status == google.maps.GeocoderStatus.OK) {                
                    if (results.length > 0){
                        let lat_0 = this.state.lat;
                        let lng_0 = this.state.lng;
                        let ready_0 = this.state.ready;

                        lat_0[0] = results[0].geometry.location.lat();
                        lng_0[0] = results[0].geometry.location.lng();
                        ready_0[0] = true;
                        
                        this.setState({lat:lat_0, lng:lng_0, ready:ready_0});                   
                    }
                }else{           
                    let ready_0 = this.state.ready;  
                    ready_0[0] = false                     
                    this.setState({ ready: ready_0 });
                }
                if (this.state.lat[0] != 0 && this.state.lng[0] != 0 && this.state.lat[1] != 0 && this.state.lng[1] != 0){
                    this.setState({ displayMap: 'block', loading: false});
                }else{
                    this.setState({ displayMap: 'none', loading: false});
                }
            });
            
            this.geocoder.geocode({'address': address[1]}, (results, status)=>{
                if (status == google.maps.GeocoderStatus.OK) {                
                    if (results.length > 0){
                        let lat_1 = this.state.lat;
                        let lng_1 = this.state.lng;
                        let ready_1 = this.state.ready;

                        lat_1[1] = results[0].geometry.location.lat();
                        lng_1[1] = results[0].geometry.location.lng();
                        ready_1[1] = true;
                        
                        this.setState({lat:lat_1, lng:lng_1, ready:ready_1});                    
                    }
                }else{                    
                    let ready_1 = this.state.ready;  
                    ready_1[1] = false                     
                    this.setState({ ready: ready_1 });
                }
                if (this.state.lat[0] != 0 && this.state.lng[0] != 0 && this.state.lat[1] != 0 && this.state.lng[1] != 0){
                    this.setState({ displayMap: 'block', loading: false});
                }else{
                    this.setState({ displayMap: 'none', loading: false});
                }
            });   
        }        
    }
    centerMap(){
        let lat_0 = this.state.lat[0];
        let lat_1 = this.state.lat[1];
        let lng_0 = this.state.lng[0];
        let lng_1 = this.state.lng[1];

        if (this.state.center.onCenter == true){ return; }
        if (!lat_0 || !lat_1 || !lng_0 || !lng_1){ 
            let timer = setTimeout(()=>{this.centerMap}, 1000);
            return; 
        }

        let center = {lat: 0, lng: 0}
        let distance = (distanceBetween(lat_0, lng_0, lat_1, lng_1)+' km').replace('.', ',');

        center.lat = (lat_0 + lat_1) * 1000000;
        center.lng = (lng_0 + lng_1) * 1000000;

        center.lat = (parseFloat(center.lat) / 2);
        center.lng = (parseFloat(center.lng)/ 2);

        center.lat = parseFloat(center.lat) / 1000000;
        center.lng = parseFloat(center.lng) / 1000000;

        center.onCenter = true;

        this.map.marker_0 = new google.maps.Marker( {position: {lat:lat_0, lng:lng_0}, map: this.map} )
        this.map.marker_1 = new google.maps.Marker( {position: {lat:lat_1, lng:lng_1}, map: this.map} )
       
        var latlngList = [];
        latlngList.push(new google.maps.LatLng(lat_0, lng_0));
        latlngList.push(new google.maps.LatLng(lat_1, lng_1));

        var bounds = new google.maps.LatLngBounds();

        latlngList.map(n=>{ bounds.extend(n); });

        this.map.fitBounds(bounds); 
        this.setState({center:center, distance:distance});        
    }

    render(){
        console.log(this.state)
        if (this.state.ready[0] && this.state.ready[1]){ this.centerMap(); }

        return(
        <div>
            <VendorHeader/>
            <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={['places', 'geometry', 'drawing', 'visualization']}>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>                    
                    <div style={{margin:'0 20px', marginTop:'10px', padding:'5px 10px', borderRadius:'8px 8px 0px 0px', backgroundColor:'#3BCD3850', borderBottom:'1px solid #3BCD38'}}>
                        <div style={{height:'20px', padding:'5px 10px', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#666'}}>Pedido #51365: Em andamento</div>
                        </div>                        
                    </div>
                    <div style={{margin:'0 20px', padding:'5px 10px', backgroundColor:'#F7F7F7'}}>
                        <div style={{padding:'0 20px', backgroundColor:'#F7F7F7', overflow:'auto'}}>
                            <div style={{minWidth:'fit-content', marginRight:'50px', marginTop:'10px', float:'left'}}>
                                <div style={{minWidth:'fit-content', minHeight:'130px', marginBottom:'20px'}}>
                                    <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                        Dados do cliente:
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                        Nome: Matheus Marques de Aquino
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                        E-mail: matheusm.aquino@yahoo.com.br
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                        Telefone: (11)97954-4109
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                        CPF/CNPJ: 461.716.198-84
                                    </div>                       
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                    Endereço de envio:
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Destinatário: Matheus Marques de Aquino
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    CEP: 09571-020
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Rua: Coronel Camisão
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Número: 91
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Complemento: casa
                                </div>   
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Bairro: Oswaldo Cruz
                                </div>                             
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Cidade: São Caetano do Sul
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Estado: São Paulo
                                </div>
                            </div>
                            <div style={{minWidth:'fit-content', marginTop:'10px', float:'left'}}>
                                <div style={{minWidth:'fit-content', minHeight:'130px', marginBottom:'20px'}}>
                                    <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                        Status do pedido:
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', fontWeight:'bold', marginTop:'5px', fontSize:'14px', color:'#D7B614'}}>
                                        Preparando pedido
                                    </div>
                                    <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 10px', marginTop:'25px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>
                                        CANCELAR COMPRA
                                    </div>                      
                                </div>  
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                    Endereço de cobrança:
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    CEP: 09571-020
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Rua: Coronel Camisão
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Número: 91
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Complemento: casa
                                </div>   
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Bairro: Oswaldo Cruz
                                </div>                             
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Cidade: São Caetano do Sul
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Estado: São Paulo
                                </div>
                            </div>
                        </div>
                        <div style={{padding:'0 20px', marginTop:'20px',}}>
                            <div style={{height:'30px', lineHeight:'30px', marginBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                Produtos:
                            </div>
                            <div style={{display:'flex', width:'fit-content', height:'64px', paddingRight:'10px', borderBottom:'1px solid #FF700050'}}>
                                <div style={{minWidth:'50px', minHeight:'50px', margin:'auto 0', marginLeft:'5px', border:'1px solid #CCC', borderRadius:'3px', backgroundColor:'white'}}></div> 
                                <div style={{width:'fit-content', height:'50px', margin:'auto 0', display:'flex'}}>
                                    <div style={{width:'100%', maxWidth:'300px', height:'100%', margin:'0 10px', display:'flex'}}>
                                        <div style={{heigth:'fit-content', margin:'auto 0', fontSize:'13px', color:'#555'}}>
                                            Folha de Lixa para Massa Grão 180 225x275mm Norton
                                        </div>                                        
                                    </div>
                                    <div style={{display:'flex'}}>
                                        <div style={{width:'33%', minWidth:'75px', height:'100%', display:'flex'}}>
                                            <div style={{width:'100%', heigth:'fit-content', margin:'auto 0', textAlign:'center'}}>
                                                <div style={{fontSize:'13px', color:'#555', width:'fit-content'}}>
                                                    <div >100</div>
                                                    <div style={{fontSize:'10px'}}>unidades</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{width:'33%', minWidth:'75px', height:'100%', display:'flex'}}>
                                            <div style={{width:'100%', heigth:'fit-content', margin:'auto 0'}}>
                                                <div style={{fontSize:'13px', color:'#555', width:'fit-content', textAlign:'center'}}>
                                                    <div >R$50,00</div>
                                                    <div style={{fontSize:'10px'}}>unitário</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{width:'33%', minWidth:'75px', height:'100%', display:'flex'}}>
                                            <div style={{width:'100%', heigth:'fit-content', width:'fit-content', margin:'auto 0'}}>
                                                <div style={{fontSize:'14px', color:'#555', textAlign:'center'}}>
                                                    <div style={{paddingBottom:'13px'}}>R$5.000,00</div>                           
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{display:'flex', width:'fit-content', height:'64px', paddingRight:'10px', borderBottom:'1px solid #FF700050'}}>
                                <div style={{minWidth:'50px', minHeight:'50px', margin:'auto 0', marginLeft:'5px', border:'1px solid #CCC', borderRadius:'3px', backgroundColor:'white'}}></div> 
                                <div style={{width:'fit-content', height:'50px', margin:'auto 0', display:'flex'}}>
                                    <div style={{width:'100%', maxWidth:'300px', height:'100%', margin:'0 10px', display:'flex'}}>
                                        <div style={{heigth:'fit-content', margin:'auto 0', fontSize:'13px', color:'#555'}}>
                                            Folha de Lixa para Massa Grão 180 225x275mm Norton
                                        </div>                                        
                                    </div>
                                    <div style={{display:'flex'}}>
                                        <div style={{width:'33%', minWidth:'75px', height:'100%', display:'flex'}}>
                                            <div style={{width:'100%', heigth:'fit-content', margin:'auto 0', textAlign:'center'}}>
                                                <div style={{fontSize:'13px', color:'#555', width:'fit-content'}}>
                                                    <div >100</div>
                                                    <div style={{fontSize:'10px'}}>unidades</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{width:'33%', minWidth:'75px', height:'100%', display:'flex'}}>
                                            <div style={{width:'100%', heigth:'fit-content', margin:'auto 0'}}>
                                                <div style={{fontSize:'13px', color:'#555', width:'fit-content', textAlign:'center'}}>
                                                    <div >R$50,00</div>
                                                    <div style={{fontSize:'10px'}}>unitário</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{width:'33%', minWidth:'75px', height:'100%', display:'flex'}}>
                                            <div style={{width:'100%', heigth:'fit-content', width:'fit-content', margin:'auto 0'}}>
                                                <div style={{fontSize:'14px', color:'#555', textAlign:'center'}}>
                                                    <div>R$5.000,00</div>
                                                    <div style={{paddingBottom:'13px'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{display:'flex', marginTop:'20px'}}>
                                <div style={{width:'fit-content', paddingLeft:'5px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>
                                    <div style={{height:'20px'}}>
                                        Subtotal:
                                    </div>
                                    <div style={{height:'20px'}}>
                                        Frete (Sedex):
                                    </div>
                                    <div style={{height:'20px'}}>
                                        Total:
                                    </div>
                                </div>
                                <div style={{width:'fit-content', paddingLeft:'20px', fontSize:'14px', color:'#555'}}>
                                    <div style={{height:'20px', display:'flex'}}>
                                        R$<div style={{marginLeft:'auto'}}>10.000,00</div>
                                    </div>
                                    <div style={{height:'20px', display:'flex'}}>
                                        R$<div style={{marginLeft:'auto'}}>210,00</div>
                                    </div>
                                    <div style={{height:'20px', display:'flex'}}>
                                        R$<div style={{marginLeft:'auto'}}>10.210,00</div>
                                    </div>
                                </div>
                            </div>            
                        </div>
                        <DistanceMatrixService onLoad={this.matrixLoad.bind(this)} options={{origins: [{lat:this.state.lat[0], lng:this.state.lng[0]}], destinations: [{lat:this.state.lat[1], lng:this.state.lng[1]}], travelMode: 'DRIVING'}} 
                            callback={(result, status)=>{
                                if (result.originAddresses[0] == '0,0'){ return; }
                                if (result.destinationAddresses[0] == '0,0' ){ return; }
                                if (status != 'OK'){ return; }
                                if (this.state.distanceMatrix.status == 'OK'){ return; } 
                                console.log(result)
                                this.setState({distanceMatrix: {status:result.rows[0].elements[0].status, distance:result.rows[0].elements[0].distance}});                                
                            }}>
                        </DistanceMatrixService>
                        <div style={{padding:'0 20px', marginTop:'20px'}}>
                            <div style={{marginRight:'20px'}}>
                                <div style={{display:'flex'}}>
                                    <div style={{minWidth:'230px'}}>
                                        <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                            Forma de envio:
                                        </div>
                                        <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                            Transportadora: Sedex
                                        </div>
                                        <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                            Distância: {this.state.distance}
                                        </div>
                                        <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                            Distância Percorrida: {this.state.distanceMatrix.distance.text}
                                        </div>
                                    </div>
                                    <div style={{width:'fit-content'}}>
                                        <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                            Código de rastreio:
                                        </div>
                                        <div style={{display:'flex', marginTop:'5px'}}>
                                            <CustomInput width='155px' height='28px' name='trackingCode' value={this.state.trackingCode} onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{height:'30px', lineHeight:'30px', padding:'0 10px', marginLeft:'10px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>
                                                ENVIAR
                                            </div>
                                        </div> 
                                    </div>
                                </div>                                
                            </div>                    
                        </div> 
                        <div style={{height:'30px', lineHeight:'30px', marginTop:'20px', padding:'0 20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                            Instruções para a retirada do pacote:
                        </div>             
                        <CustomInput width='460px' height='28px' margin='5px 20px' name='motoboyInstruction' value={this.state.motoboyInstruction} placeholder='É recomendado informar o número do pedido e onde o retirar.' onChange={(e)=>{this.inputHandler(e)}}/>
                        <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 10px', marginTop:'20px', marginLeft:'20px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>
                            CHAMAR MOTOBOY
                        </div> 
                        <div style={{maxWidth:'480px', maxHeight:'250px', paddingBottom:'20px', marginTop:'30px', marginLeft:'20px'}}>
                            <GoogleMap id='mainMap' mapContainerStyle={{width:'480px', height:'250px', borderRadius:'8px', border:'1px solid #FF7000'}} clickableIcons={false} zoom={18} center={{lat: this.state.center.lat, lng:  this.state.center.lng}} onLoad={this.onLoad.bind(this)} options={{disableDefaultUI: true}}>
                            </GoogleMap> 
                        </div>                         
                    </div>
                </div>
            </div>
            </LoadScript>
            <Waiting open={this.state.loading} size='50px'/>
        </div>);
    }
}
export default OrderPage;