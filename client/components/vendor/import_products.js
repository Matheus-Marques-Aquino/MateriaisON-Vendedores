import React, { Component } from 'react';
import MainHeader from '../subcomponents/mainHeader';
import { Meteor } from 'meteor/meteor';
import { Vendors } from '../../../imports/collections/vendors';
import { VendorsOnHold } from '../../../imports/collections/vendors_onhold';
import Waiting from '../subcomponents/widgets/waiting';
import history from '../subcomponents/widgets/history';
import CustomInput from '../subcomponents/widgets/customInput';
import CustomToggle from '../subcomponents/widgets/customToggle';
import CustomSelect from '../subcomponents/widgets/customSelect';
import VendorHeader from '../subcomponents/vendor_header';
import VendorMenu from '../subcomponents/vendorMenu';
import XLSX from 'xlsx';
import removeAccents from 'remove-accents';

class ImportProductPage extends Component {
    constructor(props){
        super(props);
        //this.productList = [];
        this.productErrors = [];
        this.removeList = [];
        this.vendor = {};
        this.mainCategories = [
            'Banheiro','Climatização e ventilação',
            'Cozinha e área de serviço','Decoração',
            'Esporte e lazer','Ferragens',
            'Ferramentas','Iluminação',
            'Jardim e varanda','Materiais elétricos',
            'Materiais hidráulicos','Material de construção',
            'Pisos e revestimentos','Segurança e comunicação',
            'Tapetes','Tintas e acessórios','Tudo para sua casa','Outra:'
        ];
        this.defaultText = ['img_url', 'name', 'description', 'brand', 'price', 'details_0', 'details_1', 
        'details_2', 'details_3', 'category_0', 'category_1', 'category_2', 'categories', 'stock_quantity'];
        this.defaultText['img_url'] = 'O produto deve ter ao menos uma foto.';
        this.defaultText['name'] = 'O nome deve ter ao menos 3 caracteres.';
        this.defaultText['description'] = 'A descrição deve ter pelo menos 10 caracteres.';
        this.defaultText['brand'] = 'A marca do produto deve ter mais do que 1 caractere.';
        this.defaultText['price'] = 'O produto não pode ter um preço nulo.';
        this.defaultText['details_0'] = 'A altura do produto deve ser maior do que 0 cm.';
        this.defaultText['details_1'] = 'A largura do produto deve ser maior do que 0 cm.';
        this.defaultText['details_2'] = 'O comprimento do produto deve ser maior do que 0 cm.';
        this.defaultText['details_3'] = 'O peso do produto deve ser maior do que 0 kg.';
        this.defaultText['category_0'] = 'A categoria dever ter mais do que 1 caractere.';
        this.defaultText['category_1'] = 'A categoria dever ter mais do que 1 caractere.';
        this.defaultText['category_2'] = 'A categoria dever ter mais do que 1 caractere.';
        this.defaultText['categories'] = 'O produto deve ter ao menos uma categoria.';
        this.defaultText['stock_quantity'] = 'O campo "Estoque" é obrigatório.';

        this.errors = [];

        this.errorText = [];
        this.backup = { images: [], control: true };
        this.imagesToUpload = [];
        

        this.productImages = [];

        this.state = {
            selectedIndex: 0,
            openBox: 0,
            index: 0,
            multiPages:[],
            page: 0,
            pageList: [[]],
            productPerPage: 30,
            limit: 5,
            imageBox: {open: false, index: -1},
            imagesReady: false,
            loading: true
        };
    } 
    componentDidMount(){
        Meteor.subscribe('VendorSettings', ()=>{
            let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
            if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()}); }
            if (!vendor){
                this.setState({ loading: false });
                Meteor.logout();
                history.push('/entrar');
                return; 
            }
            this.setState({ loading: false });
            this.vendor = vendor;  
        });    
    }  
    fixSheetNumbers(number){
        let value = number.toString();
        value = value.replace(/\./g,',');
        value = value.replace(/[^0-9,]/g, '');
        if (value == ''){ return '0,00'; }        
        let valueArray = value.split(',');
        if (valueArray.length == 1){ return valueArray[0]+',00'; }
        if (valueArray[0] == ''){ valueArray[0] = '0'; }
        if (valueArray[1] == ''){ valueArray[1] = valueArray[1]+'00'; }
        if (valueArray[1].length == 1){ valueArray[1] = valueArray[1]+'0'; }
        return (valueArray[0]+','+valueArray[1]); 
    }    
    readSheet(e){
        if (this.state.loading){ return; }   
        var file = e.target.files[0];
        if (!file){ return; }

        var reader = new FileReader();        
        this.setState({ loading: true });
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
            let productsArray = [];
            let productsList = [];
            let pageList = [];
            for (let key in productSheet){
                if (key.includes('!')){continue;}
                if (letterArray.includes(key[0])){
                    if (!numberArray.includes(key[1])){continue;}
                    let row = parseInt(key.substr(1));               
                    if (row < 3){ continue; }  
                    
                    productsArray[row-3] = {sku: '', img_url: [], details:[{name: "Altura (cm)", detail: "0"}, {name: "Largura (cm)", detail: "0"}, {name: "Comprimento (cm)", detail: "0"}, {name: "Peso (kg)", detail: "0"}], category:[{name: "", slug: ""}, {name: "", slug: ""}, {name: "", slug: ""}], name:'', brand:'', price:'0', stock_quantity:0, tags:[]};                                     
                    console.log(productSheet[key])
                    switch(key[0]){
                        case 'A':
                            productsArray[row-3] = {sku: productSheet[key].v.toString(), img_url: [], details:[{name: "Altura (cm)", detail: "0"}, {name: "Largura (cm)", detail: "0"}, {name: "Comprimento (cm)", detail: "0"}, {name: "Peso (kg)", detail: "0"}], category:[{name: "", slug: ""}, {name: "", slug: ""}, {name: "", slug: ""}], name:'', brand:'', price:'0', stock_quantity:0, tags:[]}; 
                            break;
                        case 'B':
                            productsArray[row-3].name = productSheet[key].v.toString();
                            console.log(productSheet[key])
                            break;
                        case 'C':
                            productsArray[row-3].brand = productSheet[key].v.toString();
                            break;
                        case 'D':
                            productsArray[row-3].details[0] = ({name:'Altura (cm)', detail:this.fixSheetNumbers(productSheet[key].v)});
                            break;
                        case 'E':
                            productsArray[row-3].details[1] = ({name:'Largura (cm)', detail:this.fixSheetNumbers(productSheet[key].v)});
                            break;
                        case 'F':
                            productsArray[row-3].details[2] = ({name:'Comprimento (cm)', detail:this.fixSheetNumbers(productSheet[key].v)});
                            break;
                        case 'G':
                            productsArray[row-3].details[3] = ({name:'Peso (kg)', detail:this.fixSheetNumbers(productSheet[key].v)});
                            break;
                        case 'H':
                            productsArray[row-3].price = this.fixSheetNumbers(productSheet[key].v);
                            break;
                        case 'I':
                            productsArray[row-3].stock_quantity = parseInt(productSheet[key].v.toString().replace(/[^0-9]/g, '')) ? parseInt(productSheet[key].v.toString().replace(/[^0-9]/g, '')) : 0;
                            break;
                        case 'J':
                            let category = productSheet[key].v.split(';');
                            let categories = [];
                            
                            for(let i=0; i < 3; i++){
                                if (category[i] != undefined){
                                    category[i] = category[i].trim();
                                    category[i] = category[i].charAt(0).toUpperCase() + category[i].slice(1);
                                    let slug = category[i].replace(/\ /gi, '-').replace(/\//g, '').toLowerCase();
                                    slug = removeAccents(slug);
                                    categories.push({name:category[i], slug:slug});
                                }
                                
                            }
                            if (categories.length == 0){
                                categories=[{name:'', slug:''}, {name:'', slug:''}, {name:'', slug:''}];
                            }
                            if (categories.length == 1){
                                categories.push({name:'', slug:''});
                            }
                            if (categories.length == 2){
                                categories.push({name:'', slug:''});
                            }
                            
                            productsArray[row-3].category = categories;                            
                            break;
                        case 'K':
                            productsArray[row-3].description = productSheet[key].v.toString();
                            break;
                    }                    
                }                
            } 
            
            let lastPage = 0; 
            this.productErrors[lastPage] = [];
            this.errorText[lastPage] = [];
            productsArray.map((product, index)=>{
                if (productsList.length == this.state.productPerPage){
                    pageList.push(productsList);
                    productsList = [];
                    lastPage += 1;
                    this.productErrors[lastPage] = [];
                    this.errorText[lastPage] = [];
                }
                product.errors = [];   
                productsList.push(product);   
                this.productErrors[lastPage].push([]);
                this.errorText[lastPage].push([]);
                if (index == productsArray.length - 1){                    
                    pageList.push(productsList);
                }
            });

            for(let i = 0; i < pageList.length; i++){
                if (!this.errors[i]){ this.errors[i] = []; }
                pageList[i].map((error, index)=>{
                    if (!this.errors[i][index]){ this.errors[i][index] = []; }
                    for(let b = 0; b < 15; b++){
                        this.errors[i][index].push('');
                    }
                });                                
            }
            if (!pageList[0]){ 
                pageList[0] = []; 
            }
            return this.setState({
                pageList: pageList,
                productList: productsArray,
                loading: false
            });            
        };
        reader.readAsBinaryString(file);              
    }
    returnText(product, key){
        let text = '';
        if (product){
            if (product.errors){
                if (product.errors[key]){ text = product.errors[key];}else{ return ''; }
            }return '';
        }'';                
        return text;
    }
    inputHandler(e, index){  
        let name = e.target.name;
        let value = e.target.value;
        let page = this.state.page;
        
        if (name == '') { return; }
        let pageList = this.state.pageList;
        let productList = this.state.pageList[page];       
        let product = productList[index];

        if (name == 'stock_quantity'){               
            if (value != ''){
                if (!(/^\d+$/.test(value))){
                    value = this.state.pageList[page][index].stock_quantity.toString();
                } 
            }
            product.stock_quantity = value;
            productList[index] = product;
            pageList[page] = productList;
            this.setState({ productList: pageList });
            return;
        }
        if (name.includes( 'category' )){ 
            let nameArray = name.split('_');
            let _index = nameArray[1];
            name = nameArray[0];            
            product.category[_index].name = value;
            productList[index] = product;
            pageList[page] = productList;
            this.setState({ productList: pageList });
            return;
        }
        if (name.includes('price')){ 
            if (value != ''){
                value = value.replace('.', ',')
                value = value.toString();
                if (value.includes(',') && value != ','){
                    let commaArray = value.split(',');
                    if (commaArray.length > 2){
                        this.setState({ pageList: this.state.pageList });
                        return;
                    }
                    if (commaArray[1].length > 2){
                        commaArray[1] = commaArray[1].slice(0, 2);                        
                    }
                    value = commaArray[0]+','+commaArray[1];
                    if (commaArray[1] != ''){
                        if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ 
                            value = this.state.pageList[page][index].price;
                        }
                        product.price = value;
                        productList[index] = product;
                        pageList[page] = productList;
                        this.setState({ pageList: pageList });
                        return;
                    }
                }else{
                    if (!(/^\d+$/.test(value))){                 
                        value = this.state.pageList[page][index].price;
                    }
                }
            }
            product.price = value;
            productList[index] = product;
            pageList[page] = productList;            
            this.setState({ pageList: pageList });
            return;
        }
        if (name.includes('details')){ 
            let nameArray = name.split('_');
            let _index = nameArray[1];
            name = nameArray[0];

            if (value != ''){
                value = value.replace('.', ',')
                value = value.toString();
                if (value.includes(',') && value != ','){
                    let commaArray = value.split(',');
                    if (commaArray.length > 2){
                        this.setState({ pageList: this.state.pageList });
                        return;
                    }
                    if (commaArray[1].length > 2){
                        commaArray[1] = commaArray[1].slice(0, 2);                        
                    }
                    value = commaArray[0]+','+commaArray[1];
                    if (commaArray[1] != ''){
                        if (!(/^\d+$/.test(commaArray[0])) || !(/^\d+$/.test(commaArray[1]))){ 
                            value = this.state.pageList[page][index].details[_index].detail;
                        }
                        product.details[_index].detail = value;
                        productList[index] = product;
                        pageList[page] = productList;
                        this.setState({ pageList: pageList });
                        return;
                    }
                }else{
                    if (!(/^\d+$/.test(value))){                 
                        value = this.state.pageList[page][index].details[_index].detail;
                    }
                }
            }
            product.details[_index].detail = value;
            productList[index] = product;
            pageList[page] = productList;
            this.setState({ pageList: pageList});
            return;
        }        
        product[name] = value;       
        productList[index] = product;
        pageList[page] = productList;
        this.setState({ pageList: pageList});
    }
    pageController(){
        let pages = this.state.pageList.length;
        let page = this.state.page;
        let limit = this.state.limit;        
        let pagination = [];
        if (!this.state.pageList[0].length > 0){ return; }
        if (pages > limit){
            if (page + (limit - 1)/2 >= pages){
                for(let i = pages; i > (pages - limit); i--){
                    pagination.unshift(i);
                }
            }else{
                for(let i = page - (limit - 1) / 2; i <= (page + (limit - 1) / 2); i++){
                    pagination.push(i);
                }
            }
        }else{
            for(let i=0; i < pages; i++){
                pagination.push(i);
            }
        }
        return(
        <div style={{width:'fit-content', height:'26px', margin:'0 auto', marginTop:'10px', fontWeight:'bold', fontSize:'14px', textAlign:'center', display:'flex'}}>
            <div style={{display: (page + 1 > 1) ? 'block' : 'none', width:'16px', height:'16px', padding:'0 5px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-leftArrow.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>{
            pagination.map((_page, index)=>{
                let key = 'Page_' + _page;
                return(<div style={{width:'20px', height:'22px', margin:'0 5px', lineHeight:'22px', border: (page != _page) ? '2px solid #FF7000' : '2px solid #B3B3B3', color: (page != _page) ? '#FF7000' : '#B3B3B3', cursor: (page != _page) ? 'pointer' : 'default'}} key={key} onClick={()=>{if (this.state.page != _page){ this.setState({page: index})}}}>{_page + 1}</div>);
            }) 
            }<div style={{display: (page + 1 < pages) ? 'block' : 'none', width:'16px', height:'16px', padding:'0 5px', margin:'auto 0', backgroundImage:'url(/imgs/icons/icon-rightArrow.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat'}}></div>
        </div>)
    }     
    uploadImages(callback){
        let index = -1;
        let position = 0;
        let page = this.state.page;
        let image = {src: '', position: 0, file: undefined};
        let meta = { folder: Meteor.userId(), type: 'productsImageFolder', id: Math.random(0).toString().slice(-5) };
        let uploader = new Slingshot.Upload( 'product-images', meta );        
        for(let i = 0; i < this.productImages.length; i++){
            if (!this.productImages[i]){ continue; }
            for(let k = 0; k < this.productImages[i].length; k++){
                position = k;
                if (!this.productImages[i][k].src){ continue; }
                if (this.productImages[i][k].src.includes('blob')){
                    image = this.productImages[i][k];
                    index = i;
                    break;
                }
            }
        }
        if (index < 0){ 
            console.log('Finished')
            this.productImages = [];
            this.setState({loading: false});
            if (callback == 'importComplete'){ this.importCompleteProducts(); }
            if (callback == 'importIncomplete'){ this.importIncompleteProducts(); }
            return; 
        }
        if (!image.file){ 
            this.productImages[index] = {src: '', position: 0, file: undefined};
            pageList[page][index].img_url[image.position] = image; 
            this.errors[page][index][0] = 'Ocorreu um erro ao fazer upload da imagem.';
            this.setState({pageList: pageList}); 
            this.uploadImages(callback);  
            return; 
        }
        uploader.send(image.file, (error, url)=>{
            if (error) {
                let pageList = this.state.pageList;
                this.productImages[index][position] = {src: '', position: position, file: undefined};
                pageList[page][index].img_url[image.position] = image; 
                this.errors[page][index][0] = 'Ocorreu um erro ao fazer upload da imagem.';
                this.setState({pageList: pageList});
                this.uploadImages(callback);          
            }else{               
                let pageList = this.state.pageList; 
                delete image.file;
                image.name = url.split('/');
                image.name = image.name[image.name.length - 1];  
                image.name = image.name.split('.'); 
                image.name = image.name[0];
                image.src = url;                
                pageList[page][index].img_url[image.position] = image; 
                console.log(pageList)
                this.setState({pageList: pageList});
                this.uploadImages(callback);  
            }
        });
    }  
    validatePage(productsArray){ 
        if (!productsArray.length > 0 || this.state.loading){ return; }
        this.setState({ loading: true });
        
        this.removeList = [];
        this.completeProducts = [];
        this.incompleteProducts = [];
        this.productImages = [];
        let page = this.state.page;
        let products = productsArray;//this.state.pageList[page];       

        products.map((product, index)=>{
            let categoryEmpty = true;
            let imageEmpty = true;   
            let error = false;        
            this.errors[page][index] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
            product.errors = [];
            product.price = product.price.toString().replace(',', '.');
            if (product.name.length < 3){ this.errors[page][index][1] = this.defaultText['name']; error = true; }
            if (product.description.length < 10){ this.errors[page][index][2] = this.defaultText['description']; error = true; }
            if (product.brand.length > 0 && product.brand.length < 3){ this.errors[page][index][14] = this.defaultText['brand']; error = true; }
            if (!parseFloat(product.price) > 0){ this.errors[page][index][4] = this.defaultText['price']; error = true; }            
            if (!Number.isInteger(parseInt(product.stock_quantity))){ this.errors[page][index][13] = this.defaultText['stock_quantity']; error = true;
            }else{ product.stock_quantity = product.stock_quantity.toString(); }                  
            product.details.map((detail, _index)=>{
                product.details.detail = detail.detail.toString().replace(',', '.');
                if (!parseFloat(product.details.detail) > 0 || !parseFloat(product.details.detail)){
                    switch(index){
                        case 0:
                            this.errors[page][index][5] = this.defaultText['details_0']; error = true; 
                            break;
                        case 1: 
                            this.errors[page][index][6] = this.defaultText['details_1']; error = true; 
                            break;
                        case 2:
                            this.errors[page][index][7] = this.defaultText['details_2']; error = true; 
                            break;
                        case 2:
                            this.errors[page][index][8] = this.defaultText['details_3']; error = true; 
                            break;    
                    } 
                }        
            });
            product.category.map((_category, _index)=>{
                if (_category.name.length > 0){ categoryEmpty = false; }
                
                if (_category.name.length < 3){
                    console.log(_category.name.length)
                    switch(index){
                        case 0:
                            this.errors[page][index][9] = this.defaultText['category_0']; error = true; 
                            break; 
                        case 2: 
                            this.errors[page][index][10] = this.defaultText['category_1']; error = true; 
                            break; 
                        case 2: 
                            this.errors[page][index][11] = this.defaultText['category_2']; error = true; 
                            break; 
                    }
                }
            });                
            if (categoryEmpty){ this.errors[page][index][12] = this.defaultText['categories']; error = true; }
            if (!product.img_url.length > 0){
                this.errors[page][index][0] = this.defaultText['img_url'];
                error = true;
            }else{
                product.img_url.map((img, _index)=>{
                    if (img.src){                        
                        if (img.src != ''){ imageEmpty = false; }
                        if (img.src.includes('blob')){ 
                            if (!this.productImages[index]){ this.productImages[index] = []; }
                            this.productImages[index].push(img);
                        }
                    }
                });
            }
            if (imageEmpty){
                this.errors[page][index][0] = this.defaultText['img_url'];
                error = true;
            }
            if (!product.index){ product.index = index };
            if (error > 0){ this.incompleteProducts.push(product); }else{ this.completeProducts.push(product); }
        });
        console.log(this.errors)
        if (this.completeProducts.length > 0){ 
            if (this.productImages.length > 0){ 
                this.uploadImages('importComplete'); 
                return; 
            } 
        } 
        this.setState({loading: false});
        return;           
    }
    validateIncompletePage(productsArray){
        if (!productsArray.length > 0 || this.state.loading){ return; }
        this.setState({ loading: true });
        
        this.removeList = [];
        this.completeProducts = [];
        this.incompleteProducts = [];
        this.productImages = [];
        let page = this.state.page;
        let products = productsArray;       

        products.map((product, index)=>{
            let error = false; 
            product.errors = [];
            if (product.name.length < 3){ this.errors[page][index][1] = this.defaultText['name'];; error = true; }
            product.price = product.price.toString().replace(',', '.');
            product.price = parseFloat(product.price);
            if (!product.price){ product.price = 0; }
            product.price = product.price.toFixed(2);
            product.index = index;                          
            product.img_url.map((img, _index)=>{
                if (img.src){                        
                    if (img.src != ''){ imageEmpty = false; }
                    if (img.src.includes('blob')){ 
                        if (!this.productImages[index]){ this.productImages[index] = []; }
                        this.productImages[index].push(img);
                    }
                }
            });
            if (!error > 0){this.incompleteProducts.push(product); }
        });
        if (!this.incompleteProducts.length > 0){ 
            this.setState({loading: false}); return; 
        }else{ 
            if (this.productImages.length > 0){ 
                this.uploadImages('importComplete'); 
                return; 
            }else{
                this.importIncompleteProducts();
                return;
            }
        }
        return;
    }
    importCompleteProducts(){
        if (this.state.loading){ return; }        
        this.setState({loading: true}); 
        this.productImages = [];       
        let steps = this.completeProducts.splice(0, 5);
        let pageList = this.state.pageList;
        let page = this.state.page;

        if (!steps.length > 0){ 
            for(let i = this.removeList.length - 1; i >= 0; i--){ 
                pageList[page].splice(this.removeList[i], 1); 
                this.errors[page].splice(this.removeList[i], 1);
                this.errors[page].push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
            }
            this.removeList = [];
            this.setState({pageList: pageList, loading: false});
            this.refreshList(pageList); 
            return; 
        }
        steps.map((product)=>{ if (product.errors){ delete product.erros; } });

        Meteor.call('vendorImportCompleteProducts', steps, (error, result)=>{
            if (error){
                console.log(error);
                this.setState({loading: false});
                return;
            }else{
                console.log(result); 
                this.removeList = this.removeList.concat(result.index);
                this.setState({loading: false});
                console.log(this.removeList);
                this.importCompleteProducts();
            }
        });
    }
    importIncompleteProducts(){
        if (this.state.loading){ return; }        
        this.setState({loading: true}); 
        this.productImages = [];       
        let steps = this.incompleteProducts.splice(0, 5);
        let pageList = this.state.pageList;
        let page = this.state.page;

        if (!steps.length > 0){ 
            for(let i = this.removeList.length - 1; i >= 0; i--){ 
                pageList[page].splice(this.removeList[i], 1); 
                this.erros[page].splice(this.removeList[i], 1);
                this.errors[page].push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
            }
            this.removeList = [];
            this.setState({pageList: pageList, loading: false});
            this.refreshList(pageList); 
            return; 
        }
        steps.map((product)=>{ if (product.errors){ delete product.erros; } });

        Meteor.call('vendorImportIncompleteProducts', steps, (error, result)=>{
            if (error){
                console.log(error);
                this.setState({loading: false});
                return;
            }else{
                console.log(result); 
                this.removeList = this.removeList.concat(result.index);
                this.setState({loading: false});
                console.log(this.removeList);
                this.importIncompleteProducts();
            }
        });
    }    
    validateSingleCompleteProduct(index){
        if (this.state.loading){ return; }
        this.setState({loading: true});
        let pageList = this.state.pageList;
        let page = this.state.page;
        let product = pageList[page][index];
        let error = false;
        let categoryEmpty = true;
        let imageEmpty = true;
        let productImages = [];

        if (!product){ this.setState({loading: false}); return; }
        this.errors[page][index] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        product.errors = [];
        product.price = product.price.toString().replace(',', '.');
        if (product.name.length < 3){ this.errors[page][index][1] = this.defaultText['name']; error = true; }
        if (product.description.length < 10){ this.errors[page][index][2] = this.defaultText['description']; error = true; }
        if (product.brand.length > 0 && product.brand,length < 3){ this.errors[page][index][14] = this.defaultText['brand']; error = true; }
        if (!parseFloat(product.price) > 0){ this.errors[page][index][4] = this.defaultText['price'];; error = true; }            
        if (!Number.isInteger(parseInt(product.stock_quantity))){ 
            this.errors[page][index][13] = this.defaultText['stock_quantity']; error = true;
        }else{ 
            product.stock_quantity = product.stock_quantity.toString(); 
        }                  
        product.details.map((detail, _index)=>{
            product.details.detail = detail.detail.toString().replace(',', '.');
            if (!parseFloat(product.details.detail) > 0 || !parseFloat(product.details.detail)){ 
                if (!parseFloat(product.details.detail) > 0){
                    switch(index){
                        case 0:
                            this.errors[page][index][5] = this.defaultText['details_0']; error = true; 
                            break;
                        case 1: 
                            this.errors[page][index][6] = this.defaultText['details_1']; error = true; 
                            break;
                        case 2:
                            this.errors[page][index][7] = this.defaultText['details_2']; error = true; 
                            break;
                        case 2:
                            this.errors[page][index][8] = this.defaultText['details_3']; error = true; 
                            break;    
                    } 
                }
            }           
        });
        product.category.map((_category, _index)=>{
            if (_category.name.length > 0){ categoryEmpty = false; }
            if (_category.name.length < 3){ 
                switch(index){
                    case 0:
                        this.errors[page][index][9] = this.defaultText['category_0']; error = true; 
                        break; 
                    case 2: 
                        this.errors[page][index][10] = this.defaultText['category_1']; error = true; 
                        break; 
                    case 2: 
                        this.errors[page][index][11] = this.defaultText['category_2']; error = true; 
                        break; 
                }
            }           
        });                
        if (categoryEmpty){ this.errors[page][index][12] = this.defaultText['categories']; error = true; }
        if (!product.img_url.length > 0){
            this.errors[page][index][0] = this.defaultText['img_url'];
            error = true;
        }else{
            product.img_url.map((img, _index)=>{
                if (img.src){                        
                    if (img.src != ''){ imageEmpty = false; }
                    if (img.src.includes('blob')){                         
                        productImages.push(img);
                        console.log(img.src)
                    }
                }
            });
        }
        if (imageEmpty){ this.errors[page][index][0] = this.defaultText['img_url']; }
        product.index = index;
        if (error > 0){ this.setState({loading: false}); return; }else{ this.uploadSingleProductImage(index, 'complete'); }
        return;
    }
    validateSingleIncompleteProduct(index){
        if (this.state.loading){ return; }
        this.setState({loading: true});
        let pageList = this.state.pageList;
        let page = this.state.page;
        let product = pageList[page][index];
        let error = false;
        let imageEmpty = true;
        let productImages = [];

        if (!product){ this.setState({loading: false}); return; }
        this.errors[page][index] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        product.errors = [];        
        if (product.name.length < 3){ this.errors[page][index][1] = this.defaultText['name']; error = true; }
        product.price = product.price.toString().replace(',', '.');
        product.price = parseFloat(product.price);
        if (!product.price){ product.price = 0; }
        product.price = product.price.toFixed(2);      
        product.img_url.map((img, _index)=>{
            if (img.src){                        
                if (img.src.includes('blob')){                         
                    productImages.push(img);
                }
            }
        });        
        product.index = index;
        if (error > 0){ this.setState({loading: false}); return; }else{ this.uploadSingleProductImage(index, 'incomplete'); }
        return;
    }
    uploadSingleProductImage(index, status){
        let pageList = this.state.pageList;
        let page = this.state.page;
        let img_url = pageList[page][index].img_url;
        let image = {src: '', position: 0, file: undefined};
        let meta = { folder: Meteor.userId(), type: 'productsImageFolder', id: Math.random(0).toString().slice(-5) };
        let uploader = new Slingshot.Upload( 'product-images', meta );
        for(let i = 0; i < img_url.length; i++){
            if (!img_url[i]){ continue; }
            if (!img_url[i].src){ continue; }
            if (img_url[i].src.includes('blob')){ 
                image = img_url[i];
                if (!image.file){ 
                    pageList[page][index].img_url[i] = {src: '', position: 0, file: undefined};
                    this.errors[page][index][0] = 'Ocorreu um erro ao fazer upload da imagem.';
                    this.setState({pageList: pageList}); 
                    this.uploadSingleProductImage(index, status)  
                    return; 
                }
                uploader.send(image.file, (error, url)=>{
                    if (error) {
                        pageList[page][index].img_url[i] = {src: '', position: position, file: undefined};
                        this.errors[page][index][0] = 'Ocorreu um erro ao fazer upload da imagem.';  
                        this.setState({pageList: pageList});
                        this.uploadSingleProductImage(index, status);
                        return;    
                    }else{               
                        delete image.file;
                        image.name = url.split('/');
                        image.name = image.name[image.name.length - 1];  
                        image.name = image.name.split('.'); 
                        image.name = image.name[0];
                        image.src = url;                
                        pageList[page][index].img_url[i] = image; 
                        this.setState({pageList: pageList});
                        this.uploadSingleProductImage(index, status);
                        return;
                    }
                });
            }
        }
        this.setState({loading: false}); 
        if (status == 'complete'){ this.importSingleProduct(index); } 
        if (status == 'incomplete'){ this.importSingleIncompleteProduct(index); }        
        return;
    }
    importSingleProduct(index){
        if (this.state.loading){ return; }        
        this.setState({loading: true}); 
        let pageList = this.state.pageList;
        let page = this.state.page;
        let product = pageList[page][index]
        if (product.errors){ delete product.erros; }
        Meteor.call('vendorImportCompleteProducts', [product], (error, result)=>{
            if (error){
                console.log(error);
                this.setState({loading: false});
                return;
            }else{
                console.log()
                for(let i = result.index.length - 1; i >= 0; i--){ 
                    pageList[page].splice(result.index[i], 1); 
                    this.errors[page].splice(result.index[i], 1);
                    this.errors[page].push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
                }                
                this.setState({pageList: pageList, loading: false});
                this.refreshList(pageList);
                return;
            }
        });        
    }
    importSingleIncompleteProduct(index){
        if (this.state.loading){ return; }        
        this.setState({loading: true}); 
        let pageList = this.state.pageList;
        let page = this.state.page;
        let product = pageList[page][index]
        if (product.errors){ delete product.erros; }
        Meteor.call('vendorImportIncompleteProducts', [product], (error, result)=>{
            if (error){
                console.log(error);
                this.setState({loading: false});
                return;
            }else{
                console.log()
                for(let i = result.index.length - 1; i >= 0; i--){ 
                    pageList[page].splice(result.index[i], 1); 
                    this.errors[page].splice(result.index[i], 1)
                    this.errors[page].push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
                }                
                this.setState({pageList: pageList, loading: false});
                this.refreshList(pageList);
                return;
            }
        });        
    }    
    deleteProduct(index){
        if (this.state.loading){ return; }
        if (this.state.pageList[0].length == 0){ return; }
        this.setState({loading: true});
        let pageList = this.state.pageList;
        let page = this.state.page;
        pageList[page].splice(index, 1);
        //this.errors[page].splice(index, 1);
        this.refreshList(pageList);        
    }
    refreshList(pages){
        if (!this.state.loading){ this.setState({loading: true}); }  
        let page = this.state.page;      
        let allProducts = [];
        let productsList = [];
        let pageList = [];
        let errorList = [];
        let lastPage = 0;
        let _errorText = [];
        let _productErrors = [];
        
        for(let i=0; i<this.productErrors.length; i++){
            _productErrors = _productErrors.concat(this.productErrors[i]);
        }
        for(let i=0; i<this.errorText.length; i++){
            _errorText = _errorText.concat(this.errorText[i]);
        }
        pages.map((_page, index)=>{
            allProducts = allProducts.concat(_page);
        });
        this.errorText[0] = [];
        this.productErrors[0] = [];
        allProducts.map((product, index)=>{
            if (productsList.length == this.state.productPerPage){
                pageList.push(productsList);
                productsList = [];
                lastPage += 1;
                this.errorText[lastPage] = [];
                this.productErrors[lastPage] = [];
            }
            this.errorText[lastPage].push(_errorText[index])
            this.productErrors[lastPage].push(_productErrors[index])
            productsList.push(product);
            if (index == allProducts.length - 1){                    
                pageList.push(productsList);
            }
        }) 
        if (pageList.length > this.errors.length){
            this.errors.unshift();
        }
        if (page > lastPage){ 
            page = lastPage; 
        } 
        if (!pageList[0]){ 
            pageList[0] = []; 
            page = 0
        }
        //console.log(pageList)
        console.log(this.errors)
        this.setState({ pageList: pageList, page: page, loading: false});
    }       
    imageBox(){
        console.log(this.state.pageList)
        let page = this.state.page;
        let image = [];
        let pageList = this.state.pageList;
        let index = this.state.imageBox.index;
        if (!this.state.imageBox.open){ return; }
        if (this.state.imageBox.index < 0 ){ return; }
        if (!pageList.length > 0){ return; }
        if (!pageList[page]){ return; }
        if (!pageList[page][index]){ return; }        
        image = pageList[page][index].img_url;        
        for(let i=0; i<4; i++){ if (!image[i]){ image[i] = {src: '', name: '', position: i}; } }
        return(
        <div style={{minWidth:'1007px', zIndex:'80'}}>
            <div style={{width:'100%', height:'100%', position:'fixed', top:'0', right:'0', bottom:'0', left:'0', backgroundColor:'black', opacity:'0.5'}}></div>
            <div style={{width:'100%', maxWidth:'430px', height:'450px', borderRadius:'8px', backgroundColor:'white', position:'fixed', margin:'auto', top:'0', right:'0', bottom:'0', left:'0'}}>
                <div style={{width:'100', height:'40px', lineHeight:'40px', textAlign:'center', borderBottom:'1px solid #F0F0F0', backgroundColor:'#F7F7F7', borderTopLeftRadius:'8px', borderTopRightRadius:'8px', position:'relative', color:'#333'}}>
                    {this.state.pageList[page][index].name}
                    <div style={{width:'15px', height:'15px', margin:'auto', position:'absolute', top:'0px', right:'30px', bottom:'0px', backgroundImage:'url(/imgs/icons/icon-xcancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{this.setState({imageBox:{open:false, index:-1}})}}></div>
                </div>
                <div style={{marginTop:'15px', marginLeft:'20px', fontSize:'15px', fontWeight:'bold', color:'#555'}}>Imagens do produto:</div>
                <div style={{margin:'15px auto', marginBottom:'20px', display:'flex'}}>                    
                    <div style={{width:'fit-content',minWidth:'510px' ,matginBottom:'20px', marginLeft:'20px'}}>
                        <div style={{height:'fit-content', lineHeight:'15px', fontSize:'12px', textAlign:'left', color:'#666'}}>
                            • Cada imagem de produto não pode ultrapassar 2MB.
                        </div>
                        <div style={{height:'fit-content', lineHeight:'15px', fontSize:'12px', textAlign:'left', color:'#666'}}>
                            • Os formatos de imagem aceitos pelo sistema são: JPG, JPEG e PNG.
                        </div>
                    </div>                            
                </div>                
                <div style={{width:'fit-content', margin:'0 auto', marginTop:'45px', display:'flex'}}>
                    <div style={{width:'100%', height:'173px', maxWidth:'173px', minWidth:'173px', border:'1px solid #ff7000', borderRadius:'3px', boxSizing:'border-box', backgroundColor:'white', position:'relative'}}>
                        <div style={{width:'100%', height:'136px', display:'flex'}}>
                            <label htmlFor='image_0' style={{width:'50px', height:'50px', margin:'auto', cursor:'pointer', backgroundImage:'url(imgs/icons/icon-image-plus.png)', backgroundPosition:'center', borderRadius:'3px', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                        </div>
                        <label htmlFor='image_0' style={{display:(image[0].src == '') ? 'none' : 'block' , width:'100%', height:'100%', cursor:'pointer', borderRadius:'3px', top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+image[0].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>                                           
                        <label htmlFor='image_0' style={{width:'100%', height:'35px', cursor:'pointer', lineHeight:'35px', textAlign:'center', backgroundColor:'black', opacity:'0.5', color:'white', display:'block', fontSize:'13px'}}>Selecione uma imagem</label>                                  
                        <input style={{display:'none'}} type='file' id='image_0' accept='image/*' onChange={(e)=>{ this.importImage(e, 0, index);}}/>
                    </div>
                    <div style={{minWidth:'70px', marginLeft:'5px', boxSizing:'border-box'}}>
                        <div style={{width:'52px', height:'52px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                            <label htmlFor='image_1' style={{display:'none', width:'25px', height:'25px', margin:'auto', cursor:'pointer', backgroundImage:'url(imgs/icons/icon-image-plus.png)', borderRadius:'3px', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                            <label htmlFor='image_1' style={{display:(image[1].src == '') ? 'none' : 'block', width:'100%', height:'100%', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+image[1].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                            <input style={{display:'none'}} type='file' id='image_1' accept='image/*' onChange={(e)=>{ this.importImage(e, 1, index); }}/>
                            <div style={{display:(image[1].src == '') ? 'none' : 'block', width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{ let img_url = {src: '', name: '', position: 1}; pageList[page][index].img_url[1] = img_url; this.setState({pageList: pageList}); }}></div>
                        </div>
                        <div style={{width:'52px', height:'52px', marginTop:'5px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                            <label htmlFor='image_2' style={{width:'25px', height:'25px', margin:'auto', cursor:'pointer', backgroundImage:'url(imgs/icons/icon-image-plus.png)', borderRadius:'3px', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                            <label htmlFor='image_2' style={{display:(image[2].src == '') ? 'none' : 'block', width:'100%', height:'100%', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+image[2].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                            <input style={{display:'none'}} type='file' id='image_2' accept='image/*' onChange={(e)=>{ this.importImage(e, 2, index); }}/>
                            <div style={{display:(image[2].src == '') ? 'none' : 'block', width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{ let img_url = {src: '', name: '', position: 2}; pageList[page][index].img_url[2] = img_url; this.setState({pageList: pageList}); }}></div>
                        </div>
                        <div style={{width:'52px', height:'52px', marginTop:'5px', border:'1px solid #ff7000', borderRadius:'3px', backgroundColor:'white', position:'relative', display:'flex'}}>
                            <label htmlFor='image_3' style={{width:'25px', height:'25px', margin:'auto', cursor:'pointer', backgroundImage:'url(imgs/icons/icon-image-plus.png)', borderRadius:'3px', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain', opacity:'0.5', display:'block'}}></label>
                            <label htmlFor='image_3' style={{display:(image[3].src == '') ? 'none' : 'block', width:'100%', height:'100%', cursor:'pointer', borderTopLeftRadius:'3px', borderTopRightRadius:'3px', top:'0px', left:'0px', position:'absolute', backgroundColor:'white', backgroundImage:'url('+image[3].src+')', backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'contain'}}></label>
                            <input style={{display:'none'}} type='file' id='image_3' accept='image/*' onChange={(e)=>{ this.importImage(e, 3, index); }}/>
                            <div style={{display:(image[3].src == '') ? 'none' : 'block', width:'20px', height:'20px', position:'absolute', top:'-5px', right:'-5px', backgroundImage:'url(/imgs/icons/icon-cancel.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{ let img_url = {src: '', name: '', position: 3}; pageList[page][index].img_url[3] = img_url; this.setState({pageList: pageList}); }}></div>
                        </div>
                    </div>                                        
                </div>                
                <div style={{width:'100%', height:'50px', borderTop:'1px solid #F0F0F0', backgroundColor:'#F7F7F7', display:'flex', borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px', position:'absolute', bottom:'0', display:'flex'}}>
                    <div style={{width:'50px', height:'fit-content', padding:'5px 10px', margin:'auto 0', marginLeft:'auto', marginRight:'30px', fontSize:'12px', backgroundColor:'#3BCD38', borderRadius:'10px', color:'white', cursor:'pointer', textAlign:'center'}} onClick={()=>{this.setState({imageBox:{open:false, index:-1}})}}>                            
                        Salvar
                    </div>
                </div>
            </div>
        </div>);
    }
    importImage(event, pos, index){
        let page = this.state.page;
        let pageList = this.state.pageList;
        let product = this.state.pageList[page][index];
        let src = '';  
        if (index < 0){ return; }      
        if (!event.target.files[0]){ this.setState({imageIndex: index}); return; } 
        if (product.img_url.length > 4){ this.setState({imageIndex: index}); return; }   
        if (!product.img_url){ product.img_url = []; }
        src = URL.createObjectURL(event.target.files[0]);
        if (product.img_url.length == 0 || product.img_url[0].src == ''){
            this.imagesToUpload.push({index: index, file: event.target.files[0], position: 0});
            product.img_url[0] = {src: src, name: '', position: 0, file: event.target.files[0]};
        }else{
            this.imagesToUpload.push({index: index,  file: event.target.files[0], position: pos});
            product.img_url[pos] = {src: src, name: '', position: pos, file: event.target.files[0]};
        }
        event.target.value = ''; 
        pageList[page][index] = product;
        this.setState({pageList: pageList});
    } 
    productList() {
        console.log('x')
        let page = this.state.page;
        return(
        this.state.pageList[page].map((product, index)=>{
            let image = product.img_url;
            let border = '0px';
            let key = 'produto_'+index;
            if (index == 0){ border = '1px solid #FF7000'; }
            for(let i=0; i<4; i++){ if (!image[i]){ image[i] = {src: '', name: '', position: i}; } } 
            return(
            <div key={key}>                                
                <div style={{width:'100%', minWidth:'1007px', maxHeight:'80px', marginTop: (index == 0) ? '0px' : '10px', lineHeight:'30px', border:'1px solid #FF7000', borderTop: (index == 0) ? '0px' : '1px solid #FF000', textAlign:'center', fontSize:'12px', backgroundColor:'white', color:'#555', display:'flex'}}>
                    <div title={this.errors[page][index][0]} style={{minWidth:'80px', minHeight:'80px', position:'relative'}}>
                        <div style={{width:'35px', height:'35px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-warning.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', position:'absolute', top:'0px', right:'0px', bottom:'25px', left:'0px', display:(this.errors[page][index][0]) ? 'block' : 'none'}}></div>
                        <div style={{display:(image[0].src == '') ? 'none' : 'block', width:'80px', height:'80px', position:'absolute', top:'0px', left:'0px', backgroundImage:'url(' + image[0].src + ')', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat'}}></div>
                        <div style={{width:'100%', height:'25px', lineHeight:'25px', backgroundColor:'#00000050', position:'absolute', left:'0', bottom:'0px', textAlign:'center', fontSize:'12px', color:'white', cursor:'pointer'}} onClick={()=>{if (!this.state.loading){ this.setState({ imageBox: {open: true, index: index}}); }}}>Adicionar</div>
                    </div>
                    <div style={{width:'250px', minWidth:'250px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', textAlign:'left'}}>
                        <div title={this.errors[page][index][1]}  style={{height:'55px', width:'100%', margin:'auto 0', borderBottom:'1px solid #FF7000', position:'relative'}}>
                            <textarea style={{width:'100%', height:'60px', padding:'5px 3px', border:'0px', fontSize:'13px', color:(!this.errors[page][index][1]) ? '#222' : '#FF1414', resize:'none', boxSizing: 'border-box'}} name='name' value={this.state.pageList[page][index].name} onChange={(e)=>{this.inputHandler(e, index)}} />
                            <div style={{width:'35px', height:'35px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-warning.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px', display:(this.errors[page][index][1]) ? 'block' : 'none'}}></div>
                        </div>
                        <div style={{height:'24px', width:'100%', display:'flex'}}>
                            <div title={this.errors[page][index][4]} style={{width:'124px', height:'24px', borderRight:'1px solid #FF7000', backgroundColor:'white', display:'flex'}}>
                                <div style={{paddingLeft:'5px', width:'40px', height:'24px', lineHeight:'23px', textAlign:'left', fontSize:'12px', fontWeight:'bold', color:(!this.errors[page][index][4]) ? '#000' : '#FF1414'}}>
                                    Preço:
                                </div>
                                <div style={{padding:'0 3px', width:'16px', height:'24px', lineHeight:'24px', textAlign:'left', fontSize:'12px', fontWeight:'normal', color:(!this.errors[page][index][4]) ? '#222' : '#FF1414'}}>
                                    R$
                                </div>
                                <input style={{width:'100%', height:'22px', lineHeight:'24px', textAlign:'left', fontSize:'12px', border:'0px', color:(!this.errors[page][index][4]) ? '#222' : '#FF1414'}} name='price' value={this.state.pageList[page][index].price} onChange={(e)=>{this.inputHandler(e, index)}} />
                            </div>
                            <div title={this.errors[page][index][13]} style={{width:'125px', height:'24px', backgroundColor:'white', display:'flex'}}>
                                <div style={{paddingLeft:'5px', width:'50px', height:'24px', lineHeight:'23px', textAlign:'left', fontSize:'12px', fontWeight:'bold', color:(!this.errors[page][index][13]) ? '#000' : '#FF1414' }}>
                                    Estoque:
                                </div>
                                <input style={{width:'100%', height:'22px', lineHeight:'24px', textAlign:'center', fontSize:'12px', border:'0px', color:(!this.errors[page][index][13]) ? '#222' : '#FF1414'}}  name='stock_quantity' value={this.state.pageList[page][index].stock_quantity} onChange={(e)=>{this.inputHandler(e, index)}}/>
                                <div  style={{paddingLeft:'3px', minWidth:'30px', height:'24px', lineHeight:'24px', marginLeft:'auto', textAlign:'left', fontSize:'12px', fontWeight:'normal', color:(!this.errors[page][index][13]) ? '#222' : '#FF1414' }}>
                                    und.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{minWidth:'150px', minHeight:'80px', borderLeft: '1px solid #FF7000', borderRight:'1px solid #FF7000', fontSize:'12px'}}>
                        <div style={{display:'flex'}}>
                            <div style={{width:'fit-content', margin:'auto', padding:'0px'}}>                                                                       
                                <div style={{width:'140px', display:'flex'}}>
                                    <div title={this.errors[page][index][5]} style={{width:'70px', height:'15px', lineHeight:'15px', textAlign:'center', fontSize:'10px', color:(!this.errors[page][index][5]) ?  'black': '#FF1414', fontWeight:'bold'}}>
                                        Altura:
                                    </div>
                                    <div title={this.errors[page][index][6]} style={{width:'70px', height:'15px', lineHeight:'15px', textAlign:'center', fontSize:'10px', color:(!this.errors[page][index][6]) ? 'black' : '#FF1414', fontWeight:'bold'}}>
                                        Largura:
                                    </div>
                                </div>
                                <div style={{width:'140px', display:'flex'}}>
                                    <div title={this.errors[page][index][5]} style={{width:'65px', height:'20px', margin:'0 auto', lineHeight:'20px', border:'1px solid #FF700050', textAlign:'center', fontSize:'10px', position:'relative', color:(!this.errors[page][index][5]) ? '#444' : '#FF1414', backgroundColor:'white'}}>
                                        <input style={{width:'43px', height:'20px', padding:'0 2px', paddingRight:'15px', border:'0px', lineHeight:'20px', borderRadius:'4px', fontSize:'10px', textAlign:'center', color:(!this.errors[page][index][5]) ? 'black' : '#FF1414'}} name='details_0' value={this.state.pageList[page][index].details[0].detail}  onChange={(e)=>{this.inputHandler(e, index)}}/>
                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', position:'absolute', right:'1px', top:'0px', color:(!this.errors[page][index][5]) ? '#222' : '#FF1414'}}>cm</div>
                                    </div>
                                    <div title={this.errors[page][index][6]} style={{width:'65px', height:'20px', margin:'0 auto', lineHeight:'20px', border:'1px solid #FF700050', textAlign:'center', fontSize:'10px', position:'relative', color:(!this.errors[page][index][6]) ? '#444' : '#FF1414', backgroundColor:'white'}}>
                                        <input style={{width:'43px', height:'20px', padding:'0 2px', paddingRight:'15px', border:'0px', lineHeight:'20px', borderRadius:'4px', fontSize:'10px', textAlign:'center', color:(!this.errors[page][index][6]) ? 'black' : '#FF1414'}} name='details_1' value={this.state.pageList[page][index].details[1].detail}  onChange={(e)=>{this.inputHandler(e, index)}}/>
                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', position:'absolute', right:'1px', top:'0px', color:(!this.errors[page][index][6]) ? '#222' : '#FF1414'}}>cm</div>
                                    </div>
                                </div>
                            </div>                                    
                        </div>
                        <div style={{display:'flex'}}>
                            <div style={{width:'fit-content', margin:'auto', padding:'0px'}}>                                                                       
                                <div style={{width:'140px', display:'flex'}}>
                                    <div title={this.errors[page][index][7]} style={{width:'70px', height:'15px', lineHeight:'15px', textAlign:'center', fontSize:'10px', color:(!this.errors[page][index][7]) ? 'black' : '#FF1414', fontWeight:'bold'}}>
                                        Comprimento:
                                    </div>
                                    <div title={this.errors[page][index][8]} style={{width:'70px', height:'15px', lineHeight:'15px', textAlign:'center', fontSize:'10px', color:(!this.errors[page][index][8]) ? 'black' : '#FF1414', fontWeight:'bold'}}>
                                        Peso:
                                    </div>
                                </div>
                                <div style={{width:'140px', display:'flex'}}>
                                    <div title={this.errors[page][index][7]} style={{width:'65px', height:'20px', margin:'0 auto', lineHeight:'20px', border:'1px solid #FF700050', textAlign:'center', fontSize:'10px', position:'relative', color:(!this.errors[page][index][7]) ? '#444' : '#FF1414'}}>
                                        <input style={{width:'43px', height:'20px', padding:'0 2px', paddingRight:'15px', border:'0px', lineHeight:'20px', borderRadius:'4px', fontSize:'10px', textAlign:'center', color:(!this.errors[page][index][7]) ? 'black' : '#FF1414'}} name='details_2' value={this.state.pageList[page][index].details[2].detail} onChange={(e)=>{this.inputHandler(e, index)}}/>
                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', position:'absolute', right:'1px', top:'0px', color:(!this.errors[page][index][7]) ? '#222' : '#FF1414}'}}>cm</div>
                                    </div>
                                    <div title={this.errors[page][index][8]} style={{width:'65px', height:'20px', margin:'0 auto', lineHeight:'20px', border:'1px solid #FF700050', textAlign:'center', fontSize:'10px', position:'relative', color:(!this.errors[page][index][8]) ? '#444' : '#FF1414'}}>
                                        <input style={{width:'43px', height:'20px', padding:'0 2px', paddingRight:'15px', border:'0px', lineHeight:'20px', borderRadius:'4px', fontSize:'10px', textAlign:'center', color:(!this.errors[page][index][8]) ? 'black' : '#FF1414'}} name='details_3' value={this.state.pageList[page][index].details[3].detail} onChange={(e)=>{this.inputHandler(e, index)}}/>
                                        <div style={{width:'fit-content', height:'20px', lineHeight:'20px', position:'absolute', right:'1px', top:'0px', color:(!this.errors[page][index][8]) ? '#222' : '#FF1414'}}>kg</div>
                                    </div>
                                </div>
                            </div>                                    
                        </div>                        
                    </div>
                    <div style={{minWidth:'190px', minHeight:'81px', lineHeight:'13px', position:'relative'}}>                        
                        <input title={this.errors[page][index][9]} style={{width:'100%', height:'19px', padding:'0px', border:'0px', textAlign:'center', fontSize:'12px', color:(!this.errors[page][index][9]) ? 'black' : '#FF1414'}} name='category_0' value={this.state.pageList[page][index].category[0].name} onChange={(e)=>{this.inputHandler(e, index)}}/>
                        <input title={this.errors[page][index][10]} style={{width:'100%', height:'19px', padding:'0px', border:'0px', textAlign:'center', fontSize:'12px', color:(!this.errors[page][index][10]) ? 'black' : '#FF1414'}} name='category_1' value={this.state.pageList[page][index].category[1].name} onChange={(e)=>{this.inputHandler(e, index)}}/>                        
                        <input title={this.errors[page][index][11]} style={{width:'100%', height:'19px', padding:'0px', border:'0px', textAlign:'center', fontSize:'12px', color:(!this.errors[page][index][11]) ? 'black' : '#FF1414'}} name='category_2' value={this.state.pageList[page][index].category[2].name} onChange={(e)=>{this.inputHandler(e, index)}}/>                          
                        <div  title={this.errors[page][index][3]} style={{height:'24px', padding:'0 5px', lineHeight:'24px', fontSize:'12px', textAlign:'left', borderTop:'1px solid #FF7000', fontWeight:'bold', display:'flex'}}>
                            <div style={{color:(!this.errors[page][index][14]) ? 'black' : '#FF1414'}}>Marca:</div>
                            <input style={{width:'120px', height:'24px', padding:'0 5px', border:'0px', lineHeight:'24px', fontSize:'12px', textAlign:'left', color:(!this.errors[page][index][14]) ? 'black' : '#FF1414'}} name='brand' value={this.state.pageList[page][index].brand} onChange={(e)=>{this.inputHandler(e, index)}}/>
                        </div>
                        <div title={this.errors[page][index][12]} style={{width:'35px', height:'35px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-warning.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', position:'absolute', top:'0px', right:'0px', bottom:'25px', left:'0px', display:(this.errors[page][index][12]) ? 'block' : 'none'}}></div>
                    </div>
                    <div title={this.errors[page][index][2]} style={{width:'100%', minWidth:'260px', minHeight:'80px', lineHeight:'13px', borderLeft: '1px solid #FF7000', display:'flex', backgroundColor:'white', position:'relative'}}>
                        <textarea style={{width:'100%', height:'100%', padding:'3px 3px', border:'0px', fontSize:'13px', color:'#222', resize:'none', overflowY:'scroll', boxSizing: 'border-box', backgroundColor:'transparent'}} name='description' value={this.state.pageList[page][index].description} onChange={(e)=>{this.inputHandler(e, index)}} />
                        <div style={{width:'35px', height:'35px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-warning.png', backgroundSize:'contain', backgroundPosition:'center', backgroundRepeat:'no-repeat', position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px', display:(this.errors[page][index][2]) ? 'block' : 'none'}}></div>
                    </div>
                    <div style={{minWidth:'80px', minHeight:'81px', lineHeight:'13px', borderLeft: '1px solid #FF7000'}}>
                        <div style={{width:'100%', height:'40px', display:'flex'}}>
                            <div style={{width:'40px', height:'40px', display:'flex'}}>
                                <div title='Vizualizar' style={{width:'23px', height:'22px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-seen.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}}></div>
                            </div>
                            <div style={{width:'40px', height:'40px', display:'flex'}}>
                                <div title='Salvar' style={{width:'20px', height:'22px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-save.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{ this.validateSingleCompleteProduct(index); }}></div>
                            </div>
                        </div>
                        <div style={{width:'100%', height:'40px', display:'flex'}}>
                            <div style={{width:'40px', height:'40px', display:'flex'}}>
                                <div title='Salvar como Rascunho' style={{width:'22px', height:'22px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-file.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{ this.validateSingleIncompleteProduct(index); }}></div>
                            </div>
                            <div style={{width:'40px', height:'40px', display:'flex'}}>
                                <div title='Excluir' style={{width:'22px', height:'22px', margin:'auto', backgroundImage:'url(/imgs/icons/icon-thrash2.png)', backgroundPosition:'center', backgroundSize:'contain', backgroundRepeat:'no-repeat', cursor:'pointer'}} onClick={()=>{this.deleteProduct(index);}}></div>
                            </div>
                        </div>                                                                                            
                    </div>
                </div>
            </div>)
        }))        
    }    
    render(){
        //if (!Meteor.userId()){ Meteor.logout(); history.push('/entrar'); }
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
                            <label htmlFor='upload' style={{minWidth:'210px', height:'30px', lineHeight:'30px', marginLeft:'0px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Importar planilha</label> 
                            <a style={{textDecoration:'none'}} href='/downloads/Planilha_de_Produtos_Base.xlsx' download='Planilha de Produtos Base.xlsx'>
                                <div style={{minWidth:'210px', height:'30px', lineHeight:'30px', marginLeft:'20px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Baixar planilha base</div> 
                            </a>    
                            <a style={{textDecoration:'none'}} href='/downloads/Planilha_de_Produtos_Examplo.xlsx' download='Exemplo de Planilha de Produtos.xlsx'>                      
                                <div style={{minWidth:'210px', height:'30px', lineHeight:'30px', marginLeft:'20px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Baixar planilha de exemplo</div> 
                            </a>  
                            <input type='file' id='upload' accept='.xlsx' style={{display:'none'}} onChange={(e)=>{this.readSheet(e)}}/>
                        </div>
                        <div style={{margin:'5px 0', marginBottom:'20px', marginLeft:'auto', display:'flex'}}>
                            {/*<CustomSelect select={['Edição em massa', 'Salvar todos selecionados', 'Salvar rascunho dos seleciondos', 'Excluir selecionados']} style={{fontSize:'12px'}} width='250px' height='30px' margin='0' name='name' value={this.state.productFilter} onChange={()=>{}}/>
                            <div style={{width:'70px', height:'30px', lineHeight:'30px', marginLeft:'5px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:'#FF7000', color:'white', cursor:'pointer'}}>Executar</div>*/}
                            <div style={{minWidth:'210px', height:'30px', lineHeight:'30px', margin:'auto 0', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:(this.state.pageList[this.state.page].length == 0) ? '#CCC' : '#FF7000', color:'white', cursor:(this.state.pageList[this.state.page].length == 0) ? 'default' : 'pointer'}} onClick={()=>{this.validatePage(this.state.pageList[this.state.page]);}}>Importar todos os produtos</div>
                            <div style={{minWidth:'210px', height:'30px', lineHeight:'30px', margin:'auto 0', marginLeft:'20px', borderRadius:'8px', fontSize:'12px', textAlign:'center', backgroundColor:(this.state.pageList[this.state.page].length == 0) ? '#CCC' : '#FF7000', color:'white', cursor:(this.state.pageList[this.state.page].length == 0) ? 'default' : 'pointer'}} onClick={()=>{this.validateIncompletePage(this.state.pageList[this.state.page]);}}>Importar todos como rascunho</div>
                            <div style={{width:'fit-content',minWidth:'510px' ,marginLeft:'20px'}}>
                                <div style={{height:'fit-content', lineHeight:'15px', fontSize:'12px', textAlign:'left', color:'#666'}}>
                                    • Cada imagem de produto não pode ultrapassar 2MB.
                                </div>
                                <div style={{height:'fit-content', lineHeight:'15px', fontSize:'12px', textAlign:'left', color:'#666'}}>
                                    • Os formatos de imagem aceitos pelo sistema são: JPG, JPEG e PNG.
                                </div>
                                <div style={{height:'fit-content', lineHeight:'15px', fontSize:'12px', textAlign:'left', color:'#666'}}>
                                    • Produtos incompletos podem ser importados como rascunho e editados posteriomente.
                                </div>
                            </div>                            
                        </div>  
                        <div style={{width:'100%', height:'30px', minWidth:'1007px', lineHeight:'30px', border:'1px solid #FF7000', textAlign:'center', fontSize:'13px', fontWeight:'bold', backgroundColor:'#FF700020', display:'flex'}}>
                            <div style={{minWidth:'80px', height:'30px'}}>Imagem</div>
                            <div style={{width:'240px', minWidth:'240px', height:'30px', paddingLeft:'10px', borderLeft: '1px solid #FF7000', textAlign:'left', overflow:'hidden', whiteSpace:'nowrap'}}>Nome do Produto</div>
                            <div style={{minWidth:'150px', height:'30px', borderLeft: '1px solid #FF7000', borderRight:'1px solid #FF7000'}}>Detalhes</div>
                            <div style={{minWidth:'190px', height:'30px'}}>Categorias</div>                            
                            <div style={{width:'100%', minWidth:'260px', height:'30px', borderLeft: '1px solid #FF7000'}}>Descrição</div>
                            <div style={{minWidth:'80px', height:'30px', borderLeft: '1px solid #FF7000'}}>Ações</div>
                        </div>                                            
                        {this.productList()}
                        {this.pageController()}
                    </div>                    
                </div>
                {/*this.categoryBox((this.state.openBox==1), this.state.index)*/}
                {this.imageBox()}
                <Waiting open={this.state.loading} size='60px'/>
            </div>
        </div>);
        }
    }
export default ImportProductPage;