import validateDate from 'validate-date';
import getAge from 'get-age';

export const validator = (type, value, camp) => {
    let indexOf = -1;
    switch(type){       
        case 'nome':
            if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (value.length < 3){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (!(/^[A-zÀ-ú/\s]+$/.test(value))){ return {result: false, message: 'O campo '+camp+' não deve conter caracteres especiais.'}; }
            return {result: true, message: ''};
            break;
        case 'cep':
            if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (value.length < 9){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (/^(\d{5})-(\d{3})$/.test(value)){
                return {result: true, message: ''};
            }else{ 
                return {result: false, message: 'O campo '+camp+' é obrigatório.'}; 
            }            
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
        case 'email':
            if (!value){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (value == ''){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (value.length < 3){ return {result: false, message: 'O campo '+camp+' é obrigatório.'}; }
            if (!(value.includes('@') && value.includes('.'))){ return {result: false, message: 'O '+camp+' inserido não é inválido.'}; }
            return {result: true, message: ''};
            break;
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
        case 'UF':
            let UFs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
                'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
            let UF_LowerCase = [];
            UFs.map((UF)=>{ UF_LowerCase.push( UF.toLowerCase() ) });
            console.log(value.toLowerCase())
            indexOf = UF_LowerCase.indexOf( value.toLowerCase() );
            if (indexOf > -1){ return {result: indexOf, message: ''}; }else{ return {result: -1, message: 'Não foi encontrado esta sigla de estado'}; }
            break;
        case 'estado':
            let estados = ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 
            'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 
            'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 
            'São Paulo', 'Sergipe', 'Tocantins'];    
            let estados_LowerCase = [];            
            estados.map((estado)=>{ 
                let formated = estado.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                estados_LowerCase.push(formated);
            });
            let value_LowerCase = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            indexOf = (estados_LowerCase.indexOf( value_LowerCase ))
            if (indexOf > -1){ return {result: indexOf, message: ''}; }else{ return {result: -1, message: 'Verifique se o estado foi digitado corretamente.'}; }
            return;
            break;
        
        case 'estado':
    }
}