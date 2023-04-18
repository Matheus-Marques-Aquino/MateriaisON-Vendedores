import  React, { Component } from 'react';
import XLSX from 'xlsx';
import removeAccents from 'remove-accents'

class ExcelImport extends Component {
    constructor(props){
        super(props);
        this.errors = [];
        this.start = true;
        this.state = {
            
        }
    }
    componentDidMount(){
        Meteor.call('batchInsertTo', (error, result)=>{
            if (error){
                console.log(error);
            }else{
                console.log(result);
            }
        })
    }
    readSheet(e){
        var file = e.target.files[0];       
        var reader = new FileReader();
        var name = file.name;
        var rows = 0
        var workSheet = reader.onload = function(e) {
            let data = e.target.result;
            let importSheet = XLSX.read(data, {type: 'binary'});
            let sheetName = importSheet.SheetNames[0];
            let productSheet = importSheet.Sheets[sheetName];
            console.log(productSheet);
            let numberArray = ['0', '1', '2', 
            '3', '4', '5', '6', '7', '8', '9']; 
            let letterArray = ['A', 'B', 'C', 'D', 
            'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
            'U', 'V', 'X', 'Y', 'Z'];
            let propArray = [''];
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
                            productsArray[row-3] = {sku:productSheet[key].v.toString(), details:[{name: "Altura (cm)", detail: ""}, {name: "Largura (cm)", detail: ""}, {name: "Comprimento (cm)", detail: ""}, {name: "Peso (kg)", detail: ""}], category:[{name: "", slug: ""}, {name: "", slug: ""}, {name: "", slug: ""}], name:'', brand:'', price:'0', stock_quantity:0, tags:[]};
                            break;
                        case 'B':
                            productsArray[row-3].name = productSheet[key].v.toString();
                            break;
                        case 'C':
                            productsArray[row-3].brand = productSheet[key].v.toString();
                            break;
                        case 'D':
                            productsArray[row-3].details[0] = ({name:'Altura (cm)', detail:productSheet[key].v.toString()});
                            break;
                        case 'E':
                            productsArray[row-3].details[1] = ({name:'Largura (cm)', detail:productSheet[key].v.toString()});
                            break;
                        case 'F':
                            productsArray[row-3].details[2] = ({name:'Comprimento (cm)', detail:productSheet[key].v.toString()});
                            break;
                        case 'G':
                            productsArray[row-3].details[3] = ({name:'Peso (kg)', detail:productSheet[key].v.toString()});
                            break;
                        case 'H':
                            productsArray[row-3].price = productSheet[key].v.toString();
                            break;
                        case 'I':
                            productsArray[row-3].stock_quantity = parseInt(productSheet[key].v);
                            break;
                        case 'J':
                            let category = productSheet[key].v.split(';');
                            let categories = [];
                            for(let i=0; i<3; i++){
                                if (category[i][0] == ' '){ 
                                    category[i] = category[i].substr(1); 
                                }
                                if (category[i][category.length - 1] == ' '){ 
                                    category[i] = category[i].substring(0, category[i].length - 1);
                                }
                                category[i] = category[i].charAt(0).toUpperCase() + category[i].slice(1);
                                let slug = category[i].replace(/\ /gi, '-').toLowerCase()
                                slug = removeAccents(slug);
                                categories.push({name:category[i], slug:slug});
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
            console.log(productsArray);  
        };        
        reader.readAsBinaryString(file); 
    }
    render(){        
        return(
        <div>
            <label htmlFor="upload">Parse File: </label>
            <input type="file" id="upload" onChange={(e)=>{this.readSheet(e)}}/>
	        <div id="out"></div>
	        <button id="dnload" disabled={true}>Generate Worksheet</button>
        </div>);
    }
}
export default ExcelImport;