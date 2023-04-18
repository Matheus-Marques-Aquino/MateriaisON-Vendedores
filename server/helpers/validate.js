import validateDate from 'validate-date';
import getAge from 'get-age';
class validate {
    constructor(){              
    }
    check(type, value, camp){
        switch(type){       
            case 'nome':
                if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value.length < 2){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (!(/^[A-zÀ-ú/\s]+$/.test(value))){ return {result: false, message: 'O campo '+camp+' não deve conter caracteres especiais.'}; }
                return {result: true, message: ''};
                break;
            case 'email':
                if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value.length < 3){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (!(value.includes('@') && value.includes('.'))){ return {result: false, message: 'O '+camp+' inserido não é inválido.'}; }
                return {result: true, message: ''};
                break;
            case 'deMaior':{
                if (validateDate(value, 'boolean', 'dd/mm/yyyy')){
                    let age = 0;
                    let date = value.split('/');
                    date = date[2]+'-'+date[1]+'-'+date[0];
                    age = getAge(date);
                    if (age > 17){ return {result: true, message: ''}; }  
                }
                return{result: false, message: 'O usuário deve ter ao menos 18 anos.'};
            }
            case 'cpf':
                if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(value))){ return {result: false, message: 'O campo '+camp+' inserido não é válido.'}; }
                return {result: true, message: ''};
                break;
            case 'cnpj':
                if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(value))){ return {result: false, message: 'O campo '+camp+' inserido não é válido.'}; }
                return {result: true, message: ''};
                break;
            case 'senha':
                if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value.length < 8){ return {result: false, message: 'Sua '+camp+' deve ter ao menos 8 caracteres'}; }
                return {result: true, message: ''};
                break;
            case 'telefone':
                if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
                if (value.length < 13){ return {result: false, message: 'O número de '+camp+' inserido não é valido.'}; }
                return {result: true, message: ''};
                break;
        }
    }
}
export default validate
