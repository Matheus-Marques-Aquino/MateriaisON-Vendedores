import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import CustomSelect from '../subcomponents/widgets/customSelect';
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold'
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';

class VendorDeliveryPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.successText = '';
        this.start = true;
        this.state={
            distanceLimit: {enabled: false, distance: 50},
            doMotoboy: false,
            doCorreios: false,
            doTakeIn: false,
            doTransport: false,
            doMotoboy_2: false,
            transportData: {base: 10, km: 3, kmLimit: 30, wgLimit: 100, freeDelivery: {enabled: false, byPrice: false, kmLimit: 10, wgLimit: 50, minPrice: 99}},
            motoboyData: {base: 5, km: 0.6, kmLimit: 20, wgLimit: 20, box:{ width: 40, height: 30, length: 40 }, freeDelivery: {enabled: false, byPrice: false, kmLimit: 5, minPrice: 99}},
            loading: true
        };
    }
    componentDidMount(){
        Meteor.subscribe('VendorSettings', ()=>{
            let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
            if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()}); }
            if (!vendor){ this.setState({ loading: false }); history.push('/index'); return; }
            if (!vendor.terms){ this.setState({loading: false}); return; }
            if (!vendor.terms.delivery){ this.setState({loading: false}); return; }  
            if (!vendor.distanceLimit){ vendor.distanceLimit = {enabled: true, distance: 50}; }
            vendor.distanceLimit.enabled = (vendor.distanceLimit)?true:false;
            vendor.distanceLimit.distance = (vendor.distanceLimit.distance == undefined) ? 50 : vendor.distanceLimit.distance;
            let deliveryData = [];
            if (!vendor.terms.deliveryData){                 
                deliveryData[4] = {base: 10, km: 3, kmLimit: 30, wgLimit: 100, freeDelivery: {enabled: false, byPrice: false, kmLimit: 10, wgLimit: 50, minPrice: 99}};
                deliveryData[1] = {base: 5, km: 0.3, kmLimit: 20, wgLimit: 20, box: { width: 40, height: 30, length: 40 }, freeDelivery: {enabled: false, byPrice: false, kmLimit: 10, wgLimit: 20, minPrice: 99}};
            }else{ deliveryData = vendor.terms.deliveryData; }
            
            if (!deliveryData[4]){ deliveryData[4] = {base: 10, km: 3, kmLimit: 30, wgLimit: 100, freeDelivery: {enabled: false, byPrice: false, kmLimit: 10, wgLimit: 50, minPrice: 99}}; }
            if (!deliveryData[4].freeDelivery){ deliveryData[4].freeDelivery = {enabled: false, byPrice: false, kmLimit: 10, wgLimit: 50, minPrice: 99}; }
            for(let key in deliveryData[4]){ 
                if (key != 'freeDelivery'){ 
                    deliveryData[4][key] = (deliveryData[4][key] == undefined) ? this.state.transportData[key] : deliveryData[4][key]; 
                    deliveryData[4][key] = deliveryData[4][key].toString().replace('.',','); 
                } 
            }
            for(let key in deliveryData[4].freeDelivery){ 
                if (key != 'enabled' && key != 'byPrice'){ 
                    deliveryData[4].freeDelivery[key] = (deliveryData[4].freeDelivery[key] == undefined) ? this.state.transportData.freeDelivery[key] : deliveryData[4].freeDelivery[key];
                    deliveryData[4].freeDelivery[key] = deliveryData[4].freeDelivery[key].toString().replace('.',','); 
                } 
            }
            
            if (!deliveryData[1]){ deliveryData[1] = {base: 5, km: 0.3, kmLimit: 20, wgLimit: 20, box: { width: 40, height: 30, length: 40 }, freeDelivery: {enabled: false, byPrice: false, kmLimit: 10, wgLimit: 20, minPrice: 99}}; }
            if (!deliveryData[1].freeDelivery){ deliveryData[1].freeDelivery = {enabled: false, byPrice: false, kmLimit: 10, wgLimit: 20, minPrice: 99}; }
            if (!deliveryData[1].box){ deliveryData[1].box = { width: 40, height: 30, length: 40 }; }
            for(let key in deliveryData[1]){ 
                if (key != 'freeDelivery' && key != 'box'){ 
                    deliveryData[1][key] = (deliveryData[1][key] == undefined) ? this.state.motoboyData[key] : deliveryData[1][key]; 
                    deliveryData[1][key] = deliveryData[1][key].toString().replace('.',','); 
                } 
            }
            for(let key in deliveryData[1].freeDelivery){ 
                if (key != 'enabled' && key != 'byPrice'){ 
                    deliveryData[1].freeDelivery[key] = (deliveryData[1].freeDelivery[key] == undefined) ? this.state.motoboyData.freeDelivery[key] : deliveryData[1].freeDelivery[key];
                    deliveryData[1].freeDelivery[key] = deliveryData[1].freeDelivery[key].toString().replace('.',','); 
                } 
            }
            for(let key in deliveryData[1].box){ 
                deliveryData[1].box[key] = (deliveryData[1].box[key] == undefined) ? this.state.motoboyData.box[key] : deliveryData[1].box[key];
                deliveryData[1].box[key] = deliveryData[1].box[key].toString().replace('.',',');
            }
            
            let delivery = vendor.terms.delivery;       
            this.setState({
                distanceLimit: vendor.distanceLimit,
                doMotoboy: false,//delivery[0] ? delivery[0] : false,
                doCorreios: delivery[1] ? delivery[1] : false,
                doTransport: delivery[3] ? delivery[3] : false,
                doTakeIn: delivery[4] ? delivery[4] : false,
                transportData: deliveryData[4],
                motoboyData: deliveryData[1],
                loading: false
            });
        });
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.successText = '';
        if (name.includes('distanceLimit')){
            let distanceLimit = this.state.distanceLimit;
            if (value != ''){
                value = value.toString().replace('.', ',')
                value = value.toString();
                if (value.includes(',') && value != ','){
                    let commaArray = value.split(',');
                    if (commaArray.length > 2){ this.setState({ distanceLimit: this.state.distanceLimit }); return; }
                    if (commaArray[1].length > 2){ commaArray[1] = commaArray[1].slice(0, 2); }
                    value = commaArray[0]+','+commaArray[1];
                    if (commaArray[1] != ''){
                        if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ value = this.state.distanceLimit.distance; }
                        distanceLimit.distance = value;
                        this.setState({ distanceLimit: distanceLimit });
                        return;
                    }
                }else{
                    if (!(/^\d+$/.test(value))){ value = this.state.distanceLimit.distance.toString(); }
                    if (value == ','){ value = '0,'; }
                }
            }  
            distanceLimit.distance = value;
            this.setState({distanceLimit: distanceLimit});
            return;
        }
        if (name.includes('_do')){
            name = name.replace('_', '');
            this.setState({[name]: false});
            return;
        }else{
            if (name.includes('do')){
                this.setState({[name]: true});
                return;
            }
        }
        if (name.includes('freeDelivery')){
            name = name.replace('freeDelivery_', '');
            if (name.includes('motoboy')){
                let motoboy = this.state.motoboyData;
                name = name.replace('motoboy_', '');
                if (value != ''){
                    value = value.toString().replace('.', ',')
                    value = value.toString();
                    if (value.includes(',') && value != ','){
                        let commaArray = value.split(',');
                        if (commaArray.length > 2){
                            this.setState({ motoboyData: this.state.motoboyData });
                            return;
                        }
                        if (commaArray[1].length > 2){
                            commaArray[1] = commaArray[1].slice(0, 2);                        
                        }
                        value = commaArray[0]+','+commaArray[1];
                        if (commaArray[1] != ''){
                            if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ value = this.state.motoboyData.freeDelivery[name]; }
                            motoboy.freeDelivery[name] = value;
                            this.setState({ motoboyData: motoboy });
                            return;
                        }
                    }else{
                        if (!(/^\d+$/.test(value))){      
                            value = this.state.motoboyData.freeDelivery[name].toString(); 
                        }
                        if (value == ','){ value = '0,'; }
                    }
                }  
                motoboy.freeDelivery[name] = value;
                this.setState({motoboyData: motoboy});
                return;
            }
            let transport = this.state.transportData;

            if (name == 'enabled'){
                transport.freeDelivery.enabled = !transport.freeDelivery.enabled;
                this.setState({transportData: transport});
                return;
            }
            if (value != ''){
                value = value.toString().replace('.', ',')
                value = value.toString();
                if (value.includes(',') && value != ','){
                    let commaArray = value.split(',');
                    if (commaArray.length > 2){ this.setState({ transportData: this.state.transportData }); return; }
                    if (commaArray[1].length > 2){ commaArray[1] = commaArray[1].slice(0, 2); }
                    value = commaArray[0]+','+commaArray[1];
                    if (commaArray[1] != ''){
                        if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ value = this.state.transportData.freeDelivery[name]; }
                        transport.freeDelivery[name] = value;
                        this.setState({ transportData: transport });
                        return;
                    }
                }else{
                    if (!(/^\d+$/.test(value))){ value = this.state.transportData.freeDelivery[name].toString(); }
                    if (value == ','){ value = '0,'; }
                }
            }  
            transport.freeDelivery[name] = value;
            this.setState({transportData: transport});
            return;            
        }
        if (name.includes('transport')){  
            name = name.replace('transport_', '');
            let transport = this.state.transportData;
            if (value != ''){
                value = value.toString().replace('.', ',')
                value = value.toString();
                if (value.includes(',') && value != ','){
                    let commaArray = value.split(',');
                    if (commaArray.length > 2){ this.setState({ transportData: this.state.transportData }); return; }
                    if (commaArray[1].length > 2){ commaArray[1] = commaArray[1].slice(0, 2); }
                    value = commaArray[0]+','+commaArray[1];
                    if (commaArray[1] != ''){
                        if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ value = this.state.transportData[name]; }
                        transport[name] = value; this.setState({ transportData: transport }); return;
                    }
                }else{ if (!(/^\d+$/.test(value))){ value = this.state.transportData[name].toString(); } }
            }  
            transport[name] = value;
            this.setState({transportData: transport});
            return;
        }
        if (name.includes('motoboy')){  
            name = name.replace('motoboy_', '');
            let motoboy = this.state.motoboyData;            
            if (name.includes('box')){
                name = name.replace('box_', '');
                if (value != ''){
                    value = value.toString().replace('.', ',')
                    value = value.toString();
                    if (value.includes(',') && value != ','){
                        let commaArray = value.split(',');
                        if (commaArray.length > 2){ this.setState({ motoboyData: this.state.motoboyData }); return; }
                        if (commaArray[1].length > 2){ commaArray[1] = commaArray[1].slice(0, 2); }
                        value = commaArray[0]+','+commaArray[1];
                        if (commaArray[1] != ''){
                            if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ value = this.state.motoboy.box[name]; }
                            motoboy.box[name] = value;
                            this.setState({ motoboyData: motoboy });
                            return;
                        }
                    }else{ if (!(/^\d+$/.test(value))){ value = this.state.transportData[name].toString(); } }
                }
                motoboy.box[name] = value;
                this.setState({ motoboyData: motoboy });
                return;
            }
            if (value != ''){
                value = value.toString().replace('.', ',')
                value = value.toString();
                if (value.includes(',') && value != ','){
                    let commaArray = value.split(',');
                    if (commaArray.length > 2){ this.setState({ motoboyData: this.state.motoboyData }); return; }
                    if (commaArray[1].length > 2){ commaArray[1] = commaArray[1].slice(0, 2); }
                    value = commaArray[0]+','+commaArray[1];
                    if (commaArray[1] != ''){
                        if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ value = this.state.motoboyData[name]; }
                        motoboy[name] = value;
                        this.setState({ motoboyData: motoboy });
                        return;
                    }
                }else{ if (!(/^\d+$/.test(value))){ value = this.state.motoboyData[name].toString(); } }
            }
            motoboy[name] = value;
            this.setState({ motoboyData: motoboy });
            return;
        }
    }
    displayErrors(){
        if (this.errors.length > 0){
            return(
            <div style={{margin:'10px 0'}}>
                {this.errors.map((error, index)=>{
                    let key = 'Errors_'+index;
                    return(<div style={{margin:'0 20px', color:'#FF1414', fontSize:'14px'}} key={key}>{error}</div>)
                })}
            </div>);
        }
    }    
    saveDelivery(){
        if (this.state.loading){ return; }

        this.setState({loading: true});
        let delivery = this.state;
        let transportData = delivery.transportData;
        let motoboyData = delivery.motoboyData;
        let distanceLimit = delivery.distanceLimit;
        
        distanceLimit.distance = (delivery.distanceLimit.distance == undefined) ? 50 : parseFloat(delivery.distanceLimit.distance.toString().replace(',', '.'));
        distanceLimit.enabled = (delivery.distanceLimit.enabled) ? true : false;

        transportData.base = (transportData.base == '') ? '0' : parseFloat(transportData.base.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        transportData.km = (transportData.km == '') ? '0' : parseFloat(transportData.km.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        transportData.kmLimit = (transportData.kmLimit == '') ? '0' : parseFloat(transportData.kmLimit.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        transportData.wgLimit = (transportData.wgLimit == '') ? '0' : parseFloat(transportData.wgLimit.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        transportData.freeDelivery.kmLimit = (transportData.freeDelivery.kmLimit == '') ? '0' : parseFloat(transportData.freeDelivery.kmLimit.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        transportData.freeDelivery.wgLimit = (transportData.freeDelivery.wgLimit == '') ? '0' : parseFloat(transportData.freeDelivery.wgLimit.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        transportData.freeDelivery.byPrice = (transportData.freeDelivery.byPrice) ? true : false;
        transportData.freeDelivery.minPrice = (transportData.freeDelivery.minPrice) ? parseFloat(transportData.freeDelivery.minPrice.toString().replace(',', '.')).toFixed(2).replace('.', ',') : '0'; 

        motoboyData.base = (motoboyData.base == '') ? '0' : parseFloat(motoboyData.base.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        motoboyData.km = (motoboyData.km == '') ? '0' : parseFloat(motoboyData.km.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        motoboyData.kmLimit = (motoboyData.kmLimit == '') ? '0' : parseFloat(motoboyData.kmLimit.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        motoboyData.wgLimit = (motoboyData.wgLimit == '') ? '0' : parseFloat(motoboyData.wgLimit.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        motoboyData.freeDelivery.kmLimit = (motoboyData.freeDelivery.kmLimit == '') ? '0' : parseFloat(motoboyData.freeDelivery.kmLimit.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',');
        motoboyData.freeDelivery.byPrice = (motoboyData.freeDelivery.byPrice) ? true : false;
        motoboyData.freeDelivery.minPrice = (motoboyData.freeDelivery.minPrice) ? parseFloat(motoboyData.freeDelivery.minPrice.toString().replace(',', '.')).toFixed(2).replace('.', ',') : '0'; 

        if (!delivery.doTransport) { transportData.freeDelivery.enabled = false; }
        if (!delivery.doMotoboy) { motoboyData.freeDelivery.enabled = false; }

        let pack = {
            distanceLimit: distanceLimit,
            doMotoboy: delivery.doMotoboy,
            doCorreios: delivery.doCorreios,
            doTakeIn: delivery.doTakeIn,
            doTransport: delivery.doTransport,
            doMotoboy_2: delivery.doMotoboy_2,
            transportData: transportData,
            motoboyData: motoboyData
        }
        Meteor.call('vendorEditDelivery', pack, (error)=>{
            if (error){ this.errors.push(error.reason); }else{ this.successText = 'Seus dados foram atualizados com sucesso!'; }           
            this.setState({loading: false});
        })
    }
    render(){
        //if (!Meteor.userId()){ Meteor.logout(); history.push('/entrar'); }
        return(
            <div>
                <VendorHeader/>
                <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                    <VendorMenu />
                    <div style={{width:'100%', backgroundColor:'white'}}>
                        <div style={{width:'100%', height:'45px', borderBottom:'1px solid #ff7000', backgroundColor:'#F7F7F7', display:'flex', position:'sticky', top:'0', zIndex:'20'}}>
                            <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px', fontWeight:'bold', color: '#555'}}>Formas de envio</div>
                            <div style = {{margin:'auto', fontSize:'14px', paddingLeft:'20px', color:'#3BCD38', fontWeight:'bold'}}>{this.successText}</div>
                            <div style={{height:'27px', width:'75px', margin:'auto 0', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000', marginRight:'20px'}} onClick={()=>{this.saveDelivery()}}>Salvar</div>
                        </div>  
                        <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                            <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Métodos de envio:</div>
                            </div>
                            <div style={{margin:'0 20px', marginRight:'5px', marginTop:'20px'}}>
                                <div>
                                    {/*<div style={{height:'20px', lineHeight:'20px', marginBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                        Motoboy:
                                    </div>
                                    <div style={{marginLeft:'15px', fontSize:'14px', color:'#555'}}>
                                        <div style={{fontSize:'14px', display:'flex'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:this.state.doMotoboy ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'doMotoboy', value:true}}; this.inputHandler(e);}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:this.state.doMotoboy ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Tenho disponibilídade para chamar um motoboy com a Loggi para retirar o pedido e leva-lo até o cliente.</div>
                                        </div>    
                                        <div style={{fontSize:'14px', display:'flex', marginTop:'5px'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:!this.state.doMotoboy ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'_doMotoboy', value:true}}; this.inputHandler(e);}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:!this.state.doMotoboy ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Não pretendo disponibilizar este serviço.</div>
                                        </div>                             
                                    </div>*/}
                                    <div style={{fontSize:'14px', display:'flex'}}>
                                        <div style={{minWidth:'10px', height:'10px', border:this.state.distanceLimit.enabled ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let distanceLimit = this.state.distanceLimit; distanceLimit.enabled = !this.state.distanceLimit.enabled; this.setState({distanceLimit: distanceLimit})}}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:this.state.distanceLimit.enabled ? 'block' : 'none'}}></div>
                                        </div>
                                        <div style={{margin:'auto 0', marginLeft:'10px', color:'#555'}}>Limitar distancia de todos as formas de envio.</div>
                                    </div>
                                    <div style={{paddingLeft:'20px', paddingTop:'5px', marginBottom:'15px', paddingBottom:'10px', color:'#555', display: this.state.distanceLimit.enabled ? 'block' : 'none'}}>
                                        <div style={{width:'fit-content', marginRight:'20px'}}>
                                            <div style={{width:'fit-content', marginRight:'20px'}}>
                                                <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Distância Limite:</div>
                                                <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='distanceLimit_distance' value={this.state.distanceLimit.distance} unit={{text:'km', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                            </div>                
                                        </div>
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', marginBottom:'10px', marginTop:'20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                        Correios:
                                    </div>
                                    <div style={{marginLeft:'15px', fontSize:'14px', color:'#555'}}>
                                        <div style={{fontSize:'14px', display:'flex'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:this.state.doCorreios ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'doCorreios', value:true}}; this.inputHandler(e);}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:this.state.doCorreios ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Tenho disponibilidade para embalar e levar até a agência de correios mais próxima meus pedidos.</div>
                                        </div>    
                                        <div style={{fontSize:'14px', display:'flex', marginTop:'5px'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:!this.state.doCorreios ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'_doCorreios', value:true}}; this.inputHandler(e);}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:!this.state.doCorreios ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Não pretendo disponibilizar este serviço.</div>
                                        </div> 
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', marginBottom:'10px', marginTop:'20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                        Motoboy:
                                    </div>
                                    <div style={{marginLeft:'15px', fontSize:'14px', color:'#555'}}>
                                        <div style={{fontSize:'14px', display:'flex'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:this.state.doMotoboy_2 ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{ if (!this.state.doMotoboy_2){ this.setState({doMotoboy_2: true}); } }}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:this.state.doMotoboy_2 ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Disponho de motoboys para efetuarem as entregas.</div>
                                        </div> 
                                        <div style={{paddingLeft:'20px', paddingTop:'5px', overflow:'hidden', maxHeight: this.state.doMotoboy_2 ? '300px' : '0px', marginBottom: this.state.doMotoboy_2 ? '15px' : '0px', paddingBottom: this.state.doMotoboy_2 ? '10px' : '0px', borderBottom: this.state.doMotoboy_2 ? '1px solid #FF700050' : '0px'}}>
                                            <div style={{display:'flex'}}>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Preço Base:</div>
                                                    <CustomInput inputStyle={{color:'#555'}} width='80px' height='20px' margin='0 auto' name='motoboy_base' value={this.state.motoboyData.base} start={{text:'R$', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px', paddingRight:'5px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Preço por Km:</div>
                                                    <CustomInput inputStyle={{color:'#555'}} width='80px' height='20px' margin='0 auto' name='motoboy_km' value={this.state.motoboyData.km} start={{text:'R$', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px', paddingRight:'5px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Distância Limite:</div>
                                                    <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='motoboy_kmLimit' value={this.state.motoboyData.kmLimit} unit={{text:'km', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Limite de peso:</div>
                                                    <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='motoboy_wgLimit' value={this.state.motoboyData.wgLimit} unit={{text:'kg', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>                                                
                                            </div> 
                                                <div style={{padding:'20px 5px 5px'}}>Tamanho do baú da moto.</div>
                                            <div style={{display:'flex'}}>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Altura:</div>
                                                    <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='motoboy_box_height' value={this.state.motoboyData.box.height} unit={{text:'cm', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Largura:</div>
                                                    <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='motoboy_box_width' value={this.state.motoboyData.box.width} unit={{text:'cm', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Comprimento:</div>
                                                    <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='motoboy_box_length' value={this.state.motoboyData.box.length} unit={{text:'cm', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                            </div>
                                            <div style={{fontSize:'14px', marginTop:'15px'}}>
                                                <div style={{display:'flex', marginTop:'10px'}}>
                                                    <div style={{minWidth:'10px', height:'10px', border:this.state.motoboyData.freeDelivery.enabled ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{ let motoboyData = this.state.motoboyData; motoboyData.freeDelivery.enabled = !motoboyData.freeDelivery.enabled; this.setState({motoboyData: motoboyData}); }}>
                                                        <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display: this.state.motoboyData.freeDelivery.enabled ? 'block' : 'none'}}></div>
                                                    </div>                                                
                                                    <div style={{margin:'auto 0', marginLeft:'10px'}}>Disponibilizar frete grátis até uma determinada distância.</div>
                                                </div>
                                                <div style={{display:'flex', paddingLeft:'10px', marginTop:'5px', maxHeight:this.state.motoboyData.freeDelivery.enabled ? '47px' : '0px', overflow:'hidden'}}>
                                                    <div style={{width:'fit-content', marginRight:'20px'}}>
                                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Frete grátis até:</div>
                                                        <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='freeDelivery_motoboy_kmLimit' value={this.state.motoboyData.freeDelivery.kmLimit} unit={{text:'km', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{fontSize:'14px', marginTop:'10px'}}>
                                                <div style={{display:'flex', marginTop:'10px'}}>
                                                    <div style={{minWidth:'10px', height:'10px', border:this.state.motoboyData.freeDelivery.byPrice ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{ let motoboyData = this.state.motoboyData; motoboyData.freeDelivery.byPrice = !motoboyData.freeDelivery.byPrice; this.setState({motoboyData: motoboyData}); }}>
                                                        <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display: this.state.motoboyData.freeDelivery.byPrice ? 'block' : 'none'}}></div>
                                                    </div>                                                
                                                    <div style={{margin:'auto 0', marginLeft:'10px'}}>Disponibilizar frete grátis pelo valor do pedido.</div>
                                                </div>
                                                <div style={{display:'flex', paddingLeft:'10px', marginTop:'5px', maxHeight:this.state.motoboyData.freeDelivery.byPrice ? '47px' : '0px', overflow:'hidden'}}>
                                                    <div style={{width:'fit-content', marginRight:'20px'}}>
                                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Frete grátis a partir:</div>
                                                        <CustomInput inputStyle={{color:'#555'}} width='80px' height='20px' margin='0 auto 0 0' name='freeDelivery_motoboy_minPrice' value={this.state.motoboyData.freeDelivery.minPrice} start={{text:'R$', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px', paddingRight:'5px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                        
                                        <div style={{fontSize:'14px', display:'flex', marginTop:'5px', marginBottom:'5px'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:!this.state.doMotoboy_2 ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{ if (this.state.doMotoboy_2){ this.setState({doMotoboy_2: false}); }}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:!this.state.doMotoboy_2 ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Não possuo esse serviço.</div>
                                        </div>                          
                                    </div>
                                    <div style={{height:'20px', lineHeight:'20px', marginBottom:'10px', marginTop:'20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                        Transportadora:
                                    </div>
                                    <div style={{marginLeft:'15px', fontSize:'14px', color:'#555'}}>
                                        <div style={{fontSize:'14px', display:'flex'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:this.state.doTransport ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'doTransport', value:true}}; this.inputHandler(e);}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:this.state.doTransport ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Possuo um serviço de entregas próprio.</div>
                                        </div>    
                                        <div style={{paddingLeft:'20px', paddingTop:'5px', overflow:'hidden', maxHeight: this.state.doTransport ? '300px' : '0px', marginBottom: this.state.doTransport ? '15px' : '0px', paddingBottom: this.state.doTransport ? '10px' : '0px', borderBottom: this.state.doTransport ? '1px solid #FF700050' : '0px'}}>
                                            <div style={{display:'flex'}}>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Preço Base:</div>
                                                    <CustomInput inputStyle={{color:'#555'}} width='80px' height='20px' margin='0 auto' name='transport_base' value={this.state.transportData.base} start={{text:'R$', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px', paddingRight:'5px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Preço por Km:</div>
                                                    <CustomInput inputStyle={{color:'#555'}} width='80px' height='20px' margin='0 auto' name='transport_km' value={this.state.transportData.km} start={{text:'R$', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px', paddingRight:'5px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Distância Limite:</div>
                                                    <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='transport_kmLimit' value={this.state.transportData.kmLimit} unit={{text:'km', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                                <div style={{width:'fit-content', marginRight:'20px'}}>
                                                    <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Limite de peso:</div>
                                                    <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='transport_wgLimit' value={this.state.transportData.wgLimit} unit={{text:'kg', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                </div>
                                            </div>
                                            <div style={{fontSize:'14px', marginTop:'15px'}}>
                                                <div style={{display:'flex', marginTop:'10px'}}>
                                                    <div style={{minWidth:'10px', height:'10px', border:this.state.transportData.freeDelivery.enabled ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'freeDelivery_enabled', value:true}}; this.inputHandler(e);}}>
                                                        <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display: this.state.transportData.freeDelivery.enabled ? 'block' : 'none'}}></div>
                                                    </div>                                                
                                                    <div style={{margin:'auto 0', marginLeft:'10px'}}>Disponibilizar frete grátis até uma determinada distância.</div>
                                                </div>
                                                <div style={{display:'flex', paddingLeft:'10px', marginTop:'5px', maxHeight:this.state.transportData.freeDelivery.enabled ? '47px' : '0px', overflow:'hidden'}}>
                                                    <div style={{width:'fit-content', marginRight:'20px'}}>
                                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Frete grátis até:</div>
                                                        <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='freeDelivery_kmLimit' value={this.state.transportData.freeDelivery.kmLimit} unit={{text:'km', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                    </div>
                                                    <div style={{width:'fit-content', marginRight:'20px'}}>
                                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Limite de peso:</div>
                                                        <CustomInput inputStyle={{color:'#555', textAlign:'center'}} width='80px' height='20px' margin='0 auto' name='freeDelivery_wgLimit' value={this.state.transportData.freeDelivery.wgLimit} unit={{text:'kg', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{fontSize:'14px', marginTop:'10px'}}>
                                                <div style={{display:'flex', marginTop:'10px'}}>
                                                    <div style={{minWidth:'10px', height:'10px', border:this.state.transportData.freeDelivery.byPrice ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{ let transportData = this.state.transportData; transportData.freeDelivery.byPrice = !transportData.freeDelivery.byPrice; this.setState({transportData: transportData}); }}>
                                                        <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display: this.state.transportData.freeDelivery.byPrice ? 'block' : 'none'}}></div>
                                                    </div>                                                
                                                    <div style={{margin:'auto 0', marginLeft:'10px'}}>Disponibilizar frete grátis pelo valor do pedido.</div>
                                                </div>
                                                <div style={{display:'flex', paddingLeft:'10px', marginTop:'5px', maxHeight:this.state.transportData.freeDelivery.byPrice ? '47px' : '0px', overflow:'hidden'}}>
                                                    <div style={{width:'fit-content', marginRight:'20px'}}>
                                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', margin:'0 auto', fontSize:'12px'}}>Frete grátis a partir:</div>
                                                        <CustomInput inputStyle={{color:'#555'}} width='80px' height='20px' margin='0 auto 0 0' name='freeDelivery_minPrice' value={this.state.transportData.freeDelivery.minPrice} start={{text:'R$', style:{margin:'auto 0', height:'18px', lineHeight:'20px', fontSize:'13px', paddingRight:'5px'}}} onChange={(e)=>{this.inputHandler(e)}}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{fontSize:'14px', display:'flex', marginTop:'5px', marginBottom:'5px'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:!this.state.doTransport ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'_doTransport', value:true}}; this.inputHandler(e);}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:!this.state.doTransport ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Não possuo um serviço de entrega próprio.</div>
                                        </div> 
                                        {this.displayErrors()}
                                    </div>
                                    
                                    <div style={{height:'20px', lineHeight:'20px', marginBottom:'10px', marginTop:'20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                                        Retirar na Loja:
                                    </div>
                                    <div style={{marginLeft:'15px', fontSize:'14px', color:'#555'}}>
                                        <div style={{fontSize:'14px', display:'flex'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:this.state.doTakeIn ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'doTakeIn', value:true}}; this.inputHandler(e);}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:this.state.doTakeIn ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Tenho disponibilidade para atender os clientes que forem retirar o pedido em meu endereço comercial.</div>
                                        </div>    
                                        <div style={{fontSize:'14px', display:'flex', marginTop:'5px'}}>
                                            <div style={{minWidth:'10px', height:'10px', border:!this.state.doTakeIn ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let e={target:{name:'_doTakeIn', value:true}}; this.inputHandler(e);}}>
                                                <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:!this.state.doTakeIn ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{margin:'auto 0', marginLeft:'10px'}}>Não pretendo disponibilizar este serviço.</div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Waiting open={this.state.loading} size='60px' />
                </div>
            </div>);
    }
}
export default VendorDeliveryPage;