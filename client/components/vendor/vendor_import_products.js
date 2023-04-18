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
import XLSX from 'xlsx';
import removeAccents from 'remove-accents';

class VendorImportProductPage extends Component {
    constructor(props){
        super(props);
        this.mainCategories = [
            'Banheiro','Climatização e ventilação',
            'Cozinha e área de serviço','Decoração',
            'Esporte e lazer','Ferragens',
            'Ferramentas','Iluminação',
            'Jardim e varanda','Materiais elétricos',
            'Materiais hidráulicos','Material de construção',
            'Pisos e revestimentos','Segurança e comunicação',
            'Tapetes','Tintas e acessórios','Tudo para sua casa','Outra:'
        ]
        this.state = {
            selectedIndex: -1,
            openBox: 0,
            productList: [],

        };
    }
    inputHandler(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }

    readSheet(e){
        var file = e.target.files[0];       
        var reader = new FileReader();
        var workSheet = reader.onload = (e)=>{
            let data = e.target.result;
            let importSheet = XLSX.read(data, {type: 'binary'});
            let sheetName = importSheet.SheetNames[0];
            let productSheet = importSheet.Sheets[sheetName];
            let numberArray = ['0', '1', '2', 
            '3', '4', '5', '6', '7', '8', '9']; 
            let letterArray = ['A', 'B', 'C', 'D', 
            'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
            'U', 'V', 'X', 'Y', 'Z'];
            let productsArray = []
            for (let key in productSheet){
                if (key.includes('!')){continue;}
                if (letterArray.includes(key[0])){
                    if (!numberArray.includes(key[1])){continue;}
                    let row = parseInt(key.substr(1));
                    console.log(row)
                    if (row < 3){ continue; }
                    console.log(key[0])
                    switch(key[0]){
                        case 'A':
                            productsArray[row-3] = {sku:productSheet[key].v.toString(), details:[{name: "Altura (cm)", detail: ""}, {name: "Largura (cm)", detail: ""}, {name: "Comprimento (cm)", detail: ""}, {name: "Peso (kg)", detail: ""}], category:[{name: "", slug: ""}, {name: "", slug: ""}], name:'', price:'0', stock_quantity:0, tags:[]};
                            break;
                        case 'B':
                            productsArray[row-3].name = productSheet[key].v.toString();
                            break;
                        case 'C':
                            productsArray[row-3].details[0] = ({name:'Altura (cm)', detail:productSheet[key].v.toString()});
                            break;
                        case 'D':
                            productsArray[row-3].details[1] = ({name:'Largura (cm)', detail:productSheet[key].v.toString()});
                            break;
                        case 'E':
                            productsArray[row-3].details[2] = ({name:'Comprimento (cm)', detail:productSheet[key].v.toString()});
                            break;
                        case 'F':
                            productsArray[row-3].details[3] = ({name:'Peso (kg)', detail:productSheet[key].v.toString()});
                            break;
                        case 'G':
                            productsArray[row-3].price = productSheet[key].v.toString();
                            break;
                        case 'H':
                            productsArray[row-3].stock_quantity = parseInt(productSheet[key].v);
                            break;
                        case 'I':
                            let category = productSheet[key].v.split(',');
                            let categories = [];
                            for(let i=0; i<2; i++){
                                if (category[i][0] == ' '){ 
                                    category[i] = category[i].substr(1); 
                                }
                                if (category[i][category.length - 1] == ' '){ 
                                    category[i] = category[i].substring(0, category[i].length - 1);
                                }
                                category[i] = category[i].charAt(0).toUpperCase() + category[i].slice(1);
                                let slug = category[i].replace(/\ /gi, '-').replace(/\//g, '').toLowerCase();
                                slug = removeAccents( slug );
                                categories.push({name:category[i], slug:slug});
                            }
                            if (categories.length == 0){
                                categories=[{name:'', slug:''}, {name:'', slug:''}];
                            }
                            if (categories.length == 1){
                                categories.push({name:'', slug:''});
                            }
                            productsArray[row-3].category = categories;                            
                            break;
                        case 'J':
                            productsArray[row-3].description = productSheet[key].v.toString();
                            break;
                    }
                }
            }
        return this.setState({productList: productsArray})};
        reader.readAsBinaryString(file);
        console.log(workSheet)
    }

    productList() {
        return(
            this.state.productList.map((product, index)=>{
            let key = 'produto_'+index;
            let border = '0px';
            if (index == 0){ border = '1px solid #FF7000'; }
            return(
            <div key={key}>
                <div style={{width:'100%', height:'30px', lineHeight:'30px', border:'1px solid #FF7000', borderTop:border, textAlign:'center', fontSize:'13px', fontWeight:'bold', backgroundColor:'#FF700020', display:'flex'}}>
                    <div style={{minWidth:'80px', height:'30px'}}>Imagem</div>
                    <div style={{width:'100%', minWidth:'200px', height:'30px', paddingLeft:'10px', borderLeft: '1px solid #FF7000', textAlign:'left', overflow:'hidden', whiteSpace:'nowrap'}}>Nome do Produto</div>
                    <div style={{minWidth:'80px', height:'30px', borderLeft: '1px solid #FF7000'}}>Preço</div>
                    <div style={{minWidth:'75px', height:'30px', borderLeft: '1px solid #FF7000'}}>Estoque</div>
                    <div style={{minWidth:'150px', height:'30px', borderLeft: '1px solid #FF7000'}}>Detalhes</div>
                    <div style={{minWidth:'180px', height:'30px', borderLeft: '1px solid #FF7000'}}>Categorias</div>                            
                    <div style={{minWidth:'115px', height:'30px', borderLeft: '1px solid #FF7000'}}>Descrição</div>
                    <div style={{minWidth:'115px', height:'30px', borderLeft: '1px solid #FF7000'}}>Ações</div>
                </div>
                <div style={{width:'100%', maxHeight:'80px', lineHeight:'30px', border:'1px solid #FF7000', borderTop:'0px', textAlign:'center', fontSize:'12px', backgroundColor:'white', color:'#555', display:'flex'}}>
                    <div style={{minWidth:'80px', minHeight:'80px', position:'relative'}}>
                        <div style={{width:'100%', height:'30px', backgroundColor:'#00000050', position:'absolute', left:'0', bottom:'0px', textAlign:'center', fontSize:'12px', color:'white', cursor:'pointer'}}>Adicionar</div>
                    </div>
                    <div style={{width:'100%', minWidth:'210px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', textAlign:'left', display:'flex'}}>
                        <div style={{height:'100%', width:'100%', margin:'auto 0'}}>
                            <textarea style={{width:'100%', height:'80px', padding:'10px 5px', border:'0px', fontSize:'13px', color:'#555', resize:'none', boxSizing: 'border-box'}} name={'name_'+index} value={this.state.productList[index].name} onChange={(e)=>{this.inputHandler(e)}} />
                        </div>
                    </div>
                    <div style={{minWidth:'80px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                        <div style={{width:'fit-content', maxWidth:'80px', padding:'0 5px', lineHeight:'15px', margin:'auto', display:'flex'}}>
                            <div style={{lineHeight:'16px'}}>R$</div>
                            <input style={{width:'60px', height:'15px', lineHeight:'15px', textAlign:'left', fontSize:'12px', border:'0px', backgroundColor:'transparent'}} name={'price_'+index} value={this.state.productList[index].price} onChange={(e)=>{this.inputHandler(e)}} />
                        </div>
                    </div>
                    <div style={{minWidth:'75px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                        <div style={{margin:'auto', maxWidth:'75px', padding:'5px'}}>
                                <input style={{width:'100%', height:'15px', marginBottom:'2px', textAlign:'center', fontSize:'12px', border:'0px', backgroundColor:'transparent'}}  name={'stock_quantity_'+index} value={this.state.productList[index].stock_quantity} onChange={(e)=>{this.inputHandler(e)}}/>
                                <div style={{fontSize:'10px', lineHeight:'0px', paddingTop:'8px'}}>
                                    unidades
                                </div>
                            </div>                                      
                        </div>
                    <div style={{minWidth:'150px', minHeight:'80px', borderLeft: '1px solid #FF7000', fontSize:'12px'}}>
                        <div style={{display:'flex'}}>
                            <div style={{width:'fit-content', margin:'auto', padding:'0px'}}>                                                                       
                                <div style={{width:'140px', display:'flex'}}>
                                    <div style={{width:'70px', height:'15px', lineHeight:'15px', textAlign:'center', fontSize:'10px', color:'black'}}>
                                        Altura:
                                    </div>
                                    <div style={{width:'70px', height:'15px', lineHeight:'15px', textAlign:'center', fontSize:'10px', color:'black'}}>
                                        Largura:
                                    </div>
                                </div>
                                <div style={{width:'140px', display:'flex'}}>
                                    <div style={{width:'65px', height:'20px', margin:'0 auto', lineHeight:'20px', border:'1px solid #FF700050', textAlign:'center', fontSize:'10px', position:'relative', color:'#444'}}>
                                        <input style={{width:'43px', height:'20px', padding:'0 2px', paddingRight:'15px', border:'0px', lineHeight:'20px', borderRadius:'4px', fontSize:'10px', textAlign:'center'}} name={'detail1_'+index} value={this.state.productList[index].details[0].detail}  onChange={(e)=>{this.inputHandler(e)}}/>
                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', position:'absolute', right:'1px', top:'0px'}}>cm</div>
                                    </div>
                                    <div style={{width:'65px', height:'20px', margin:'0 auto', lineHeight:'20px', border:'1px solid #FF700050', textAlign:'center', fontSize:'10px', position:'relative', color:'#444'}}>
                                        <input style={{width:'43px', height:'20px', padding:'0 2px', paddingRight:'15px', border:'0px', lineHeight:'20px', borderRadius:'4px', fontSize:'10px', textAlign:'center'}} name={'detail2_'+index} value={this.state.productList[index].details[1].detail}  onChange={(e)=>{this.inputHandler(e)}}/>
                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', position:'absolute', right:'1px', top:'0px'}}>cm</div>
                                    </div>
                                </div>
                            </div>                                    
                        </div>
                        <div style={{display:'flex'}}>
                            <div style={{width:'fit-content', margin:'auto', padding:'0px'}}>                                                                       
                                <div style={{width:'140px', display:'flex'}}>
                                    <div style={{width:'70px', height:'15px', lineHeight:'15px', textAlign:'center', fontSize:'10px', color:'black'}}>
                                        Comprimento:
                                    </div>
                                    <div style={{width:'70px', height:'15px', lineHeight:'15px', textAlign:'center', fontSize:'10px', color:'black'}}>
                                        Peso:
                                    </div>
                                </div>
                                <div style={{width:'140px', display:'flex'}}>
                                    <div style={{width:'65px', height:'20px', margin:'0 auto', lineHeight:'20px', border:'1px solid #FF700050', textAlign:'center', fontSize:'10px', position:'relative', color:'#444'}}>
                                        <input style={{width:'43px', height:'20px', padding:'0 2px', paddingRight:'15px', border:'0px', lineHeight:'20px', borderRadius:'4px', fontSize:'10px', textAlign:'center'}} name={'detail3_'+index} value={this.state.productList[index].details[2].detail} onChange={(e)=>{this.inputHandler(e)}}/>
                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', position:'absolute', right:'1px', top:'0px'}}>cm</div>
                                    </div>
                                    <div style={{width:'65px', height:'20px', margin:'0 auto', lineHeight:'20px', border:'1px solid #FF700050', textAlign:'center', fontSize:'10px', position:'relative', color:'#444'}}>
                                        <input style={{width:'43px', height:'20px', padding:'0 2px', paddingRight:'15px', border:'0px', lineHeight:'20px', borderRadius:'4px', fontSize:'10px', textAlign:'center'}} name={'detail4_'+index} value={this.state.productList[index].details[3].detail} onChange={(e)=>{this.inputHandler(e)}}/>
                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', position:'absolute', right:'1px', top:'0px'}}>kg</div>
                                    </div>
                                </div>
                            </div>                                    
                        </div>
                        
                    </div>
                    <div style={{minWidth:'180px', minHeight:'81px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                        <div style={{width:'100%', margin:'auto'}}>
                            <div style={{display:'flex', height:'27px'}}>
                                <div style={{margin:'auto'}}>{this.state.productList[index].category[0].name}</div>
                            </div>
                            <div style={{display:'flex', height:'27px'}}>
                                <div style={{margin:'auto'}}>{this.state.productList[index].category[1].name}</div>
                            </div>
                            <div style={{width:'140px', height:'21px', margin:'3px auto', lineHeight:'21px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Editar categorias</div> 
                        </div>
                    </div>
                    <div style={{minWidth:'115px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex'}}>
                        <div style={{margin:'auto'}}>
                            <div style={{width:'105px', height:'30px', lineHeight:'30px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Editar descrição</div>     
                        </div>
                    </div>
                    <div style={{minWidth:'115px', minHeight:'81px', lineHeight:'13px', borderLeft: '1px solid #FF7000'}}>
                        <div style={{width:'100%', height:'33%', fontWeight:'bold', color:'#3395F5', display:'flex', cursor:'pointer'}}>
                            <div style={{width:'100%', height:'26px', borderBottom:'1px solid #FF7000', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    Salvar
                                </div>
                            </div>
                        </div>
                        <div style={{width:'100%', height:'33%', fontWeight:'bold', color:'#3395F5', display:'flex', cursor:'pointer'}}>
                            <div style={{width:'100%', height:'26px', borderBottom:'1px solid #FF7000', display:'flex'}}>
                                <div style={{margin:'auto'}}>   
                                    Manter Rascunho
                                </div>
                            </div>
                        </div>
                        <div style={{width:'100%', height:'33%', fontWeight:'bold', color:'#3395F5', display:'flex', cursor:'pointer'}}>
                            <div style={{width:'100%', height:'26px', display:'flex'}}>
                                <div style={{margin:'auto'}}>
                                    Excluir
                                </div>
                            </div>
                        </div>                                                                    
                    </div>
                </div>
            </div>)
        }))
    }
    descriptionBox(){
        let display = 'none';
        if (this.state.openBox == 3){
            display = 'box';
        }
        return(<div style={{zIndex:'999', display:display}}>
            <div style={{width:'100%', height:'100%', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', backgroundColor:'black', opacity:'0.5'}}></div>
            <div style={{width:'100%', maxWidth:'430px', height:'520px', borderRadius:'8px', backgroundColor:'white', position:'fixed', margin:'auto', top:'0', right:'0', bottom:'0', left:'0'}}>
                <div style={{width:'100%', height:'100%', position:'relative'}}>
                    <div style={{width:'100%', height:'40px', textAlign:'center', display:'flex', fontWeight:'bold', color:'black', backgroundColor:'#F7F7F7', borderBottom:'1px solid #CCC', borderRadius:'8px 8px 0px 0px', position:'absolute', top:'0px', left:'0px'}}>
                        <div style={{width:'100%', height:'fit-content', lineHeight:'17px', fontSize:'16px', margin:'auto'}}>Nome do produto</div>
                    </div>
                    <div style={{maxWidth:'430px', position:'absolute', top:'55px'}}>
                        <div style={{padding:'0 25px', paddingTop:'5px', width:'100%', maxWidth:'380px', fontSize:'13px', color:'#555'}}>Escreva uma descrição breve com as caracteristicas principais do produto.
                        <div style={{padding:'0 25px', paddingTop:'2px',width:'100%', maxWidth:'380px', fontSize:'13px', color:'#555'}}></div>Este texto irá aparecer na página do produto.</div> 
                        <div style={{padding:'0 25px', paddingTop:'20px', width:'100%', maxWidth:'380px', fontWeight:'bold', fontSize:'14px'}}>Descrição:</div>
                        <div style={{height:'125px', width:'100%', maxWidth:'380px', padding:'10px', margin:'0 auto', marginTop:'15px', border:'1px solid #ff7000', borderRadius:'3px', boxSizing:'border-box', backgroundColor:'white'}}>                                        
                            <textarea style={{width:'100%', height:'100%', padding:'0px', border:'0px', fontSize:'14px', resize:'none', boxSizing:'border-box'}} onChange={(e)=>{this.inputHandler(e)}}/>                            
                        </div>
                        <div style={{display:'flex'}}>
                            <div style={{width:'fit-content', padding:'7px 15px', marginTop:'20px', marginLeft:'auto', marginRight:'35px', fontSize:'13px', color:'white', backgroundColor:'#FF7000', borderRadius:'5px', cursor:'pointer'}}>Cancelar</div>
                            <div style={{width:'fit-content', padding:'7px 15px', marginTop:'20px', marginRight:'25px', fontSize:'13px', color:'white', backgroundColor:'#FF7000', borderRadius:'5px', cursor:'pointer'}}>Salvar</div>
                        </div>
                    </div>
                    <div style={{width:'100%', height:'40px', backgroundColor:'#F7F7F7', borderTop:'1px solid #CCC', borderRadius:'0px 0px 8px 8px', position:'absolute', bottom:'0px', left:'0px'}}></div>
                </div>
            </div>
        </div>)     
    }    
    categoryBox(){
        let display = 'none';
        if (this.state.openBox == 2){
            display = 'box';
        }
        return(<div style={{zIndex:'999', display:display}}>
            <div style={{width:'100%', height:'100%', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', backgroundColor:'black', opacity:'0.5'}}></div>
            <div style={{width:'100%', maxWidth:'440px', height:'520px', borderRadius:'8px', backgroundColor:'white', position:'fixed', margin:'auto', top:'0', right:'0', bottom:'0', left:'0'}}>
                <div style={{width:'100%', height:'100%', position:'relative'}}>
                    <div style={{width:'100%', height:'40px', textAlign:'center', display:'flex', fontWeight:'bold', color:'black', backgroundColor:'#F7F7F7', borderBottom:'1px solid #CCC', borderRadius:'8px 8px 0px 0px', position:'absolute', top:'0px', left:'0px'}}>
                        <div style={{width:'100%', height:'fit-content', lineHeight:'17px', fontSize:'16px', margin:'auto'}}>Nome do produto</div>
                    </div>
                    <div style={{maxWidth:'440px', position:'absolute', top:'55px'}}>
                        <div style={{padding:'0 25px', paddingTop:'5px', width:'100%', maxWidth:'390px', fontSize:'13px', color:'#555'}}>Escolha até duas categorias para seu produto, uma principal e outra secundaria.
                        <div style={{padding:'0 25px', paddingTop:'2px',width:'100%', maxWidth:'390px', fontSize:'13px', color:'#555'}}></div>Isto afetara as categorias apresentadas em sua página de fornecedor.</div> 
                        <div style={{width:'390px', paddingLeft:'30px', margin:'0', boxSizing:'border-box'}}>    
                            <div style={{width:'390px', paddingTop:'15px', fontSize:'13px', fontWeight:'bold'}}>
                                <div style={{marginBottom:'8px'}}>Categoria principal:</div>
                                <div style={{display:'flex', fontWeight:'normal'}}>
                                    <CustomSelect width='190px' height='25px' select={this.mainCategories} maxHeight='199px' name='mainCategory' onChange={(e)=>{this.inputHandler(e)}}/>
                                    <div style={{width:'10px', height:'25px'}}></div>
                                    <CustomInput width='190px' height='23px' name='_mainCategory' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>                                
                            </div>
                            <div style={{width:'390px', marginTop:'15px', fontSize:'13px', fontWeight:'bold'}}>
                                <div style={{marginBottom:'8px'}}>Categoria secundária:</div>
                                <div style={{display:'flex', fontWeight:'normal'}}>
                                    <CustomSelect width='190px' height='25px' select={this.mainCategories} maxHeight='199px' name='secondCategory' onChange={(e)=>{this.inputHandler(e)}}/>
                                    <div style={{width:'10px', height:'25px'}}></div>
                                    <CustomInput width='190px' height='23px' name='_mainCategory' onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>
                        </div> 
                        <div style={{display:'flex'}}>
                            <div style={{width:'fit-content', padding:'7px 15px', marginTop:'20px', marginLeft:'auto', marginRight:'35px', fontSize:'13px', color:'white', backgroundColor:'#FF7000', borderRadius:'5px', cursor:'pointer'}}>Cancelar</div>
                            <div style={{width:'fit-content', padding:'7px 15px', marginTop:'20px', marginRight:'25px', fontSize:'13px', color:'white', backgroundColor:'#FF7000', borderRadius:'5px', cursor:'pointer'}}>Salvar</div>
                        </div>  
                    </div>
                    <div style={{width:'100%', height:'40px', backgroundColor:'#F7F7F7', borderTop:'1px solid #CCC', borderRadius:'0px 0px 8px 8px', position:'absolute', bottom:'0px', left:'0px'}}></div>
                </div>
            </div>
        </div>)
    }
    imageBox(){
        let display = 'none';
        if (this.state.openBox == 1){
            display = 'box';
        }
        return(<div></div>)
    }
    render(){
        return(
        <div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{margin:'10px 10px', padding:'5px 5px', borderRadius:'3px', backgroundColor:'#F7F7F7', width:'100%'}}>
                    <div style={{height:'20px', marginBottom:'10px', padding:'5px 10px', paddingBottom:'10px', borderBottom:'1px solid #FFDBBF', fontSize:'16px', fontWeight:'bold', display:'flex'}}>
                        <div style={{width:'11px', height:'11px', margin:'auto 0', position:'relative', top:'1px', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></div>
                        <div style={{margin:'auto 0', marginLeft:'5px', color:'#ff7000'}}>Importar produtos:</div>
                    </div>
                    <div style={{padding:'10px 10px', borderRadius:'3px', backgroundColor:'#F7F7F7'}}>
                        <div style={{margin:'10px 0', marginBottom:'20px', marginLeft:'auto', display:'flex'}}>
                            <label htmlFor='upload' style={{width:'180px', height:'30px', lineHeight:'30px', marginLeft:'0px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Importar planilha</label> 
                            <div style={{width:'180px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer', display:'none'}}>Baixar planilha base</div> 
                            <div style={{width:'180px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer', display:'none'}}>Baixar planelha de exemplo</div> 
                            <input type="file" id="upload" style={{display:'none'}} onChange={(e)=>{this.readSheet(e)}}/>
                        </div>
                        <div style={{margin:'10px 0', marginBottom:'20px', marginLeft:'auto', display:'flex'}}>
                            <CustomSelect select={['Edição em massa', 'Salvar todos selecionados', 'Salvar rascunho dos seleciondos', 'Excluir selecionados']} style={{fontSize:'12px'}} width='250px' height='30px' margin='0' name='name' value={this.state.productFilter} onChange={(e)=>{this.inputHandler(e)}}/>
                            <div style={{width:'70px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Executar</div>
                            <div style={{width:'120px', height:'30px', lineHeight:'30px', marginLeft:'105px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Salvar todos</div>
                        </div>                                              
                        {this.productList()}
                    </div>                    
                </div>
                {this.descriptionBox()}
                {this.categoryBox()}
                {this.imageBox()}
            </div>
        </div>);
        }
    }
export default VendorImportProductPage;