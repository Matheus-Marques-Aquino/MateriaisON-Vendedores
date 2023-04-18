import react, { Component } from 'react';
import { Email } from 'meteor/email';

class Email_HTML {
    constructor(data, type){
        switch(type){
            case 'joinOurTeam':
                this.joinOurTeam(data);
                break;
            case 'vendorContact':
                this.vendorContact(data);                
                break;
            case 'internChangePassword':
                this.internChangePassword(data);
                break;
        }
    }
    joinOurTeam(data){
        let html=`
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-type" content="text/html; charset=UTF-8">  
            <meta name="color-scheme" content="light dark">
            <meta name="supported-color-schemes" content="light dark">
            <style type="text/css">
                :root {
                    color-scheme: light dark;
                    supported-color-schemes: light dark;
                }
            </style>        
            <style type="text/css">
                @media (prefers-color-scheme: dark ) {                    
                    .body: { 
                        #FFFFFF !important; 
                    }    
                    div: { 
                        backgrouns-color: #ffffff !important; 
                    }                    
                    .darkMode_whiteText: {
                        color: #FFFFFF !important;
                    }

                }
            </style>
        </head>
        <html style='width:100%; background-color:white !important;'>
            <body style='width:100%; background-color:white !important; font-family:Chivo, Tahoma, Sans-serif; margin:0px'>
                <div style='max-width:100%; margin:0 auto; background-color:white !important; '>
                    <div style='width:100%; height:220px; border-bottom: 1px solid #ff7000; background-color:white !important; display: flex;' bgcolor=”#000000”>
                        <img src='https://imagens.materiaison.com.br/wp-content/uploads/2020/08/D9kES.png' style='margin: auto; width: 220px; max-width: 220px;'/>
                    </div>
                    <div style='height:310px; max-width:560px; margin:0 auto; display:flex;'>
                        <div style='width:fit-content; height:fit-content; margin:auto; text-align:center;'>
                            <div style='font-size:18px; margin-bottom:45px;'>Seja bem-vindo a MateriaisON</div>
                            <div style='font-size:14px; margin-bottom:30px;'>Obrigado por se cadastrar em nossa plataforma ` + data.name + `!</div>
                            <div style='font-size:14px;'>Aguarde enquanto verificamos seus dados cadastrados, em breve entraremos em contato.</div>
                        </div>
                    </div>
                    <div style='width:100%; height:150px; border-bottom:1px solid #FFDBBF; border-top:1px solid #FFDBBF; display:flex'>
                        <div style='height:fit-content; margin:auto;'>
                            <div style='font-size:15px; color:#ff7000; font-weight:bold; text-align:center;'>
                                ACOMPANHE NOSSAS REDES SOCIAIS:
                            </div>
                            <div style='text-align:center; height:45px; margin:0 auto; margin-top:25px'>
                                <a href='https://facebook.com/materiaison.online' target="_blank " style='text-decoration:none;'>
                                    <img src='https://imagens.materiaison.com.br/wp-content/uploads/2020/06/zImcM.png' style='width:45px; height:45px; margin-right:25px;'>
                                </a>
                                <a href='https://instagram.com/materiaison_' target="_blank" style='text-decoration:none;'>
                                    <img src='https://imagens.materiaison.com.br/wp-content/uploads/2020/06/PGTtN.png' style='width:45px; height:45px'>
                                </a>
                            </div>
                        </div>                    
                    </div>
                    <div style='max-width:400px; height:240px; margin:50px auto; background-color:#ff7000; border-radius: 10px; display:flex'>
                        <div style='height:fit-content; font-size: 14px; color: white; margin:auto'>
                            <div class='darkMode_whiteText' style='font-size:16px; color: white; font-weight:bold; text-align:center; color:#FFFFFF !important;'>Dúvidas?</div>
                            <div class='darkMode_whiteText' style='width:250px; line-height:19px; padding-top:25px; padding-bottom:25px; font-size:15px; text-align:center; text-decoration:none;'>
                                Envie um e-mail para: <a style='text-decoration:none !important;  color:#FFFFFF !important;'>contato@materiaison.com.br</a>
                            </div>
                            <div style='width:150px; margin-left:50px;'>
                                <div style='width:fit-content; height:20px; display:flex'>
                                    <img src='https://imagens.materiaison.com.br/wp-content/uploads/2020/06/5GqOI.png' style='width:20px; height:20px; margin:auto 0;'>
                                    <div class='darkMode_whiteText' style='padding-left:5px; color:#FFFFFF !important;'>(11) 99510-7345</div>
                                </div>
                                <div style='width:fit-content; height:20px; display:flex'>
                                    <img src='https://imagens.materiaison.com.br/wp-content/uploads/2020/06/Wb7E6.png' style='width:20px; height:20px; margin:auto 0;'>
                                    <div class='darkMode_whiteText' style='padding-left:5px; color:#FFFFFF !important;'>(11) 4226-7099</div>
                                </div>
                                <div style='width:fit-content; height:20px; display:flex'>
                                    <img src='https://imagens.materiaison.com.br/wp-content/uploads/2020/06/Wb7E6.png' style='width:20px; height:20px; margin:auto 0;'>
                                    <div class='darkMode_whiteText' style='padding-left:5px; color:#FFFFFF !important;'>(11) 4318-7223</div>
                                </div>
                            </div>
                        </div>
                    </div>            
                </div>
            </body>
        </html>        
        `;
        this.sendMail(html, data);
    }
    internChangePassword(data){
        let html = `
        <html style='width:100%; background-color:#FFFFFF;'>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-type" content="text/html; charset=UTF-8"> 
            </head>
            <body style='width:100%; margin:0px; background-color:#FFFFFF; margin:0px;'>
                <table cellspacing='0' cellpadding='0' style='width:100%; max-width:625px; margin: 0 auto; border: 1px solid #FFDBBF; background-color: #FFFFFF; font-family:Tahoma, Sans-serif;'>
                    <tr>
                        <td style='border-bottom: 1px solid #FFDBBF; text-align: center;'>                    
                            <img width='100%' style='max-width: 220px; border: 0px;' src='https://materiaison-email-marketing.s3.amazonaws.com/Logo-news.png'/>                    
                        </td>
                    </tr>
                    <tr>
                        <td style='padding:20px 10px 30px; text-align: center; font-size: 11pt; font-family:sans-serif; color: #777;'>                    
                            Este é um e-mail automático, não é necessário respondê-lo.
                        </td>
                    </tr>
                    <tr>
                        <td style='padding:0px 10px 20px; text-align:left; font-size: 12pt; font-family:sans-serif; color:#333333;'>                    
                            <div style='max-width:530px; margin:0 auto;'>Olá, ` + data.name + `. Tudo bem?</div>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding:0px 10px 60px; text-align:justify; font-size: 12pt; font-family:sans-serif; color: #333333;'>                    
                            <div style='max-width:530px; margin:0 auto;'>Sua senha foi alterada com sucesso através de seu painel de controle!</div>
                        </td>
                    </tr>
                    <tr>
                        <td style='max-width:600px; padding:0px 10px 10px; text-align: center; font-size: 11pt; font-family:sans-serif; color: #333333;'>                    
                            <b>Não foi você quem alterou a senha?</b>
                        </td>
                    </tr>
                    <tr>
                        <td style='max-width:600px; padding:0px 10px 30px; text-align: center; font-size: 11pt; font-family:sans-serif; color: #333333;'>                    
                            Envie um e-mail para: contato@materiaison.com.br
                        </td>
                    </tr>
                    <tr>
                        <td style='width: 100%; padding:20px 0; border-top :1px solid #FFDBBF; font-size: 11pt; font-family: sans-serif; color: #333333; text-align:center;'>                    
                            Siga nossas redes sociais:               
                        </td>
                    </tr>
                    <tr>
                        <td style='width: 100%; padding-bottom:20px; font-size: 12pt; font-family: sans-serif; color: #333333; text-align:center;'>                    
                            <div style='width:80px; height:25px; padding:0 5px; margin:0 auto; display:flex; background-image:url(https://materiaison-email-marketing.s3.amazonaws.com/socialBackground_2.png); background-repeat: no-repeat; background-size: contain; background-position: center;'>
                                <a href='https://api.whatsapp.com/send?phone=5511995107345' target="_blank" style='text-decoration:none; margin:0px 4px 5px 2px'>
                                    <img width='20px' height='20px' src='https://materiaison-email-marketing.s3.amazonaws.com/icon-whatsapp.png'>     
                                </a>
                                <a href='https://facebook.com/materiaison.online' target="_blank" style='text-decoration:none; margin:0px 4px 5px 2px'>
                                    <img width='20px' height='20px' src='https://materiaison-email-marketing.s3.amazonaws.com/zImcM.png'>  
                                </a>
                                <a href='https://instagram.com/materiaison_' target="_blank" style='text-decoration:none; margin:0px 2px 5px 4px'>
                                    <img width='20px' height='20px' src='https://materiaison-email-marketing.s3.amazonaws.com/PGTtN.png'> 
                                </a>
                            </div>      
                        </td>
                    </tr>
                    <tr>
                        <td style='width: 100%; height:32.5px; margin-top:25px; font-size: 14pt; font-family: sans-serif; color: #FFFFFF; text-align:center; background-color:#FF7000;'>                    
                            <div style='max-width:270px; margin:auto; margin-top:17.5px;'>
                                <img width='100%' style='padding-bottom:17.5px' src='https://materiaison-email-marketing.s3.amazonaws.com/LINK+CONTRU%C3%87%C3%83O.png'/>
                            </div>
                        </td>
                    </tr>
                </table> 
            </body>
        </html> `       
        this.sendMail(html, data);
    }
    vendorContact(data){
        let user = data.user;
        let perfil = '';
        let createdAt = user.createdAt;
        let day = (user.createdAt.getDate().toString().length == 1) ? '0'+user.createdAt.getDate().toString() : user.createdAt.getDate().toString();
        let month = (user.createdAt.getMonth().toString().length == 1) ? '0'+user.createdAt.getMonth().toString() : user.createdAt.getMonth().toString();
        let year = user.createdAt.getFullYear().toString();     
        createdAt = day + '/' + month + '/' + year;

        if (user.profile.roles.includes('vendor') && user.profile.roles.includes('service')){
            perfil = 'Vendedor e Prestador de Serviço';
        }else{
            if (user.profile.roles.includes('vendor')){
                perfil = 'Vendedor';
            }else{
                if (user.profile.roles.include('service')){
                    perfil = 'Prestador de Servidor';
                }else{
                    perfil = 'Perfil não identificado';
                }
            }
        }
        let html = `
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-type" content="text/html; charset=UTF-8"> 
        </head>
        <html style='width:100%;'>
            <body style='width:100%; background-color:white; font-family:Chivo, Tahoma, Sans-serif; margin:0px'>
                <div style='width: fit-content; width: 100%; max-width: 400px; margin: 0 auto;'}>
                    <table style="border:1px solid #CCCCCC; margin:0 auto;" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#FFFFFF">
                                <div style="padding: 2px 5px">Usuário: ` + user.profile.fullName + `</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#F0F0F0">
                                <div style="padding: 2px 5px">Identificação do usuário: ` + user._id + `</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#FFFFFF">
                                <div style="padding: 2px 5px">Identificação de perfil: ` + user.profile.id + `</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#F0F0F0">
                                <div style="padding: 2px 5px">CPF: ` + user.profile.cpf + `</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#FFFFFF">
                                <div style="padding: 2px 5px">CNPJ: ` + user.profile.cnpj + `</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#F0F0F0">
                                <div style="padding: 2px 5px">Perfil: ` + perfil + `</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#FFFFFF">
                                <div style="padding: 2px 5px">Data do registro: ` + createdAt + `</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#F0F0F0">
                                <div style="padding: 2px 5px 0px 5px; color: black">Mensagem:</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="100%" valign="top" align="left" bgcolor="#F0F0F0">
                                <div style="padding: 0px 5px 2px 10px; color: black">` + data.message + `</div>
                            </td>
                        </tr>
                    </table>
                
                    <div style="width: 100%'; height: fit-content;" bgcolor="#F0F0F0"</div>
                    <div style="width: 100%'; min-height:30px; background-color:yellow;"></div>
                    <div style="width: 100%'; height: fit-content;" bgcolor="#F0F0F0"></div>
                    <div style="width: 100%'; height: fit-content;" bgcolor="#FFFFFF"></div>
                    <div style="width: 100%'; height: fit-content;" bgcolor="#F0F0F0"></div>
                    <div style="width: 100%'; height: fit-content;" bgcolor="#FFFFFF"></div>
                    <div style="width: 100%'; height: fit-content;" bgcolor="#F0F0F0"></div>   
                    <div style="width: 100%'; height: fit-content;" bgcolor="#FFFFFF"></div>             
                </div> 
            </body>
        </html>
        `;
        console.log(html)
        this.sendMail(html, data);
    }
    sendMail(html, data){
        let mail = {
            to: data.to,
            from: data.from,
            subject: data.subject,
            html: html
        }
        if (data.to.includes('@materiaison.com.br') && data.to != 'contato@materiaison.com.br'){ console.log('A'); return; }
        Email.send(mail);  
    }
}
export default Email_HTML;