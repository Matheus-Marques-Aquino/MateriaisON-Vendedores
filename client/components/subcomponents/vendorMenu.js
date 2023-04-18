import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Vendors } from '../../../imports/collections/vendors';
import history from './widgets/history';
class VendorMenu extends Component {
    constructor(props){
        super(props);
        this.start = true;
        this.state={
            roles: [],
            mode: 0,
            limitedAccess: true
        };
    }
    componentDidMount(){
        if (!Meteor.userId()){ 
            Meteor.logout();
            history.push('/entrar'); 
        }
        Meteor.subscribe('ProfileSettings', ()=>{
            let user = Meteor.users.findOne({'_id': Meteor.userId()});
            if (!user){ history.push('/index'); return; }                
            if (!user.profile){ history.push('/index'); return; }
            if (!user.profile.roles){ history.push('/index'); return; }
            let limitedAccess = false;
            let roles = user.profile.roles;
            let mode = 0;
            if (roles.includes('vendor')){ mode = 1; }
            if (roles.includes('service')){ mode = 2; }
            if (roles.includes('vendor') && roles.includes('service')){ mode = 3; }
            if (mode == 0){ history.push('/index'); return; }
            if (mode == 1){
                Meteor.subscribe('VendorSettings', ()=>{
                    let vendor = Vendors.findOne({});
                    if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()})}
                    if (!vendor){ 
                        history.push('/index')
                        this.setState({ loading: false });
                        return; 
                    } 
                    limitedAccess = vendor.limitedAccess;
                    this.setState({ 
                        roles: roles,
                        mode: mode,
                        limitedAccess: limitedAccess 
                    }); 
                    console.log(vendor);
                    return;
                });
                return;
            }
            this.setState({ 
                        roles: roles,
                        mode: mode,
                        limitedAccess: limitedAccess 
                    })                           
            console.log(this.state);
        });
    }
    render(){
        let mode = this.state.mode;
        let limitedAccess = (this.state.limitedAccess)?true:false;
        return(
        <div style={{minWidth:'225px', height:'auto', borderRight:'1px solid #FF7000'}}>
            <div style={{height:'40px', paddingLeft:'10px', fontWeight:'bold', borderBottom:'1px solid #CCC', lineHeight:'40px', backgroundColor:'#F7F7F7', display:(mode == 2 || mode ==3) ? 'block' : 'none'}}>
                • Prestador de Serviço
            </div>
            <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', cursor:'pointer', display:(mode == 2 || mode ==3) ? 'block' : 'none'}} onClick={()=>{history.push('/perfil-do-prestador-de-servico')}}>  
                Editar Perfil
            </div>
            <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', cursor:'pointer', display:(mode == 2 || mode ==3) ? 'block' : 'none'}} onClick={()=>{history.push('/endereco-do-prestador-de-servico')}}>
                Endereço
            </div>
            {/*<div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', cursor:'pointer', display:(mode == 2 || mode ==3) ? 'block' : 'none'}} onClick={()=>{history.push('/orcamentos-do-prestador-de-servico')}}>
                Orçamentos
            </div>*/}
            <div style={{height:'40px', paddingLeft:'10px', fontWeight:'bold', borderBottom:'1px solid #CCC', lineHeight:'40px', backgroundColor:'#F7F7F7', display:(mode == 1 || mode ==3) ? 'block' : 'none'}}>
                • Fornecedor
            </div>
            <div>
                {/*<div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', animation:'blinker 1.8s infinite', cursor:'pointer'}} onClick={()=>{history.push('/documentos-do-fornecedor')}}>  
                    <div style={{opacity:'1.0'}}>
                        Documentação
                    </div>
                </div>*/}
                <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', cursor:'pointer', display:(mode == 1 || mode ==3) ? 'block' : 'none'}} onClick={()=>{history.push('/perfil-do-fornecedor')}}>  
                    Editar Perfil
                </div>
                <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', cursor:'pointer', display:(mode == 1 || mode ==3) ? 'block' : 'none'}} onClick={()=>{history.push('/endereco-do-fornecedor')}}>
                    Endereço comercial
                </div>
                {/*<div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', cursor:'pointer', display:(mode == 1 || mode ==3) ? 'block' : 'none'}} onClick={()=>{history.push('/dados-bancarios-do-fornecedor')}}>
                    Dados bancários
                </div>*/}
                <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #CCC', lineHeight:'40px', cursor:'pointer', display:((mode == 1 || mode == 3) && !limitedAccess) ? 'block' : 'none'}} onClick={()=>{history.push('/envio-do-fornecedor')}}>
                    Formas de envio
                </div>
            </div>
            <div style={{height:'40px', paddingLeft:'10px', fontWeight:'bold', borderBottom:'1px solid #CCC', lineHeight:'40px', backgroundColor:'#F7F7F7', display:((mode == 1 || mode ==3) && !limitedAccess) ? 'block' : 'none'}}>
                Gerenciar produtos
            </div>
            <div>
                <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #CCC', lineHeight:'40px', cursor:'pointer', display:((mode == 1 || mode ==3) && !limitedAccess) ? 'block' : 'none'}} onClick={()=>{history.push('/lista-de-produtos')}}>
                    Lista de produtos
                </div>
                <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #CCC', lineHeight:'40px', cursor:'pointer', display:((mode == 1 || mode ==3) && !limitedAccess) ? 'block' : 'none'}} onClick={()=>{history.push('/novo-produto')}}>
                    Adicionar produto
                </div>
                <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', cursor:'pointer', display:((mode == 1 || mode ==3) && !limitedAccess) ? 'block' : 'none'}} onClick={()=>{history.push('/importar-produtos')}}>
                    Importar produtos
                </div>                
            </div>
            <div style={{height:'40px', paddingLeft:'10px', fontWeight:'bold', borderBottom:'1px solid #CCC', lineHeight:'40px', backgroundColor:'#F7F7F7', display:((mode == 1 || mode ==3) && !limitedAccess) ? 'block' : 'none'}}>
                Pedidos
            </div>
            <div>
                <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #FFDBBF', lineHeight:'40px', cursor:'pointer', display:((mode == 1 || mode ==3) && !limitedAccess) ? 'block' : 'none'}} onClick={()=>{history.push('/pedidos-em-andamento')}}> 
                    Pedidos em andamento
                </div>
                <div style={{height:'40px', paddingLeft:'20px', borderBottom:'1px solid #CCC', lineHeight:'40px', cursor:'pointer', display:((mode == 1 || mode ==3) && !limitedAccess) ? 'block' : 'none'}} onClick={()=>{history.push('/lista-de-pedidos')}}>
                    Histórico de pedidos
                </div>
            </div>   
            <div style={{height:'40px', paddingLeft:'10px', fontWeight:'bold', borderBottom:'1px solid #CCC', lineHeight:'40px', backgroundColor:'#F7F7F7', cursor:'pointer', display:(mode > 0) ? 'block' : 'none'}} onClick={()=>{history.push('/configuracoes')}}>
                • Configurações da conta
            </div> 
            <div style={{height:'40px', paddingLeft:'10px', fontWeight:'bold', borderBottom:'1px solid #CCC', lineHeight:'40px', backgroundColor:'#F7F7F7', cursor:'pointer', display:(mode > 0) ? 'block' : 'none'}} onClick={()=>{history.push('/contato')}}>
                • Contato
            </div>                      
        </div>);
    }
}
export default VendorMenu;