import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import { Products } from '../../../imports/collections/products';
import { ProductsOnHold } from '../../../imports/collections/products_onhold';
import { IncompleteProducts } from '../../../imports/collections/incomplete_products';
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold';
import CustomToggle from '../subcomponents/widgets/customToggle';
import CustomSelect from '../subcomponents/widgets/customSelect';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';

class ProductListPage extends Component {
    constructor(props){
        super(props);
        this.start = true;
        this.state = {
            products: [],
            complete: 0,
            loading: true
        };
    }
    componentDidMount(){
        if (this.start){
            this.start = false;
            Meteor.subscribe('VendorSettings', ()=>{
                let vendor = Vendors.findOne({});
                if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()})}
                if (!vendor){ this.setState({ loading: false }); return; }       
                Meteor.subscribe('ProductsList', ()=>{
                    let products = Products.find({'id_vendor': vendor.id.toString()}, {sort:{'createAt': -1}}).fetch();
                    if (!products){ products = []; }
                    console.log(products);
                    products.map((product, index)=>{
                        products[index].selected = false;
                        products[index].status = 'Publicado';
                    });
                    this.setState({
                        products: this.state.products.concat(products),
                        complete: this.state.complete + 1,
                        loading:(this.state.complete < 2)
                    });
                });
                Meteor.subscribe('ProductsOnHoldList', ()=>{
                    let productsOnHold = ProductsOnHold.find({'id_vendor': vendor.id.toString()}, {sort:{'createAt': -1}}).fetch();
                    if (!productsOnHold){ productsOnHold = []; }
                    productsOnHold.map((product, index)=>{
                        productsOnHold[index].selected = false;
                        productsOnHold[index].status = 'Em análise'
                    });
                    this.setState({
                        products: this.state.products.concat(productsOnHold),
                        complete: this.state.complete + 1,
                        loading: (this.state.complete < 2)
                    });
                });
                Meteor.subscribe('IncompleteProductsList', ()=>{
                    let incompletProducts = IncompleteProducts.find({'id_vendor': vendor.id.toString()}, {sort:{'createAt': -1}}).fetch();
                    if (!incompletProducts){ incompletProducts = []; }
                    incompletProducts.map((product, index)=>{
                        incompletProducts[index].selected = false;
                        incompletProducts[index].status = 'Rascunho'
                    });
                    this.setState({
                        products: this.state.products.concat(incompletProducts),
                        complete: this.state.complete + 1,
                        loading:(this.state.complete < 2)
                    });
                });
                //this.setState({ loading: false });
                //console.log(this.id);                
            });
        }
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }
    listDisplay(){
        return(<div>{
            this.state.products.map((product, index)=>{
                let key = 'Product_' + index;                
                let date = (product.createAt.getDate() > 9) ? product.createAt.getDate() + '/' : '0' + product.createAt.getDate().toString() + '/'
                let selectDisplay = 'none';
                date += ((product.createAt.getMonth() + 1) > 9) ? (product.createAt.getMonth() + 1).toString() + '/' : '0' + (product.createAt.getMonth() + 1).toString() + '/'
                date += product.createAt.getFullYear().toString().slice(2);
                //console.log(product)
                if (product.selected == true){ selectDisplay = 'block'; }
                if (product.img_url.length == 0){ product.img_url.push({src: ''})}
                return(<div style={{width:'100%', maxHeight:'80px', lineHeight:'30px', border:'1px solid #FF700080', borderTop:'0px', textAlign:'center', fontSize:'12px', backgroundColor:'white', color:'#555', display:'flex'}} key={key}>
                    <div style={{minWidth:'80px', minHeight:'80px', position:'relative', backgroundImage:'url('+product.img_url[0].src+')', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}>
                        <div style={{width:'15px', height:'15px', position:'absolute', top:'-1px', left:'-1px', border:'1px solid #FF700080', backgroundColor:'white', cursor:'pointer'}} 
                        onClick={()=>{
                            let products = this.state.products;
                            products[index].selected = !products[index].selected;
                            this.setState({ products: products })
                        }
                        }>
                            <div style={{display:selectDisplay, width:'15px', height:'15px', position:'absolute', top:'-2px', left:'2px', backgroundImage:'url(/imgs/icons/icon-marked.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}>
                            </div>
                        </div>
                    </div>
                    <div style={{width:'100%', minHeight:'80px', minWidth:'210px', lineHeight:'13px', borderLeft: '1px solid #FF700080', textAlign:'left', display:'flex'}}>
                        <div style={{height:'fit-content', padding:'10px', margin:'auto 0'}}>
                            {product.name}
                        </div>
                    </div>
                    <div style={{minWidth:'80px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>R${(parseFloat(product.price).toFixed(2)).toString().replace('.', ',')}</div>
                    </div>
                    <div style={{minWidth:'80px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                                {product.stock_quantity}
                                <div style={{fontSize:'10px', lineHeight:'0px', paddingTop:'8px'}}>
                                    und.
                                </div>
                            </div>                                      
                        </div>
                    <div style={{minWidth:'180px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            {product.category.map((_category, _index)=>{
                                let key='Category_'+_index;
                                return(<div style={{width:'100%', padding:'4px 0'}} key={key}>{_category.name}</div>)
                            })}
                        </div>
                    </div>
                    <div style={{minWidth:'80px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            {date}
                        </div>
                    </div>
                    <div style={{minWidth:'75px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            {product.status}    
                        </div>
                    </div>
                    <div style={{minWidth:'90px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF700080', display:'flex'}}>
                        <div style={{width:'22px', height:'80px', marginLeft:'5px', display:'flex'}}>
                            <div title='Visualizar produto' style={{width:'22px', height:'15px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-seen.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}}></div>
                        </div>
                        <div style={{width:'22px', height:'80px', margin:'0 auto', display:'flex'}}>
                            <div title='Editar produto' style={{width:'22px', height:'18px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-pencil.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{history.push('/editar-produto/'+product.id)}}></div>
                        </div>
                        <div style={{width:'22px', height:'80px', marginRight:'5px', display:'flex'}}>
                            <div title='Excluir produto' style={{width:'22px', height:'19px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-thrash2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} 
                            onClick={
                            ()=>{if (this.state.loading){ return; } 
                                    this.setState({ loading: true }); 
                                    let pack = { product: product };
                                    Meteor.call('vendorRemoveProduct', pack, (error)=>{
                                        if (error){ 
                                            console.log(error);
                                        }else{
                                            let products = this.state.products;
                                            products.splice(index, 1);
                                            this.setState({product: products, loading: false});
                                            return;
                                        }
                                        this.setState({ loading: false })
                                    });
                                }
                            }></div>
                        </div>
                    </div>
                </div>)
            })
        }</div>);
    }
    render(){
        //console.log(this.state)        
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF700080', display:'flex'}}>
                <VendorMenu />
                <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7', width:'100%'}}>
                    <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                        <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Produtos cadastrados:</div>
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
                        <div style={{width:'100%', height:'30px', lineHeight:'30px', border:'1px solid #FF700080', textAlign:'center', fontSize:'13px', fontWeight:'bold', backgroundColor:'#FF700020', display:'flex', color:'#555'}}>
                            <div style={{minWidth:'80px', height:'30px'}}>Imagem</div>
                            <div style={{minWidth:'200px', width:'100%', height:'30px', paddingLeft:'10px', borderLeft: '1px solid #FF700080', textAlign:'left'}}>Produto</div>
                            <div style={{minWidth:'80px', height:'30px', borderLeft: '1px solid #FF700080'}}>Preço</div>
                            <div style={{minWidth:'80px', height:'30px', borderLeft: '1px solid #FF700080'}}>Estoque</div>
                            <div style={{minWidth:'180px', height:'30px', borderLeft: '1px solid #FF700080'}}>Categorias</div>
                            <div style={{minWidth:'80px', height:'30px', borderLeft: '1px solid #FF700080'}}>Data</div>
                            <div style={{minWidth:'75px', height:'30px', borderLeft: '1px solid #FF700080'}}>Status</div>
                            <div style={{minWidth:'90px', height:'30px', borderLeft: '1px solid #FF700080'}}>Ações</div>
                        </div>
                        {this.listDisplay()}                        
                    </div>
                </div>
            </div>
            <Waiting open={this.state.loading} size='60px' />
        </div>);
    }
}
export default ProductListPage;