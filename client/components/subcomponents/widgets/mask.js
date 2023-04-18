export const mask = (type, value) => {
    switch(type){       
        case 'cpf':
            return value
            .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
            .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
            break;

        case 'cnpj':
            return value
            .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
                .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')            
            break;
            
        case 'cpf/cnpj':
            if (value.length>14){
                return value
                .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
                .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')
            }else{
                return value
                .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
                .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{3})(\d)/, '$1')
            }
            break;

        case 'cep':
            return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1')
            break;

        case 'birthday':
            return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1')
            break;

        case 'phone':
            value = value.replace(/\D/g, '');
            console.log(value +' > '+ value.length);            
            if (value.length > 10){
                return value
                .replace(/\D/g, '')
                .replace(/(\d{1})(\d)/, '($1$2)')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(\d{5})(\d)/, '$1')
                .slice(0, 14);
            }
            if (value.length > 3){
                return value
                .replace(/\D/g, '')
                .replace(/(\d{1})(\d)/, '($1$2)')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(\d{6})(\d)/, '$1');
            }
            if (value.length > 2){
                return value
                .replace(/\D/g, '')
                .replace(/(\d{1})(\d)/, '($1$2)');
            }            
            if (value.length > 0){
                return value
                .replace(/\D/g, '')
                .replace(/(\d{0})(\d)/, '($1$2');
            }
            if (value.length == 0){
                return value
                .replace(/\D/g, '');
            }
            return value.slice(0, 15);
            break;

        case 'validate':
            return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2') 
            .replace(/(\d{2})(\d)/, '$1')           
            break;
            
        case 'creditCard':
            return value
            .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
            .replace(/(\d{4})(\d)/, '$1 $2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
            .replace(/(\d{4})(\d)/, '$1 $2')
            .replace(/(\d{4})(\d{1,2})/, '$1 $2')
            .replace(/( \d{4})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
            break;
        case 'money':
            return value
            .replace(/\D/g, '')
            .replace(/(\d)(?!.*\d{2})/, ',$1')
            break;
        case 'stock':
            return value
            .replace(/\D/g, '')
            .replace('e', '')
            .replace('.', '')
            .replace(',', '')
            .replace(/(\d)(\d)/, '$1$2')
            break;
    }
}
    