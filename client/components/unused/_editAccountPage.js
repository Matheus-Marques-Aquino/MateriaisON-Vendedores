import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import VendorHeader from './subcomponents/vendorHeader';
import VendorMenu from './subcomponents/vendorMenu';
import windowResize from 'window-resize';

class VendorSettingsPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            banner: {
                w: Math.round(document.querySelector('.mainContainer').clientWidth - 420),
                h: Math.round((document.querySelector('.mainContainer').clientWidth - 420) / 2.72) - 40
            }
        };
    }
    handleResize = () => {
        let banner = { w: window.innerWidth, h: window.innerHeight };
        this.setState({ banner: banner });
    }
    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }

    render(){
        let totalWidth = Math.round(this.state.banner.w - 320);
        let totalHeight = Math.round(this.state.banner.w - 320) / 2.72 - 40;

        let logo = 110 / totalWidth * 110
        console.log(logo)
        let sIndex = 2;
        let sizes = [{px:'50px', font:'10px'}, {px:'75px', font:'14px'}, {px:'90px', font:'18px'}];
        if (this.state.banner.w < 950){ sIndex = 1; }
        if (this.state.banner.w < 830){ sIndex = 0; }
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'45px', borderBottom:'1px solid #f7f7f7', backgroundColor:'#F7F7F7', display:'flex'}}>
                        <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px'}}>Editar Perfil</div>
                        <div style={{height:'27px', width:'75px', margin:'auto 0', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Salvar</div>
                        <div style={{height:'27px', width:'90px', margin:'auto 0', marginLeft:'10px', marginRight:'20px', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Rascunho</div>
                    </div> 
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Perfil do lojista:</div>
                        </div>
                        <div style={{margin:'10px 10px', border:'1px solid #CCC', backgroundColor:'white'}}>
                            <div style={{padding:'10px', border:'5px solid #F7F7F7', display:'flex', position:'relative'}}>
                                <div style={{width:'100%', height:totalHeight, backgroundColor:'#F7F7F7', display:'flex'}}>
                                    <div style={{margin:'auto', fontWeight:'bold', color:'#CCC', fontSize:'20px'}}>1200 X 440</div>
                                    <div style={{width:'120px', height:'30px', lineHeight:'33px', borderRadius:'3px', backgroundColor:'#FF7000', textAlign:'center', position:'absolute', right:'100px', bottom:'-20px', fontSize:'14px', color:'white', display:'flex'}}>
                                        <div style={{margin:'0 auto', display:'flex'}}>
                                            <div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-upload.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                            <div style={{width:'fit-content'}}>Subir Banner</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{position:'absolute', bottom:'-30px', left:'30px', border:'1px solid #ccc', backgroundColor:'white'}}>
                                    <div style={{padding:'10px', border:'5px solid #F7F7F7'}}>
                                        <div style={{width:sizes[sIndex].px, height:sizes[sIndex].px, backgroundColor:'#F7F7F7', display:'flex'}}>
                                            <div style={{margin:'auto'}}>
                                                <div style={{fontWeight:'bold', textAlign:'center', color:'#CCC', fontSize:sizes[sIndex].font}}>100 X 100</div>                                                
                                            </div>                                            
                                        </div>
                                    </div>
                                    <div style={{width:'100%', height:'25px', lineHeight:'25px', marginTop:'auto', fontSize:'12px', textAlign:'center', backgroundColor:'#00000050', color:'white', position:'absolute', bottom:'0'}}>
                                        Subir Logo
                                    </div>
                                </div>                                
                            </div>
                        </div>
                        <div style={{marginTop:'50px', paddingBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#555', display:'flex'}}>
                            <div style={{width:'100px', padding:'0 10px'}}>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    Nome da Loja:
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    CNPJ:
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    E-mail:
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    Telefone:
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    Celular:
                                </div>
                            </div>
                            <div style={{width:'260px', padding:'0 10px'}}>
                                <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='fornecedorLoja' value={this.state.fornecedorLoja} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='fornecedorCNPJ' value={this.state.fornecedorCNPJ} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='fornecedorEmail' value={this.state.fornecedorEmail} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{maxWidth:'220px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='fornecedorTelelfone' value={this.state.fornecedorTelefone} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{maxWidth:'220px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='fornecedorCelular' value={this.state.fornecedorCelular} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                        </div>                        
                    </div>
                    <div style={{margin:'10px 20px', marginTop:'20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Perfil do prestador de serviço:</div>
                        </div>
                        <div style={{margin:'10px 10px', border:'1px solid #CCC', backgroundColor:'white'}}>
                            <div style={{padding:'10px', border:'5px solid #F7F7F7', display:'flex', position:'relative'}}>
                                <div style={{width:'100%', height:totalHeight, backgroundColor:'#F7F7F7', display:'flex'}}>
                                    <div style={{margin:'auto', fontWeight:'bold', color:'#CCC', fontSize:'20px'}}>1200 X 440</div>
                                    <div style={{width:'120px', height:'30px', lineHeight:'33px', borderRadius:'3px', backgroundColor:'#FF7000', textAlign:'center', position:'absolute', right:'100px', bottom:'-20px', fontSize:'14px', color:'white', display:'flex'}}>
                                        <div style={{margin:'0 auto', display:'flex'}}>
                                            <div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-upload.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                            <div style={{width:'fit-content'}}>Subir Banner</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{position:'absolute', bottom:'-30px', left:'30px', border:'1px solid #ccc', backgroundColor:'white'}}>
                                    <div style={{padding:'10px', border:'5px solid #F7F7F7'}}>
                                        <div style={{width:sizes[sIndex].px, height:sizes[sIndex].px, backgroundColor:'#F7F7F7', display:'flex'}}>
                                            <div style={{margin:'auto'}}>
                                                <div style={{fontWeight:'bold', textAlign:'center', color:'#CCC', fontSize:sizes[sIndex].font}}>100 X 100</div>                                                
                                            </div>                                            
                                        </div>
                                    </div>
                                    <div style={{width:'100%', height:'25px', lineHeight:'25px', marginTop:'auto', fontSize:'12px', textAlign:'center', backgroundColor:'#00000050', color:'white', position:'absolute', bottom:'0'}}>
                                        Subir Foto
                                    </div>
                                </div>                             
                            </div>
                        </div>
                        <div style={{marginTop:'50px', paddingBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#555', display:'flex'}}>
                            <div style={{width:'120px', padding:'0 10px'}}>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    Nome completo:
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    CPF:
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    E-mail:
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    Telefone:
                                </div>
                                <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    Celular:
                                </div>
                                <div style={{width:'200px', height:'30px', lineHeight:'30px', paddingTop:'15px'}}>
                                    Apresentação breve:
                                </div>                                                             
                                <div style={{height:'175px', width:'380px', padding:'10px', paddingBottom:'0px', margin:'0 auto', marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px', boxSizing:'border-box', backgroundColor:'white'}}>                                        
                                    <textarea style={{width:'100%', height:'140px', padding:'0px', border:'0px', fontSize:'14px', resize:'none', boxSizing:'border-box'}} name='description' value={this.state.description} onChange={(e)=>{this.inputHandler(e)}}/>
                                    <div style={{width:'100%', height:'20px', marginLeft:'auto', lineHeight:'20px', fontSize:'13px'}}>
                                    <div style={{width:'fit-content', marginLeft:'auto'}}>
                                        caracteres: <span style={{fontSize:'11px'}}>0/500</span></div>
                                    </div>
                                </div>                                
                            </div>
                            <div style={{width:'260px', height:'210px', padding:'0 10px'}}>
                                <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='prestadorNome' value={this.state.fornecedorLoja} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='prestadorCPF' value={this.state.fornecedorCNPJ} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='prestadorEmail' value={this.state.fornecedorEmail} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{maxWidth:'220px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='prestadoTelelfone' value={this.state.fornecedorTelefone} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <div style={{maxWidth:'220px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                    <CustomInput width='100%' height='28px' margin='0' name='prestadorCelular' value={this.state.fornecedorCelular} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
export default VendorSettingsPage;