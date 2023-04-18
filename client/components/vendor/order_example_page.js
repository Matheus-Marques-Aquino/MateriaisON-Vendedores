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
import { GoogleMap, LoadScript, DistanceMatrixService, Autocomplete, Marker} from '@react-google-maps/api';
import { CepBrasil } from 'correios-brasil';
import { distanceBetween} from '../subcomponents/widgets/distance_helper';
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold';
import { Orders } from '../../../imports/collections/orders';
import ChatBox from '../subcomponents/chat_box.js';

class OrderExamplePage extends Component {
    constructor(props){
        super(props);
        this.map = null;
        this.geocoder = null;
        this.errors = null;
        this.distanceMatrix = null
        this.state = {            
            status: {
                name: 'Aguardando Pagamento',
                index: 0
            },
            order_status: -1,
            trackingCodeError: '',
            trackingCodeSuccess: '',
            status_update: {error:false, message:''},
            order_id: 'Exemplo de pedido',
            name : 'Cliente',
            CPFCNPJ: '000.000.000-00',
            email: 'email_do_cliente@exemplo.com',
            telefone: '(00)12345-64789',
            date: new Date(),
            products: [
                {
                    _id: '0',
                    id: '0',
                    id_vendor: '0',
                    createAt: new Date(),
                    img_url:[{position: 0, src: '', name:'teste.png'}],
                    name: 'Produto exemplo',
                    description: 'Exemplo de produto',
                    price: '0.00',
                    category:[ {name: 'Exemplo', slug: 'exemplo'}],
                    stock_quantity: '1',
                    details: [
                        {name: 'Peso (kg)', detail: '1'},
                        {name: 'Largura (cm)', detail: '1'},
                        {name: 'Altura (cm)', detail: '1'},
                        {name: 'comprimento (cm)', detail: '1'}
                    ],
                    tags: ['#Pedido', '#Exemplo'],
                    popularity: [null],
                    quantity: 1
                }
            ],
            price: '0.00',
            delivery: {
                name: 'Sedex',
                price: '0.00',
                index: 2,
                trackingCode: '',
                box: {
                    w: '1',
                    h: '1',
                    d: '1',
                    wg: '1',
                    error: false
                }
            },
            address: {
                destinatario: 'Cliente Exemplo',
                celular: '(00)12345-6789',
                rua: ['Avenida Interlagos', 'Avenida Ibirapuera'],
                numero: ['2255', '3103'],
                bairro: ['Jardim Umuarama', 'Indianópolis'],
                cidade: ['São Paulo', 'São Paulo'],
                UF: ['SP', 'SP'],
                estado: ['São Paulo', 'São Paulo'],                
                cep: ['04661-200', '04029-902'],
                pais: ['Brasil', 'Brasil'],
                complemento: ['', ''],
                coords: {
                    selected: {
                        lat: [-23.6764362, -23.6104927],
                        lng: [-46.6804545, -46.6688605]
                    },
                    address: {
                        lat: [-23.6764362, -23.6104927],
                        lng: [-46.6804545, -46.6688605]
                    }
                }
            },
            billing: {
                nome: 'Cliente Exemplo',
                email: 'email_do_cliente@exemplo.com',
                celular: '(00)12345-64789',
                CPFCNPJ: '000.000.000-00',
                rua: 'Avenida Interlagos',
                numero:  '2255',
                bairro: 'Jardim Umuarama',
                cidade: 'São Paulo',
                UF: 'SP',
                estado: 'São Paulo',                
                cep: '04661-200',
                pais: 'Brasil',
                complemento: ''
            },
            payment: {
                type: {index: -1}
            },
            ready: [false, false],
            center: {lat: 0, lng: 0, onCenter: false},
            distance: '',
            distanceMatrix: {distance: {text: ''}},
            displayMap: 'none',
            motoboyInstruction: '',
            loading: true
        };
    } 
    componentDidMount(){ this.setState({ loading: false }); }   
    addressFormat(){
        let address = this.state.address
        if (address.cep[0] == '' || address.cep[1] == ''){ return; }
        if (address.rua[0] == '' || address.rua[1] == ''){ return; }
        if (address.numero[0] == '' || address.numero[1] == ''){ return; }
        if (address.bairro[0] == '' || address.bairro[1] == ''){ return; }
        if (address.cidade[0] == '' || address.cidade[1] == ''){ return; }
        if (address.estado[0] == '' || address.estado[1] == ''){ return; }
        if (address.UF[0] == '' || address.UF[1] == ''){ return; }
        let _address = ['', ''];

        _address[0] += address.rua[0] + ', ';
        _address[0] += address.numero[0] + ' - ';
        _address[0] += address.bairro[0] + ', ';
        _address[0] += address.cidade[0] + ' - ';
        _address[0] += address.uf[0] + ', ';
        _address[0] += address.cep[0] + ', ';
        _address[0] += address.pais[0];

        _address[1] += address.rua[1] + ', ';
        _address[1] += address.numero[1] + ' - ';
        _address[1] += address.bairro[1] + ', ';
        _address[1] += address.cidade[1] + ' - ';
        _address[1] += address.uf[1] + ', ';
        _address[1] += address.cep[1] + ', ';
        _address[1] += address.pais[1];
        return address;
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        if (name == 'trackingCode'){
            let delivery = this.state.delivery;
            delivery.trackingCode = value;
            this.setState({delivery: delivery});
            return;
        }
        this.setState({ [name]: value });
    }
    matrixLoad(matrix){
        if (this.distanceMatrix == null){
            this.distanceMatrix = matrix;
        }     
    }
    onLoad(map){        
        let address = this.state.address;
        if (address.coords.selected.lat[0] == 0 || address.coords.selected.lng[0] == 0 || address.coords.selected.lat[1] == 0 || address.coords.selected.lng[1] == 0){
            this.setState({ displayMap: 'none' });
        }else{
            this.setState({ displayMap: 'block' });
            
        }
        this.map = map;  
        this.map.center = {lat:0, lng:0};
        if (!this.state.center.onCenter){ this.centerMap(); }
        return;     
    }
    centerMap(){
        let coords = this.state.address.coords.selected;

        if (this.state.center.onCenter == true){ return; }

        let center = {lat: 0, lng: 0}
        let distance = (distanceBetween(coords.lat[0], coords.lng[0], coords.lat[1], coords.lng[1])+' km').replace('.', ',');

        center.lat = (coords.lat[0] + coords.lat[1]) * 1000000;
        center.lng = (coords.lng[0] + coords.lng[1]) * 1000000;

        center.lat = center.lat / 2;
        center.lng = center.lng / 2;

        center.lat = center.lat / 1000000;
        center.lng = center.lng / 1000000;

        center.onCenter = true;

        this.map.marker_0 = new google.maps.Marker( {position: {lat:coords.lat[0], lng:coords.lng[0]}, map: this.map} )
        this.map.marker_1 = new google.maps.Marker( {position: {lat:coords.lat[1], lng:coords.lng[1]}, map: this.map} )
       
        var latlngList = [];
        latlngList.push(new google.maps.LatLng(coords.lat[0], coords.lng[0]));
        latlngList.push(new google.maps.LatLng(coords.lat[1], coords.lng[1]));

        var bounds = new google.maps.LatLngBounds();

        latlngList.map(n=>{ bounds.extend(n); });

        this.map.fitBounds(bounds); 
        this.setState({center:center, distance:distance});   
    }
    productsList(){
        let products = this.state.products;
        return(<div>{
            products.map((product, index)=>{
                let key = 'Product_'+index;
                let total = product.price.toString().replace('.', ',');
                total = parseFloat(total);
                total = total * product.quantity;
                total = total.toFixed(2);
                return(
                <div style={{display:'flex', width:'fit-content', height:'64px', borderBottom:'1px solid #FF700050'}} key={key}>
                    <div style={{minWidth:'50px', minHeight:'50px', margin:'auto 0', marginLeft:'5px', border:'1px solid #CCC', borderRadius:'3px', backgroundImage:'url('+ product.img_url[0].src+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundColor:'white'}}></div> 
                    <div style={{width:'fit-content', height:'50px', margin:'auto 0', display:'flex'}}>
                        <div style={{width:'100%', maxWidth:'300px', height:'100%', margin:'0 10px', display:'flex'}}>
                            <div style={{width:'200px', heigth:'fit-content', margin:'auto 0', fontSize:'13px', color:'#555'}}>
                                {product.name}
                            </div>                                        
                        </div>
                        <div style={{display:'flex'}}>
                            <div style={{width:'33%', minWidth:'75px', height:'100%', display:'flex'}}>
                                <div style={{width:'fit-content', heigth:'fit-content', margin:'auto 0', textAlign:'center'}}>
                                    <div style={{fontSize:'13px', color:'#555', width:'fit-content'}}>
                                        <div>{product.quantity}</div>
                                        <div style={{fontSize:'10px'}}>unidades</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{width:'33%', minWidth:'100px', height:'100%', display:'flex'}}>
                                <div style={{width:'fit-content', heigth:'fit-content', margin:'auto'}}>
                                    <div style={{fontSize:'13px', color:'#555', textAlign:'center'}}>
                                        <div >R$ {product.price.toString().replace('.', ',')}</div>
                                        <div style={{fontSize:'10px'}}>unitário</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{width:'33%', minWidth:'100px', height:'100%', display:'flex'}}>
                                <div style={{width:'fit-content', heigth:'fit-content', margin:'auto'}}>
                                    <div style={{fontSize:'13px', color:'#555', textAlign:'center'}}>
                                        <div style={{paddingBottom:'13px'}}>R$ {total.toString().replace('.', ',')}</div>                           
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>);
            })
        }</div>);        
    }
    updateTrackingCode(){        
        this.setState({ 
            trackingCodeError: '',
            trackingCodeSuccess: 'Pedido atualizado com sucesso.'
        }); 
    }
    updateStatus(){
        if (this.state.loading){ return; }
        if (this.state.order_status < 0){ return; }
        this.setState({ status_update: {error: false, message: ''} });
        let index = parseInt(this.state.order_status);
        let orderStatus = ['Aguardando pagamento', 'Preparando pedido', 'Pedido em transporte', 'Pedido concluído', 'Pedido cancelado', 'Pagamento recusado'];
        this.setState({ 
            status_update: {error: false, message: 'Pedido aualizado com sucesso.'},
            status: {name: orderStatus[index], index: index}
        });
    }
    selectLayout(){
        let status = this.state.status;
        let orderStatus = ['Aguardando pagamento', 'Preparando pedido', 'Pedido em transporte', 'Pedido concluído', 'Pedido cancelado', 'Pagamento recusado'];
        let orderIndex = ['0', '1', '2', '3', '4', '5']
        if (status.index < 0){ return; }
        orderStatus.splice(status.index, 1);
        orderStatus.unshift(status.name);
        orderIndex.splice(status.index, 1);
        orderIndex.unshift(status.index.toString());
        console.log(orderStatus);
        console.log(orderIndex)
        return(
            <select style={{width:'220px', height:'30px', padding:'0 10px', lineHeight:'30px', fontSize:'15px', color:'#444'}} name='order_status' onChange={(e)=>{ this.inputHandler(e); }}>{
                orderStatus.map((select, index)=>{
                    let key='Select_'+index;
                    return(<option value={orderIndex[index]} key={key}>{select}</option>)
                })
            }</select>
        )
    }
    render(){
        console.log(this.state)
        if (this.state.loading){ return(<div></div>); }
        let profile = this.state;
        let address = this.state.address;
        let billing = this.state.billing;
        let delivery = this.state.delivery;
        let payment = this.state.payment;
        let products = this.state.products;
        let status = this.state.status;

        let lastHour = new Date();
        let hour = lastHour.getHours();
        hour = (hour < 10) ? '0' + hour.toString() : hour.toString();
        let minutes = lastHour.getMinutes();
        minutes = (minutes < 10 ) ? '0' + minutes.toString() : minutes.toString();
        lastHour = hour + ':' + minutes;

        //Aguardando pagamento, Processando pagamento, Pagamento aprovado, Pagamento recusado, Pagamento cancelado
        //'Aguardando pagamento', 'Preparando pedido', 'Pedido em transporte', 'Pedido concluído', 'Pedido cancelado', 'Pagamento recusado'
        let colors = ['#D7B614', '#007AF3', '#D7B614', '#3BCD38', '#FF1414', '#FF1414' ]

        billing.CPFCNPJ_text = 'CPF';
        profile.CPFCNPJ_text = 'CPF';

        if (billing.CPFCNPJ.length > 14){ billing.CPFCNPJ_text = 'CNPJ'; }
        if (profile.CPFCNPJ.length > 14){ profile.CPFCNPJ_text = 'CNPJ'; }
        //if (!(payment.type < 0)){ payment.color = colors[payment.status.index +1 ]; }
        
        status.color = colors[status.index];

        profile.subtotal = 0.00;
        products.map( product => {
            let price = product.price.toString().replace(',', '.');
            price = parseFloat(price);
            profile.subtotal += price;
        });
        profile.subtotal = profile.subtotal.toFixed(2);

        return(
        <div>
            <VendorHeader/>
            <LoadScript id="script-loader" googleMapsApiKey="AIzaSyB2cI2xl2b40J1NNg4EZ2VXuD2JTBJ2GTg" libraries={['places', 'geometry', 'drawing', 'visualization']}>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>                    
                    <div style={{margin:'0 20px', marginTop:'10px', padding:'5px 10px', borderRadius:'8px 8px 0px 0px', backgroundColor:status.color+'80', borderBottom:'1px solid '+status.color}}>
                        <div style={{height:'20px', padding:'5px 10px', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#666'}}>Pedido #{profile.order_id.toString().replace('_', '')}: {status.name}</div>
                        </div>                        
                    </div>
                    <div style={{margin:'0 20px', padding:'5px 10px', backgroundColor:'#F7F7F7'}}>
                        <div style={{padding:'0 20px', backgroundColor:'#F7F7F7', overflow:'auto'}}>
                            <div style={{width:'100%', height:'fit-content', margin:'10px 0 0'}}>
                                <div style={{display:'flex'}}>
                                    <div style={{lineHeight:'30px', marginRight:'15px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>Andamento do pedido:</div>
                                    {/*<select style={{width:'220px', height:'30px', padding:'0 10px', lineHeight:'30px', fontSize:'15px', color:'#444'}} name='orser_status' onChange={(e)=>{ this.inputHandler(e); }}>
                                        <option value={'0'}>Aguardando pagamento</option>
                                        <option value={'1'}>Preparando pedido</option>
                                        <option value='2'>Pedido em transporte</option>
                                        <option value='3'>Pedido concluído</option>
                                        <option value='4'>Pedido cancelado</option>
                                        <option value='5'>Pagamento recusado</option>
                                    </select>*/}
                                    {this.selectLayout()}
                                    <div style={{height:'30px', lineHeight:'30px', padding:'0 10px', marginLeft:'10px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}} onClick={()=>{this.updateStatus()}}>
                                        ATUALIZAR
                                    </div>
                                </div>
                                <div style={{height:(this.state.status_update.message == '')?'0px':'20px', lineHeight:'20px', marginTop:'5px', fontSize:'14px', color:(this.state.status_update.error)?'#FF1414':'#3BCD38'}}>
                                    {this.state.status_update.message}
                                </div>
                            </div>
                            <div style={{minWidth:'fit-content', marginRight:'50px', marginTop:'10px', float:'left'}}>
                                <div style={{minWidth:'fit-content', minHeight:'130px', marginBottom:'20px'}}>
                                    <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                        Dados do cliente:
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                        Nome: {profile.name}
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                        E-mail: {profile.email}
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                        Telefone: {profile.phone}
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                        {profile.CPFCNPJ_text}: {profile.CPFCNPJ}
                                    </div>                       
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                    Endereço de envio:
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Destinatário: {address.destinatario}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Celular: {address.celular}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    CEP: {address.cep[1]}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Rua: {address.rua[1]}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Número: {address.numero[1]}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Complemento: {address.complemento[1]}
                                </div>   
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Bairro: {address.bairro[1]}
                                </div>                             
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Cidade: {address.cidade[1]}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Estado: {address.estado[1]}
                                </div>
                            </div>
                            <div style={{minWidth:'fit-content', marginTop:'10px', float:'left'}}>
                                {/*<div style={{minWidth:'fit-content', minHeight:'130px', marginBottom:'20px', color:'#555'}}>
                                    <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold'}}>
                                        Status do pedido:
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', fontWeight:'bold', color:payment.color}}>
                                        {status.name}
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px'}}>
                                        {payment.flag.charAt(0) + payment.flag.slice(1).toLowerCase()} terminado em {payment.digits}
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px'}}>
                                        Pagamento: ({payment.installments}x R$ {payment.installmentsPrice.toString().replace('.', ',')})
                                    </div>
                                    <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 10px', marginTop:'25px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF1414', color:'white', cursor:'pointer'}}>
                                        CANCELAR PEDIDO
                                    </div>                     
                                </div>*/}
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                    Endereço de cobrança:
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Nome: {billing.nome}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    {billing.CPFCNPJ_text}: {billing.CPFCNPJ}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    CEP: {billing.cep}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Rua: {billing.rua}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Número: {billing.numero}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Complemento: {billing.complemento}
                                </div>   
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Bairro: {billing.bairro}
                                </div>                             
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Cidade: {billing.cidade}
                                </div>
                                <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                    Estado: {billing.estado}
                                </div>
                            </div>
                        </div>
                        <div style={{padding:'0 20px', marginTop:'20px',}}>
                            <div style={{height:'30px', lineHeight:'30px', marginBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                Fale diretamente com o cliente:
                            </div>
                            <div style={{maxWidth:'500px', width:'100%', height:'fit-content'}}>
                                <div style={{maxWidth:'480px', height:'fit-content', border:'1px solid #FFDBBF', borderRadius:'5px', backgroundColor:'white'}}>
                                    
                                    <div style={{height:'39px', padding:'0 10px', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                                        <div style={{maxWidth:'100%', maxHeight:'30px', margin:'auto', overflow:'hidden', fontSize:'13px', fontWeight:'bold', color:'#555', display:(this.props.title)?'block':'none'}}>{this.props.title}</div>
                                        
                                    </div>
                                    <div className='customScroll' style={{maxHeight:'180px', padding:'0px 5px 5px 5px', overflowY:'scroll', borderBottom:'1px solid #FFDBBF', backgroundColor:'#F7F7F7'}}>
                                        <div style={{minHeight:'150px'}}>
                                            <div style={{height:'35px', lineHeight:'35px', fontSize:'13px', fontWeight:'bold', textAlign:'center', color:'#555'}}>Sexta</div>
                                            <div style={{width:'fit-content', maxWidth:'70%', height:'fit-content', padding:'10px 10px 5px 10px', marginTop:'10px', borderRadius:'4px', backgroundColor:'#E5E5E5'}}>
                                                <div style={{fontSize:'12px', color:'#333'}}>Não se esqueça de fornecer suas formas de pagamento para o cliente! Ou então entre em contato com ele pelos dados fornecidos acima.</div>
                                                <div style={{width:'fit-content', marginTop:'5px', marginRight:'10px', fontSize:'9px', color:'#333'}}>{lastHour}</div>
                                            </div>                                            
                                        </div>
                                    </div>
                                    <div style={{height:'34px', padding:'0 10px', display:'flex'}}>
                                        <div style={{ width:'100%', height:'20px', padding:'0 15px', margin:'auto auto auto 0', border:'1px solid #DDD', borderRadius:'15px', backgroundColor:'#EEE'}}>
                                            <input  style={{width:'100%', height:'22px', lineHeight:'20px', border:'0px', padding:'0px', fontSize:'12px', color:'#333'}} name='message' value={this.state.message} onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>
                                        <div style={{minWidth:'65px', height:'22px', margin:'auto 0'}}>
                                            <div style={{width:'55px', height:'22px', marginLeft:'auto', lineHeight:'22px', borderRadius:'15px', backgroundColor:'#DDD', fontSize:'12px', textAlign:'center', color:'#222', cursor:'pointer'}} onClick={()=>{}}>Enviar</div>
                                        </div>
                                    </div>
                                </div>
                                {/*<div style={{width:'20px', height:'20px', backgroundColor:'purple'}} onClick={()=>{this.pushMessage()}}>
                                </div>*/}
                            </div>)
                        </div>
                        <div style={{padding:'0 20px', marginTop:'20px',}}>
                            <div style={{height:'30px', lineHeight:'30px', marginBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                Produtos:
                            </div>
                            {this.productsList()}
                            <div style={{display:'flex', marginTop:'35px'}}>
                                <div style={{width:'fit-content', paddingLeft:'5px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>
                                    <div style={{height:'20px'}}>
                                        Subtotal:
                                    </div>
                                    <div style={{height:'20px'}}>
                                        Frete ({delivery.name}):
                                    </div>
                                    <div style={{height:'20px'}}>
                                        Total:
                                    </div>
                                </div>
                                <div style={{width:'fit-content', paddingLeft:'20px', fontSize:'14px', color:'#555'}}>
                                    <div style={{height:'20px', display:'flex'}}>
                                        R$ <div style={{marginLeft:'auto'}}>{profile.subtotal.toString().replace('.', ',')}</div>
                                    </div>
                                    <div style={{height:'20px', display:'flex'}}>
                                        R$ <div style={{marginLeft:'auto'}}>{delivery.price.toString().replace('.', ',')}</div>
                                    </div>
                                    <div style={{height:'20px', display:'flex'}}>
                                        R$ <div style={{marginLeft:'auto'}}>{profile.price.toString().replace('.', ',')}</div>
                                    </div>
                                </div>
                            </div>            
                        </div>
                        <DistanceMatrixService onLoad={this.matrixLoad.bind(this)} options={{origins: [{lat:this.state.address.coords.selected.lat[0], lng:this.state.address.coords.selected.lng[0]}], destinations: [{lat:this.state.address.coords.selected.lat[1], lng:this.state.address.coords.selected.lng[1]}], travelMode: 'DRIVING'}} 
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
                                    <div style={{minWidth:'230px', display:(delivery.index == 4) ? 'block' : 'none'}}>
                                        <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                            O cliente vai retirar no local.
                                        </div>
                                    </div>
                                    <div style={{minWidth:'230px', display:(delivery.index != 4) ? 'block' : 'none'}}>
                                        <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                            Forma de envio:
                                        </div>
                                        <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                            Transportadora: {delivery.name}
                                        </div>
                                        <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                            Distância: {this.state.distance}
                                        </div>
                                        <div style={{height:'20px', lineHeight:'20px', paddingLeft:'5px', marginTop:'5px', fontSize:'14px', color:'#555'}}>
                                            Distância Percorrida: {this.state.distanceMatrix.distance.text}
                                        </div>
                                    </div>
                                    <div style={{width:'fit-content', marginLeft:'22px', display:(delivery.index == 1 || delivery.index == 2) ? 'block' : 'none'}}>
                                        <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                            Código de rastreio:
                                        </div>
                                        <div style={{display:'flex', marginTop:'5px'}}>
                                            <input style={{width:'115px', height:'28px', padding:'0px 20px', margin:'0', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='trackingCode' value={delivery.trackingCode} onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{height:'30px', lineHeight:'30px', padding:'0 10px', marginLeft:'10px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}} onClick={()=>{this.updateTrackingCode()}}>
                                                ENVIAR
                                            </div>
                                        </div> 
                                        <div style={{marginTop:'5px', fontSize:'12px', color:'#FF1414'}}> {this.state.trackingCodeError} </div>
                                        <div style={{marginTop:'5px', fontSize:'12px', color:'#3BCD38'}}> {this.state.trackingCodeSuccess} </div>
                                    </div>
                                </div>                                
                            </div>                    
                        </div> 
                        <div style={{display:(delivery.index == 0) ? 'block' : 'none'}}>
                            <div style={{width:'fit-content', marginLeft:'22px', display:(delivery.index == 1 || delivery.index == 2) ? 'block' : 'none'}}>
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                    Código de rastreio:
                                </div>
                                <div style={{display:'flex', marginTop:'5px'}}>
                                    <input style={{width:'115px', height:'28px', padding:'0px 20px', margin:'0', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='trackingCode' value={delivery.trackingCode} onChange={(e)=>{this.inputHandler(e)}}/>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'0 10px', marginLeft:'10px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}> ENVIAR </div>
                                </div> 
                            </div>
                            {/*
                            <div style={{height:'30px', lineHeight:'30px', marginTop:'20px', padding:'0 20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                Instruções para a retirada do pacote:
                            </div>    
                            <input style={{width:'420px', height:'28px', padding:'0px 20px', margin:'5px 20px', lineHeight:'30px', textAlign:'', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='motoboyInstruction' value={this.state.motoboyInstruction} placeholder='É recomendado informar o número do pedido e onde o retirar.' onChange={(e)=>{this.inputHandler(e)}}/>        
                            <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 10px', marginTop:'20px', marginLeft:'20px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>
                                CHAMAR MOTOBOY
                            </div>*/}
                        </div>
                        <div style={{maxWidth:'500px', maxHeight:'250px', paddingBottom:'20px', marginTop:'30px', marginLeft:'20px'}}>
                            <GoogleMap id='mainMap' mapContainerStyle={{width:'500px', height:'250px', borderRadius:'8px', border:'1px solid #FF7000'}} clickableIcons={false} zoom={18} center={{lat: this.state.center.lat, lng: this.state.center.lng}} onLoad={this.onLoad.bind(this)} options={{disableDefaultUI: true}}>
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
export default OrderExamplePage;