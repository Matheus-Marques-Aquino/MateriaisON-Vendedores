import React, { Component } from 'react';
import VendorHeader from './subcomponents/vendor_header';
import CustomSelect from './subcomponents/widgets/customSelect';
import CustomInput from './subcomponents/widgets/customInput';
import VendorMenu from './subcomponents/vendorMenu';
import Waiting from './subcomponents/widgets/waiting';
import CustomToggle from './subcomponents/widgets/customToggle';

class NewProductPage extends Component {
    constructor(props){
        super(props);
        this.start = true
        this.state = {
            display: [
                {display:'none', src:''}, 
                {display:'none', src:''}, 
                {display:'none', src:''}, 
                {display:'none', src:''}
            ],
            name: '',
            height: '',
            length: '',
            width: '',
            weight: '',
            mainCategory: '',
            secondCategory: '',
            attributes:[],
            description: '',
            images: [],
            price: '',
            stock: '',
            hidden: false,
            loading: false
        }
    }    
    inputHandler(event){
        if (event.target.name.includes('attribute')){
            let attributes = this.state.attributes;
            let box = event.target.name.replace('attribute','');   

            if (box.includes('Name')){
                let index = event.target.name.replace('attributeName_','');
                index = parseInt(index);
                attributes[index].name = event.target.value;
                this.setState({ attributes: attributes });
                return;
            }
            if (box.includes('Value')){
                let index = event.target.name.replace('attributeValue_','');
                index = parseInt(index);
                attributes[index].value = event.target.value;
                this.setState({ attributes: attributes });
                return;
            }
        }        
        let name = event.target.name;
        let value = event.target.value;
        if (name == 'description'){
            if (value.length > 500){
                return;
            }
        }
        this.setState({ [name]: value });
    }    
    attributeBox(){
        let attributes = this.state.attributes; 
        if (attributes.length < 1){ return; }
        return(
        <div>
            <div style={{marginLeft:'10px',margintTop:'10px', display:'flex'}}>
                <div style={{width:'200px', margin:'auto 0', marginTop:'10px', fontSize:'13px'}}>Nome</div>
                <div style={{width:'150px', margin:'auto 0', marginLeft:'20px', marginTop:'10px', fontSize:'13px'}}>Valor</div>
            </div>
            <div style={{marginLeft:'10px',margintTop:'10px'}}>{
                <div>
                    {attributes.map((attribute, index)=>{
                        let key = 'attribute_'+index;
                        return(
                        <div style={{display:'flex'}} key={key}>
                            <CustomInput width='200px' height='30px' margin='auto 0' name={'attributeName_'+index} style={{marginTop:'5px', boxSizing:'border-box'}} value={attribute.name} onChange={(e)=>{this.inputHandler(e)}}/>
                            <CustomInput width='150px' height='30px' margin='auto 0' name={'attributeValue_'+index} style={{marginLeft:'20px', marginTop:'5px', boxSizing:'border-box'}} value={attribute.value} onChange={(e)=>{this.inputHandler(e)}}/>
                            <div style={{width:'20px', height:'30px', margin:'auto 0', marginLeft:'20px', marginTop:'5px', backgroundImage:'url(/imgs/icons/icon-remover.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}} onClick={()=>{this.attributeRemove(index)}}></div>
                        </div>);
                    })}          
                </div>
            }</div>
        </div>
        );
    }
    createAttribute(){
        let attributes = this.state.attributes;
        if (attributes.length > 6){ return; }
        attributes.push({name:'', value:''});
        this.setState({attributes: attributes});
    }
    attributeRemove(index){
        let attributes = this.state.attributes;
        if (attributes.length >= index){
            attributes.splice(index, 1);
        }
        this.setState({attributes:attributes});        
    }    
    displayImage(e, pos){
        let src = URL.createObjectURL(e.target.files[0]);
        let display = this.state.display;
        display[pos] = {display:'flex', src:src};        
        this.setState({display:display});
        this.imageSend()
    }
    imageSend(){
        let uploader = new Slingshot.Upload('ProductImages');
        console.log(uploader)
        uploader.send(document.getElementById('mainImage').files[0], function (error, downloadUrl) {
            if (error) {
              console.error('Error uploading', uploader);
              console.log(error)
            }
            else {
                console.log("Success!");
                console.log('uploaded file available here: '+downloadUrl);
            }
        });        
    }        
    render(){
        console.log(this.state)
        var style = this.state.display;
        if (this.start){
            this.start = false;
            Slingshot.fileRestrictions('ProductImages', {
                allowedFileTypes: ['image/png', 'image/jpeg'],
                maxSize: 3 * 1024 * 1024 
            });           
        } 
        let hiddenHeight = '0px'
        if (this.state.hidden){ hiddenHeight = 'none'; }
        return(<div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'45px', borderBottom:'1px solid #f7f7f7', backgroundColor:'#F7F7F7', display:'flex'}}>
                        <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px'}}>Editar Produto</div>
                        <div style={{height:'27px', width:'75px', margin:'auto 0', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Salvar</div>
                        <div style={{height:'27px', width:'90px', margin:'auto 0', marginLeft:'10px', marginRight:'20px', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#FF7000'}}>Rascunho</div>
                    </div>                    
                    <div style={{margin:'10px 20px'}}>                        
                        <div style={{padding:'10px', borderRadius:'3px', backgroundColor:'#f7f7f7'}}>
                            <div style={{height:'20px', marginBottom:'10px', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                                <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                                <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Detalhes do produto:</div>
                                <div style={{margin:'auto 0', marginLeft:'auto', display:'flex'}}>
                                    <CustomToggle name='hidden' value={this.state.hidden} size={1} onChange={(e)=>{this.inputHandler(e)}}/>
                                    <div style={{margin:'auto 10px', paddingTop:'3px', paddingRight:'10px', color:'#555', fontSize:'13px', fontWeight:'bold'}}>
                                        Ocultar produto
                                    </div>
                                </div>                                
                            </div>
                            <div style={{maxHeight:hiddenHeight, overflow:'hidden', display:'flex'}}>
                                <div style={{marginTop:'15px', padding:'10px 20px', margin:'auto 0', borderTop:'1px solid #FFDBBF', fontSize:'13px', color:'#666'}}>
                                    Este produto esta ocultado, logo não ira estará aparecera na loja, impossibilitando a venda do mesmo.
                                </div>
                            </div>
                            <div style={{padding:'10px 0', color:'#555', borderTop:'1px solid #FFDBBF', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                                <div style={{width:'175px', margin:'auto 0', marginLeft:'19px', fontSize:'15px', fontWeight:'bold'}}>Nome do Produto:</div>
                                <CustomInput width='100%' height='30px' margin='auto 19px' name='name' value={this.state.productName} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                            <div style={{padding:'10px 15px', paddingBottom:'20px', color:'#555', borderBottom:'1px solid #FFDBBF'}}>
                            <div style={{fontSize:'15px', fontWeight:'bold'}}>Atributos:</div>
                                <div style={{display:'flex'}}>
                                    <div style={{width:'50%', padding:'0 19px', paddingLeft:'30px', margin:'0', boxSizing:'border-box'}}>    
                                        <div style={{width:'230px', marginLeft:'19px', paddingTop:'10px', fontSize:'15px'}}>
                                            <div style={{marginBottom:'10px'}}>Categoria principal:</div>
                                            <CustomSelect width='100%' height='30px' select={['Banheiro', 'Piso', 'Areia']} name='mainCategory' onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>
                                        <div style={{width:'230px', marginLeft:'19px', marginTop:'15px', fontSize:'15px'}}>
                                            <div style={{marginBottom:'10px'}}>Categoria secundária:</div>
                                            <CustomSelect width='100%' height='30px' select={['Banheiro', 'Piso', 'Areia']} name='secondCategory' onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>
                                    </div>     
                                    <div style={{width:'50%', padding:'0 19px', paddingLeft:'30px', paddingTop:'10px', boxSizing:'border-box', margin:'auto 0'}}>                                    
                                        <div style={{height:'30px', padding:'5px 0', display:'flex'}}>
                                            <div style={{width:'120px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Altura: </div>
                                            <CustomInput width='85px' height='30px' margin='auto 0' name='height' value={this.state.height} type='number' unit='cm' onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>
                                        <div style={{height:'30px', padding:'5px 0', display:'flex'}}>
                                            <div style={{width:'120px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Largura: </div>
                                            <CustomInput width='85px' height='30px' margin='auto 0' name='width' value={this.state.width} type='number' unit='cm' onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>
                                        <div style={{height:'30px', padding:'5px 0', display:'flex'}}>
                                            <div style={{width:'120px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Comprimento: </div>
                                            <CustomInput width='85px' height='30px' margin='auto 0' name='length' value={this.state.length} type='number' unit='cm' onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div> 
                                        <div style={{height:'30px', padding:'5px 0', display:'flex'}}>
                                            <div style={{width:'120px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Peso: </div>
                                            <CustomInput width='85px' height='30px' margin='auto 0' name='weight' value={this.state.weight} type='number' unit='kg' onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>                                    
                                    </div>
                                </div>
                                <div style={{height:'30px', width:'140px', marginTop:'25px ', lineHeight:'30px', border:'1px solid #ff7000', borderRadius:'5px', backgroundColor:'#FF7000', color:'white', fontSize:'14px', textAlign:'center'}} onClick={()=>{this.createAttribute()}}>Adicinar atributo</div>                                  
                                {this.attributeBox()}    
                            </div>
                            <div style={{padding:'10px 0', paddingTop:'15px', fontSize:'15px', color:'#555', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                                <div style={{width:'100%', padding:'0 14px', paddingRight:'30px', boxSizing:'border-box'}}>
                                    <div style={{fontSize:'15px', fontWeight:'bold'}}>Descrição:</div>
                                    <div style={{height:'230px', width:'100%', padding:'10px', paddingBottom:'0px', margin:'0 auto', marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px', boxSizing:'border-box', backgroundColor:'white'}}>                                        
                                        <textarea style={{width:'100%', height:'195px', padding:'0px', border:'0px', fontSize:'14px', resize:'none', boxSizing:'border-box'}} name='description' value={this.state.description} onChange={(e)=>{this.inputHandler(e)}}/>
                                        <div style={{width:'100%', height:'20px', marginLeft:'auto', lineHeight:'20px', fontSize:'13px'}}>
                                            <div style={{width:'fit-content', marginLeft:'auto'}}>
                                                caracteres: <span style={{fontSize:'11px'}}>{this.state.description.length}/500</span></div>
                                            </div>
                                    </div>
                                </div>
                                <div style={{minWidth:'360px', padding:'0 14px', paddingLeft:'26px', boxSizing:'border-box'}}>
                                    <div style={{fontSize:'15px', fontWeight:'bold'}}>Imagens:</div>
                                    <div style={{width:'100%', display:'flex'}}>
                                        <div style={{height:'230px', width:'240px', marginRight:'10px', marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px', boxSizing:'border-box', backgroundColor:'white', position:'relative'}}>
                                            <div style={{width:'100%', height:'178px', display:'flex'}}>
                                                <label htmlFor='mainImage' style={{width:'70px', height:'70px', margin:'auto', cursor:'pointer', backgroundImage:'url(imgs/icons/icon-image-plus.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                                            </div>
                                            <label htmlFor='mainImage'  style={{width:'100%', height:'178px', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style[0].display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style[0].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>                                           
                                            <label htmlFor='mainImage' style={{width:'100%', height:'50px', cursor:'pointer', lineHeight:'50px', textAlign:'center', backgroundColor:'black', opacity:'0.5', color:'white', display:'block'}}>Selecione uma imagem</label>                                  
                                            <input style={{display:'none'}} type="file" id="mainImage" accept="image/*" onChange={(e)=>{this.displayImage(e, 0)}}/>
                                        </div>
                                        <div style={{height:'230px', minWidth:'70px', marginRight:'auto', marginTop:'10px', boxSizing:'border-box'}}>
                                            <div style={{width:'68px', height:'68px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                                                <label htmlFor='firstImage' style={{width:'35px', height:'35px', margin:'auto', cursor:'pointer', backgroundImage:'url(imgs/icons/icon-image-plus.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                                                <label htmlFor='firstImage' style={{width:'100%', height:'68px', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style[1].display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style[1].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                                                <input style={{display:'none'}} type="file" id="firstImage" accept="image/*" onChange={(e)=>{this.displayImage(e, 1)}}/>
                                            </div>
                                            <div style={{width:'68px', height:'68px', marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                                                <label htmlFor='secondImage' style={{width:'35px', height:'35px', margin:'auto', cursor:'pointer', backgroundImage:'url(imgs/icons/icon-image-plus.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                                                <label htmlFor='secondImage' style={{width:'100%', height:'68px', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style[2].display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style[2].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                                                <input style={{display:'none'}} type="file" id="secondImage" accept="image/*" onChange={(e)=>{this.displayImage(e, 2)}}/>
                                            </div>
                                            <div style={{width:'68px', height:'68px', marginTop:'10px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                                                <label htmlFor='thirdImage' style={{width:'35px', height:'35px', margin:'auto', cursor:'pointer', backgroundImage:'url(imgs/icons/icon-image-plus.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                                                <label htmlFor='thirdImage' style={{width:'100%', height:'68px', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style[3].display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style[3].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                                                <input style={{display:'none'}} type="file" id="thirdImage" accept="image/*" onChange={(e)=>{this.displayImage(e, 3)}}/>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div style={{ padding:'10px 0', color:'#555', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                                <div style={{width:'60px', margin:'auto 0', marginLeft:'14px', fontSize:'15px', fontWeight:'bold'}}>Preço:</div>
                                <CustomInput width='150px' height='30px' margin='auto 0' name='price' value={this.state.price} type='number' start='R$' onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{width:'75px', margin:'auto 0', marginLeft:'35px', fontSize:'15px', fontWeight:'bold'}}>Estoque:</div>
                                <CustomInput width='150px' height='30px' margin='auto 0' name='stock' value={this.state.stock} type='number' unit='unidades' onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
            <Waiting open={this.state.loading} size='60px'/>
        </div>);
    }
}
export default NewProductPage;