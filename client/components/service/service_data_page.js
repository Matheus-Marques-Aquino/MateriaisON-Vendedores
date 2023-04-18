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
import windowResize from 'window-resize';

class ServiceSettingsPage extends Component {
    constructor(props){
        super(props);
        this.services = ['Escolha uma categoria', 'Aluguel de Maquinário', 'Arquiteto', 'Engenheiro', 'Limpeza pós Obra', 
            'Pedreiro', 'Poço Artesiano', 'Antenista', 'Automação Residencial', 'Instalação de Eletrônicos', 
            'Instalador TV Digital', 'Instalador de Ar Condicionado', 'Segurança Eletrônica', 'Encanador', 
            'Eletricista', 'Gás', 'Gesso e Drywall', 'Pavimentação', 'Pintor', 'Serralheria e Solda', 
            'Vidraceiro', 'Chaveiro', 'Dedetizador', 'Desentupidor', 'Desinfecção', 'Impermebilizador', 
            'Marceneiro', 'Marido de Aluguel', 'Mudanças e Carretos', 'Tapeceiro', 'Decorador', 'Design de Interiores', 
            'Instalador de Papel de Parede', 'Jardinagem', 'Paisagismo', 'Montador de Móveis', 'Limpeza de Piscina', 'Outro'];
        this.state = {
            nome: '',
            cpf: '',
            cpnj: '',
            email: '',
            celular: '',
            loading: false,            
            banner: {
                w: (Math.round(document.querySelector('.mainContainer').clientWidth - 420)),
                h: (Math.round((document.querySelector('.mainContainer').clientWidth - 420) / 2.72))
            },
            servicos: [{servico: ''}]            
        };
    }
    handleResize = () => {
        let banner = { w: window.innerWidth, h: window.innerHeight };
        this.setState({ banner: banner });
    }
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize)
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        if (name.includes('servicos_')){
            console.log(name)
            let index = name.replace('servicos_', '');
            let servicos = []
            servicos = this.state.servicos;
            index = parseInt(index);
            servicos[index].servico = value;   
            if (value != 'Outros'){ servicos[index] = {servico: value}; }         
            this.setState({ servicos: servicos });
            return;
        }
        if (name.includes('outros_')){
            console.log(name)
            let index = name.replace('outros_', '');
            let servicos = []
            servicos = this.state.servicos;
            index = parseInt(index);
            servicos[index].other = value;            
            this.setState({ servicos: servicos });
            return;
        }
        this.setState({ [name]: value });
    }
    serviceList(){
        let servicos = this.state.servicos;
        for (let i = 0; i < servicos.length; i++){
            let service = servicos[i];
            if (i + 1 == servicos.length ){
                service.button = {text:'+', color:'#3395F5', index: i};      
                continue;
            }           
            service.button = {text:'-', color:'#FF1414', index: i};
        }
        return(
            servicos.map((service, index)=>{
                let key = 'Servico_'+index; 
                if (service.servico == 'Outro'){
                    return(<div style={{padding:'0 20px', display:'flex', marginBottom:'5px'}} key={key}>
                        <div style={{width:'100%', display:'flex'}}>
                            <div style={{width:'fit-content', display:'flex'}}>                                
                                <div style={{width:'fit-content', paddingRight:'10px', fontSize:'14px'}}>
                                    <CustomSelect width='400px' height='32px' margin='0px' maxHeight='223px' select={this.services} start={37} name={'servicos_'+index} index={index} value={this.state.servicos[index].servico} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <CustomInput width='400px' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name={'outros_'+index} value={this.state['outros_'+index]} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>                            
                            <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid '+service.button.color, backgroundColor:service.button.color, display:'flex'}} onClick={(e)=>{this.serviceController(index)}}>
                                <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>{service.button.text}</div>
                            </div>
                        </div>
                    </div>);
                }
                return(
                    <div style={{padding:'0 20px', display:'flex', marginBottom:'5px'}} key={key}>
                        <div style={{width:'fit-content', display:'flex'}}>
                            <CustomSelect width='400px' height='32px' maxHeight='223px' margin='0px' select={this.services} name={'servicos_'+index} index={index} value={this.state.servicos[index].servico} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                            <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid '+service.button.color, backgroundColor:service.button.color, display:'flex'}} onClick={(e)=>{this.serviceController(index)}}>
                                <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>{service.button.text}</div>
                            </div>
                        </div>
                    </div>
                ); 
            })
        );
    }
    serviceController(index){
        let servicos = this.state.servicos;
        if (servicos[index].button.text == '-'){
            servicos.splice(index, 1);            
        }else{
            if (servicos.length < 15){
                servicos.push({ servico: ''}); 
            }
        }
        this.setState({servicos: servicos})   
    }''
    render(){
        console.log(this.state)
        let totalWidth = Math.round(this.state.banner.w - 320);
        let totalHeight = Math.round(this.state.banner.w - 320) / 2.72 - 40;
        let logo = 110 / totalWidth * 110;
        let index = 2;
        let sizes = [
            {px:'50px', font:'10px'}, 
            {px:'75px', font:'14px'}, 
            {px:'90px', font:'18px'}];        

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
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Perfil do prestador de serviço:</div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Perfil do prestador de serviço:</div>
                            </div>
                            <div style={{margin:'10px 10px', border:'1px solid #CCC', backgroundColor:'white'}}>
                                <div style={{padding:'10px', border:'5px solid #F7F7F7', display:'flex', position:'relative'}}>
                                    <div style={{width:'100%', height:totalHeight, backgroundColor:'#F7F7F7', display:'flex'}}>
                                        <div style={{margin:'auto', fontWeight:'bold', color:'#CCC', fontSize:'20px'}}>1200 X 440</div>
                                        <div style={{width:'120px', height:'30px', lineHeight:'33px', borderRadius:'3px', backgroundColor:'#FF7000', textAlign:'center', position:'absolute', right:'100px', bottom:'-20px', fontSize:'14px', color:'white', display:'flex'}}>
                                            <div style={{margin:'0 auto', display:'flex'}}>
                                                <div style={{width:'16px', height:'16px', margin:'auto 0', marginRight:'5px', backgroundImage:'url(/imgs/icons/icon-upload.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                                <div style={{width:'fit-content', cursor:'pointer'}}>Subir Banner</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{position:'absolute', bottom:'-30px', left:'30px', border:'1px solid #ccc', backgroundColor:'white'}}>
                                        <div style={{padding:'10px', border:'5px solid #F7F7F7'}}>
                                            <div style={{width:sizes[index].px, height:sizes[index].px, backgroundColor:'#F7F7F7', display:'flex'}}>
                                                <div style={{margin:'auto'}}>
                                                    <div style={{fontWeight:'bold', textAlign:'center', color:'#CCC', fontSize:sizes[index].font}}>100 X 100</div>                                                
                                                </div>                                            
                                            </div>
                                        </div>
                                        <div style={{width:'100%', height:'25px', lineHeight:'25px', marginTop:'auto', fontSize:'12px', textAlign:'center', backgroundColor:'#00000050', color:'white', position:'absolute', bottom:'0', cursor:'pointer'}}>
                                            Subir Logo
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop:'50px', paddingBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#444', display:'flex'}}>
                                <div style={{width:'120px', padding:'0 10px'}}>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        Nome completo:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        CPF:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        CNPJ:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        E-mail:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        Celular:
                                    </div>
                                    <div style={{height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        Telefone:
                                    </div>
                                </div>
                                <div style={{width:'260px', padding:'0 10px'}}>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='nome' value={this.state.nome} inputStyle={{textAlign:'center'}} placeholder='Nome' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='cpf' value={this.state.cpf} inputStyle={{textAlign:'center'}} placeholder='CPF' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='cnpj' value={this.state.cnpj} inputStyle={{textAlign:'center'}} placeholder='CNPJ' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='email' value={this.state.email} inputStyle={{textAlign:'center'}} placeholder='E-mail'  onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='celular' value={this.state.celular} inputStyle={{textAlign:'center'}} placeholder='Celular com DDD' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                    <div style={{maxWidth:'260px', height:'30px', lineHeight:'30px', padding:'5px 0'}}>
                                        <CustomInput width='100%' height='28px' margin='0' name='telelfone' value={this.state.telefone} inputStyle={{textAlign:'center'}} placeholder='Telefone com DDD' onChange={(e)=>{this.inputHandler(e)}}/>
                                    </div>
                                </div>
                            </div>
                            <div style={{padding:'0 10px', marginTop:'30px'}}>
                                <div style={{height:'30px', lineHeight:'30px', fontSize:'16px', fontWeight:'bold', color:'#444'}}>
                                    Serviços prestados: 
                                </div>
                                <div style={{marginTop:'15px', paddingBottom:'250px'}}>
                                    {this.serviceList()}
                                </div>                                
                            </div>
                        </div>  
                    </div>
                </div>
                <Waiting open={this.state.loading} size='50px'/>
            </div>
        );
    }
}
export default ServiceSettingsPage;