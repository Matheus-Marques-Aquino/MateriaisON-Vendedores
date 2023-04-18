import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import { Services } from '../../../imports/collections/services';
import { ServicesOnHold } from '../../../imports/collections/services_onhold';
import { ServiceInbox } from '../../../imports/collections/service_inbox';
import CustomToggle from '../subcomponents/widgets/customToggle';
import CustomSelect from '../subcomponents/widgets/customSelect';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';

class ServiceOrderPage extends Component {
    constructor(props){
        super(props);
        this.start = true;
        this.state = {
            ordersList: [],
            openIndex: -1,
            deleteIndex: -1,
            selectList: [],
            mouseIndex: -1,
            selectLock: false,
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
                console.log(Meteor.userId())
                if (!user){ history.push('/index'); return; }
                if (!user.profile.roles.includes('service')){ history.push('/index'); return; }
                console.log(Meteor.userId());
                Meteor.subscribe('ServiceSettings', ()=>{
                    let service = Services.findOne({'service_id': Meteor.userId()});
                    if (!service){ return; }
                    
                })
            })
        }
    }    
    subscribe(service){
        Meteor.subscribe('ServiceInbox', service._id, ()=>{  
            let messages = ServiceInbox.find({'service_id': service._id}, {sort:{'date': -1}}).fetch();
            console.log(messages);
            if (!messages){ messages = []; }                    
            this.setState({ 
                ordersList: messages,
                loading: false 
            });
        });
    }
    openOrder(index){
        console.log('a')
        if (!this.state.orderList){ return; }
        if (!this.state.ordersList[index]){ return; }
        console.log('a')
        let list = this.state.ordersList;   
        let _id = list[index]._id;
        list[index].seen = true;
        Meteor.call('serviceInboxOrderOpen', _id);
        this.setState({orderList: list, openIndex: index}); 
    }
    deleteOrder(index){
        console.log('a')
        if (this.state.openIndex > -2){ return; }
        let list = this.state.ordersList;   
        let _id = list[index]._id;
        list.splice(index, 1);
        Meteor.call('serviceInboxOrderDelete', _id);
        this.setState({orderList: list, openIndex: -1, deleteIndex: -1});
    }
    deleteBox(){  
        console.log('a')      
        if (this.state.openIndex > -2){ return; }        
        if (!this.state.ordersList[this.state.deleteIndex]){ return; }
        let index = this.state.deleteIndex;    
        return(
        <div style={{width:'100%', height:'100%', margin:'auto', backgroundColor:'transparent', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', zIndex:'60'}} onClick={(e)=>{e.stopPropagation(); this.setState({openIndex: -1, deleteIndex: -1});}}>
            <div style={{width:'275px', height:'fit-content', margin:'auto', position:'fixed', top:'0', right:'0', bottom:'0', left:'225px'}}>
            <div style={{width:'100%', height:'25px', borderRadius:'8px 8px 0px 0px', border:'1px solid #FF700080', backgroundColor:'#F7F7F7', display:'flex'}}>
                <div style={{width:'10px', height:'10px', margin:'auto 20px auto auto', backgroundImage:'url(/imgs/icons/icon-xcancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(); this.setState({openIndex: -1, deleteIndex: -1});}}></div>
            </div>
                <div style={{width:'100%', padding:'20px 0px 10px', borderLeft:'1px solid #FF700080', borderRight:'1px solid #FF700080', fontSize:'14px', textAlign:'center', backgroundColor:'white', color:'#555'}}>
                    Deseja deletar este orçamento?
                </div>
                <div style={{width:'100%', height:'50px', borderRadius:'0px 0px 8px 8px', border:'1px solid #FF700080', borderTop:'0px', backgroundColor:'white', display:'flex'}}>
                    <div style={{width:'60px', height:'24px', lineHeight:'24px', margin:'auto', borderRadius:'15px', backgroundColor:'#FF700095', fontSize:'14px', textAlign:'center', color:'white', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(); this.deleteOrder(index)}}>Sim</div>
                    <div style={{width:'60px', height:'24px', lineHeight:'24px', margin:'auto', borderRadius:'15px', backgroundColor:'#FF700095', fontSize:'14px', textAlign:'center', color:'white', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(); this.setState({openIndex: -1, deleteIndex: -1});}}>Não</div>
                </div>
            </div>
        </div>);
    }
    contactTypeText(name){
        switch(name){
            case 'E-mail':
                return(
                    <div style={{height:'fit-content', margin:'15px 0 5px 0', fontSize:'14px', color:'#555'}}>
                        <div style={{width:'100%', height:'fit-content'}}>
                            <span style={{fontSize:'15px', fontWeight:'bold', color:'#FF1414'}}>* </span>
                            Favor responder esta mensagem através do <span style={{fontWeight:'bold', color:'#007AF3'}}>E-mail</span> citado no cabeçalho, conforme foi solicitado.
                        </div>
                        <div style={{height:'fit-content'}}>
                            Caso não consiga contatá-lo, tente enviar um e-mail fornecido.
                        </div>
                    </div>);
                break;
            case 'WhatsApp':
                return(
                    <div style={{height:'fit-content', margin:'15px 0 5px 0', fontSize:'14px', color:'#555'}}>
                        <div style={{width:'100%', height:'fit-content'}}>
                            <span style={{fontSize:'14px', fontWeight:'bold', color:'#FF1414'}}>* </span>
                            Favor responder esta mensagem pelo <span style={{fontWeight:'bold', color:'#25D366'}}>WhatsApp</span> citado no cabeçalho, conforme foi solicitado.
                        </div>
                        <div style={{height:'fit-content'}}>
                            Caso não consiga contatá-lo, tente enviar um e-mail fornecido.
                        </div>
                    </div>);
                break;
            case 'Outro':
                return(
                    <div style={{height:'fit-content', margin:'15px 0 5px 0', fontSize:'14px', color:'#555'}}>
                        <div style={{width:'100%', height:'fit-content'}}>
                            <span style={{fontSize:'14px', fontWeight:'bold', color:'#FF1414'}}>* </span>
                            Verifique no corpo da mensagem se foi citado qual a melhor forma de entrar em contato o cliente.
                        </div>
                        <div style={{height:'fit-content'}}>
                            Caso não tenha sido especificado favor entrar em contato com ele através do e-mail do cabeçalho.
                        </div>
                    </div>);
                break;
            default:
                return(
                    <div style={{height:'fit-content', margin:'15px 0 5px 0', fontWeight:'14px', color:'#555'}}>
                        <div style={{width:'100%', height:'fit-content'}}>
                            <span style={{fontSize:'14px', fontWeight:'bold', color:'#FF1414'}}>* </span>
                            Verifique no corpo da mensagem se foi citado qual a melhor forma de entrar em contato o cliente.
                        </div>
                        <div style={{height:'fit-content'}}>
                            Caso não tenha sido especificado favor entrar em contato com ele através do e-mail do cabeçalho.
                        </div>
                    </div>);
                break;
        }
    }
    orderBox(){
        console.log('a')
        if (this.state.openIndex < 0){ return; }        
        let week = [ 'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado' ];
        let month = [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ];
        let index = this.state.openIndex;
        let order = this.state.ordersList[index];
        let date = week[order.date.getDay()];
        let responseType = order.responseType;
        if (!responseType){ responseType = { name: 'Outro' }; }
            
        
        date += ', ';
        date += (order.date.getDate() > 9) ? order.date.getDate() : '0' + order.date.getDate().toString();
        date += ' de ';
        date += month[order.date.getMonth()];
        date += ' de ';
        date += order.date.getFullYear();
        
        return(
        <div style={{width:'100%', height:'100%', margin:'auto', backgroundColor:'transparent', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', zIndex:'60'}} onClick={(e)=>{e.stopPropagation(); this.setState({openIndex: -1});}}>
            <div style={{width:'100%', height:'fit-content', maxWidth:'475px', maxHeight:'565px', margin:'auto', backgroundColor:'transparent', position:'fixed', top:'0', right:'0', bottom:'0', left:'225px'}} onClick={(e)=>{e.stopPropagation();}}>
                <div style={{width:'100%', height:'40px', backgroundColor:'#F7F7F7', borderRadius:'8px 8px 0px 0px', border:'1px solid #FF700080', display:'flex'}}>
                    <div style={{width:'20px', height:'20px', margin:'auto 20px auto auto', backgroundImage:'url(/imgs/icons/icon-xcancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(); this.setState({openIndex: -1});}}></div>
                </div>
                <div style={{width:'100%', height:'fit-content', backgroundColor:'white', borderLeft:'1px solid #FF700080', borderRight:'1px solid #FF700080', display:'flex'}}>
                    <div style={{width:'100%', padding:'20px 35px'}}>
                        <div style={{height:'fit-content', padding:'0 10px', fontSize:'15px', color:'black'}}><b>{order.userName}</b></div>
                        <div style={{height:'fit-content', padding:'0 10px', marginTop:'5px', fontSize:'13px', color:'black'}}><span style={{fontWeight:'bold', color:'#007AF3'}}>E-mail:</span> {order.email}</div>    
                        <div style={{height:'fit-content', padding:'0 10px', marginTop:'5px', marginBottom:'8px', fontSize:'13px', color:'black', display:(responseType.name == 'WhatsApp') ? 'block' : 'none'}}><span style={{fontWeight:'bold', color:'#25D366'}}>WhatsApp:</span> {responseType.value}</div>                        
                        <div style={{height:'fit-content', padding:'0 10px', marginTop:'5px', fontSize:'12px', color:'#222'}}>{order.city + ' (' + order.distance + ' km)'}</div>
                        <div style={{height:'fit-content', padding:'0 10px', marginTop:'5px', fontSize:'12px', color:'#222'}}>{date}</div>
                        <div style={{height:'fit-content', maxHeight:'61px', padding:'7px', marginTop:'20px', border:'1px solid #FF700080', borderRadius:'3px', fontSize:'13px', color:'#555', overflowY:'auto'}}>{'Assunto: ' + order.title}</div>
                        <div style={{height:'100%', maxHeight:'200px', marginTop:'15px', border:'1px solid #FF700080', borderRadius:'3px', display:'flex'}}>
                            <textarea style={{width:'100%', height:'188px', margin:'auto', padding:'5px 10px',  border:'0px', backgroundColor:'transparent', resize:'none', fontSize:'13px', color:'#555'}} value={order.description} onChange={()=>{}}/>
                        </div>
                        {this.contactTypeText(responseType.name)}
                        <div style={{height:'fit-content', marginTop:'15px', fontSize:'14px', color:'#555'}}>    
                            <div style={{width:'100%', height:'fit-content'}}>
                                <span style={{fontSize:'14px', fontWeight:'bold', color:'#FF1414'}}>* </span>
                                Não se esqueça de se identificar como prestador de serviços da <b><span style={{color:'black'}}>Materiais</span><span style={{color:'#FF7000'}}>ON</span></b>.
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width:'100%', height:'40px', backgroundColor:'#F7F7F7', borderRadius:'0px 0px 8px 8px', border:'1px solid #FF700080'}}></div>
            </div>
        </div>)
    }
    listDisplay(){
        console.log('a')
        let now = new Date();
        let week = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        let month = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
        return(<div>{
            this.state.ordersList.map((order, index)=>{
                let key = 'Order_' + index;       
                let date = '';          
                let selected = false;
                let title = '[';
                title += order.title.slice(0, 50);
                title += (order.title.length > 50) ? '...]' : ']'
                if (this.state.selectList.includes(index)){ selected = true; }else{ selected = false; }
                if (order.date.getDate() == now.getDate() && order.date.getMonth() == now.getMonth() && order.date.getFullYear() == now.getFullYear()){
                    date += (order.date.getHours() > 9) ? order.date.getHours() : '0' + order.date.getHours().toString();
                    date += ':';
                    date += (order.date.getMinutes() > 9) ? order.date.getMinutes() : '0' + order.date.getMinutes().toString();
                }else{                    
                    date += (order.date.getDate() > 9) ? order.date.getDate() : '0' + order.date.getDate().toString();
                    date += ' de ';
                    date += month[order.date.getMonth()]
                }  
                return(
                <div style={{width:'100%', height:'50px', minHeight:'50px', borderBottom:'1px solid #FF700050', borderTop:(index == 0) ? '1px solid #FF700050' : '0px', fontSize:'12px', position:'relative', backgroundColor:(this.state.mouseIndex == index || this.state.openIndex == index || selected) ? '#FFF' : 'transparent', color:'#555', cursor:'pointer'}} 
                    onMouseOver={ ()=>{if (this.state.mouseIndex == -1){ this.setState({mouseIndex: index});}} } 
                    onMouseLeave={ ()=>{if (this.state.mouseIndex != -1){ this.setState({mouseIndex: -1});}} } 
                    key={key}
                >
                    <div style={{width:'100%', height:'42px', padding:'5px 0px', borderLeft:(this.state.mouseIndex == index || this.state.openIndex == index || selected) ? '5px solid #FF7000A0' : '5px solid transparent', position:'absolute', top:'-1px', right:'0', bottom:'0', left:'0'}} onClick={()=>{ if (this.state.openIndex == -1){ this.openOrder(index); }}}>
                        <div style={{width:'100%', minHeight:'21px', display:'flex'}}>
                            <div style={{width:'fit-content', height:'fit-content', maxWidth:'360px', margin:'auto 0px auto 65px', fontSize:'12px', fontWeight:(!order.seen) ? 'bold' : 'normal', textAlign:'left', display:'flex'}}>
                                <div style={{width:'fit-content', minWidth:'21px', margin:'auto 0', flexWrap:'wrap', display:'flex'}}>
                                    <div style={{width:'fit-content', height:'fit-content', paddingRight:'10px', whiteSpace:'nowrap'}}>{order.userName}</div>
                                    <div style={{width:'fit-content', height:'fit-content', whiteSpace:'nowrap'}}>{'<' + order.email + '>'}</div>
                                </div>
                            </div>
                            <div style={{width:'fit-content', margin:'auto 50px auto auto', fontSize:'11px', display:'flex'}}>
                                <div style={{width:'160px', height:'16px', minWidth:'180px', textAlign:'right', whiteSpace:'nowrap'}}>
                                    {order.city + ' (' + order.distance +' km)'}
                                </div>
                            </div>
                            <div style={{width:'10px', height:'10px', margin:'auto 0', border:'1px solid #FF7000A0', borderRadius:'3px', position:'absolute', left:'5px', top:'8.5px', display:(this.state.mouseIndex == index || selected || this.state.openIndex == index) ? 'flex' : 'none'}} onClick={(e)=>{ e.stopPropagation(); let list = this.state.selectList; let indexOf = list.indexOf(index); if (indexOf > -1){ list.splice(indexOf, 1); }else{ list.push(index); }; this.setState({selectList: list, selectLock: true}); }}>
                                <div style={{width:'6px', height:'6px', margin:'auto', borderRadius:'2px', backgroundColor:'#FF7000C0', display:(selected) ? 'block' : 'none'}}></div>
                            </div>
                        </div>
                        <div style={{width:'100%', height:'21px', maxHeight:'25px', display:'flex'}}>
                            <div style={{width:'fit-content', height:'fit-content', margin:'auto 0', marginLeft:'65px', fontSize:'12px', fontWeight:(!order.seen) ? 'bold' : 'normal'}}>{title}</div>
                            <div style={{width:'fit-content', height:'fit-content', margin:'auto 0', marginLeft:'auto', marginRight:'50px', fontSize:'12px'}}>{date}</div> 
                        </div>  
                    </div>
                    <div style={{width:'20px', height:'40px', position:'absolute', top:'0', bottom:'0', left:'32px', margin:'auto', borderRadius:'5px', backgroundImage:(order.seen) ? 'url(/imgs/icons/icon-mail-open.png)' : 'url(/imgs/icons/icon-mail-closed.png)', opacity:'0.78', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>                   
                    <div style={{width:'20px', height:'20px', position:'absolute', top:'0', bottom:'0', right:'10px', margin:'auto', display:(this.state.mouseIndex == index || this.state.openIndex == index) ? 'block' : 'none', backgroundImage:'url(/imgs/icons/icon-thrash2.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}} onClick={(e)=>{ e.stopPropagation(); this.setState({deleteIndex: index, openIndex: -2})}}></div>                   
                </div>);
            })
        }</div>);
    }
    render(){
        console.log(this.state)        
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF700080', display:'flex'}}>
                <VendorMenu />
                <div style={{minWidth:'700px', margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7', width:'100%'}}>
                    <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                        <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Orçamentos:</div>
                    </div>
                    <div style={{margin:'10px 0', padding:'10px 0px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        {this.listDisplay()}                        
                    </div>
                    {this.orderBox()}
                    {this.deleteBox()}
                </div>
            </div>
            <Waiting open={this.state.loading} size='60px' />
        </div>);
    }
}
export default ServiceOrderPage;