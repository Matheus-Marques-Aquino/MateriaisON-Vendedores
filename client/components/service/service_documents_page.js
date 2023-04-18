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

class ServiceDocumentsPage extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.uploadList = [];
        this.state = {
            displayForm: 'none',
            formPage: 0,
            formType: 0,
            name: '',
            files: [],
            documents: [{files:[], status:0}, {files:[], status:0}],
            documentIndex: 0,
            upload: [],
            uploading:[]
        };
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value })
    }
    displayErrors(){
        return(
        <div style={{marginTop:'20px', fontSize:'14px', color:'#FF1414'}}>
            {this.errors.map((error, index)=>{
                let key = 'Error_' + index;
                return(<div style={{padding:'0 15px'}} key={key}>{ error }</div>);
            })}
        </div>);        
    }
    sendButton(index, status, type){
        if (status == 1 || status == 2){ return; }
        return(
            <div style={{width:'fit-content', height:'fit-content', padding:'5px 10px', fontSize:'12px', backgroundColor:'#FF7000', borderRadius:'15px', color:'white', position:'absolute', bottom:'5px', right:'5px', cursor:'pointer'}} onClick={()=>{this.setState({formType: type}); this.formAction({index:index, type:type}, 'open')}}>                            
                ENVIAR
            </div> 
        )
    } 
    displayDocuments(){
        let documents =  this.state.documents;
        let documentStatus = [['Não enviado', 'Em análise', 'Aprovado', 'Recusado'], ['Não enviado', 'Em análise', 'Aprovado', 'Recusado']]
        let color = [['#FF1414', '#D7B614', '#3BCD38', '#FF1414'], ['#FF1414', '#D7B614', '#3BCD38', '#FF1414']]
        console.log(documents[0].status)
        return(
        <div style={{overflow:'auto', paddingBottom:'50px'}}>{
            this.state.documents.map((document, index)=>{
                let key = 'Documentos_'+index;
                let type = '';
                let text = [['Documento com foto:', 'Serão aceiros RG E CNH.'], 
                    ['Confirmação do documento:', 'Uma foto sua segurando o seu documento identidade.']]
                if (index == 0){
                    type = 'Documentos do prestador de serviço:';
                }else{
                    type = 'Confirmação do documento:';
                }
                return(<div style={{width:'100%', maxWidth:'365px', float:'left', marginRight:'25px', overflow:'auto'}} key={key}>
                    <div style={{marginTop:'30px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>
                        {type}
                    </div>
                    <div style={{width:'360px' ,maxWidth:'365px', height:'100px', marginTop:'15px', border:'2px solid #FF700070', borderRadius:'8px', display:'flex', position:'relative'}}> 
                        <div style={{width:'90px', height:'90px', margin:'auto 0', display:'flex'}}>
                            <div style={{width:'70px', height:'70px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-document.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
                        </div>
                        <div style={{height:'fit-content', margin:'auto 0'}}>
                            <div style={{height:'16px', lineHeight:'16px', fontSize:'14px', fontWeight:'bold', color:'#555'}}>
                                {text[index][0]}
                            </div>
                            <div style={{height:'16px', lineHeight:'16px', fontSize:'14px', fontWeight:'bold', color:color[index][documents[index].status]}}>
                                {documentStatus[index][documents[index].status]}
                            </div>
                            <div style={{maxWidth:'180px', height:'34px', marginTop:'10px', fontSize:'14px', color:'#777', display:'flex'}}>
                                <div style={{margin:'auto 0'}}>{text[index][1]}</div>
                            </div>                                    
                        </div>
                        {this.sendButton(document, documents.status, index)}                        
                    </div>
                </div>);
            })
        }</div>);                
    }        
    displayForm(){
        let page = this.state.formPage;
        let document = this.state.documents[this.state.documentIndex];
        let button = [{text:'Próximo', action:'next'}, {text:'Salvar', action:'save'}];
        let title = ''
        if (this.state.formType == 0){
            title = 'Documento com foto'
        }else{
            title = 'Confirmação do documento'
        }           
        return(
        <div style={{zIndex:'999', display:this.state.displayForm}}>
            <div style={{width:'100%', height:'100%', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', backgroundColor:'black', opacity:'0.5'}}></div>
            <div style={{width:'100%', maxWidth:'430px', height:'520px', borderRadius:'8px', backgroundColor:'white', position:'fixed', margin:'auto', top:'0', right:'0', bottom:'0', left:'0'}}>
                <div style={{width:'100', height:'40px', lineHeight:'40px', textAlign:'center', borderBottom:'1px solid #F0F0F0', backgroundColor:'#F7F7F7', borderTopLeftRadius:'8px', borderTopRightRadius:'8px', position:'relative'}}>
                    {title}
                    <div style={{width:'15px', height:'15px', margin:'auto', position:'absolute', top:'0px', right:'30px', bottom:'0px', backgroundImage:'url(/imgs/icons/cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{this.formAction({index:-1, type:this.state.formType}, 'close');}}></div>
                </div>
                {this.displayContent(page)}
                <div style={{width:'100%', height:'40px', borderTop:'1px solid #F0F0F0', backgroundColor:'#F7F7F7', display:'flex', borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px', position:'absolute', bottom:'0'}}>
                    <div style={{width:'fit-content', height:'fit-content', padding:'5px 10px', margin:'auto 0', marginLeft:'auto', fontSize:'12px', backgroundColor:'#FF7000', borderRadius:'10px', color:'white', cursor:'pointer'}} onClick={()=>{this.formAction({index:-1, type:this.state.formType}, 'close');}}>                            
                        Cancelar
                    </div> 
                    <div style={{width:'fit-content', height:'fit-content', padding:'5px 10px', margin:'auto 0', marginLeft:'20px', marginRight:'30px', fontSize:'12px', backgroundColor:'#FF7000', borderRadius:'10px', color:'white', cursor:'pointer'}} onClick={()=>{this.formAction({index:-1, type:this.state.formType}, button[page].action);}}>                            
                        {button[page].text}
                    </div>
                </div> 
            </div>
        </div>
        );
    }
    displayContent(page){
        if (page == 0){
            return(
            <div>                
            <div style={{padding:'15px', borderBottom:'1px solid #F0F0F0'}}>
            <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                Insira abaixo o seu nome complesto como consta em seu documento de identificação.
            </div>
                </div>
                <div style={{width:'100%', height:'100%', padding:'15px 0', marginBottom:'10px', maxHeight:'319px'}}>
                    <div style={{height:'30px', lineHeight:'30px', margin:'0px 15px', fontSize:'13px', fontWeight:'bold', color:'#555'}}>
                        Nome completo:
                    </div>
                    <CustomInput width='250px' height='25px' margin='0px 15px' name='newName' value={this.state.newName} onChange={(e)=>{this.inputHandler(e)}}/>
                </div>
                {this.displayErrors()}
            </div>
            );            
        }
        let border = '0px';
        if (this.state.files.length > 0){ border = '1px solid #FF700050'; }
        let text = [
            ['• Serão aceitos somente RG ou CNH.',
            '• As cópias devem ser coloridas, frente e verso, legíveis e sem cortes.',
            '• Em caso de fotos, não podem estar desfocadas ou com brilho excessivo.'],
            ['• O rosto do portador do documento deve estar visível e sem qualquer acessório.',
            '• O documento deve estar legível para que possamos fazer a verificação do mesmo.',
            '• O documento deve estar em mãos próximo ao rosto do portador.']
        ];
        return(
        <div>
            <div style={{padding:'15px', minWidth:'45px', borderBottom:'1px solid #F0F0F0'}}>
                <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                    {text[this.state.formType][0]}
                </div>
                <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                    {text[this.state.formType][1]}
                </div>
                <div style={{lineHeight:'20px', fontSize:'12px', color:'#666'}}>
                    {text[this.state.formType][2]} 
                </div>
            </div>
            <div style={{width:'100%', height:'100%', padding:'15px 0', marginBottom:'10px', maxHeight:'307px'}}>
                {this.displayFiles()}  
                <div style={{padding:'5px 15px', paddigTop:'20px', margin:'0px 15px', borderTop:border, display:'flex'}}>
                    <label htmlFor={'document_'+this.state.documentIndex+'_'+this.state.files.length} style={{width:'fit-content', height:'fit-content', padding:'5px 10px', margin:'auto 0', marginTop:'20px', fontSize:'13px', backgroundColor:'#FF7000', borderRadius:'10px', color:'white', cursor:'pointer'}}>                            
                        Adicionar arquivo
                    </label>                            
                </div>
                {this.displayErrors()}           
            </div>
        </div>
        );
    }
    inputsController(fileIndex){
        let files = this.state.files;
        let documentId = this.state.documentIndex;        
        if (fileIndex != files.length - 1 && files.length > 0){ return; }        
        if (files.length == 0){          
            return(
            <div>
                <input style={{display:'none'}} type='file' id={'document_'+documentId+'_0'} accept='image/*' onChange={(e)=>{this.formAction({index:1, type:this.state.formType}, 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+documentId+'_0', e.target.files);}}/>
                <input style={{display:'none'}} type='file' id={'document_'+documentId+'_1'} accept='image/*' onChange={(e)=>{this.formAction({index:1, type:this.state.formType}, 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+documentId+'_1', e.target.files);}}/>
            </div>);
        }
        return(
        <div>{
            files.map((file, index)=>{  
                if (index == files.length - 1){
                    let key = 'Files_'+index;
                    return(<div key={key}>
                        <input style={{display:'none'}} type='file' id={'document_'+documentId+'_'+index} accept='image/*' onChange={(e)=>{this.formAction({index:1, type:this.state.formType}, 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+documentId+'_'+index, e.target.files);}}/>
                        <input style={{display:'none'}} type='file' id={'document_'+documentId+'_'+(index + 1)} accept='image/*' onChange={(e)=>{this.formAction({index:1, type:this.state.formType}, 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+documentId+'_'+(index + 1), e.target.files)}}/>
                    </div>);                    
                }
                return(<input style={{display:'none'}} type='file' id={'document_'+documentId+'_'+index} accept='image/*' onChange={(e)=>{this.formAction({index:1, type:this.state.formType}, 'include', -1, e.target.files[0].name.replace(/.*[\/\\]/, ''), 'document_'+documentId+'_'+index, e.target.files);}}/>)
            })}
        </div>);
    }
    displayFiles(){
        if (this.state.files.length == 0){return(<div>{this.inputsController(0)}</div>);}        
        return(            
        <div>{
            this.state.files.map((file, index)=>{
                let errorDisplay = 'none';
                let key = 'File_'+index;
                if (this.state.uploading[index][3] == 'ERROR'){ errorDisplay = 'block'; }                                              
                return(
                <div key={key}>                
                    <div style={{padding:'5px 15px', margin:'0px 15px', borderTop:'1px solid #FF700050', display:'flex'}}>
                        <div style={{margin:'auto 0px', width:'15x', height:'15px'}}>
                            <div style={{width:'15px', height:'15px', backgroundImage:'url(/imgs/icons/icon-file.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
                        </div>
                        <div style={{margin:'auto 10px', fontSize:'12px', color:'#FF7000'}}>
                            {file.name}
                        </div>                            
                        <div style={{margin:'auto 10px', marginLeft:'auto', padding:'3px 5px', borderRadius:'5px', fontSize:'12px', fontWeight:'bold', color:'#FF1414', cursor:'pointer'}} onClick={()=>{this.formAction({index:-1, type:this.state.formType}, 'exclude', index)}}>
                            Excluir
                        </div>
                        <div style={{display:this.state.uploading[index][0], width:'10px', height:'10px', margin:'auto 5px', marginLeft:'5px', border:'5px solid '+this.state.uploading[index][1], borderRadius:'50%', borderTop:'5px solid '+this.state.uploading[index][2], animation:'spin 1s linear infinite'}}></div>
                        <div style={{display:errorDisplay, width:'15px', height:'15px',  margin:'auto', backgroundImage:'url(/imgs/icons/icon-remover.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
                    </div>
                    {this.inputsController(index)}
                </div>);
            })
        }</div>)
    }           
    formAction(form, action, exclude, name, input, upload){
        let files = this.state.files;
        let documents = this.state.documents;
        let uploads = this.state.upload;
        let uploading = this.state.uploading;
        this.errors = [];
        console.log(files)
        switch(action){            
            case 'open':
                if (form.type == 1){
                    this.setState({ newName:'', documentIndex:form.index, displayForm:'block', formPage:1 });
                    break;
                }
                this.setState({ newName:'', documentIndex:form.index, displayForm:'block', formPage:0 });
                break;
            case 'close':
                this.setState({ newName:'', documentIndex:-1, displayForm:'none', files:[], formPage:0});
                break;
            case 'next':
                if (this.state.newName.length < 3 || !this.state.newName.includes(' ')){
                    this.errors.push('É necessário inserir seu nome completo.');                    
                    this.setState({displayForm:'block', formPage:0});
                    break;
                }
                this.setState({displayForm:'block', formPage:1});
                break;
            case 'save':      
                documents[this.state.documentIndex] = {};         
                documents[this.state.documentIndex].name = this.state.newName;                
                documents[this.state.documentIndex].files = files;
                documents[this.state.documentIndex].status = 1;
                if (!uploads.length > 0){
                    this.errors.push('É necessário adicionar seus documentos conforme as instruções acima.');
                    this.setState({files:[]});
                    break;
                }
                this.uploadList = this.state.upload;
                this.imageSend();                
                break;
            case 'include':
                if (upload[0]){ 
                    uploads.push(upload[0]);
                    uploading.push(['none','#f0f0f0', '#ff7000', 'STANDING']);
                    files.push({name:name, input:input});                    
                    this.setState({files:files, uploading:uploading});
                }  
                break;
            case 'exclude':
                files.splice(exclude, 1);
                uploading.shift();
                this.setState({files:files, uploading:uploading});
                break;            
        }
    }
    imageSend(){
        let uploader = new Slingshot.Upload('documents-pics');        
        let uploading = this.state.uploading;
        let index = uploading.length - this.uploadList.length;
        console.log(index)
        uploading[index]=['block','#f0f0f0', '#ff7000', 'LOADING'];
        this.setState({ uploading: uploading});
        uploader.send(this.uploadList[0], (error, url)=>{
            if (error) {
                this.error.push('Ocorreu um erro durante o envio da imagem.')
                this.error.push('Verifique sua conexão com a internet ou se foram selecionados os arquivos corretos.');
                console.log(error);
                uploading[index]=['block','#FF1414', '#3BCD38', 'ERROR'];
                this.uploadList.shift()
                this.setState({ uploading: uploading});
                if (this.uploadList.length > 0){ this.imageSend(); }
            }
            else {
                console.log("Success!");
                console.log('uploaded file available here: '+url);
                uploading[index]=['block','#3BCD38', '#3BCD38', 'OK'];
                this.uploadList.shift()
                this.setState({ uploading: uploading});
                if (this.uploadList.length > 0){ this.imageSend(); }
            }
            if (this.uploadList.length == 0){
                this.setState({ newName:'', documentIndex:-1, displayForm:'none', files:[], formPage:0});
            }
        });        
    }
    render(){
        console.log(this)        
        return(
            <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{margin:'10px 20px', padding:'5px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FF7000', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                            <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                            <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Documentos do prestador de serviço:</div>
                        </div>                         
                        <div style={{height:'30px', lineHeight:'30px', marginLeft:'20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>
                            Documentos:                        
                        </div>
                        <div style={{padding:'0 20px'}}>
                            <div style={{fontSize:'12px', marginTop:'5px', color:'#666'}}>
                                Para ativarmos sua conta na plataforma é necessário que você forneça os documentos descritos abaixo.
                            </div>
                            <div style={{fontSize:'12px', marginTop:'5px', color:'#666'}}>
                                As cópias devem ser coloridas, apresentar frente e verso do documento, legíveils e sem desfoque ou corte.
                            </div>
                            <div style={{fontSize:'12px', marginTop:'5px', color:'#666'}}>
                                Após isso é só clicar em enviar e aguardar pela nossa equipe o notificar referente a aprovação.
                            </div>                           
                            {this.displayDocuments()}
                        </div>
                    </div>
                </div>
            </div>
            {this.displayForm()}
        </div>);
    }
}
export default ServiceDocumentsPage;


