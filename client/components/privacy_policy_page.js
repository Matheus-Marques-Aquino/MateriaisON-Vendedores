import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import VendorFooter from './subcomponents/vendor_footer';
class PrivacyPolicyPage extends Component{
    constructor(props){
        super(props);        
    }
    MateriaisON(){
        return(
        <span style={{color:'black', fontWeight:'600'}}>
            Materiais<span style={{color:'#ff7000'}}>ON</span>
        </span>)
    }
    render(){        
        return(
        <div style={{width:'100%'}}>
            <MainHeader/>        
            <div style={{maxWidth:'900px', margin:'0 auto'}}>
                <div style={{width:'100%', paddingBottom:'10px', fontSize:'12px'}}></div>
                <div style={{width:'100%', height:'70px', fontSize:'13px', fontWeight:'600', textAlign:'center', display:'flex'}}>
                    <div style={{margin:'auto'}}>POLÍTICA DE PRIVACIDADE E SEGURANÇA DE DADOS</div>
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    A {this.MateriaisON()} se preocupa com seus usuários, por isso trabalha com recursos 
                    tecnológicos de segurança na Internet para garantir total privacidade e segurança aos seus 
                    clientes. Ao acessar e usar o site, você concorda com essa política e autoriza a {this.MateriaisON()} a 
                    coletar, processar e armazenar seus dados para os fins descritos aqui.
                </div>
                <div style={{margin:'0 15px', paddingBottom:'20px', fontSize:'13px', lineHeight:'20px'}}>
                    Caso você não concorde com qualquer item dessa política, por favor, não acesse o site nem 
                    utilize os nossos serviços.
                </div>
                <div style={{height:'50px', fontSize:'13px', fontWeight:'600', display:'flex'}}>
                    <div style={{margin:'auto 10px', marginLeft:'25px'}}>1.</div>
                    <div style={{margin:'auto 0'}}>COLETA E USO DE DADOS PESSOAIS</div>                
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    Os dados pessoais de nossos usuários são coletados a partir da adesão voluntária ao site da {this.MateriaisON()}.
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    <span>
                        <span style={{fontWeight:'bold'}}>• Dados Cadastrais coletados: </span>
                        <span>Nome completo; Razão Social; CPF/CNPJ; Data de nascimento; E-mail; Telefones e Endereços (entrega e cobrança).</span>
                    </span>
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    <span>
                        <span style={{fontWeight:'bold'}}>• Dados Cadastrais coletados: </span>
                        <span>Nome completo; Razão Social; CPF/CNPJ; Data de nascimento; E-mail; Telefones e Endereços (entrega e cobrança).</span>
                    </span>
                </div>
                <div style={{margin:'0 15px', fontSize:'13px', lineHeight:'20px'}}>
                    <span>
                        <span style={{fontWeight:'bold'}}>• Dados de Identificação Digital coletados: </span>
                        <span>Endereço IP e porta lógica de origem; Registros de interações com o site; Conta de acesso e Geolocalização*.</span>                                       
                    </span>                
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'10px', color:'grey'}}>
                    * A maioria dos dispositivos permite que você navegue de forma anônima e desligue a 
                    opção de geolocalização, recomendamos que você visite a seção de configurações dos 
                    seus navegadores e dispositivos para escolher a opção que melhor te atenda.
                </div>
                <div style={{margin:'0 15px', fontSize:'13px', lineHeight:'20px'}}>
                    <span>
                        <span style={{fontWeight:'bold'}}>• Cookies: </span>
                        <span>
                            São dados armazenados no seu computador, vindos de nosso servidor, para ajudar na 
                            coleta de informações sobre sua navegação e suas preferências de navegação.
                        </span>                                       
                    </span>                
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'10px', color:'grey'}}>
                    *Você pode, a qualquer momento, ajustar as 
                    configurações da privacidade de seu navegador e bloquear os cookies ou impedir que seu 
                    navegador aceite novos cookies.
                </div>
                <div style={{height:'50px', fontSize:'13px', fontWeight:'600', display:'flex'}}>
                    <div style={{margin:'auto 10px', marginLeft:'25px'}}>2.</div>
                    <div style={{margin:'auto 0'}}>COMPARTILHAMENTO DOS DADOS PESSOAIS</div>                
                </div>
                <div style={{margin:'0 15px', paddingBottom:'15px', fontSize:'13px', lineHeight:'20px'}}>
                    A {this.MateriaisON()} informa que compartilha os dados de endereços de nossos usuários com 
                    parceiros e fornecedores autorizados para atendimento no processo de compras através do 
                    nosso site, somente após a finalização da compra.
                </div>
                <div style={{margin:'0 15px', fontWeight:'bold', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    • Subcontratação:
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    A {this.MateriaisON()} tem como subcontratado o serviço de processamento e armazenamento de 
                    dados, então gostaríamos de deixá-los cientes sobre o acesso e tratamento de Dados 
                    Pessoais por terceiros, cuja contratação tenha por objeto, garantir a eficiência dos 
                    serviços a serem prestados.
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    A {this.MateriaisON()} se compromete a subcontratar serviços de processamento e armazenamento 
                    de dados somente de empresas com a respectiva especialidade, garantindo todos os 
                    direitos do titular dos dados e impondo regras e responsabilidades ao operador subcontratado.
                </div>
                <div style={{height:'50px', fontSize:'13px', fontWeight:'600', display:'flex'}}>
                    <div style={{margin:'auto 10px', marginLeft:'25px'}}>3.</div>
                    <div style={{margin:'auto 0'}}>SEGURANÇA DOS DADOS</div>                
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    A {this.MateriaisON()} se empenhará na proteção da informação, aplicando as medidas de 
                    proteção administrativas e técnicas necessárias e disponíveis, exigindo de seus 
                    fornecedores o mesmo nível de segurança da informação.
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    Todavia, considerando que nenhum sistema de segurança é infalível, a {this.MateriaisON()} se 
                    exime de qualquer responsabilidade por eventuais danos e/ou prejuízos decorrentes de 
                    falhas, vírus ou invasões de seu banco de dados, e demais atos ilícitos praticados por 
                    terceiros.
                </div>
                <div style={{margin:'0 15px', fontSize:'13px', fontWeight:'bold', lineHeight:'20px'}}>
                    Links de terceiros
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    É importante destacar que você poderá ser conduzido via link a portais ou outras 
                    plataformas, que poderão coletar suas informações e ter sua própria Política de 
                    Privacidade, cabendo a cada um compreender ou desconsiderar.
                </div>
                <div style={{height:'50px', fontSize:'13px', fontWeight:'600', display:'flex'}}>
                    <div style={{margin:'auto 10px', marginLeft:'25px'}}>4.</div>
                    <div style={{margin:'auto 0'}}>ARMAZENAMENTO DOS DADOS E REGISTROS</div>                
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    Os dados pessoais coletados e os registros de atividades são armazenados em ambiente 
                    seguro e controlado pelo prazo exigido por lei, considerando:
                </div>
                <div style={{margin:'0 15px', fontSize:'13px', lineHeight:'20px'}}>
                    <span>
                        <span style={{fontWeight:'bold'}}>• Dados cadastrais: </span>
                        <span>
                            5 anos após o término da relação (Art. 12 e 34 do Código de Defesa do Consumidor).
                        </span>                                       
                    </span>                
                </div>
                <div style={{margin:'0 15px', fontSize:'13px', lineHeight:'20px'}}>
                    <span>
                        <span style={{fontWeight:'bold'}}>• Dados de identificação digital: </span>
                        <span>
                            6 meses (Art. 15, Marco Civil da Internet).
                        </span>                                       
                    </span>                
                </div>
                <div style={{margin:'0 15px', fontSize:'13px', lineHeight:'20px'}}>
                    <span>
                        <span style={{fontWeight:'bold'}}>• Demais dados: </span>
                        <span>
                            Enquanto durar a relação e não houver pedido de apagamento ou revogação de 
                            consentimento (Art. 9, Inciso II da Lei Geral de Proteção de Dados Pessoais).
                        </span>                                       
                    </span>                
                </div>
                <div style={{height:'50px', fontSize:'13px', fontWeight:'600', display:'flex'}}>
                    <div style={{margin:'auto 10px', marginLeft:'25px'}}>5.</div>
                    <div style={{margin:'auto 0'}}>INFORMAÇÕES GERAIS</div>                               
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    A {this.MateriaisON()} tem o direito de alterar o teor desta Política de Privacidade a qualquer 
                    momento, conforme necessidade, tal qual para adequação e conformidade legal.
                </div>
                <div style={{margin:'0 15px', paddingBottom:'10px', fontSize:'13px', lineHeight:'20px'}}>
                    Ocorrendo atualizações neste documento e que demandem nova coleta de consentimento, 
                    a {this.MateriaisON()} notificará os usuários pelos meios de contato que fornecidos no cadastro.
                </div> 
            </div>
            <VendorFooter />
        </div>)
    }
}
export default PrivacyPolicyPage;