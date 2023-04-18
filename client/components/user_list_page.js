import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import { Router } from "react-router";
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import { validator } from './subcomponents/widgets/validation_helper';
import { mask } from './subcomponents/widgets/mask';
import VendorFooter from './subcomponents/vendor_footer'
import { withTracker } from 'meteor/react-meteor-data';
import { Vendors } from '../../imports/collections/vendors'
import { VendorsOnHold } from '../../imports/collections/vendors_onhold';
import { Services } from '../../imports/collections/services';
import { ServicesOnHold } from '../../imports/collections/services_onhold';
import { Profile } from '../../imports/collections/profile';
import { Products } from '../../imports/collections/products';
import { ProductsOnHold, productsOnHold } from '../../imports/collections/products_onhold';
import { IncompleteProducts } from '../../imports/collections/incomplete_products';
import { Orders } from '../../imports/collections/orders';
import { OrderInbox } from '../../imports/collections/order_inbox';
import { Tracker } from 'meteor/tracker'
import Fuse from 'fuse.js';

class UserListPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.users = [];
        this.updateMessage = {color:'', message:''};
        this.start = true;
        this.searchQuery = '';
        this.state = {
            loadingCollections: true,
            loading: false,
            user: undefined,
            users: [],
            vendors: [],
            services: [],
            searchQuery:'',
            userQuery: [],
            filters: {
                vendors: {
                    display: true,
                    showAll: true,
                    onlyVerified: false,
                    notVerified: false,
                    displayOnly: false,
                    notDisplayOnly: false, 
                    onlyLimitedAccess: false,
                    notLimitedAccess: false,
                    hidden: false,
                    notHidden: false
                },                
                services: {
                    display: true,
                    showAll: true,
                    verified: false,
                    notVerified: false,
                    hidden: false,
                    notHidden: false
                },
            },
            displayPassword: [false, false, false],
            selection:{
                page: 0,
                user:undefined,
                vendor:undefined,
                service:undefined               
            },
            servicesById: [],
            vendorsById: []
        };
    }
    componentDidMount(){
        Tracker.autorun(function() {
            if (Meteor.userId()) {
                Meteor.subscribe('rooms');
            }
        });
    }
    componentDidUpdate(){
        if (!this.props.loading  && this.start){
            this.start= false;
            let vendorsById = [];
            let servicesById = [];
            /*vendors: Vendors.find({}).fetch(),
            vendorsOnHold: VendorsOnHold.find({}).fetch(),
            service: Services.find({}).fetch(),
            serviceOnHold: ServicesOnHold.find({}).fetch(),*/
            this.props.vendors.map((vendor, index)=>{ vendorsById[vendor.vendor_id] = vendor });
            this.props.vendorsOnHold.map((vendor, index)=>{ vendorsById[vendor.vendor_id] = vendor });
            this.props.service.map((service, index)=>{ servicesById[service.service_id] = service });
            this.props.serviceOnHold.map((service, index)=>{ servicesById[service.service_id] = service });
            this.setState({vendorsById: vendorsById, servicesById: servicesById});
        }
        if (!this.props.loading && this.state.loadingCollections){ this.setState({loadingCollections: false}); }
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;        
        this.updateMessage = {color:'', message:''};
        if (name.includes('user_')){
            let selection = this.state.selection;
            name = name.replace('user_', '')
            if (name == 'cpf'){ value = mask('cpf', value ); }
            if (name == 'cnpj'){ value = mask('cnpj', value); }
            if (name == 'birthday'){ value = mask('birthday', value ); }
            if (name == 'phone'){ value = mask('phone', value); }
            if (name == 'cellphone'){ value = mask('phone', value); }
            selection.user[name] = value;
            this.setState({selection: selection});
            return;
        }
        if (name.includes('vendor_')){
            let selection = this.state.selection;
            name = name.replace('vendor_', '');
            if (name == 'cpf'){ value = mask('cpf', value ); }
            if (name == 'cnpj'){ value = mask('cnpj', value); }
            if (name == 'birthday'){ value = mask('birthday', value ); }
            if (name == 'phone'){ value = mask('phone', value); }
            if (name == 'cellphone'){ value = mask('phone', value); }
            selection.vendor[name] = value;
            this.setState({selection: selection});
            return;
        }
        if (name.includes('service_')){
            let selection = this.state.selection;
            name = name.replace('service_', '');
            if (name == 'cpf'){ value = mask('cpf', value ); }
            if (name == 'cnpj'){ value = mask('cnpj', value); }
            if (name == 'birthday'){ value = mask('birthday', value ); }
            if (name == 'phone'){ value = mask('phone', value); }
            if (name == 'cellphone'){ value = mask('phone', value); }
            selection.service[name] = value;
            this.setState({selection: selection});
            return;
        }
        this.setState({ [name]: value });
    }
    userContainer(user){        
        let select = false;
        let admin = false;
        let vendor = false;
        let service = false;
        let filters = this.state.filters;
        if (!user){ return; }
        if (!user.profile){ user.profile = {firstName:'', lastName:'', email:'', cpf:'', cnpj:'', birthday:'', phone:'', roles:[], address:[], orders:[]}; }
        if (!user.profile.roles){ user.profile.roles = []; }
        if (user.profile.roles.includes('admin')){ admin = true; }
        if (user.profile.roles.includes('vendor')){ 
            vendor = this.state.vendorsById[user._id];
            vendor = (!vendor) ? false : vendor; 
        }
        if (user.profile.roles.includes('service')){ 
            service = this.state.servicesById[user._id];
            service = (!service) ? false : service;
        }
        if (!user.profile.fullName){ user.profile.fullName = '<Não indetificado>'; }
        if (!user.username){ user.username = '<Não identificado>'; }
        if (vendor){
            if (!filters.vendors.display){ return; }
            if (!filters.vendors.showAll){
                if (vendor.verified && filters.vendors.notVerified){ return; }
                if (!vendor.verified && filters.vendors.onlyVerified){ return; }
                if (vendor.displayOnly && filters.vendors.notDisplayOnly){ return; }
                if (!vendor.displayOnly && filters.vendors.displayOnly){ return; }
                if (vendor.limitedAccess && filters.vendors.notLimitedAccess){ return; }
                if (!vendor.limitedAccess && filters.vendors.onlyLimitedAccess){ return; }
                if (vendor.permaHidden && filters.vendors.notHidden){ return; }
                if (!vendor.permaHiden && filters.vendors.hidden){ return; }
            }
        }
        if (service){                 
            if (!filters.services.display){ return; }
            if (!filters.services.showAll){
                if (service.verified && filters.services.notVerified){ return; }
                if (!service.verified && filters.services.verified){ return; }
                if (service.permaHidden && filters.services.notHidden){ return; }
                if (!service.permaHidden && filters.services.hidden){ return; }
            }
        }

        return(
        <div style={{padding:'10px 0px', borderBottom:'1px solid #77777770', fontSize:'15px', color:'#555', cursor:'pointer'}} onClick={()=>{this.selectUser(user._id)}}>
            <div style={{marginBottom:'5px', display:'flex'}}>
                <div style={{marginRight:'5px', display:(select)?'block':'none', color:'black'}}>►</div>
                <div style={{fontWeight:(select)?'bold':'normal', color:(select)?'#222':'#333'}}>{user.profile.fullName}</div>
                <div style={{width:'fit-content', height:'fit-content', margin:'auto 0px auto 5px', fontSize:'12px', color:'black', display:(admin)?'block':'none'}}>[ADMIN]</div>
            </div>
            <div style={{marginBottom:'10px', fontSize:'12px'}}>({user.username})</div>
            <div style={{display:'flex'}}>
                <div style={{width:'fit-content', height:'22px', padding:'0 8px', marginRight:'10px', lineHeight:'22px', fontSize:'12px', borderRadius:'5px', backgroundColor:'#FF7000', color:'white', display:(vendor)?'block':'none'}}>Vendedor</div>
                <div style={{width:'fit-content', height:'22px', padding:'0 8px', marginRight:'10px', lineHeight:'22px', fontSize:'12px', borderRadius:'5px', backgroundColor:'#007AF3', color:'white', display:(service)?'block':'none'}}>Prestador de Serviço</div>
            </div>
        </div>);
    }
    addressList(){
        let selection = this.state.selection;
        let addressList = selection.user.address
        return(
        <div className='customScroll' style={{maxHeight:'290px', overflowY:'scroll'}}>
            {addressList.map((address, index)=>{
                let key = 'Address_'+index;
                let name = address.name;
                let _address = address.address;
                return(<div style={{marginBottom:(index == addressList.length - 1) ? '10px' : '0px'}}>{this.addressContainer(_address, name)}</div>)
            })}
        </div>);
    }
    addressContainer(_address, name){
        if (!_address){ return; }
        let address = [];
        address[0] = 'Destinatário: ' + name;
        address[1] = (_address.celular) ? 'Celular: ' + _address.celular : '';
        address[2] = (_address.rua) ? _address.rua : '';
        address[2] = (_address.numero) ? address[2] + ', ' + _address.numero : address[2];
        address[2] = (_address.complemento) ? address[2] + ' - ' + _address.complemento : address[2];
        if (!_address.rua){ address[2] = ''; }
        address[3] = (_address.cidade) ? _address.cidade : '';
        address[3] = (_address.UF) ? address[3] + ' - ' + _address.UF : address[3];
        if (!_address.cidade){ address[3] = (_address.estado) ? _address.estado : ''; } 
        address[4] = (_address.cep) ? _address.cep : '';
        return(
        <div style={{width:'100%', maxWidth:'398px', margin:'10px auto 0 auto', border:'1px solid #FF7000', borderRadius:'5px', backgroundColor:'white'}}>
            <div style={{margin:'15px'}}>
                <div style={{marginBottom:'4px', fontSize:'14px', color:'#555'}}>{address[0]}</div>
                <div style={{marginBottom:'4px', fontSize:'14px', color:'#555'}}>{address[1]}</div>
                <div style={{marginBottom:'4px', fontSize:'14px', color:'#555'}}>{address[2]}</div>
                <div style={{marginBottom:'4px', fontSize:'14px', color:'#555'}}>{address[3]}</div>
                <div style={{marginBottom:'4px', fontSize:'14px', color:'#555'}}>{address[4]}</div>
            </div>
        </div>)
    }
    accessUserAccount(_id){
        if (this.state.loading){ return; }
        this.setState({loading: true});
        console.log(Meteor.userId());
        Meteor.call('admin.impersonateUser', _id, (error)=>{
            if (!error){ Meteor.connection.setUserId(_id); history.push('/entrar'); return; }
            this.setState({loading: false});
        });
    }    
    userList(){
        if (this.props.loading || this.state.loading){ return; }
        let userList = (!this.props.users) ? [] : this.props.users;
        if (this.state.searchQuery.length > 0){ userList = this.state.userQuery; }
        console.log(userList)
        return(
        <div className='customScroll' style={{maxHeight:'570px', padding:'20px 15px', borderRadius:'5px', backgroundColor:'#F2F2F2', overflowY:'scroll'}}>
            {userList.map((user, index)=>{
                if (!user){ return; }
                if (!user.username){ return; }                
                if (!user.profile){ user.profile = {firstName:'', lastName:'', email:'', cpf:'', cnpj:'', birthday:'', phone:'', roles:[], address:[], orders:[]}; }
                let key = 'User_'+index;
                return(<div style={{borderTop:(index == 0)?'1px solid #77777770':'0px'}} key={key}>{this.userContainer(user)}</div>);
            })}
        </div>);
    }
    changePassword(){
        this.setState({loading: true});
        if (!this.state.selection.user){
            this.setState({loading: false});
            return;
        }
        if (!this.state.selection.user.newPassword.length > 8){
            this.updateMessage = { color: '#FF1414', message: 'A senha deve ter pelo menos 8 caracteres.' };
            this.setState({loading: false});
            return;
        }
        if (this.state.selection.user.newPassword != this.state.selection.user.confirmPassword){
            this.updateMessage = { color: '#FF1414', message: 'As senhas não são iguais.' };
            this.setState({loading: false});
            return;
        }
        let pack = { user_id: this.state.selection.user._id, password: this.state.selection.user.newPassword };
        Meteor.call('admin.update.password', pack, (error, result)=>{
            if (error){
                this.updateMessage = { color: '#FF1414', message: error.reason };
            }else{
                this.updateMessage = { color: '#3BCD38',  message: 'A senha do usuário foi alterada com sucesso.' };
            }
            this.setState({loading: false});
            return;
        });
    }
    filterUsers(){

    }
    userData(){
        if (this.props.loading || this.state.loading){ return; }
        if (!this.state.selection.user){ return; }
        let password = [{title: '', type: 'password'}, {title: '', type: 'password'}, {title: '', type: 'password'}];
        this.state.displayPassword.map((display, index)=>{
            if (display){ password[index] = {title: 'Ocultar senha', type: 'text'};  }else{ password[index] = {title: 'Mostrar senha', type: 'password'}; }
        });
        return(
        <div style={{maxWidth:'650px', padding:'0 15px', margin:'0 auto'}}>
            <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}>
                <input style={{width:'50%', height:'28px', maxWidth:'183px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid #ff7000', borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='user_firstName' placeholder='Nome' value={this.state.selection.user.firstName} onChange={(e)=>{this.inputHandler(e);}}/>
                <input style={{width:'50%', height:'28px', maxWidth:'183px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid #ff7000', borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='user_lastName' placeholder='Sobrenome' value={this.state.selection.user.lastName} onChange={(e)=>{this.inputHandler(e);}}/>
            </div>
            <div style={{width:'100%', maxWidth:'400px', margin:'0px auto', display:'flex'}}>
                <input style={{width:'100%', height:'28px', maxWidth:'388px', padding:'0px 5px', margin:'0px 0px 15px 0px', border:'1px solid #ff7000', borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='user_email' placeholder='E-mail' value={this.state.selection.user.email} onChange={(e)=>{this.inputHandler(e);}} autoCapitalize="none"/>
            </div>                                
            <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}>
                <input style={{width:'50%', height:'28px', maxWidth:'183px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid #ff7000', borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='user_cpf' placeholder='CPF' value={this.state.selection.user.cpf} onChange={(e)=>{this.inputHandler(e);}} autoCapitalize="none"/>
                <input style={{width:'50%', height:'28px', maxWidth:'183px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid #ff7000', borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='user_cnpj' placeholder='CNPJ' value={this.state.selection.user.cnpj} onChange={(e)=>{this.inputHandler(e);}} autoCapitalize="none"/>
            </div>
            <div style={{width:'fit-content', margin:'0 auto', display:'flex'}}>
                <input style={{width:'50%', height:'28px', maxWidth:'183px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid #ff7000', borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='user_phone' placeholder='Celular' value={this.state.selection.user.phone} onChange={(e)=>{this.inputHandler(e);}} autoCapitalize="none"/>
                <input style={{width:'50%', height:'28px', maxWidth:'183px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid #ff7000', borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='user_birthday' placeholder='Nascimento' value={this.state.selection.user.birthday} onChange={(e)=>{this.inputHandler(e);}} autoCapitalize="none"/>
            </div>
            <div style={{width:'100%', maxWidth:'398px', height:'fit-content', margin:'30px auto 40px auto', borderRadius:'5px', border:'1px solid #CCC', position:'relative'}}>
                <div style={{width:'155px', height:'fit-contend', textAlign:'center', backgroundColor:'#F7F7F7', position:'absolute', top:'-10px', left:'10px', fontWeight:'bold'}}>Alteração da senha</div>
                <div style={{margin:'15px 5px 5px 10px', fontSize:'11px', color:'#666'}}>*Salvar as alterações não irá alterar a senha do usuário, favor pressionar 'Alterar Senha' para realizar esta operação.</div>
                <div style={{display:'flex'}}>
                    <div style={{margin:'5px 0px 0px 10px', fontSize:'14px', display:'flex'}}>
                        <div style={{width:'120px', marginRight:'10px', textAlign:'right'}}>
                            <div style={{height:'30px', lineHeight:'30px', margin:'5px 0 10px 0', fontWeight:'normal'}}>
                                Nova senha:
                            </div>
                            <div style={{height:'30px', lineHeight:'30px', margin:'10px 0', fontWeight:'normal'}}>
                                Confirmar senha:
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{height:'30px', margin:'10px 0 5px', display:'flex'}}>
                            <div style={{width:'168x', height:'28px', padding: '0 0 0 15px', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', fontWeight:'300', backgroundColor:'white'}}>
                                <input type={password[1].type} autoComplete='new-password' style={{width:'100%', height:'100%', padding:'0px', border:'0px', display:'block', backgroundColor:'transparent'}} name='user_newPassword' value={this.state.selection.user.newPassword} onChange={(e)=>{ this.inputHandler(e) }}/>
                            </div>
                            <div title={password[1].title} type={password[1].type} style={{width:'30px', height:'30px', margin:'0 0 0 10px', backgroundImage:(!this.state.displayPassword[1]) ? 'url(/imgs/icons/icon-lockEye.png)' : 'url(/imgs/icons/icon-unlockEye.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{let state = this.state.displayPassword; state[1] = !state[1]; this.setState({displayPassword: state});}}></div>
                        </div>
                        <div style={{height:'30px', margin:'10px 0', display:'flex'}}>
                            <div style={{width:'168px', height:'28px', padding: '0 0 0 15px', lineHeight:'30px', border:'1px solid #FF7000AA', borderRadius:'3px', fontWeight:'300', backgroundColor:'white'}}>
                                <input type={password[2].type} autoComplete='new-password' style={{width:'100%', height:'100%', padding:'0px', border:'0px', display:'block', backgroundColor:'transparent'}} name='user_confirmPassword' value={this.state.selection.user.confirmPassword} onChange={(e)=>{ this.inputHandler(e) }}/>
                            </div>
                            <div title={password[2].title} type={password[2].type} style={{width:'30px', height:'30px', margin:'0 0 0 10px', backgroundImage:(!this.state.displayPassword[2]) ? 'url(/imgs/icons/icon-lockEye.png)' : 'url(/imgs/icons/icon-unlockEye.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{let state = this.state.displayPassword; state[2] = !state[2]; this.setState({displayPassword: state});}}></div>
                        </div>
                    </div>                    
                </div>
                <div style={{width:'fit-content', padding:'5px 20px', margin:'20px auto 20px auto', fontSize:'14px', borderRadius:'10px', color:'#FFF', textAlign:'center', fontWeight:'300', backgroundColor:'#FF7000', cursor:'pointer'}} onClick={()=>{this.changePassword()}}>ALTERAR SENHA</div>
            </div>
            <div style={{width:'100%', maxWidth:'400px', margin:'0 auto', fontSize:'15px', color:'#333'}}>Destinatários:</div>
            <div style={{margin:'15px auto'}}>
                {this.addressList()}
            </div>
            <div style={{width:'fit-content', margin:'35px auto 0 auto', display:'flex'}}>
                <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 15px', margin:'0px 40px 0px 0px', borderRadius:'15px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}} onClick={()=>{ if (this.state.loading){ return; } this.updateUser(); }}>Salvar</div>
                <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 15px', borderRadius:'15px', backgroundColor:'#AAA', color:'white', cursor:'pointer'}} onClick={()=>{ this.updateMessage = {color:'', message:''}; this.setState({selection: {page: 0, user: undefined, vendor: undefined, service: undefined}}) }}>Cancelar</div>
            </div>
        </div>);        
    }
    vendorData(){
        if (this.props.loading || this.state.loading){ return; }
        if (!this.state.selection.vendor){ return; }
        let vendor = this.state.selection.vendor;
        let address = [];
        address[0] = (vendor.address.rua) ? vendor.address.rua : '';
        address[0] = (vendor.address.numero) ? address[0] + ', ' + vendor.address.numero : address[0];
        address[0] = (vendor.address.complemento) ? address[0] + ' - ' + vendor.address.complemento : address[0];
        if (!vendor.address.rua){ address[0] = ''; }
        address[1] = (vendor.address.cidade) ? vendor.address.cidade : '';
        address[1] = (vendor.address.UF) ? address[1] + ' - ' + vendor.address.UF : address[1];
        if (!vendor.address.cidade){ address[1] = (vendor.address.estado) ? vendor.address.estado : ''; } 
        address[2] = (vendor.address.cep) ? vendor.address.cep : '';
        return(
        <div style={{padding:'0 5px'}}>
            <div style={{width:'100%', paddingTop:'36%', border:'1px solid '+vendor.color, borderRadius:'3px', position:'relative', backgroundColor:'white', backgroundImage:'url('+vendor.banner_url+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
            <div style={{width:'100%', height:'100px', position:'relative', bottom:'40px', display:'flex'}}>
                <div style={{width:'100px', height:'100px', margin:'0 0 0 30px', border:'1px solid '+vendor.color, borderRadius:'50%', backgroundColor:'white', textAlign:'center', backgroundImage:'url('+vendor.img_url+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                <input style={{width:'100%', height:'28px', maxWidth:'220px', padding:'0px 5px', margin:'auto 0px 20px 10px', border:'1px solid '+vendor.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white'}} name='vendor_display_name' placeholder='Nome da Loja' value={this.state.selection.vendor.display_name} onChange={(e)=>{this.inputHandler(e);}}/>
                <input id='color' type='color' style={{width:'25px', height:'25px', margin:'auto 5px 20px auto', border:'0px', cursor:'pointer'}} value={this.state.selection.vendor.color} onChange={(e)=>{let selection = this.state.selection; selection.vendor.color = e.target.value; this.setState({ selection: selection}); }}/>
                <label htmlFor='color' style={{height:'25px', lineHeight:'25px', margin:'auto 5px 20px 0px', fontSize:'13px', color:'#555', cursor:'pointer'}}>Selecionar Cor</label>
            </div>
            <div style={{position:'relative', bottom:'10px'}}>
                <div style={{margin:'0 auto', display:'flex'}}>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid '+vendor.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='vendor_email' placeholder='E-mail' value={this.state.selection.vendor.email} onChange={(e)=>{this.inputHandler(e);}}/>                                    
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid '+vendor.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='vendor_razaoSocial' placeholder='Razão Social' value={this.state.selection.vendor.razaoSocial} onChange={(e)=>{this.inputHandler(e);}}/>
                </div>
                <div style={{margin:'0 auto', display:'flex'}}>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid '+vendor.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='vendor_cpf' placeholder='CPF' value={this.state.selection.vendor.cpf} onChange={(e)=>{this.inputHandler(e);}}/>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid '+vendor.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='vendor_cnpj' placeholder='CNPJ' value={this.state.selection.vendor.cnpj} onChange={(e)=>{this.inputHandler(e);}}/>
                </div>
                <div style={{margin:'0 auto', display:'flex'}}>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid '+vendor.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='vendor_cellphone' placeholder='Celular' value={this.state.selection.vendor.cellphone} onChange={(e)=>{this.inputHandler(e);}}/>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid '+vendor.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='vendor_phone' placeholder='Telefone' value={this.state.selection.vendor.phone} onChange={(e)=>{this.inputHandler(e);}}/>
                </div>
            </div>
            <div style={{ margin:'0px 0px 25px 0px', display:'flex'}}>
                <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 0px', border:(vendor.perfilLock)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; selection.vendor.perfilLock = !selection.vendor.perfilLock; this.setState({selection: selection}); }}>
                    <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(vendor.perfilLock)?'block':'none'}}></div>
                </div>
                <div style={{width:'fit-content', height:'fit-content', margin:'auto 5px auto 10px', fontSize:'15px', fontWeight:'blod', color:'#444', display:(vendor.perfilLock)?'none':'block'}}>Desativar orçamentos do vendedor</div>
                <div style={{width:'fit-content', height:'fit-content', margin:'auto 5px auto 10px', fontSize:'15px', fontWeight:'blod', color:'#444', display:(vendor.perfilLock)?'block':'none'}}>A página de orçamento do vendedor está desativada</div>
            </div>
            <div style={{ margin:'0px 0px 25px 0px', display:'flex'}}>
                <div style={{width:'fit-content', height:'24px', lineHeight:'26px', padding:'0 15px', margin:'0 20px 0 0', border:(vendor.verified) ? '3px solid #FF7000' : '3px solid #999', borderRadius:'15px', fontSize:'14px', fontWeight:(vendor.verified) ? 'normal' : 'bold', backgroundColor:(vendor.verified) ? '#FF7000' : 'transparent', color:(vendor.verified) ? 'white' : '#999', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; selection.vendor.verified = (selection.vendor.verified) ? false : true; this.setState({ selection: selection}); }}>Verificado</div>
                <div style={{width:'fit-content', height:'24px', lineHeight:'26px', padding:'0 15px', margin:'0 20px 0 0', border:(vendor.limitedAccess) ? '3px solid #FF7000' : '3px solid #999', borderRadius:'15px', fontSize:'14px', fontWeight:(vendor.limitedAccess) ? 'normal' : 'bold', backgroundColor:(vendor.limitedAccess) ? '#FF7000' : 'transparent', color:(vendor.limitedAccess) ? 'white' : '#999', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; selection.vendor.limitedAccess = (selection.vendor.limitedAccess) ? false : true; this.setState({ selection: selection}); }}>Perfil Guia</div>
                <div style={{width:'fit-content', height:'24px', lineHeight:'26px', padding:'0 15px', margin:'0 20px 0 0', border:(vendor.displayOnly) ? '3px solid #FF7000' : '3px solid #999', borderRadius:'15px', fontSize:'14px', fontWeight:(vendor.displayOnly) ? 'normal' : 'bold', backgroundColor:(vendor.displayOnly) ? '#FF7000' : 'transparent', color:(vendor.displayOnly) ? 'white' : '#999', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; selection.vendor.displayOnly = (selection.vendor.displayOnly) ? false : true; this.setState({ selection: selection}); }}>Perfil Vitrine</div>
                <div style={{width:'fit-content', height:'24px', lineHeight:'26px', padding:'0 15px', margin:'0 0 0 0', border:(vendor.permaHidden) ? '3px solid #FF7000' : '3px solid #999', borderRadius:'15px', fontSize:'14px', fontWeight:(vendor.permaHidden) ? 'normal' : 'bold', backgroundColor:(vendor.permaHidden) ? '#FF7000' : 'transparent', color:(vendor.permaHidden) ? 'white' : '#999', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; selection.vendor.permaHidden = (selection.vendor.permaHidden) ? false : true; this.setState({ selection: selection}); }}>Ocultar</div>
            </div>
            <div style={{marginBottom:'10px', fontSize:'17px', fontWeight:'bold', color:'#555'}}>Endereço:</div>
            <div style={{margin:'10px 0 0 0', borderRadius:'5px'}}>
                <div style={{margin:'5px 0 30px 0'}}>
                    <div style={{marginBottom:'5px', fontSize:'15px', color:'#444'}}>{address[0]}</div>
                    <div style={{marginBottom:'5px', fontSize:'15px', color:'#444'}}>{address[1]}</div>
                    <div style={{marginBottom:'5px', fontSize:'15px', color:'#444'}}>{address[2]}</div>
                </div>
            </div>
            <div style={{width:'fit-content', margin:'35px auto 0 auto', display:'flex'}}>
                <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 15px', margin:'0px 20px 0px 0px', borderRadius:'15px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}} onClick={()=>{ if (this.state.loading){ return; } this.updateVendor(); }}>Salvar</div>
                <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 15px', borderRadius:'15px', backgroundColor:'#AAA', color:'white', cursor:'pointer'}} onClick={()=>{ this.updateMessage = {color:'', message:''}; this.setState({selection: {page: 0, user: undefined, vendor: undefined, service: undefined}}); }}>Cancelar</div>
            </div>
        </div>);       
    }
    serviceData(){
        if (this.props.loading || this.state.loading){ return; }
        if (!this.state.selection.service){ return; }
        let service = this.state.selection.service;
        let description = service.description.replace(/\r\n/g,'\n').split('\n');
        let address = [];
        address[0] = (service.address.rua) ? service.address.rua : '';
        address[0] = (service.address.numero) ? address[0] + ', ' + service.address.numero : address[0];
        address[0] = (service.address.complemento) ? address[0] + ' - ' + service.address.complemento : address[0];
        if (!service.address.rua){ address[0] = ''; }
        address[1] = (service.address.cidade) ? service.address.cidade : '';
        address[1] = (service.address.UF) ? address[1] + ' - ' + service.address.UF : address[1];
        if (!service.address.cidade){ address[1] = (service.address.estado) ? service.address.estado : ''; } 
        address[2] = (service.address.cep) ? service.address.cep : '';
        return(
        <div style={{padding:'0 5px'}}>
            <div style={{width:'100%', paddingTop:'36%', border:'1px solid '+service.color, borderRadius:'3px', position:'relative', backgroundColor:'white', backgroundImage:'url('+service.banner_url+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
            <div style={{width:'100%', height:'100px', position:'relative', bottom:'40px', display:'flex'}}>
                <div style={{width:'100px', height:'100px', margin:'0 0 0 30px', border:'1px solid '+service.color, borderRadius:'50%', backgroundColor:'white', backgroundImage:'url('+service.img_url+')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                <input style={{width:'100%', height:'28px', maxWidth:'220px', padding:'0px 5px', margin:'auto 0px 20px 10px', border:'1px solid '+service.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='service_display_name' placeholder='Nome Completo' value={this.state.selection.service.display_name} onChange={(e)=>{this.inputHandler(e);}}/>
                <input id='color' type='color' style={{width:'25px', height:'25px', margin:'auto 5px 20px auto', border:'0px', cursor:'pointer'}} value={this.state.selection.service.color} onChange={(e)=>{let selection = this.state.selection; selection.service.color = e.target.value; this.setState({ selection: selection}); }}/>
                <label htmlFor='color' style={{height:'25px', lineHeight:'25px', margin:'auto 5px 20px 0px', fontSize:'13px', color:'#555', cursor:'pointer'}}>Selecionar Cor</label>
            </div>
            <div style={{position:'relative', bottom:'10px'}}>
                <div style={{margin:'0 auto', display:'flex'}}>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid '+service.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='service_email' placeholder='E-mail' value={this.state.selection.service.email} onChange={(e)=>{this.inputHandler(e);}}/>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid '+service.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='service_birthday' placeholder='Nascimento' value={this.state.selection.service.birthday} onChange={(e)=>{this.inputHandler(e);}}/>
                </div>
                <div style={{margin:'0 auto', display:'flex'}}>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid '+service.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='service_cpf' placeholder='CPF' value={this.state.selection.service.cpf} onChange={(e)=>{this.inputHandler(e);}}/>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid '+service.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='service_cnpj' placeholder='CNPJ' value={this.state.selection.service.cnpj} onChange={(e)=>{this.inputHandler(e);}}/>
                </div>
                <div style={{margin:'0 auto', display:'flex'}}>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 5px 15px 0px', border:'1px solid '+service.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='service_cellphone' placeholder='Celular' value={this.state.selection.service.cellphone} onChange={(e)=>{this.inputHandler(e);}}/>
                    <input style={{width:'50%', height:'28px', maxWidth:'278px', padding:'0px 5px', margin:'0px 0px 15px 5px', border:'1px solid '+service.color, borderRadius:'3px', fontSize:'15px', backgroundColor:'white', textAlign:'center'}} name='service_phone' placeholder='Telefone' value={this.state.selection.service.phone} onChange={(e)=>{this.inputHandler(e);}}/>
                </div>
                <div style={{display:'flex'}}>
                    <div style={{width:'fit-content', height:'24px', lineHeight:'26px', padding:'0 15px', margin:'25px 20px 25px 0', border:(service.verified) ? '3px solid #FF7000' : '3px solid #999', borderRadius:'15px', fontSize:'14px', fontWeight:(service.verified) ? 'normal' : 'bold', backgroundColor:(service.verified) ? '#FF7000' : 'transparent', color:(service.verified) ? 'white' : '#999', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; selection.service.verified = (selection.service.verified) ? false : true; this.setState({ selection: selection}); }}>Verificado</div>
                    <div style={{width:'fit-content', height:'24px', lineHeight:'26px', padding:'0 15px', margin:'25px 0 25px 0', border:(service.permaHidden) ? '3px solid #FF7000' : '3px solid #999', borderRadius:'15px', fontSize:'14px', fontWeight:(service.permaHidden) ? 'normal' : 'bold', backgroundColor:(service.permaHidden) ? '#FF7000' : 'transparent', color:(service.permaHidden) ? 'white' : '#999', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; selection.service.permaHidden = (selection.service.permaHidden) ? false : true; this.setState({ selection: selection}); }}>Ocultar</div>       
                </div>
                
            </div>
            <div style={{width:'100%', maxWidth:'400px', marginBottom:'10px', fontSize:'17px', fontWeight:'bold', color:'#555'}}>Apresentação:</div>
            <div style={{width:'100%', margin:'10px auto 0 auto', borderRadius:'5px'}}>
                <div style={{width:'100%', padding:'0px', margin:'5px 0 30px'}}>
                    {description.map((text, index)=>{
                        let key = 'Line_'+index;
                        return(<div style={{width:'100%'}} key={key}>{text}</div>)
                    })} 
                </div>
            </div>
            <div style={{width:'100%', maxWidth:'400px', marginBottom:'10px', fontSize:'17px', fontWeight:'bold', color:'#555'}}>Serviços:</div>
            <div style={{margin:'10px 0 0 0', borderRadius:'5px'}}>
                <div style={{margin:'5px 0 30px 0'}}>
                    {service.services.map((service, index)=>{
                        let key = 'Service_'+index;
                        return(<div style={{marginBottom:'5px', fontSize:'15px', color:'#444'}} key={key}>{service}</div>)
                    })}
                </div>
            </div>
            <div style={{marginBottom:'10px', fontSize:'17px', fontWeight:'bold', color:'#555'}}>Endereço:</div>
            <div style={{margin:'10px 0 0 0', borderRadius:'5px'}}>
                <div style={{margin:'5px 0 30px 0'}}>
                    <div style={{marginBottom:'5px', fontSize:'15px', color:'#444'}}>{address[0]}</div>
                    <div style={{marginBottom:'5px', fontSize:'15px', color:'#444'}}>{address[1]}</div>
                    <div style={{marginBottom:'5px', fontSize:'15px', color:'#444'}}>{address[2]}</div>
                </div>
            </div>
            <div style={{width:'fit-content', margin:'35px auto 0 auto', display:'flex'}}>
                <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 15px', margin:'0px 20px 0px 0px', borderRadius:'15px', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}} onClick={()=>{ if (this.state.loading){ return; } this.updateService(); }}>Salvar</div>
                <div style={{width:'fit-content', height:'30px', lineHeight:'30px', padding:'0 15px', borderRadius:'15px', backgroundColor:'#AAA', color:'white', cursor:'pointer'}} onClick={()=>{ this.updateMessage = {color:'', message:''}; this.setState({selection: {page: 0, user: undefined, vendor: undefined, service: undefined}}); }}>Cancelar</div>
            </div>
        </div>)
    }
    selectUser(_id){
        let user = Meteor.users.findOne({'_id': _id});
        let vendor = undefined;
        let vendor_verified = true;
        let service = undefined;
        let service_verified = true;
        let selection = {}
        if (!user){ return; }
        if (!user.profile){ user.profile = {firstName:'', lastName:'', email:'', cpf:'', cnpj:'', birthday:'', phone:'', roles:[], address:[], orders:[]}; }
        if (!user.profile.roles){ user.profile.roles = []; }
        if (user.profile.roles.includes('vendor')){ 
            vendor = Vendors.findOne({'vendor_id': _id});             
            if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': _id}); vendor_verified = false; }
        }
        if (user.profile.roles.includes('service')){ 
            service = Services.findOne({'service_id': _id}); 
            if (!service){ service = ServicesOnHold.findOne({'service_id': _id}); service_verified = false; }
        }
        
        let cpfCnpj = (user.profile.cpfCnpj)?user.profile.cpfCnpj:'';
        let cpf = (user.profile.cpf)?user.profile.cpf:'';
        let cnpj = (user.profile.cnpj)?user.profile.cnpj:'';
        if (cpfCnpj != ''){
            if (/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(cpfCnpj) && (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(cpf)))){ cpf = cpfCnpj; }
            if (/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(cpfCnpj) && (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(cnpj)))){ cnpj = cpfCnpj; }            
        }

        selection.page = 0;
        selection.user = {};
        selection.vendor = undefined;
        selection.service = undefined;

        selection.user._id = user._id;
        selection.user.fullName = (user.profile.fullName)?user.profile.fullName:'';
        selection.user.firstName = (user.profile.firstName)?user.profile.firstName:'';
        selection.user.lastName = (user.profile.lastName)?user.profile.lastName:'';
        selection.user.email = user.username;
        selection.user.cpf = cpf
        selection.user.cnpj = cnpj
        selection.user.birthday = (user.profile.birthday)?user.profile.birthday:'';
        selection.user.phone = (user.profile.phone)?user.profile.phone:'';
        selection.user.address = (user.profile.address)?user.profile.address:[];
        selection.user.date = (user.createdAt)?user.createdAt:undefined;
        selection.user.orders = [];
        selection.user.newPassword = '';
        selection.user.cofnrimPassword = '';

        if (vendor != undefined){   
            selection.vendor = {};   
            selection.vendor._id = vendor._id;      
            selection.vendor.img_url = (vendor.img_url)?vendor.img_url:'';
            selection.vendor.banner_url = (vendor.banner_url)?vendor.banner_url:'';
            selection.vendor.display_name = (vendor.display_name)?vendor.display_name:'';
            selection.vendor.color = (vendor.color)?vendor.color:'#FF7000';
            selection.vendor.email = (vendor.email)?vendor.email:'';
            selection.vendor.cpf = (vendor.cpf)?vendor.cpf:'';
            selection.vendor.cnpj = (vendor.cnpj)?vendor.cnpj:'';
            selection.vendor.phone = (vendor.phone)?vendor.phone:'';
            selection.vendor.cellphone = (vendor.cellphone)?vendor.cellphone:'';
            selection.vendor.address = (vendor.address)?vendor.address:{};
            selection.vendor.razaoSocial = (vendor.razaoSocial)?vendor.razaoSocial:'';
            selection.vendor.verified = vendor_verified
            selection.vendor.displayOnly = (vendor.displayOnly)?vendor.displayOnly:false;
            selection.vendor.limitedAccess = (vendor.limitedAccess)?vendor.limitedAccess:false;
            selection.vendor.permaHidden = (vendor.permaHidden)?true:false;
            selection.vendor.perfilLock = (vendor.perfilLock)?true:false
        }    
        if (service != undefined){
            selection.service = {};
            selection.service._id = service._id;
            selection.service.banner_url = (service.banner_url)?service.banner_url:'';
            selection.service.img_url = (service.img_url)?service.img_url:'';
            selection.service.display_name = (service.display_name)?service.display_name:'';
            selection.service.color = (service.color)?service.color:'#FF7000';
            selection.service.email = (service.email)?service.email:'';
            selection.service.birthday = (service.birthday)?service.birthday:'';
            selection.service.cpf = (service.cpf)?service.cpf:'';
            selection.service.cnpj = (service.cnpj)?service.cnpj:'';
            selection.service.cellphone = (service.cellphone)?service.cellphone:'';
            selection.service.phone = (service.phone)?service.phone:'';
            selection.service.description = (service.description)?service.description:'';
            selection.service.services = (service.services)?service.services:[];
            selection.service.address = (service.address)?service.address:{};
            selection.service.verified = service_verified;
            selection.service.permaHidden = (service.permaHidden) ? true : false;
        }
        this.setState({selection: selection});
        console.log(selection)
    }
    doSearch(){
        if (this.state.loading){ return; }
        this.setState({ searchQuery: this.searchQuery, loading: true });
        let options = {
            includeScore: true,
            minMatchCharLength: 3,
            findAllMatches: true,
            threshold: 0.25,
            keys: ['profile.fullName', 'profile.firstName', 'profile.lastName', 'username' ]            
        };
        console.log(this.state)
        let searchString = new Fuse(this.props.users, options);
        let result = searchString.search(this.searchQuery);
        let users = [];
        result.map((user, index)=>{ users.push(user.item); });
        console.log(this.state.searchQuery)
        console.log(result);
        this.setState({userQuery: users, loading: false});
    }
    updateVendor(){
        if (this.state.loading){ return; }
        let vendor = this.state.selection.vendor;
        let pack = {
            _id: vendor._id, 
            display_name: vendor.display_name, 
            color: vendor.color, 
            email: vendor.email, 
            cnpj: vendor.cnpj, 
            cpf: vendor.cpf, 
            phone: vendor.phone, 
            cellphone: vendor.cellphone, 
            verified: vendor.verified, 
            displayOnly: vendor.displayOnly, 
            limitedAccess: vendor.limitedAccess, 
            permaHidden: vendor.permaHidden,
            perfilLock: vendor.perfilLock,
            razaoSocial: vendor.razaoSocial
        }
        this.setState({ loading: true });
        Meteor.call('admin.update.vendor', pack, (error)=>{
            if (error){
                this.updateMessage = { 
                    color: '#FF1414', 
                    message: error.reason 
                };
            }else{
                this.updateMessage = { 
                    color: '#3BCD38', 
                    message: 'Os dados do vendedor foram atualizados com sucesso!' 
                };
            }
            this.setState({ loading: false });
        });
    }
    updateUser(){
        if (this.state.loading){ return; }
        let user = this.state.selection.user;
        let pack = {
            _id: user._id, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            email: user.email, 
            cnpj: user.cnpj, 
            cpf: user.cpf, 
            phone: user.phone, 
            birthday: user.birthday
        }
        this.setState({ loading: true });
        Meteor.call('admin.update.user', pack, (error)=>{
            if (error){
                this.updateMessage = { 
                    color: '#FF1414', 
                    message: error.reason 
                };
            }else{
                this.updateMessage = { 
                    color: '#3BCD38', 
                    message: 'Os dados do usuário foram atualizados com sucesso!' 
                };
            }
            this.setState({ loading: false });
        });
    }
    updateService(){
        if (this.state.loading){ return; }
        let user = this.state.selection.user;
        let service = this.state.selection.service;
        let pack = {
            _id: service._id, 
            display_name: service.display_name, 
            color: service.color, 
            email: service.email, 
            birthday: service.birthday,
            cnpj: service.cnpj, 
            cpf: service.cpf, 
            phone: service.phone, 
            cellphone: service.cellphone, 
            verified: service.verified, 
            permaHidden: service.permaHidden
        }
        this.setState({ loading: true });
        Meteor.call('admin.update.service', pack, (error)=>{
            if (error){
                this.updateMessage = { 
                    color: '#FF1414', 
                    message: error.reason 
                };
            }else{
                this.updateMessage = { 
                    color: '#3BCD38', 
                    message: 'Os dados do prestador de serviço foram atualizados com sucesso!' 
                };
            }
            this.setState({ loading: false });
        });
    }
    render(){
        console.log(this.props)
        let loading = (this.props.loading || this.state.loading);
        let email = '';
        let date = ''; //Data de cadastro: 10/10/2020
        let fullName = '';
        if (this.state.selection.user){
            fullName = (this.state.selection.user.fullName)?this.state.selection.user.fullName:'';
            email = (this.state.selection.user.email)?this.state.selection.user.email:'';
            date = (this.state.selection.user.date)?this.state.selection.user.date:'';
            if (date != ''){
                let day = date.getDate();
                day = (day < 10)?'0'+day.toString():day.toString();
                let month = date.getMonth() + 1;
                month = (month < 10)?'0'+month.toString():month.toString();
                let year = date.getFullYear().toString();
                date = 'Data de cadastro: ' + day + '/' + month + '/' + year;
            }
        }
        return(
        <div style={{width:'100%'}}>
            <MainHeader/>            
            <div style={{maxWidth:'1200px', padding:'0 20px', margin:'0 auto', display:'flex'}}>
                <div style={{width:'50%', minWidth:'320px', maxWidth:'350px', margin:'40px 10px 0px auto'}}>
                    <div style={{padding:'15px 20px', marginBottom:'20px', borderRadius:'5px', backgroundColor:'#F2F2F2'}}>
                        <div style ={{fontSize:'16px', color:'#777'}}>
                            <div style={{padding:'0 0 15px 0', borderBottom:'1px solid #77777770', fontWeight:'bold'}}>Filtros:</div>
                            <div style={{width:'90%', height:'28px', marginTop:'10px', border:'1px solid #FF7000AA', borderRadius:'3px', backgroundColor:'white', position:'relative'}}>
                                <input style={{height:'28px', padding:'0 30px 0 10px', border:'0px'}} name='searchQuery' onChange={(e)=>{this.searchQuery = e.target.value;}} placeholder='Procurar por...' onKeyDown={(e)=>{if (e.key==='Enter'){ this.doSearch(); }}}/>
                                <div style={{minWidth:'29px', height:'28px', backgroundColor:'#FF7000', backgroundImage:'url(/imgs/icons/icon-lupa.png', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', position:'absolute', right:'0px', top:'0px', cursor:'pointer'}} onClick={()=>{ this.doSearch(); }}></div>
                            </div>                            
                            <div style={{padding:'0px', marginTop:'15px', borderTop:'1px solid #77777770', borderBottom:'1px solid #77777770'}}>
                                <div style={{display:'flex', height:'25px'}}>
                                    <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.display)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.display = !(filters.vendors.display); filters.vendors.showAll = filters.vendors.display; this.setState({filters: filters}); }}>
                                        <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.display)?'block':'none'}}></div>
                                    </div>
                                    <div style={{width:'fit-content', height:'fit-content', margin:'auto 5px auto 10px', fontSize:'15px', fontWeight:'blod', color:'#444'}}>Vendedores</div>
                                </div>
                                <div style={{width:'220px', marginLeft:'30px', marginTop:'5px', borderBottom:(this.state.filters.vendors.showAll || !this.state.filters.vendors.display)?'0px':'1px solid #77777770'}}>
                                    <div style={{display:'flex', height:'25px', paddingBottom:'5px', marginTop:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.showAll)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; if (!filters.vendors.display){ return; } filters.vendors.showAll = !(filters.vendors.showAll); this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.showAll)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Mostrar Todos</div>
                                    </div>
                                </div>    
                                <div style={{width:'220px', marginLeft:'30px', marginTop:'5px', borderBottom:'1px solid #77777770', display:(this.state.filters.vendors.showAll || !this.state.filters.vendors.display)?'none':'block'}}>
                                    <div style={{display:'flex', height:'25px', marginTop:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.onlyVerified)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.onlyVerified = !(filters.vendors.onlyVerified); filters.vendors.notVerified = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.onlyVerified)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Somente Verificados</div>
                                    </div>
                                    <div style={{display:'flex', height:'25px', paddingBottom:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.notVerified)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.notVerified = !(filters.vendors.notVerified); filters.vendors.onlyVerified = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.notVerified)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Ocultar Verificados</div>
                                    </div>
                                </div>
                                <div style={{width:'220px', marginLeft:'30px', marginTop:'5px', borderBottom:'1px solid #77777770', display:(this.state.filters.vendors.showAll || !this.state.filters.vendors.display)?'none':'block'}}>
                                    <div style={{display:'flex', height:'25px', marginTop:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.displayOnly)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.displayOnly = !(filters.vendors.displayOnly); filters.vendors.notDisplayOnly = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.displayOnly)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Somente Perfis Vitrine</div>
                                    </div>
                                    <div style={{display:'flex', height:'25px', paddingBottom:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.notDisplayOnly)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.notDisplayOnly = !(filters.vendors.notDisplayOnly); filters.vendors.displayOnly = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.notDisplayOnly)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Ocultar Perfis Vitrine</div>
                                    </div>
                                </div>
                                <div style={{width:'220px', marginLeft:'30px', marginTop:'5px', borderBottom:'1px solid #77777770', display:(this.state.filters.vendors.showAll || !this.state.filters.vendors.display)?'none':'block'}}>
                                    <div style={{display:'flex', height:'25px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.onlyLimitedAccess)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.onlyLimitedAccess = !(filters.vendors.onlyLimitedAccess); filters.vendors.notLimitedAccess = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.onlyLimitedAccess)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Somente Perfis Guia</div>
                                    </div>
                                    <div style={{display:'flex', height:'25px', paddingBottom:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.notLimitedAccess)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.notLimitedAccess = !(filters.vendors.notLimitedAccess); filters.vendors.onlyLimitedAccess = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.notLimitedAccess)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Ocultar Perfis Guia</div>
                                    </div>
                                </div>
                                <div style={{width:'220px', marginLeft:'30px', marginTop:'5px', marginBottom:'5px', display:(this.state.filters.vendors.showAll || !this.state.filters.vendors.display)?'none':'block'}}>
                                    <div style={{display:'flex', height:'25px', marginTop:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.hidden)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.hidden = !(filters.vendors.hidden); filters.vendors.notHidden = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.hidden)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Somente Perfis Ocultos</div>
                                    </div>
                                    <div style={{display:'flex', height:'25px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.vendors.notHidden)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.vendors.notHidden = !(filters.vendors.notHidden); filters.vendors.hidden = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.vendors.notHidden)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Ocultar Perfis Ocultos</div>
                                    </div>     
                                </div>                          
                            </div>
                            <div style={{padding:'0px', marginTop:'5px', borderBottom:'1px solid #77777770'}}>
                                <div style={{display:'flex', height:'25px'}}>
                                    <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.services.display)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.services.display = !(filters.services.display); filters.services.showAll = filters.services.display; this.setState({filters: filters}); }}>
                                        <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.services.display)?'block':'none'}}></div>
                                    </div>
                                    <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', fontWeight:'blod', color:'#444'}}>Prestadores de Serviço</div>
                                </div>
                                <div style={{width:'220px', marginLeft:'30px', marginTop:'5px', borderBottom:(this.state.filters.services.showAll || !this.state.filters.services.display)?'0px':'1px solid #77777770'}}>
                                    <div style={{display:'flex', height:'25px', paddingBottom:'5px', marginTop:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.services.showAll)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; if (!filters.services.display){ return; } filters.services.showAll = !(filters.services.showAll); this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.services.showAll)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Mostrar Todos</div>
                                    </div>
                                </div>
                                <div style={{width:'220px', paddingBottom:'5px', marginLeft:'30px', marginTop:'5px', borderBottom:'1px solid #77777770', display:(this.state.filters.services.showAll || !this.state.filters.services.display)?'none':'block'}}>
                                    <div style={{display:'flex', height:'25px', marginTop:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.services.verified)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.services.verified = !(filters.services.verified); filters.services.notVerified = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.services.verified)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Somente Verificados</div>
                                    </div>
                                    <div style={{display:'flex', height:'25px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.services.notVerified)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.services.notVerified = !(filters.services.notVerified); filters.services.verified = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.services.notVerified)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Ocultar Verificados</div>
                                    </div>     
                                </div> 
                                <div style={{width:'220px', marginLeft:'30px', marginTop:'5px', marginBottom:'5px', display:(this.state.filters.services.showAll || !this.state.filters.services.display)?'none':'block'}}>
                                    <div style={{display:'flex', height:'25px', marginTop:'5px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.services.hidden)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.services.hidden = !(filters.services.hidden); filters.services.notHidden = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.services.hidden)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Somente Perfis Ocultos</div>
                                    </div>
                                    <div style={{display:'flex', height:'25px'}}>
                                        <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 10px', border:(this.state.filters.services.notHidden)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let filters = this.state.filters; filters.services.notHidden = !(filters.services.notHidden); filters.services.hidden = false; this.setState({filters: filters}); }}>
                                            <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.filters.services.notHidden)?'block':'none'}}></div>
                                        </div>
                                        <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', color:'#333'}}>Ocultar Perfis Ocultos</div>
                                    </div>     
                                </div>                          
                            </div>
                        </div> 
                    </div>
                    {this.userList()}            
                </div>
                <div style={{width:'50%', minWidth:'525px', maxWidth:'750px', margin:'40px auto 0px 10px', backgroundColor:'#F2F2F2', padding:'15px 20px'}}>
                    <div style ={{fontSize:'16px', color:'#777', position:'relative'}}>
                        <div style={{padding:'0 0 15px 0', margin:'0 0 15px 0', borderBottom:'1px solid #77777770', fontWeight:'bold', display:'flex'}}>
                            <div>Perfil:</div>
                            <div style={{paddingLeft:'5px', color:this.updateMessage.color, display:(!this.updateMessage.message)?'none':'block'}}>{this.updateMessage.message}</div>
                        </div>
                        <div style={{marginBottom:'8px', color:'#333'}}>{fullName}</div>
                        <div style={{marginBottom:'8px', fontSize:'14px', color:'#555'}}>{email}</div>
                        <div style={{marginBottom:'20px', fontSize:'14px', color:'#555'}}>{date}</div>
                        <div style={{width:'fit-content', height:'23px', lineHeight:'23px', padding:'0 10px', borderRadius:'15px', fontSize:'13px', backgroundColor:'#FF1414', color:'white', position:'absolute', right:'5px', top:'55px', display:(this.state.selection.user)?'block':'none', cursor:'pointer', display:'none'}}>EXCLUIR CONTA</div>
                        <div style={{marginBottom:'30px', display:(this.state.selection.user)?'flex':'none'}}>
                            <div style={{width:'fit-content', borderBottom:(this.state.selection.page == 0)?'2px solid #FF7000':'2px solid transparent', fontSize:'18px', fontWeight:'bold', color:(this.state.selection.page == 0)?'#FF7000':'#777', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; if (selection.page == 0){ return; } selection.page = 0; this.setState({selection: selection})}}>Usuário</div>
                            <div style={{width:'fit-content', marginLeft:'20px', borderBottom:(this.state.selection.page == 1)?'2px solid #FF7000':'2px solid transparent', fontSize:'18px', fontWeight:'bold', color:(this.state.selection.page == 1)?'#FF7000':'#777', display:(this.state.selection.vendor != undefined)?'block':'none', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; if (selection.page == 1 || !selection.vendor){ return; } selection.page = 1; this.setState({selection: selection})}}>Vendedor</div>
                            <div style={{width:'fit-content', marginLeft:'20px', borderBottom:(this.state.selection.page == 2)?'2px solid #FF7000':'2px solid transparent', fontSize:'18px', fontWeight:'bold', color:(this.state.selection.page == 2)?'#FF7000':'#777', display:(this.state.selection.service != undefined)?'block':'none', cursor:'pointer'}} onClick={()=>{let selection = this.state.selection; if (selection.page == 2 || !selection.service){ return; } selection.page = 2; this.setState({selection: selection})}}>Prestador de Serviço</div>
                            <div style={{width:'fit-content', heigth:'25px', lineHeight:'25px', padding:'0 10px', margin:'auto 5px auto auto', borderRadius:'15px', fontSize:'14px', backgroundColor:'#FF7000', color:'white', position:'relative', bottom:'2px', display:(this.state.selection.page != 0)?'block':'none', cursor:'pointer'}} onClick={()=>{this.accessUserAccount(this.state.selection.user._id);}}>Acessar</div>
                        </div>
                        <div style={{display:(this.state.selection.page == 0)?'block':'none'}}>
                            {this.userData()}
                        </div>
                        <div style={{display:(this.state.selection.page == 1 && this.state.selection.vendor != undefined)?'block':'none'}}>
                            {this.vendorData()}
                        </div>
                        <div style={{display:(this.state.selection.page == 2 && this.state.selection.service != undefined)?'block':'none'}}>
                            {this.serviceData()}
                        </div>
                    </div>                    
                </div>
            </div>
            <Waiting open={loading} size='50px'/>
            <VendorFooter />
        </div>);
    }
}
export default UserListPage = withTracker( (props) => {
    if (!Meteor.userId()){ history.push('/entrar'); }

    const userHandler = Meteor.subscribe('ProfileSettings');
    const usersHandler = Meteor.subscribe('AllUsers');
    const vendorsHandler = Meteor.subscribe('AllVendors');
    const vendorsOnHoldHandler = Meteor.subscribe('AllVendorsOnHold');
    const servicesHandler = Meteor.subscribe('AllServices');
    const servicesOnHoldHandler = Meteor.subscribe('AllServicesOnHold');
    //const productsHandler = Meteor.subscribe('AllProducts');
    //const productsOnHoldHandler = Meteor.subscribe('AllProductsOnHold');
    //const incompleteProductsHandler = Meteor.subscribe('AllIncompleteProducts');
    //const orderHandler = Meteor.subscribe('AllOrders');
    //const orderInboxHandler = Meteor.subscribe('AllOrderInbox');
    if (usersHandler.ready()){ this.users = Meteor.users.find({}).fetch(); }
    return { 
        loading: !userHandler.ready() || !usersHandler.ready() 
        || !vendorsHandler.ready() || !vendorsOnHoldHandler.ready() 
        || !servicesHandler.ready() || !servicesOnHoldHandler.ready(),  
        //|| !orderHandler.ready() || !orderInboxHandler.ready() 
        //|| !productsHandler.ready() || !incompleteProductsHandler.ready() || !productsOnHoldHandler.ready() ,         
        user: Meteor.users.findOne({'_id': Meteor.userId()}),
        users: Meteor.users.find({}).fetch(),
        vendors: Vendors.find({}).fetch(),
        vendorsOnHold: VendorsOnHold.find({}).fetch(),
        service: Services.find({}).fetch(),
        serviceOnHold: ServicesOnHold.find({}).fetch(),
        //products: Products.find({}).fetch(),
        //productsOnHold: ProductsOnHold.find({}).fetch(),
        //incompleteProducts: IncompleteProducts.find({}).fetch(),
        //orders: Orders.find({}).fetch(),
        //ordersInbox: OrderInbox.find({}).fetch()
    };
    
})(UserListPage);