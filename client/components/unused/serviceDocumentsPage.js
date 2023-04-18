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
import windowResize from 'window-resize';

class ServiceDocumentPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            displayForm: ['none', 0],
            files: [],
            documents: [],
            windowSize: {
                w: Math.round(document.querySelector('.mainContainer').clientWidth),
                h: Math.round(document.querySelector('.mainContainer').clientHeight)
            }
        };
    }
    handleResize = () => {
        let windowSize = { w: window.innerWidth, h: window.innerHeight };
        this.setState({ windowSize: windowSize });
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
        this.setState({ [name]: value })
    }
    displayFileButton(documentId, display, index){

        let files = this.state.files;
        if (index != files.length - 1 && files.length > 0){ return; }

        if (files.length == 0){  
            console.log('c')           
            return(<div>
                <input style={{display:'none'}} type='file' id={'document_'+this.state.displayForm[1]+'_0'} accept='image/*' onChange={(e)=>{this.formAction(this.state.displayForm[1], 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+this.state.displayForm[1]+'_0')}}/>
                <input style={{display:'none'}} type='file' id={'document_'+this.state.displayForm[1]+'_1'} accept='image/*' onChange={(e)=>{this.formAction(this.state.displayForm[1], 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+this.state.displayForm[1]+'_1')}}/>
            </div>);
        }        
        return(
        <div>{
            files.map((file, index)=>{  
                if (index == files.length - 1){
                    return(<div>
                        <input style={{display:'none'}} type='file' id={'document_'+this.state.displayForm[1]+'_'+index} accept='image/*' onChange={(e)=>{this.formAction(this.state.displayForm[1], 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+this.state.displayForm[1]+'_'+index)}}/>
                        <input style={{display:'none'}} type='file' id={'document_'+this.state.displayForm[1]+'_'+(index + 1)} accept='image/*' onChange={(e)=>{this.formAction(this.state.displayForm[1], 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+this.state.displayForm[1]+'_'+(index + 1))}}/>
                    </div>);                    
                }
                return(<input style={{display:'none'}} type='file' id={'document_'+this.state.displayForm[1]+'_'+index} accept='image/*' onChange={(e)=>{this.formAction(this.state.displayForm[1], 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+this.state.displayForm[1]+'_'+index)}}/>)
            })}
        </div>);
    }
    displayFileDocuments(documentId){
        if (this.state.files.length == 0){
            return(<div>{this.displayFileButton(0, 'block')}</div>);
        }
        return(<div>{
            this.state.files.map((file, index)=>{
                let key = 'file_'+index
                let display = 'none'
                if (index == this.state.files.length - 1){ display = 'block'; }
                return(
                    <div key={key}>                
                        <div style={{padding:'5px 15px', margin:'0px 15px', borderTop:'1px solid #FF700050', display:'flex'}}>
                            <div style={{margin:'auto 0px', width:'15px', height:'15px', border:'1px solid'}}></div>
                            <div style={{margin:'auto 10px', fontSize:'12px', color:'#FF7000'}}>
                                {file.name}
                            </div>                            
                            <div style={{margin:'auto 10px', marginLeft:'auto', marginRight:'30px', padding:'3px 5px', borderRadius:'5px', fontSize:'12px', backgroundColor:'#FF1414', color:'white', cursor:'pointer'}} onClick={()=>{this.formAction(this.state.displayForm[1], 'exclude', index)}}>
                                Excluir
                            </div>
                    </div>
                    {this.displayFileButton(documentId, display, index)}                    
                </div>);
            })
        }</div>);
    }
    sendButton(status, index){
        if (status == 0){
            return(
            <div style={{width:'fit-content', height:'fit-content', padding:'5px 10px', fontSize:'12px', backgroundColor:'#FF7000', borderRadius:'15px', color:'white', position:'absolute', bottom:'5px', right:'5px', cursor:'pointer'}} onClick={()=>{this.formAction(index, 'open')}}>                            
                ENVIAR
            </div>)
        }
    }
    displayOwners(){
        let documentStatus = ['Não enviado', 'Em análise', 'Aprovado', 'Recusado'];
        let color = ['#FF1414', '#D7B614', '#3BCD38', '#FF1414']
        let documments = [{status: 0}, {status: 0}];
        let display = 'flex';
        if (this.state.windowSize.w < 1100){
            display = 'block';
        }
        return(
        <div style={{display:display}}>
            <div style={{marginRight:'20px', width:'100%', maxWidth:'360px'}}>
                <div style={{marginTop:'30px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>
                    Documentos do prestador de serviço:
                </div>
                <div style={{maxWidth:'360px',height:'100px', marginTop:'15px', border:'2px solid #FF700070', borderRadius:'8px', display:'flex', position:'relative'}}> 
                    <div style={{width:'90px', height:'90px', margin:'auto 0'}}></div>
                    <div style={{height:'fit-content', margin:'auto 0'}}>
                        <div style={{height:'16px', lineHeight:'16px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>
                            Documento com foto:
                        </div>
                        <div style={{height:'16px', lineHeight:'16px', fontSize:'14px', fontWeight:'bold', color:color[documments[0].status]}}>
                            {documentStatus[documments[0].status]}
                        </div>
                        <div style={{marginTop:'25px', fontSize:'14px', color:'#777'}}>
                            Serão aceiros RG E CNH.
                        </div>                                    
                    </div>
                    {this.sendButton(documments[0].status, 0)}                 
                </div>
            </div>
            <div style={{width:'100%', maxWidth:'360px'}}>
                <div style={{marginTop:'30px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>
                    Confirmação de identidade:
                </div>
                <div style={{maxWidth:'360px',height:'100px', marginTop:'15px', border:'2px solid #FF700070', borderRadius:'8px', display:'flex', position:'relative'}}> 
                    <div style={{width:'90px', height:'90px', margin:'auto 0'}}></div>
                    <div style={{height:'fit-content', margin:'auto 0'}}>
                        <div style={{height:'16px', lineHeight:'16px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>
                            Documento de identificação
                        </div>
                        <div style={{height:'16px', lineHeight:'16px', fontSize:'14px', fontWeight:'bold', color:color[documments[1].status]}}>
                            {documentStatus[documments[1].status]}
                        </div>
                        <div style={{maxWidth:'180px', marginTop:'10px', fontSize:'14px', color:'#777'}}>
                            Uma foto sua segurando o seu documento identidade.
                        </div>                                    
                    </div>
                    {this.sendButton(documments[1].status, 1)} 
                </div>
            </div>
        </div>); 
    }
    displayFormText(){
        if (this.state.displayForm[1] == 0){
            return(
            <div style={{padding:'15px', borderBottom:'1px solid #F0F0F0'}}>
                <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                    • Serão aceitos somente RG ou CNH.
                </div>
                <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                    • As cópias devem ser coloridas, frente e verso, legíveis e sem cortes.
                </div>
                <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                    • Em caso de fotos, não podem estar desfocadas ou com brilho excessivo.
                </div>
            </div>);
        }
        return(
        <div style={{minWidth:'450px', padding:'15px', borderBottom:'1px solid #F0F0F0'}}>
            <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                • O rosto do portador do documento deve estar visível e sem qualquer acessório.
            </div>
            <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                • O documento deve estar legível para que possamos fazer a verificação do mesmo.
            </div>
            <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                • O documento deve estar em mãos próximo ao rosto do portador.
            </div>
        </div>)
    }
    displayForm(){
        let border = '0px';
        if (this.state.files.length > 0){ border = '1px solid #FF700050'; }
        
        return(
        <div style={{zIndex:'999', display:this.state.displayForm[0]}}>
            <div style={{width:'100%', height:'100%', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', backgroundColor:'black', opacity:'0.5'}}></div>
            <div style={{width:'100%', height:'fit-content', maxWidth:'450px', margin:'auto', position:'absolute', top:'0 ', right:'0', bottom:'0', left:'0', backgroundColor:'white', border:'1px solid #A5A5A', borderBottom:'1px solid #F2F2F2', borderRadius:'8px'}}>
                <div style={{width:'100%', height:'40px', lineHeight:'40px', textAlign:'center', borderBottom:'1px solid #F0F0F0', backgroundColor:'#F7F7F7', borderTopLeftRadius:'8px', borderTopRightRadius:'8px', position:'relative'}}>
                    Documento com foto
                    <div style={{width:'15px', height:'15px', margin:'auto', position:'absolute', top:'0px', right:'30px', bottom:'0px', backgroundImage:'url(/imgs/icons/cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}}  onClick={()=>{this.formAction(this.state.displayForm[1], 'close')}}></div>
                </div>                
                {this.displayFormText()}
                <div style={{width:'100%', minHeight:'300px', padding:'15px 0', marginBottom:'10px', maxHeight:'307px'}}>
                    {this.displayFileDocuments(this.state.displayForm[1].length)}         
                    <div style={{padding:'5px 15px', paddigTop:'20px', margin:'0px 15px', borderTop:border, display:'flex'}}>
                        <label htmlFor={'document_'+this.state.displayForm[1]+'_'+this.state.files.length} style={{width:'fit-content', height:'fit-content', padding:'5px 10px', margin:'auto 0', marginTop:'20px', fontSize:'13px', backgroundColor:'#FF7000', borderRadius:'10px', color:'white', cursor:'pointer'}}>                            
                            Adicionar arquivo
                        </label>                            
                    </div>           
                </div>
                <div style={{width:'100%', height:'40px', marginTop:'auto', borderTop:'1px solid #F0F0F0', backgroundColor:'#F7F7F7', display:'flex', borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px'}}>
                    <div style={{width:'fit-content', height:'fit-content', padding:'5px 10px', margin:'auto 0', marginLeft:'auto', fontSize:'12px', backgroundColor:'#FF7000', borderRadius:'10px', color:'white', cursor:'pointer'}} onClick={()=>{this.formAction(this.state.displayForm[1], 'close')}}>                            
                        Cancelar
                    </div> 
                    <div style={{width:'fit-content', height:'fit-content', padding:'5px 10px', margin:'auto 0', marginLeft:'20px', marginRight:'30px', fontSize:'12px', backgroundColor:'#FF7000', borderRadius:'10px', color:'white', cursor:'pointer'}} onClick={()=>{this.formAction(this.state.displayForm[1], 'save')}}>                            
                        Salvar
                    </div>
                </div>                 
            </div>                                                     
        </div>);
    }
    formAction(form, action, index, name, input){ 
        let documents = this.state.documents; 
        let files = this.state.files; 
        switch(action){
            case 'open':
                this.setState({displayForm: ['block', form], files:[]});
                break;     
            case 'close':
                this.setState({displayForm:['none', form], files:[]});
                break;
            case 'save':
                if (this.state.files > 0){
                    documents[form].files = this.state.files;
                    documents[form] = profile;
                    this.setState({displayForm: ['none', form], documents:documents, files:[]});
                }else{
                    this.setState({displayForm:['none', form],  files:[]});
                }                
                break; 
            case 'exclude':
                files.splice(index, 1);
                this.setState({files:files});
                break;
            case 'include':     
                files.push({name:name, input:input});     
                this.setState({files:files});     
                break;  
        }        
    }
    render(){
        console.log(this.state.windowSize)        
        return( 
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Documentação do prestador de serviço:</div>
                        </div>                         
                        <div style={{height:'30px', lineHeight:'30px', marginLeft:'20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                            Documentos:                        
                        </div>
                        <div style={{padding:'0 20px'}}>
                            <div style={{fontSize:'12px', color:'#666'}}>
                                • Para ativarmos sua conta na plataforma é necessário que você forneça os documentos descritos abaixo.
                            </div>
                            <div style={{fontSize:'12px', color:'#666'}}>
                                • As cópias devem ser coloridas, apresentar frente e verso do documento, legíveils e sem desfoque ou corte.
                            </div>
                            <div style={{fontSize:'12px', color:'#666'}}>
                                • Na confirmação de identidade, a foto deve aparecer o rosto do dono do documento segurando de forma visível o documento inserido na plataforma.
                            </div>
                            <div style={{fontSize:'12px', color:'#666'}}>
                                • Após isso é só clicar em enviar e aguardar pela nossa equipe o notificar referente a aprovação.
                            </div>                           
                            {this.displayOwners()}
                        </div>
                    </div>
                </div>
            </div>
            {this.displayForm()}
        </div>);
    }
}
export default ServiceDocumentPage;