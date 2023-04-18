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

class VendorProductListPage extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }

    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }

    render(){
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7', width:'100%'}}>
                    <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                        <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Lista de produtos:</div>
                    </div>
                    <div style={{margin:'10px 20px', padding:'10px 15px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{margin:'10px 0', marginBottom:'0px', marginLeft:'auto', display:'flex'}}>
                            <CustomSelect select={['Edição em massa']} style={{fontSize:'12px'}} width='140px' height='30px' margin='0' name='name' value={this.state.productFilter} onChange={(e)=>{this.inputHandler(e)}}/>
                            <div style={{width:'70px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white'}}>Executar</div>
                        </div>
                        <div style={{display:'flex'}}>
                            <div style={{margin:'10px 0', marginBottom:'20px', display:'flex'}}>
                                <input style={{width:'180px', height:'28px', padding:'0px 20px', margin:'0', lineHeight:'30px', textAlign:'left', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='productSearch' value={this.state.productSearch} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'70px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white'}}>Pesquisar</div>
                            </div>
                            <div style={{margin:'10px 0', marginBottom:'20px', marginLeft:'auto', display:'flex'}}>
                                <CustomSelect select={['Selecione uma categoria']} style={{fontSize:'12px'}} width='200px' height='30px' margin='0' name='name' value={this.state.productFilter} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'50px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white'}}>Filtrar</div>
                            </div>
                        </div>                        
                        <div style={{width:'100%', height:'30px', lineHeight:'30px', border:'1px solid #FF7000', textAlign:'center', fontSize:'13px', fontWeight:'bold', backgroundColor:'#FF700020', display:'flex'}}>
                            <div style={{minWidth:'80px', height:'30px'}}>Imagem</div>
                            <div style={{width:'100%', height:'30px', paddingLeft:'10px', borderLeft: '1px solid #FF7000', textAlign:'left'}}>Produto</div>
                            <div style={{minWidth:'75px', height:'30px', borderLeft: '1px solid #FF7000'}}>Preço</div>
                            <div style={{minWidth:'60px', height:'30px', borderLeft: '1px solid #FF7000'}}>Estoque</div>
                            <div style={{minWidth:'158px', height:'30px', borderLeft: '1px solid #FF7000'}}>Categorias</div>
                            <div style={{minWidth:'65px', height:'30px', borderLeft: '1px solid #FF7000'}}>Data</div>
                            <div style={{minWidth:'65px', height:'30px', borderLeft: '1px solid #FF7000'}}>Status</div>
                            <div style={{minWidth:'75px', height:'30px', borderLeft: '1px solid #FF7000'}}>Açoes</div>
                        </div>
                        <div style={{width:'100%', maxHeight:'80px', lineHeight:'30px', border:'1px solid #FF7000', borderTop:'0px', textAlign:'center', fontSize:'12px', backgroundColor:'white', color:'#555', display:'flex'}}>
                            <div style={{minWidth:'80px', minHeight:'80px'}}>
                                <div style={{}}></div>
                            </div>
                            <div style={{width:'100%', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', textAlign:'left', display:'flex'}}>
                                <div style={{height:'fit-content', padding:'10px', margin:'auto 0'}}>
                                    Produto
                                </div>
                            </div>
                            <div style={{minWidth:'75px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                                <div style={{margin:'auto'}}>R$0000,00</div>
                            </div>
                            <div style={{minWidth:'60px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                        1000000
                                        <div style={{fontSize:'10px', lineHeight:'0px', paddingTop:'8px'}}>
                                            und.
                                        </div>
                                    </div>                                      
                                </div>
                            <div style={{minWidth:'158px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    Climatização e ventilação
                                </div>
                            </div>
                            <div style={{minWidth:'65px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    00/00/00
                                </div>
                            </div>
                            <div style={{minWidth:'65px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    Publicado     
                                </div>
                            </div>
                            <div style={{minWidth:'75px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000'}}>
                                <div style={{width:'100%', height:'33%', fontWeight:'bold', color:'#3395F5', display:'flex', cursor:'pointer'}}>
                                    <div style={{margin:'auto'}}>Visualizar</div>
                                </div>
                                <div style={{width:'100%', height:'33%', fontWeight:'bold', color:'#3395F5', display:'flex', cursor:'pointer'}}>
                                    <div style={{margin:'auto'}}>Editar</div>
                                </div>
                                <div style={{width:'100%', height:'33%', fontWeight:'bold', color:'#3395F5', display:'flex', cursor:'pointer'}}>
                                    <div style={{margin:'auto'}}>Excluir</div>
                                </div>                                                                    
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>);
        }
    }
export default VendorProductListPage;