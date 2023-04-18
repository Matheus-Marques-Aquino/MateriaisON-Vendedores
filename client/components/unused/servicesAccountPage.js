import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';
import CustomInput from './subcomponents/widgets/customInput';
import CustomToggle from './subcomponents/widgets/customToggle';
import CustomSelect from './subcomponents/widgets/customSelect';
import VendorHeader from './subcomponents/vendor_header';
import VendorMenu from './subcomponents/vendorMenu';

class ServiceAccountPage extends Component {
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
            servicos: [{servico: ''}]
        };
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
                            <div style={{width:'100%', display:'flex'}}>                                
                                <div style={{width:'100%', paddingRight:'10px', fontSize:'14px'}}>
                                    <CustomSelect width='100%px' height='32px' margin='0px' maxHeight='192px' select={this.services} start={37} name={'servicos_'+index} index={index} value={this.state.servicos[index].servico} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                                <CustomInput width='100%' height='30px' margin='0px' inputStyle={{textAlign:'center'}} name={'outros_'+index} value={this.state['outros_'+index]} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>                            
                            <div style={{height:'30px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid '+service.button.color, backgroundColor:service.button.color, display:'flex'}} onClick={(e)=>{this.serviceController(index)}}>
                                <div style={{width:'30px', lineHeight:'30px', textAlign:'center', fontWeight:'bold', color:'white'}}>{service.button.text}</div>
                            </div>
                        </div>
                    </div>)
                }
                return(
                    <div style={{padding:'0 20px', display:'flex', marginBottom:'5px'}} key={key}>
                        <div style={{width:'100%', display:'flex'}}>
                            <CustomSelect width='100%' height='30px' maxHeight='210px' margin='0px' select={this.services} name={'servicos_'+index} index={index} value={this.state.servicos[index].servico} placeholder='SERVIÇO PRESTADO' onChange={(e)=>{this.inputHandler(e)}}/>
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
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
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
    render(){
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'45px', borderBottom:'1px solid #f7f7f7', backgroundColor:'#F7F7F7', display:'flex'}}>
                        <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px'}}>Editar Endereço</div>
                        <div style={{height:'27px', width:'75px', margin:'auto 0', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Salvar</div>
                        <div style={{height:'27px', width:'90px', margin:'auto 0', marginLeft:'10px', marginRight:'20px', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Rascunho</div>
                    </div> 
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Gerenciar serviços prestados:</div>
                        </div>                         
                        <div style={{height:'30px', lineHeight:'30px', marginLeft:'20px', marginBottom:'10px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                            Serviços:
                        </div>                       
                        {this.serviceList()}                     
                    </div>                    
                </div>
            </div>
        </div>);
    }
}
export default ServiceAccountPage;