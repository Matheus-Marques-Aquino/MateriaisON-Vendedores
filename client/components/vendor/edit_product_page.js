import React, { Component } from 'react';
import VendorHeader from '../subcomponents/vendor_header';
import CustomSelect from '../subcomponents/widgets/customSelect';
import CustomInput from '../subcomponents/widgets/customInput';
import VendorMenu from '../subcomponents/vendorMenu';
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold';
import { Products } from '../../../imports/collections/products';
import { ProductsOnHold } from '../../../imports/collections/products_onhold';
import { IncompleteProducts } from '../../../imports/collections/incomplete_products';
import { mask } from '../subcomponents/widgets/mask';
import Waiting from '../subcomponents/widgets/waiting';
import Warning from '../subcomponents/widgets/warning';
import CustomToggle from '../subcomponents/widgets/customToggle';
import history from '../subcomponents/widgets/history';
import Productview from '../subcomponents/product_view';
import removeAccents from 'remove-accents'

class EditProductPage extends Component {
    constructor(props){
        super(props);
        this.start = true
        this.vendor = {}
        this.errors = [];
        this.successText = '';
        this.newProduct = false;
        this.incomplete = false; 
        this.saveSelection = ['Criar novo Produto', 'Salvar como Produto', 'Salvar como Rascunho', 'Deletar Produto'];
        this.id = '-1';
        this.allCategories = [
            'Banheiro','Climatização e ventilação',
            'Cozinha e área de serviço','Decoração',
            'Esporte e lazer','Ferragens',
            'Ferramentas','Iluminação',
            'Jardim e varanda','Materiais elétricos',
            'Materiais hidráulicos','Material de construção',
            'Pisos e revestimentos','Segurança e comunicação',
            'Tapetes','Tintas e acessórios','Tudo para sua casa','Outra'
        ]
        this.categories = [
            'Banheiro','Climatização e ventilação',
            'Cozinha e área de serviço','Decoração',
            'Esporte e lazer','Ferragens',
            'Ferramentas','Iluminação',
            'Jardim e varanda','Materiais elétricos',
            'Materiais hidráulicos','Material de construção',
            'Pisos e revestimentos','Segurança e comunicação',
            'Tapetes','Tintas e acessórios','Tudo para sua casa','Outra'
        ]
        this.state = {
            _id: '0',
            id: '0',
            fadeOut: '1',
            action: '',
            display: [
                {display:'none', src:'', name:'', file:undefined}, 
                {display:'none', src:'', name:'', file:undefined}, 
                {display:'none', src:'', name:'', file:undefined}, 
                {display:'none', src:'', name:'', file:undefined}
            ],
            productName: '',
            height: '',
            length: '',
            width: '',
            weight: '',
            brand: '',
            category: [],
            otherCategory: ['', '', ''],
            attributes:[],
            description: '',
            images: [],
            price: '',
            priceIndex: '',
            formatPrice: '',
            stock: '',
            hidden: false,
            status: '',
            units: {
                cubicMeter: false,
                squareMeter: false,
                width: 0, // 0 - centimetros, 1 - metros
                height: 0, // 0 - centimetros, 1 - metros
                length: 0, // 0 - centimetros, 1 - metros
                weight: 0, // 0 - gramas, 1 - kilogramas
            },
            minQuantity: {enabled: false, quantity: '0'},
            stockDisable: false,
            canDelivery: {motoboy: true, correios: true, transportadora: true},
            loading: true
        }
    }    
    componentDidMount(){
        Slingshot.fileRestrictions('product-images', { allowedFileTypes: ['image/png', 'image/jpeg'], maxSize: 2 * 1024 * 1024 });
        Meteor.subscribe('VendorSettings', ()=>{
            let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
            this.vendor = vendor;
            if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()}); }
            if (!vendor){ history.push('/lista-de-produtos'); return; }
            let location = history.location.pathname.split('/');
            let productId = location[location.length - 1];    
            if (productId.includes('n-')){ this.newProduct = true; }
            productId = productId.replace('n-', '');                
            this.id = productId;
            Meteor.subscribe('ProductsList', ()=>{
                let product = Products.findOne({'id': productId});                
                if (!product){
                    Meteor.subscribe('ProductsOnHoldList', ()=>{
                        product = ProductsOnHold.findOne({'id': productId});
                        console.log(product);
                        if (!product){ 
                            Meteor.subscribe('IncompleteProductsList', ()=>{
                                product = IncompleteProducts.findOne({'id': productId}); 
                                console.log(product);                            
                                if (!product){ 
                                    this.setState({ loading: false }); history.push('/lista-de-produtos'); return; 
                                }else{
                                    if (product.vendor_id != vendor._id){ history.push('/lista-de-produtos'); return; }
                                    this.incomplete = true; product.status = 'incomplete'; this.subscribeProducts(product); return;
                                }                                    
                            });                                
                        }else{
                            if (product.vendor_id != vendor._id){ history.push('/lista-de-produtos'); return; }
                            product.status = 'on-hold'; this.subscribeProducts(product); return;
                        }                                                   
                    });
                }else{ 
                    if (product.vendor_id != vendor._id){ history.push('/lista-de-produtos'); return; }                   
                    product.status = 'complete'; this.subscribeProducts(product); return;
                }                    
            });               
        });
        
    }    
    subscribeProducts(product){        
        if (!this.state.loading){ return; }
        let formated = {};        
        let _categories = [];
        let img_error = true;
        let detail_error = [true, true, true, true]
        this.allCategories.map(cat=>{ _categories.push(cat.toLowerCase()); });
        formated.category = [];
        formated.otherCategory = ['', '', ''];
        formated.display = [
            {display:'none', src:'', name:'', file:undefined},
            {display:'none', src:'', name:'', file:undefined},
            {display:'none', src:'', name:'', file:undefined},
            {display:'none', src:'', name:'', file:undefined},
        ];
        product.img_url.map((img, pos)=>{
            if (img.src != '' && img.src != undefined){ formated.display[pos] = {display:'flex', src:img.src, name:img.name}; img_error = false; }            
        });       
        if (!Array.isArray(product.category)){ product.category = []; }
        product.category.map((_category, pos)=>{ 
            if (_category){
                if (_category != 'Selecione uma categoria' && _category != 'Outra:' && _category != 'Outra'){                
                    if (_categories.indexOf(_category.name.toLowerCase()) > -1){
                        formated.category.push(_category.name);
                    }else{
                        formated.otherCategory[formated.category.length] = _category.name; 
                        formated.category.push('Outra');  
                    }
                }else{
                    if (_category != 'Selecione uma categoria'){
                        if (_category.name.length > 0){ 
                            formated.otherCategory[formated.category.length] = _category.name; 
                            formated.category.push('Outra'); 
                        }
                    }                
                } 
            }
                                  
        });           
        if (!product.units){ product.units = { height: 0, width: 0, length: 0, weight: 0, cubicMeter: false, squareMeter: false }; }
        if (!product.stockDisable){ product.stockDisable = false; }
        if (!product.minQuantity){ product.minQuantity = {enabled: false, quantity: '0'}; }
        if (!product.canDelivery){ product.canDelivery = {motoboy: true, correios: true, transportadora: true}}
        formated.stockDisable = product.stockDisable;
        formated.minQuantity = product.minQuantity;
        formated.canDelivery =  product.canDelivery;
        product.details.map((detail, pos)=>{
            switch(detail.name){
                case 'Peso (kg)':
                    formated.weight = (detail.detail == 'NaN' || !detail.detail) ? '0' : detail.detail;
                    formated.weight = parseFloat(formated.weight); 
                    formated.weight = (product.units.weight == 1) ? (formated.weight * 1000) : formated.weight;
                    formated.weight = formated.weight.toString();
                    detail_error[0] = false;
                    break;
                case 'Largura (cm)':
                    formated.width = (detail.detail == 'NaN' || !detail.detail) ? '0' : detail.detail;
                    formated.width = parseFloat(formated.width);
                    formated.width = (product.units.width == 1) ? (formated.width / 100) : formated.width;
                    formated.width = formated.width.toString();
                    detail_error[1] = false;
                    break;
                case 'Comprimento (cm)':
                    formated.length = (detail.detail == 'NaN' || !detail.detail) ? '0' : detail.detail;
                    formated.length = parseFloat(formated.length);
                    formated.length = (product.units.length == 1) ? (formated.length / 100) : formated.length;
                    formated.length = formated.length.toString();
                    detail_error[2] = false;
                    break;
                case 'Altura (cm)':
                    formated.height = (detail.detail == 'NaN' || !detail.detail) ? '0' : detail.detail;
                    formated.height = parseFloat(formated.height);
                    formated.height = (product.units.height == 1) ? (formated.height / 100) : formated.height;
                    formated.height = formated.height.toString();
                    detail_error[3] = false;
                    break;
                default:
                    if (!formated.attributes){ formated.attributes = []; }
                    formated.attributes.push({ name: detail.name, value: detail.detail });
                    break;
            };  
        })
        
        formated.productName = product.name;
        formated.description = product.description;
        formated.price = product.price.toString().replace('.', ',');
        formated.stock = product.stock_quantity;
        formated.tag = product.tag ? product.tag : [];
        formated.hidden = product.hidden ? product.hidden : false;
        formated.brand = product.brand ? product.brand : '';        

        if (img_error){this.errors.push('Seu produto deve ter uma foto principal.'); }
        if (formated.productName.length < 3){ this.errors.push('Você deve atribuir um nome ao produto.'); }
        if (formated.description.length < 10){ this.errors.push('Você deve atribuir uma descrição de pelo menos 10 caracteres.'); }
        if (formated.category.length == 1 && formated.category[0] == 'Selecione uma categoria'){ this.errors.push('Você deve escolher uma categoria para seu produto.'); }
        if (formated.stock.length == 0 && !formated.stockDisable){ this.errors.push('Você deve atribuir uma quantidade de estoque ao produto.'); }        
        if (detail_error[0]){ this.errors.push('A altura do produto não pode ser nula.');}
        if (detail_error[1]){ this.errors.push('A largura do produto não pode ser nula.');}
        if (detail_error[2]){ this.errors.push('O comprimento do produto não pode ser nulo.');}
        if (detail_error[3]){ this.errors.push('O peso do produto não pode ser nulo.');}
        if (formated.category.length == 0){ this.errors.push('Você deve escolher uma categoria para seu produto.'); formated.category = ['Selecione uma categoria']; }
        if (this.incomplete){ this.errors = []; }
        
        let _status = 'Publicado';
        if (product.status ==  'incomplete'){ 
            _status = 'Rascunho';
            if (this.newProduct){ this.successText = 'Seu produto foi salvo como rascunho.'; }
            let fade = setTimeout(()=>{ this.setState({ fadeOut: '0' }); }, 3000);
        }else{
            if (product.status == 'on-hold'){ _status = 'Aguardando aprovação'; }
            if (this.newProduct){ this.successText = 'Seu produto foi salvo como sucesso!'; }
            let fade = setTimeout(()=>{ this.setState({ fadeOut: '0' }); }, 3000);
        }

        let action = 'Salvar Produto'
        if (this.newProduct){ action = 'Criar novo Produto'; }else{ if (product.status ==  'incomplete'){ action = 'Salvar como Rascunho'; }else{ action = 'Salvar como Produto'; } }
        this.setState({ 
            _id: product._id,
            id: product.id,
            status: product.status,
            _status: _status,
            productName: formated.productName,
            description: formated.description,
            price: formated.price.toString().replace('.', ','),
            stock: formated.stock,
            tag: formated.tag,
            hidden: formated.hidden,
            weight: formated.weight.toString().replace('.', ','),
            width: formated.width.toString().replace('.', ','),
            length: formated.length.toString().replace('.', ','),
            height: formated.height.toString().replace('.', ','),
            attributes: formated.attributes ? formated.attributes : [],
            brand: formated.brand ? formated.brand : '',
            category: formated.category,
            otherCategory: formated.otherCategory,
            display: formated.display,
            units: product.units,
            action: action,
            minQuantity: formated.minQuantity,
            stockDisable: (formated.stockDisable) ? true : false,
            canDelivery: formated.canDelivery,
            loading: false
        });
        return;
    }
    inputHandler(event){
        let name = event.target.name;
        let value = event.target.value;
        if (name.includes('attribute')){
            let attributes = this.state.attributes;
            let box = event.target.name.replace('attribute','');            
            if (box.includes('Name')){
                let index = name.replace('attributeName_','');
                index = parseInt(index);
                attributes[index].name = value;
                console.log(19);
                this.setState({ attributes: attributes });
                return;
            }
            if (box.includes('Value')){
                let index = name.replace('attributeValue_','');
                index = parseInt(index);
                attributes[index].value = value;
                console.log(18);
                this.setState({ attributes: attributes });
                return;
            }
        }  
        if (name.includes('category')){   
            if (name.includes('_other_')){
                let otherCategories = this.state.otherCategory;
                let index = parseInt(name.replace('category_other_', ''));
                otherCategories[index] = value;
                console.log(17);
                this.setState({ otherCategory: otherCategories });
                return;
            }        
            this.categories = [];
            this.allCategories.map(cat => { this.categories.push(cat); });     
            let index = parseInt(name.replace('category_', ''));
            let category = this.state.category;
            if (value != undefined){ category[index] = value; }            
            category.map(cat => { if (cat != 'Outra'){ let i = this.categories.indexOf(cat); if (i > -1){ this.categories[i] = undefined; } } });
            this.setState({ category: category });            
            return;
        }    
        if (name.includes('unit')){
            let units = this.state.units;
            console.log(value)
            if (value.includes('(kg)') || value.includes('(cm)')){ value = 0;
            }else{
                if (value.includes('(g)') || value.includes('(m)')){ value = 1; }else{ return; }
            }
            if (name.includes('height') || name.includes('width') || name.includes('length')){
                if (this.state.units.cubicMeter || this.state.units.squareMeter){ 
                    units.width = 1; units.height = 1; units.length = 1;
                    this.setState({ height:'1', width:'1', length:'1', units: units });
                    return; 
                }
                units[name.replace('unit_', '')] = value; this.setState({ units: units }); return;
            }
            if (name.includes('weight')){ units.weight = value; this.setState({ units: units }); return; }
            return;
        }
        if (name == 'description'){ if (value.length > 1000){ return; } }
        if (name == 'minQuantity'){
            let minQuantity = this.state.minQuantity;
            if (value != ''){ if (!(/^\d+$/.test(value))){ value = minQuantity.quantity.toString(); } }
            minQuantity.quantity = value;
            this.setState({minQuantity: minQuantity});
            return;
        }
        if (name == 'price' || name == 'height' || name == 'length' || name == 'width' || name == 'weight'){
            if (this.state.units.cubicMeter || this.state.units.squareMeter){ if (name != 'price' && name != 'weight'){ return; } }
            if (value != ''){
                value = value.toString().replace('.', ',')
                value = value.toString();
                if (value.includes(',') && value != ','){
                    let commaArray = value.split(',');
                    if (commaArray.length > 2){ this.setState({ [name]: this.state[name] }); return; }
                    if (commaArray[1].length > 2){ commaArray[1] = commaArray[1].slice(0, 2); }
                    value = commaArray[0]+','+commaArray[1];
                    if (commaArray[1] != ''){
                        if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ value = this.state[name]; }
                        this.setState({ [name]: value });
                        return;
                    }
                }else{
                    if (!(/^\d+$/.test(value))){ value = this.state[name].toString(); }
                }
            }           
        } 
        if (name == 'stock'){ if (value != ''){ if (!(/^\d+$/.test(value))){ value = this.state.stock.toString(); } } }
        if (name == 'action'){ 
            let select = ['Criar novo Produto', 'Salvar como Produto', 'Salvar como Rascunho', 'Deletar Produto'];
            this.setState({action: value}); return;
        }
        this.setState({ [name]: value });
    }    
    attributeBox(){
        let attributes = this.state.attributes; 
        if (attributes.length < 1){ return; }
        return(
        <div>
            <div style={{marginTop:'5px', display:'flex'}}>
                <div style={{width:'245px', margin:'auto 0', marginLeft:'20px', marginTop:'10px', fontSize:'13px'}}>Nome<span style={{color:'#FF1414', fontWeight:'bold'}}>*</span></div>
                <div  style={{width:'108px', margin:'auto 0', marginLeft:'17px', marginTop:'10px', fontSize:'13px'}}>Valor<span style={{color:'#FF1414', fontWeight:'bold'}}>*</span></div>
            </div>
            <div>{
                <div>
                    {attributes.map((attribute, index)=>{
                        let key = 'attribute_'+index;
                        return(
                        <div style={{display:'flex'}} key={key}>
                            <CustomInput width='245px' height='30px' margin='auto 0' name={'attributeName_'+index} style={{marginLeft:'20px',marginTop:'5px', boxSizing:'border-box'}} value={attribute.name} onChange={(e)=>{this.inputHandler(e)}}/>
                            <CustomInput width='108px' height='30px' margin='auto 0' name={'attributeValue_'+index} style={{marginLeft:'17px', marginTop:'5px', boxSizing:'border-box', textAlign:'center'}} value={attribute.value} onChange={(e)=>{this.inputHandler(e)}}/>
                            <div style={{width:'20px', height:'30px', margin:'auto 0', marginLeft:'10px', backgroundImage:'url(/imgs/icons/icon-remover.png)', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}} onClick={()=>{this.attributeRemove(index)}}></div>
                        </div>);
                    })}          
                </div>
            }</div>
        </div>
        );
    }
    createAttribute(){
        let attributes = this.state.attributes;
        if (attributes.length > 4){ return; }
        attributes.push({name:'', value:''});
        this.setState({attributes: attributes});
    }
    attributeRemove(index){
        let attributes = this.state.attributes;
        if (attributes.length >= index){ attributes.splice(index, 1); }
        this.setState({attributes:attributes});        
    }    
    displayImage(e, pos){
        let display = this.state.display;
        if (!e.target.files[0]){ this.setState({display:display}); return; }
        let src = URL.createObjectURL(e.target.files[0]);        
        if (display[pos].src == '' && pos > 0){
            if (display[0].src == ''){ 
                display[0] = {display:'flex', src:src, name:'', file:e.target.files[0] }; 
            }else{
                display[pos] =  {display:'flex', src:src, name:'', file:e.target.files[0] }; 
            }
        }else{
            display[pos] = {display:'flex', src:src, name:'', file:e.target.files[0] };
        }
        e.target.value = '';       
        this.setState({display:display});
    }
    displayCategories(){
        return(this.state.category.map((ctg, index)=>{
            let key = 'Category_'+index;
            let width = '185px'
            if (ctg == 'Outra' || ctg == 'Outra:'){ 
                width = '85px';                
                return(
                <div style={{marginBottom: '10px', width:'286px'}} key={key}>
                    <div style={{display:'flex'}}>
                        <div style={{height:'30px', minWidth:'286px'}}>
                            <div style={{position:'absolute'}}>
                                <div style={{display:'flex'}}>
                                    <CustomSelect boxStyle={{position:'absolute', top:'29px', zIndex:'45'}} dropStyle={{width:'185px', borderBottom:'1px solid #FF700px', borderTop:'0px'}} maxHeight='149px' width={width} height='30px' select={this.categories} name={'category_'+index} start={-1} startText='Outra:' value={this.state.category[index]} onChange={(e)=>{this.inputHandler(e)}}/>
                                    <CustomInput width='170px' height='28px' style={{marginLeft:'10px'}} name={'category_other_'+index} value={this.state.otherCategory[index]} onChange={(e)=>{this.inputHandler(e)}}/>
                                </div>
                            </div>                                                
                        </div>
                        {this.categoryController(index)}
                    </div>
                </div>)
            }            
            return(
            <div style={{marginBottom: '10px', width:'85px'}} key={key}>
                <div style={{display:'flex',}}>
                    <div style={{height:'30px', minWidth:width}}>
                        <div style={{position:'absolute'}}>
                            <CustomSelect boxStyle={{position:'absolute', top:'29px', zIndex:'45', borderRight:'0px'}} dropStyle={{width:'185px', borderBottom:'1px solid #FF700', borderTop:'0px'}} maxHeight='149px' width={width} height='30px' select={this.categories} name={'category_'+index} start={-1} startText={this.state.category[index]} value={this.state.category[index]} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>                                                
                    </div>
                    {this.categoryController(index)}
                </div>
            </div>)
        }));
    }
    categoryController(index){
        if (this.state.category[index] == undefined || this.state.category[index] == 'Selecione uma categoria'){ return; }
        if ((index == (this.state.category.length - 1) || this.state.category.length == 0) && index < 2){        
            return(
            <div style={{height:'28px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid #3395F5', backgroundColor:'#3395F5', display:'flex', cursor:'pointer', zIndex:'40' }} onClick={(e)=>{ let category = this.state.category; if (category.length < 3){ category.push('Selecione uma categoria'); this.setState({ category: category }); } }}>
                <div style={{width:'28px', lineHeight:'28px', textAlign:'center', fontWeight:'bold', color:'white'}}>+</div>
            </div>)
        }
        return(
        <div style={{height:'28px', marginLeft:'10px', cursor:'pointer', borderRadius:'3px', border:'1px solid #FF1414', backgroundColor:'#FF1414', display:'flex', cursor:'pointer', zIndex:'40' }} onClick={(e)=>{ let category = this.state.category; category.splice(index, 1); this.setState({ category: category }); }}>
            <div style={{width:'28px', lineHeight:'28px', textAlign:'center', fontWeight:'bold', color:'white'}}>-</div>
        </div>)                
    }
    imageUpload(url, pos, file){
        let meta = { folder: Meteor.userId(), type: 'productsImageFolder', id: this.id };
        let uploader = new Slingshot.Upload( 'product-images', meta );
        if (!file){
            this.errors.push('Não foi possível subir as imagens do produto para o servidor, tente adicionar elas novamente.');
            this.setState({ loading: false });
        }        
        uploader.send(file, (error, imageUrl)=>{
            if (error){
                this.errors.push('Ocorreu um erro ao subir a imagem para o servido, verifique sua conexão com a internet ou se a imagem se enquadra nas especificações.');
                this.setState({ loading: false }); 
            }else{
                let display = this.state.display;
                let name = imageUrl.split('/');
                name = name[name.length - 1];
                name = name.split('.');
                name = name[0];
                display[pos].src = imageUrl;
                display[pos].name = name;
                delete display[pos].file;
                this.setState({ display: display, loading: false });  
                this.saveProduct();
            }
        });        
    }
    displayErrors(){
        if (this.errors.length > 0){
            return(
            <div style={{margin:'10px 0'}}>
                {this.errors.map((error, index)=>{
                    let key = 'Errors_'+index;
                    if (index == (this.errors.length - 1)){
                        return(
                        <div style={{color:'#FF1414', borderBottom:'1px solid #FF700050', fontSize:'14px'}} key={key}>
                            <div style={{margin:'0 20px', paddingBottom:'5px'}}>{error}</div>                                
                        </div>);                        
                    }
                    return(<div style={{margin:'0 20px', color:'#FF1414', fontSize:'14px'}} key={key}>{error}</div>);
                })}
            </div>);
        }
    }    
    saveProduct(){          
        if (this.state.loading){ return; }
        if (this.state.action != 'Salvar como Produto' && this.state.action != 'Salvar como Rascunho'){ return; } 
        this.setState({ loading: true });
        this.errors = [];
        let product = this.state;
        let img_stop = false;
        let productType = this.state.action;
        console.log(productType)
        product.display.map((img, pos)=>{
            let error = [ 'Seu produto deve ter uma foto principal.' ];
            if (pos == 0 && img.src == ''){ this.errors.push( error[0] ); }
            if (!this.errors.includes( error[0] )){ 
                if (img.src != '' && !img_stop){ 
                    if (img.src.includes('blob:')){ img_stop = true; console.log(img); this.imageUpload(img.src, pos, img.file); }
                }
            }
        });
        if (product.productName.trim().length < 3){ this.errors.push('Você deve atribuir um nome ao produto.'); }
        if (product.description.length < 10){ this.errors.push('Você deve atribuir uma descrição de pelo menos 10 caracteres.'); }
        if (product.category.length == 0 && !product.stockDisable){ this.errors.push('Você deve escolher uma categoria na qual seu produto se encaixa.'); }
        if (product.category.length == 1 && product.category[0] == 'Selecione uma categoria'){ this.errors.push('Você deve escolher uma categoria na qual seu produto se encaixa.'); }
        if (product.stock.length == 0 && !product.stockDisable){ this.errors.push('Você deve atribuir uma quantidade de estoque ao produto.'); }        
        if (!parseFloat(product.height.toString().replace(',', '.')) > 0){ this.errors.push('A altura do produto não pode ser nula.');}
        if (!parseFloat(product.width.toString().replace(',', '.')) > 0){ this.errors.push('A largura do produto não pode ser nula.');}
        if (!parseFloat(product.length.toString().replace(',', '.')) > 0){ this.errors.push('O comprimento do produto não pode ser nulo.');}
        if (!parseFloat(product.weight.toString().replace(',', '.')) > 0){ this.errors.push('O peso do produto não pode ser nulo.');}
        if (product.price.length == 0){ 
            this.errors.push('Você deve atribuir um preço ao produto'); 
        }else{
            if (!parseFloat(product.price.toString().replace(',', '.')) > 0){ this.errors.push('O produto deve ter um valor atribuido maior do que 0.'); }
        }
        if (this.errors.length > 0 && productType == 'Salvar como Produto'){ this.setState({ loading: false }); return; }
        if (productType == 'Salvar como Rascunho'){
            this.errors = [];
            if (product.productName.length < 3){ this.errors.push('Você deve atribuir um nome ao produto.'); this.setState({loading: false}); return; }
        }
        if (img_stop){ return; }
        let pack = {
            _id: this.state._id,
            id: this.state.id,
            img_url: [],
            name: product.productName.trim().charAt(0).toUpperCase() + product.productName.trim().slice(1),
            description: product.description,
            price: parseFloat(product.price.toString().replace(',', '.')).toString(),
            category: [],
            stock_quantity: product.stock,
            details: [],
            brand: product.brand,
            hidden: product.hidden,
            units: product.units,
            tags: [],
            stockDisable: (this.state.stockDisable)?true:false,
            minQuantity: this.state.minQuantity,
            canDelivery: this.state.canDelivery
        }
        product.category.map((category, index)=>{            
            if (category != 'Selecione uma categoria' && category != 'Outra:' && category != 'Outra' ){           
                let _category = { 
                    name: category.toString().trim().charAt(0).toUpperCase() + category.trim().slice(1), 
                    slug: removeAccents(category.toString().trim().toLowerCase().replace(/\s/g, '-').replace(/\//g, '')) 
                };
                pack.category.push(_category);
            }
            if (category == 'Outra:' || category == 'Outra'){
                let name = product.otherCategory[index];
                if (product.otherCategory[index.length == 0]){ name = 'Outros'; }   
                let _category = {                    
                    name: name.toString().trim().charAt(0).toUpperCase() + name.trim().slice(1),
                    slug: removeAccents(name.toString().trim().toLowerCase().replace(/\s/g, '-').replace(/\//g, ''))
                }
                pack.category.push(_category);
            }           
        });   
        product.display.map((img, pos)=>{
            if (pos == 0){
                if (img.src == ''){ 
                    pack.img_url.push({ scr: '', name: '', position: 0 }); 
                }else{
                    pack.img_url.push({ src: img.src, name: img.name, position: pack.img_url.length });
                }                
            }else{
                if (img.src != ''){ pack.img_url.push({ src: img.src, name: img.name, position: pack.img_url.length }); }
            }
        });
        if (!parseFloat(product.height.toString().replace(',', '.'))){ product.height = '0'; }
        if (!parseFloat(product.length.toString().replace(',', '.'))){ product.length = '0'; }
        if (!parseFloat(product.width.toString().replace(',', '.'))){ product.width = '0'; }
        if (!parseFloat(product.weight.toString().replace(',', '.'))){ product.weight = '0'; }

        pack.height = parseFloat(product.height.toString().replace(',', '.'));
        pack.length = parseFloat(product.length.toString().replace(',', '.'));
        pack.width = parseFloat(product.width.toString().replace(',', '.'));
        pack.weight = parseFloat(product.weight.toString().replace(',', '.'));

        pack.height = (pack.units.height == 1) ? (pack.height * 100) : pack.height;
        pack.length = (pack.units.length == 1) ? (pack.length * 100) : pack.length;
        pack.width = (pack.units.width == 1) ? (pack.width * 100) : pack.width;
        pack.weight = (pack.units.weight == 1) ? (pack.weight / 1000) : pack.weight;

        pack.height = pack.height.toString();
        pack.length = pack.length.toString();
        pack.width = pack.width.toString();
        pack.weight = pack.weight.toString();

        pack.details.push({ name: 'Altura (cm)', detail: pack.height });
        pack.details.push({ name: 'Largura (cm)', detail: pack.length });
        pack.details.push({ name: 'Comprimento (cm)', detail: pack.width });
        pack.details.push({ name: 'Peso (kg)', detail: pack.weight });

        product.attributes.map(attribute=>{
            if (attribute.name.length > 0 && attribute.value.length > 0){ 
                let _attribute = { name: attribute.name, detail: attribute.value }; 
                pack.details.push(_attribute); 
            }            
        });
        if (productType == 'Salvar como Produto'){
            Meteor.call('vendorEditProduct', pack, (error, result)=>{
                if (error){ 
                    this.errors.push(error.reason); 
                    console.log(error)
                    this.setState({ loading: false });
                }else{           
                    console.log(result);
                    let _status = (this.vendor.verified)?'Publicado':'Aguardando aprovação';
                    let fade = setTimeout(()=>{ this.setState({ fadeOut: '0' }); }, 3000);
                    this.successText = 'Seu produto foi salvo como sucesso!'; 
                    this.setState({ loading: false, status: 'on-hold', _status: _status, fadeOut: '1'});
                }                
                return;
            }); 
            return;
        }else{
            if (productType == 'Salvar como Rascunho'){
                Meteor.call('vendorEditIncompleteProduct', pack, (error, result)=>{
                    if (error){ 
                        this.errors.push(error.reason); 
                        console.log(error)
                        this.setState({ loading: false });
                    }else{      
                        console.log(result);     
                        let _status = 'Rascunho';     
                        let fade = setTimeout(()=>{ this.setState({ fadeOut: '0' }); }, 3000);
                        this.successText = 'Seu produto foi salvo como rascunho.';                
                        this.setState({ loading: false, status: 'incomplete', _status: _status, fadeOut: '1'});
                    }            
                    return;
                });
            }else{
                this.errors.push('Ocorreu um erro ao salvar o produto.');
                this.setState({loading: false})
            }            
        }                
    }    
    deleteProdut(){
        if (this.state.loading){ return; } 
        this.setState({ loading: true }); 
        let pack = { product:{_id: this.state._id} }
        Meteor.call('vendorRemoveProduct', pack, (error)=>{
            if (error){ this.errors.push(error.reason); console.log(error); }else{ history.push('/lista-de-produtos'); return; } 
            this.setState({ loading: false });
        });
    }
    doAction(){
        if (this.state.loading){ return; }
        switch(this.state.action){
            case 'Criar novo Produto': console.log(this.state.action); history.push('/novo-produto'); return; break;
            case 'Salvar como Produto': console.log(this.state.action); this.saveProduct(); return; break;
            case 'Salvar como Rascunho': console.log(this.state.action); this.saveProduct(); return; break;
            case 'Deletar Produto': console.log(this.state.action); this.deleteProdut(); return; break;
            default: return; break;            
        }         
    }  
    render(){
        //if (!Meteor.userId()){ Meteor.logout(); history.push('/entrar'); }
        console.log(this.state);             
        let style = this.state.display;    
        let hiddenHeight = '0px';
        if (this.state.hidden){ hiddenHeight = 'none'; }
        let units = {
            width: (this.state.units.width == 0) ? 'cm' : 'm',
            length: (this.state.units.length == 0) ? 'cm' : 'm',
            height: (this.state.units.height == 0) ? 'cm' : 'm',
            weight: (this.state.units.weight == 0) ? 'kg' : 'g',
            stock: (this.state.units.cubicMeter) ? 'm³' : 'unidades', 
            cubicMeter: this.state.cubicMeter,
            squareMeter: this.state.squareMeter
        }
        units.stock = (this.state.units.squareMeter) ? 'm²' : units.stock; 
        let selectA = ['Centímetros (cm)', 'Metros (m)'];
        let selectB = ['Quilos (kg)', 'Gramas (g)'];
        //if (this.state.loading){ return(<div></div>); }  
        //BOTÃO DE DUPLICAR
        //BOTÃO DE EXCLUIR
        //ATUALIZAR PRODUTO RASCUNHO
        //TRANSFERIR ELE PARA PRODUTOS NORMAIS
        //title='Seu produto ainda estara visível, para retira-lo da loja, encontre-o em sua lista e clique em "excluir"' 
        return(<div>
            <VendorHeader/>
            <div style={{minHeight:'100%', borderLeft:'1px solid #FF7000', display:'flex'}}>
                <VendorMenu />
                <div style={{width:'100%', backgroundColor:'white'}}>
                    <div style={{width:'100%', height:'45px', borderBottom:'1px solid #ff7000', backgroundColor:'#F7F7F7', display:'flex', position:'sticky', top:'0', zIndex:'20'}}>
                        <div style={{paddingLeft:'20px', margin:'auto 0', fontSize:'16px', fontWeight:'bold', color:'#555'}}>Editando Produto</div>
                        {/*<div style={{height:'27px', width:'95px', margin:'auto 0', marginLeft:'auto', lineHeight:'27px',textAlign:'center', color:'white', borderRadius:'15px', backgroundColor:'#3395F5'}} onClick={()=>{}}>
                            Visualizar<div style={{width:'20px', height:'20px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-seen2.png)', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                        </div>*/}                        
                        <div className='fade_out' style = {{margin:'auto', fontSize:'14px', paddingLeft:'20px', color:'#3BCD38', fontWeight:'bold', opacity:this.state.fadeOut}}>{this.successText}</div>
                        <div style={{margin:'auto 0'}}>
                            <CustomSelect style={{fontSize:'14px'}} boxStyle={{ width:'184px', position:'absolute', top:'36px', zIndex:'45', fontSize:'14px', overflow:'auto !important', overflowY:'auto !important'}} dropStyle={{minWidth:'150px', borderBottom:'1px solid #FF700px', borderTop:'0px'}} maxHeight='150px' width='185px' height='30px' select={this.saveSelection} name={'action'} start={0} value={this.state.action} onChange={(e)=>{this.inputHandler(e)}}/>
                        </div>
                        <div style={{height:'24px', width:'fit-content', margin:'auto 20px auto 15px', padding:'0 15px', lineHeight:'24px',textAlign:'center', color:'white', fontSize:'14px', borderRadius:'15px', backgroundColor:(this.state.action == 'Deletar Produto') ? '#FF1414': '#3BCD38' , cursor:'pointer'}} onClick={()=>{this.doAction()}}>Executar</div>
                    </div>                    
                    <div style={{margin:'10px 5px'}}>                        
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
                                <div style={{width:'100%', marginTop:'15px', padding:'10px 20px', margin:'auto 0', borderTop:'1px solid #FFDBBF', fontSize:'13px', color:'#666'}}>
                                    Este produto esta ocultado, logo não ira estará aparecera na loja, impossibilitando a venda do mesmo.
                                </div>
                            </div>
                            <div style={{width:'100%', marginTop:'15px', padding:'10px 20px', margin:'auto 0', borderTop:'1px solid #FFDBBF', fontWeight:'bold', fontSize:'14px', color:(this.state._status != 'Publicado') ? '#D7B614' : '#3BCD38', display:(this.state.status != '') ? 'block' : 'none'}}>
                                <span style={{paddingRight:'30px', fontSize:'15px', color:'#555'}}>Status do produto: </span>{this.state._status}
                            </div>
                            <div style={{padding:'10px 0', color:'#555', borderTop:'1px solid #FFDBBF', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                                <div style={{width:'175px', minWidth:'145px', margin:'auto 0', marginLeft:'19px', fontSize:'15px', fontWeight:'bold'}}>Nome do Produto<span style={{color:'#FF1414'}}>*</span></div>
                                <input style={{width:'100%', height:'30px', maxWidth:'510px', padding:'0px 20px', margin:'auto 0px', lineHeight:'30px', textAlign:'left', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='productName' value={this.state.productName} onChange={(e)=>{this.inputHandler(e)}}/>
                            </div>
                            {this.displayErrors()}
                            <div style={{padding:'10px 15px', paddingBottom:'20px', color:'#555', borderBottom:'1px solid #FFDBBF'}}>
                            <div style={{fontSize:'15px', fontWeight:'bold'}}>Atributos:</div>
                                <div style={{display:'flex'}}>
                                    <div style={{width:'50%', minWidth:'360px', maxWidth:'400px', margin:'0', boxSizing:'border-box', fontSize:'12px'}}>    
                                        <div style={{width:'100%', minHeight:'145px', marginLeft:'5px', paddingTop:'20px'}}>
                                            <div style={{marginBottom:'16px', fontSize:'15px'}}>Categorias<span style={{color:'#FF1414'}}>*</span></div>
                                            { this.displayCategories() }
                                        </div>                                
                                    </div>     
                                    <div style={{width:'50%', padding:'0 5px 0 19px', paddingLeft:'30px', paddingTop:'9px', boxSizing:'border-box'}}>                                    
                                        <div style={{height:'30px', padding:'5px 0', display:'flex'}}>
                                            <div style={{width:'70px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Marca </div>
                                            <input style={{width:'107px', height:'28px', padding:'0px 20px', margin:'auto 19px', lineHeight:'30px', textAlign:'center', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white'}} name='brand' value={this.state.brand} placeholder='Marca do Produto' onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>
                                        <div style={{height:'30px', padding:'10px 0 0 0', display:'flex'}}>
                                            <div style={{minWidth:'12px', height:'12px', margin:'auto 0', border:(this.state.units.cubicMeter) ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let canDelivery = this.state.canDelivery; let units = this.state.units; if (!this.state.units.cubicMeter){units.cubicMeter = true; units.squareMeter = false; canDelivery.motoboy = false; canDelivery.correios = false; units.height = 1; units.length = 1; units.width = 1; this.setState({units: units, width:'1', height:'1', length:'1'}); return; } units.cubicMeter = false; canDelivery.motoboy = true; canDelivery.correios = true; this.setState({ units:units, canDelivery: canDelivery }); return; }}>
                                                <div style={{minWidth:'7px', height:'7px', margin:'auto', borderRadius:'50%', backgroundColor:'#FF7000', display:(this.state.units.cubicMeter) ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{width:'fit-content', margin:'auto 0px auto 10px', fontSize:'15px', lineHeight:'30px'}}>Vender por metro cúbico (m³)</div>                                                       
                                        </div>
                                        <div style={{height:'30px', padding:'0 0 10px 0', display:'flex'}}>
                                            <div style={{minWidth:'12px', height:'12px', margin:'auto 0', border:(this.state.units.squareMeter) ? '2px solid #FF7000' : '2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let canDelivery = this.state.canDelivery; let units = this.state.units; if (!this.state.units.squareMeter){units.squareMeter = true; units.cubicMeter = false; canDelivery.motoboy = false; canDelivery.correios = false; units.height = 1; units.length = 1; units.width = 1; this.setState({units: units, width:'1', height:'1', length:'1'}); return; } units.squareMeter = false; canDelivery.motoboy = true; canDelivery.correios = true; this.setState({ units:units, canDelivery: canDelivery}); return; }}>
                                                <div style={{minWidth:'7px', height:'7px', margin:'auto', borderRadius:'50%', backgroundColor:'#FF7000', display:(this.state.units.squareMeter) ? 'block' : 'none'}}></div>
                                            </div>
                                            <div style={{width:'fit-content', margin:'auto 0px auto 10px', fontSize:'15px', lineHeight:'30px'}}>Vender por metro quadrado (m²)</div>                                                       
                                        </div>
                                        <div style={{height:'30px', padding:'5px 0', display:'flex', display:(this.state.units.squareMeter)?'none':'flex'}}>
                                            <div style={{width:'120px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Altura<span style={{color:'#FF1414'}}>*</span> </div>
                                            <div style={{width:'97px', height:'28px', height:'28px', padding:'0 10px', marginRight:'10px', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:(this.state.units.cubicMeter || this.state.units.squareMeter) ? '#DFDFDF' : 'white', display:'flex'}}>
                                                <input style={{width:'100%',height:'26px', margin:'0 auto', border:'0px', backgroundColor:'transparent', boxShadow:'none'}} name='height' value={this.state.height} onChange={(e)=>{this.inputHandler(e);}}/>
                                                <div style={{paddingLeft:'5px', margin:'auto 0', fontSize:'12px'}}>{units.height}</div>                                                
                                            </div>            
                                            <CustomSelect style={{fontSize:'12px', position:'relative'}} containStyle={{fontSize:'12px', display:(this.state.units.cubicMeter || this.state.units.squareMeter) ? 'none' : 'block'}} boxStyle={{width:'140px', borderRight:'0px', fontSize:'12px', position:'relative', top:'-1px', zIndex:'1', overflow:'auto !important', overflowY:'auto !important'}} dropStyle={{minWidth:'140px', borderBottom:'1px solid #FF700px', borderTop:'0px'}} maxHeight='150px' width='140px' height='30px' select={selectA} name='unit_height' start={this.state.units.height} value={selectA[this.state.units.height]} onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>
                                        <div style={{height:'30px', padding:'5px 0', display:'flex'}}>
                                            <div style={{width:'120px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Largura<span style={{color:'#FF1414'}}>*</span> </div>
                                            <div style={{width:'97px', height:'28px', height:'28px', padding:'0 10px', marginRight:'10px', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:(this.state.units.cubicMeter || this.state.units.squareMeter) ? '#DFDFDF' : 'white', display:'flex'}}>
                                                <input style={{width:'100%',height:'26px', margin:'0 auto', border:'0px', backgroundColor:'transparent', boxShadow:'none'}} name='width' value={this.state.width} onChange={(e)=>{this.inputHandler(e);}}/>
                                                <div style={{paddingLeft:'5px', margin:'auto 0', fontSize:'12px'}}>{units.width}</div>
                                            </div>
                                            <CustomSelect style={{fontSize:'12px', position:'relative'}} containStyle={{fontSize:'12px', display:(this.state.units.cubicMeter || this.state.units.squareMeter) ? 'none' : 'block'}} boxStyle={{width:'140px', borderRight:'0px', fontSize:'12px', position:'relative', top:'-1px', zIndex:'1', overflow:'auto !important', overflowY:'auto !important'}} dropStyle={{minWidth:'140px', borderBottom:'1px solid #FF700px', borderTop:'0px'}} maxHeight='150px' width='140px' height='30px' select={selectA} name='unit_width' start={this.state.units.width} value={selectA[this.state.units.width]} onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>
                                        <div style={{height:'30px', padding:'5px 0', display:'flex'}}>
                                            <div style={{width:'120px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Comprimento<span style={{color:'#FF1414'}}>*</span> </div>
                                            <div style={{width:'97px', height:'28px', height:'28px', padding:'0 10px', marginRight:'10px', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:(this.state.units.cubicMeter || this.state.units.squareMeter) ? '#DFDFDF' : 'white', display:'flex'}}>
                                                <input style={{width:'100%',height:'26px', margin:'0 auto', border:'0px', backgroundColor:'transparent', boxShadow:'none'}} name='length' value={this.state.length} onChange={(e)=>{this.inputHandler(e);}}/>
                                                <div style={{paddingLeft:'5px', margin:'auto 0', fontSize:'12px'}}>{units.length}</div>
                                            </div>
                                            <CustomSelect style={{fontSize:'12px', position:'relative'}} containStyle={{fontSize:'12px', display:(this.state.units.cubicMeter || this.state.units.squareMeter) ? 'none' : 'block'}} boxStyle={{width:'140px', borderRight:'0px', fontSize:'12px', position:'relative', top:'-1px', zIndex:'1', overflow:'auto !important', overflowY:'auto !important'}} dropStyle={{minWidth:'140px', borderBottom:'1px solid #FF700px', borderTop:'0px'}} maxHeight='150px' width='140px' height='30px' select={selectA} name='unit_length' start={this.state.units.length} value={selectA[this.state.units.length]} onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div> 
                                        <div style={{height:'30px', padding:'5px 0', display:'flex'}}>
                                            <div style={{width:'120px', margin:'auto 0', fontSize:'15px', lineHeight:'30px'}}>Peso<span style={{color:'#FF1414'}}>*</span> </div>
                                            <div style={{width:'97px', height:'28px', height:'28px', padding:'0 10px', marginRight:'10px', border:'1px solid #FF7000', borderRadius:'3px', backgroundColor:'white', display:'flex'}}>
                                                <input style={{width:'100%',height:'26px', margin:'0 auto', border:'0px', backgroundColor:'transparent', boxShadow:'none'}} name='weight' value={this.state.weight} onChange={(e)=>{this.inputHandler(e);}}/>
                                                <div style={{paddingLeft:'5px', margin:'auto 0', fontSize:'12px'}}>{units.weight}</div>
                                            </div> 
                                            <CustomSelect style={{fontSize:'12px', position:'relative'}} containStyle={{fontSize:'12px'}} boxStyle={{width:'140px', borderRight:'0px', fontSize:'12px', position:'relative', top:'-1px', zIndex:'1', overflow:'auto !important', overflowY:'auto !important'}} dropStyle={{minWidth:'140px', borderBottom:'1px solid #FF700px', borderTop:'0px'}} maxHeight='150px' width='140px' height='30px' select={selectB} name='unit_weight' start={this.state.units.weight} value={selectB[this.state.units.weight]} onChange={(e)=>{this.inputHandler(e)}}/>
                                        </div>                                    
                                    </div>
                                </div>
                                <div style={{display:'flex', marginTop:'10px'}}>
                                    <div style={{height:'28px', width:'140px', marginTop:'35px', lineHeight:'30px', border:'1px solid #ff7000', borderRadius:'5px', backgroundColor:'#FF7000', color:'white', fontSize:'14px', textAlign:'center'}} onClick={()=>{this.createAttribute()}}>Adicinar atributo</div>                                  
                                    {this.attributeBox()}  
                                </div>
                            </div>
                            <div style={{marginTop:'10px', color:'#555', display:'flex'}}>
                                <div style={{width:'50%', minWidth:'377px', maxWidth:'417px', padding:'0 14px'}}>
                                    <div style={{fontSize:'15px', fontWeight:'bold'}}>Descrição<span style={{color:'#FF1414'}}>*</span></div>
                                </div>
                                <div style={{paddingLeft:'3px', fontSize:'15px', fontWeight:'bold'}}>Imagens<span style={{color:'#FF1414'}}>*</span></div>
                            </div>
                            <div style={{padding:'10px 0', paddingTop:'15px', fontSize:'15px', color:'#555', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                                <div style={{width:'50%', minWidth:'377px', maxWidth:'417px', padding:'0 20px', paddingRight:'30px', boxSizing:'border-box'}}>
                                    <div style={{height:'260px', width:'100%', maxWidth:'360px'}}>
                                        <div style={{padding:'10px', paddingBottom:'0px', margin:'0 auto', border:'1px solid #ff7000', borderRadius:'3px', boxSizing:'border-box', backgroundColor:'white'}}>                                        
                                            <textarea style={{width:'100%', height:'215px', padding:'0px', border:'0px', fontSize:'14px', resize:'none', boxSizing:'border-box'}} name='description' value={this.state.description} onChange={(e)=>{this.inputHandler(e)}}/>
                                            <div style={{width:'100%', height:'20px', marginLeft:'auto', lineHeight:'20px', fontSize:'13px'}}>
                                                <div style={{width:'fit-content', marginLeft:'auto'}}>
                                                    caracteres: <span style={{fontSize:'11px'}}>{this.state.description.length}/500</span>
                                                </div>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                                <div style={{paddingLeft:'35px', boxSizing:'border-box'}}>                                    
                                    <div style={{width:'100%', display:'flex'}}>
                                        <div style={{width:'100%', height:'173px', maxWidth:'173px', minWidth:'173px',marginRight:'5px', border:'1px solid #ff7000', borderRadius:'3px', boxSizing:'border-box', backgroundColor:'white', position:'relative'}}>
                                            <div style={{width:'100%', height:'136px', display:'flex'}}>
                                                <label htmlFor='image_0' style={{width:'50px', height:'50px', margin:'auto', cursor:'pointer', backgroundImage:'url(/imgs/icons/icon-image-plus.png)', backgroundPosition:'center', borderRadius:'3px', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                                            </div>
                                            <label htmlFor='image_0' style={{width:'100%', height:'100%', cursor:'pointer', borderRadius:'3px', display:style[0].display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style[0].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>                                           
                                            <label htmlFor='image_0' style={{width:'100%', height:'35px', cursor:'pointer', lineHeight:'35px', textAlign:'center', backgroundColor:'black', opacity:'0.5', color:'white', display:'block', fontSize:'13px'}}>Selecione uma imagem</label>                                  
                                            <input style={{display:'none'}} type='file' id='image_0' accept='image/*' onChange={(e)=>{this.displayImage(e, 0)}}/>
                                        </div>
                                        <div style={{minWidth:'70px', marginRight:'auto', boxSizing:'border-box'}}>
                                            <div style={{width:'52px', height:'52px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                                                <label htmlFor='image_1' style={{width:'25px', height:'25px', margin:'auto', cursor:'pointer', backgroundImage:'url(/imgs/icons/icon-image-plus.png)', borderRadius:'3px', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                                                <label htmlFor='image_1' style={{width:'100%', height:'100%', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style[1].display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style[1].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                                                <input style={{display:'none'}} type='file' id='image_1' accept='image/*' onChange={(e)=>{this.displayImage(e, 1)}}/>
                                                <div style={{ display:this.state.display[1].display, width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{let display=this.state.display; display.splice(1, 1); display.push({display:'none', src:'', name:''}); console.log(3); this.setState({display: display}); return; }}></div>
                                            </div>
                                            <div style={{width:'52px', height:'52px', marginTop:'5px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                                                <label htmlFor='image_2' style={{width:'25px', height:'25px', margin:'auto', cursor:'pointer', backgroundImage:'url(/imgs/icons/icon-image-plus.png)', borderRadius:'3px', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                                                <label htmlFor='image_2' style={{width:'100%', height:'100%', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style[2].display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style[2].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                                                <input style={{display:'none'}} type='file' id='image_2' accept='image/*' onChange={(e)=>{this.displayImage(e, 2)}}/>
                                                <div style={{ display:this.state.display[2].display, width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{let display=this.state.display; display.splice(2, 1); display.push({display:'none', src:'', name:''}); console.log(2); this.setState({display: display}); return; }}></div>
                                            </div>
                                            <div style={{width:'52px', height:'52px', marginTop:'5px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                                                <label htmlFor='image_3' style={{width:'25px', height:'25px', margin:'auto', cursor:'pointer', backgroundImage:'url(/imgs/icons/icon-image-plus.png)', borderRadius:'3px', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                                                <label htmlFor='image_3' style={{width:'100%', height:'100%', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', display:style[3].display, top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+style[3].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                                                <input style={{display:'none'}} type='file' id='image_3' accept='image/*' onChange={(e)=>{this.displayImage(e, 3)}}/>
                                                <div style={{ display:this.state.display[3].display, width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{let display=this.state.display; display.splice(3, 1); display.push({display:'none', src:'', name:''}); console.log(1); this.setState({display: display}); return; }}></div>
                                            </div>
                                        </div>                                        
                                    </div>
                                    <div style={{marginTop:'15px', lineHeight:'14px', fontSize:'12px', color:'#777'}}>
                                        <div style={{minHeight:'20px'}}>• As imagens não devem ultrapassar <span style={{fontWeight:'bold'}}>2MB</span>.</div>
                                        <div style={{minHeight:'20px'}}>• Os formatos de imagem pertidos são:<span style={{fontWeight:'bold'}}>&nbsp; .JPG,&nbsp; .JPEG&nbsp; e&nbsp; .PNG</span>.</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{paddingBottom:'10px', color:'#555', borderBottom:'1px solid #FFDBBF', display:(this.state.minQuantity.enabled)?'flex':'none'}}>
                                <div style={{width:'fit-content', margin:'auto 10px auto 14px', fontSize:'15px', color:'#555', fontWeight:'bold'}}>Quantidade mínima*</div>                                    
                                <div style={{width:'136px', height:'28px', padding:'0 10px', lineHeight:'30px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', display:'flex'}}>
                                    <input style={{width:'100%', height:'100%',border:'0px', padding:'0px'}} name='minQuantity' value={this.state.minQuantity.quantity} onChange={(e)=>{ this.inputHandler(e); }}/>
                                    <div style={{paddingLeft:'5px', margin:'auto 0', fontSize:'12px'}}>{units.stock}</div>
                                </div>
                            </div>
                            <div style={{ padding:'10px 0', color:'#555', borderBottom:'1px solid #FFDBBF', display:'flex'}}>
                                <div style={{width:'50%', minWidth:'377px', maxWidth:'417px', display:'flex'}}>
                                    <div style={{width:'60px', margin:'auto 0', marginLeft:'14px', fontSize:'15px', fontWeight:'bold'}}>Preço<span style={{color:'#FF1414'}}>*</span></div>                                    
                                    <div style={{width:'136px', height:'28px', padding:'0 10px', lineHeight:'30px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', display:'flex'}}>
                                        <div style={{paddingRight:'5px', margin:'auto 0', fontSize:'14px'}}>R$</div>
                                        <input style={{width:'100%', height:'100%',border:'0px', padding:'0px'}} name='price' value={this.state.price} onChange={(e)=>{ this.inputHandler(e); }}/>
                                        <div style={{paddingLeft:'5px', margin:'auto 0', fontSize:'12px', display:(this.state.units.cubicMeter || this.state.units.squareCubicMeter) ? 'flex' : 'none'}}><span style={{display:(this.state.units.cubicMeter || this.state.units.cubicMeter) ?'block':'none'}}>/</span>{units.stock}</div>
                                    </div>
                                </div>
                                <div style={{width:'75px', margin:'auto 0', marginLeft:'35px', fontSize:'15px', fontWeight:'bold'}}>Estoque<span style={{color:'#FF1414'}}>*</span></div>
                                <div style={{width:'136px', height:'28px', padding:'0 10px', lineHeight:'30px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:(this.state.stockDisable)?'#DFDFDF':'white', display:'flex'}}>
                                    <input style={{width:'100%', height:'100%',border:'0px', padding:'0px', backgroundColor:'transparent', color:(this.state.stockDisable)?'transparent':'#555'}} name='stock' value={this.state.stock} onChange={(e)=>{ if (this.state.stockDisable){ return; } this.inputHandler(e); }}/>
                                    <div style={{paddingLeft:'5px', margin:'auto 0', fontSize:'12px'}}>{units.stock}</div>
                                </div>
                                <div style={{minWidth:'12px', height:'12px', margin:'auto 0 auto 14px', border:(this.state.stockDisable)?'2px solid #FF7000':'2px solid #B3B3B3', borderRadius:'50%', display:'flex', cursor:'pointer'}} onClick={()=>{let stockDisable = this.state.stockDisable; stockDisable = !(stockDisable); this.setState({stockDisable: stockDisable}); }}>
                                    <div style={{minWidth:'6px', height:'6px', margin:'auto', borderRadius:'50%', backgroundColor:'#ff7000', display:(this.state.stockDisable)?'block':'none'}}></div>
                                </div>
                                <div style={{width:'fit-content', height:'fit-content', margin:'auto 0 auto 10px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>Desativar estoque.</div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
            <Waiting open={this.state.loading} size='60px'/>
        </div>);
    }
}
export default EditProductPage;