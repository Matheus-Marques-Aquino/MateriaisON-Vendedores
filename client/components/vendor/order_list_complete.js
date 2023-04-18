import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import { Orders } from '../../../imports/collections/orders';
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold';
import CustomToggle from '../subcomponents/widgets/customToggle';
import CustomSelect from '../subcomponents/widgets/customSelect';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';

class CompleteOrdersListPage extends Component {
    constructor(props){
        super(props);
        this.start = true;
        this.state = {
            orders: [],
            loading: true
        };
    }
    componentDidMount(){
        if (this.start){
            this.start = false;
            this.setState({ loading: true });
            if (!Meteor.userId()){ history.push('/entrar'); return; }
            Meteor.subscribe('VendorSettings', ()=>{
                let vendor = Vendors.findOne({});
                if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()})}
                if (!vendor){ 
                    history.push('/index')
                    this.setState({ loading: false });
                    return; 
                }       
                let path = history.location.pathname.split('/');
                path = path[path.length - 1];
                console.log(path)
                if (path == 'pedidos-em-andamento'){
                    Meteor.subscribe('OrdersList', ()=>{
                        //'Aguardando pagamento', 'Preparando pedido', 'Pedido em transporte', 'Pedido concluído', 'Pedido cancelado', 'Pagamento recusado'
                        let orders = Orders.find({'vendor_id': vendor._id.toString()}, {sort:{'createdAt': 1}}).fetch();
                        let _orders = [];
                        if (!orders){ orders = []; }
                        
                        orders.map( order => {
                            if (order.status.index < 3){
                                _orders.push(order)
                            }
                        })
                        console.log(_orders);
                        this.setState({
                            orders: _orders,
                            loading:false
                        });
                        return;
                    });
                    return;  
                }  
                Meteor.subscribe('OrdersList', ()=>{
                    let orders = Orders.find({'vendor_id': vendor._id.toString()}, {sort:{'createdAt': -1}}).fetch();
                    if (!orders){ orders = []; }
                    console.log(orders);
                    this.setState({
                        orders: orders,
                        loading:false
                    });
                    return;
                });               
            });
        }
    }
    componentDidUpdate(){

    }
    listDisplay(){
        return(<div>{
            this.state.orders.map((order, index)=>{
                //'Aguardando pagamento', 'Preparando pedido', 'Pedido em transporte', 'Pedido concluído', 'Pedido cancelado', 'Pagamento recusado'
                let key = 'Pedido_' + index; 
                let color = ['#D7B614', '#007AF3', '#D7B614', '#3BCD38', '#FF1414', '#FF1414'];               
                let date = '';
                let price = '';
                
                color = color[order.status.index]
                date += (order.createdAt.getDate() > 9) ? order.createdAt.getDate() + '/' : '0' + order.createdAt.getDate().toString() + '/';
                date += ((order.createdAt.getMonth() + 1) > 9) ? (order.createdAt.getMonth() + 1).toString() + '/' : '0' + (order.createdAt.getMonth() + 1).toString() + '/';
                date += order.createdAt.getFullYear().toString().slice(2);
                price = order.price.replace(',', '.');
                price = parseFloat(price);
                price = price.toFixed(2);  

                return(
                <div style={{width:'fit-content', maxHeight:'80px', lineHeight:'30px', border:'1px solid #FF700080', borderTop:'0px', textAlign:'center', fontSize:'12px', backgroundColor:'white', color:'#555', display:'flex'}} key={key}>
                    <div style={{width:'110px', minHeight:'50px', maxWidth:'110px', lineHeight:'13px', textAlign:'left', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            #{order.order_id.replace('_', '')}
                        </div>
                    </div>
                    <div style={{width:'220px', maxWidth:'220px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            {order.name}
                        </div>
                    </div>
                    <div style={{width:'110px', maxWidth:'110px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            R$ {price.toString().replace('.',',')}
                        </div>
                    </div>
                    <div style={{width:'100px', maxWidth:'100px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            {date}
                        </div>
                    </div>
                    <div style={{width:'120px', maxWidth:'120px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto', fontWeight:'bold', color:color}}>
                            {order.status.name}    
                        </div>
                    </div>
                    <div style={{width:'100px', maxWidth:'100px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            <div style={{fontWeight:'bold', color:'#007AF3', cursor:'pointer'}} onClick={()=>{history.push('/pedido/'+order.order_id)}}>Visualizar</div>    
                        </div>
                    </div>                    
                </div>)
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
                <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7', width:'100%'}}>
                    <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                        <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Lista de pedidos:</div>
                    </div>
                    <div style={{margin:'10px 20px', padding:'10px 15px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        {/*<div style={{margin:'10px 0', marginBottom:'0px', marginLeft:'auto', display:'flex'}}>
                            <CustomSelect select={['Edição em massa']} style={{fontSize:'12px'}} width='140px' height='30px' margin='0' name='name' value={this.state.productFilter} onChange={(e)=>{this.inputHandler(e)}}/>
                            <div style={{width:'70px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white'}}>Executar</div>
                        </div>
                        <div style={{display:'flex'}}>
                            <div style={{margin:'10px 0', marginBottom:'20px', display:'flex'}}>
                                <CustomInput width='210px' height='28px' margin='0' name='name' value={this.state.productSearch} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'70px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white'}}>Pesquisar</div>
                            </div>
                            <div style={{margin:'10px 0', marginBottom:'20px', marginLeft:'auto', display:'flex'}}>
                                <CustomSelect select={['Selecione uma categoria']} style={{fontSize:'12px'}} width='200px' height='30px' margin='0' name='name' value={this.state.productFilter} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'50px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white'}}>Filtrar</div>
                            </div>
                        </div>*/}                        
                        <div style={{width:'fit-content', height:'30px', lineHeight:'30px', border:'1px solid #FF700080', textAlign:'center', fontSize:'13px', fontWeight:'bold', backgroundColor:'#FF700020', display:'flex', color:'#555'}}>
                            <div style={{minWidth:'110px', height:'30px'}}>ID do pedido</div>
                            <div style={{minWidth:'220px', height:'30px', borderLeft: '1px solid #FF700080'}}>Cliente</div>
                            <div style={{minWidth:'110px', height:'30px', borderLeft: '1px solid #FF700080'}}>Valor</div>
                            <div style={{minWidth:'100px', height:'30px', borderLeft: '1px solid #FF700080'}}>Data</div>
                            <div style={{minWidth:'120px', height:'30px', borderLeft: '1px solid #FF700080'}}>Status</div>
                            <div style={{minWidth:'100px', height:'30px', borderLeft: '1px solid #FF700080'}}>Ações</div>
                        </div>
                        {this.listDisplay()}
                        <div style={{width:'fit-content', maxHeight:'80px', lineHeight:'30px', border:'1px solid #FF700080', borderTop:'0px', textAlign:'center', fontSize:'12px', backgroundColor:'white', color:'#555', display:'flex'}}>
                            <div style={{width:'110px', minHeight:'50px', maxWidth:'110px', lineHeight:'13px', textAlign:'left', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    Exemplo de Pedido
                                </div>
                            </div>
                            <div style={{width:'220px', maxWidth:'220px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    Cliente Exemplo
                                </div>
                            </div>
                            <div style={{width:'110px', maxWidth:'110px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    R$ 0,00
                                </div>
                            </div>
                            <div style={{width:'100px', maxWidth:'100px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    09/11/2020
                                </div>
                            </div>
                            <div style={{width:'120px', maxWidth:'120px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                                <div style={{margin:'auto', fontWeight:'bold', color:'#D7B614'}}>
                                    Aguardando Pagamento    
                                </div>
                            </div>
                            <div style={{width:'100px', maxWidth:'100px', minHeight:'50px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    <div style={{fontWeight:'bold', color:'#007AF3', cursor:'pointer'}} onClick={()=>{history.push('/pedido-teste/')}}>Visualizar</div>    
                                </div>
                            </div>                    
                        </div>                         
                    </div>
                </div>
            </div>
            <Waiting open={this.state.loading} size='60px' />
        </div>);
    }
}
export default CompleteOrdersListPage;