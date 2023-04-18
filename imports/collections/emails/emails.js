import react, { Component } from 'react';
import { Email } from 'meteor/email';

class Email_HTML {
    constructor(data, type){
        switch(type){
            case 'internChangePassword':
                this.internChangePassword(data);
                break;
        }
    }
    internChangePassword(data){
        html = `
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
        </html>`
        this.sendMail(html, data); 
    }

    sendMail(html, data){
        let mail = {
            to: data.to,
            from: data.from,
            subject: data.subject,
            html: html
        }
        Email.send(mail);  
    }
}
export default Email_HTML;