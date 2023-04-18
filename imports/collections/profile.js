import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Email_HTML from './emails/emails';

Meteor.methods({
    'profile.forgetPassword': function(email){
      let user = Meteor.users.findOne({'username': email});
      let resetToken = {
        token: '',
        date: new Date,
        valid: true
      };
      if (!user){ 
        throw new Meteor.Error('1001', 'Não foi encontrado nenhum usuário com este endereço de email.'); 
      }
      if (user.resetToken){
        let token = user.resetToken;
        let now = (new Date).getTime()/1000/60;
        if (now - token.date.getTime()/1000/60 < 15){
          throw new Meteor.Error('1002', 'Aguarde o e-mail com instruções para recuperação da conta, isto pode levar alguns minutos.');
        }
      }
      for (let i=0; i<7; i++){ resetToken.token += Math.random(0).toString(36).slice(-10); }
      let name = user.profile.name.trim().split(' ');
      name = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
      /*let data = {
        name: name,
        to: name + ' <' + email + '>',
        from: 'MateriaisON <contato@materiaison.com.br>',
        subject: 'Solicitação para alteração de senha',
        resetLink: 'http://materiaison.meteorapp.com/redefinir-senha/'+resetToken.token
      }
      let htmlMail = new Email_HTML(data, 'forgetPassword');*/    
      Meteor.users.update({'_id': user._id}, {$set:{'resetToken': resetToken}});
      return true
    }   
    
})
export const Profile = Meteor.users;