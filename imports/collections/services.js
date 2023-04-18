import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { ServicesOnHold } from './services_onhold'

Meteor.methods({
    'admin.update.service': function(pack){
        let admin = Meteor.users.findOne({'_id': Meteor.userId()});
        if (!admin.profile){ throw new Meteor.Error('0000', 'Você não tem permissão para executar essa ação.'); }
        if (!admin.profile.roles){ throw new Meteor.Error('0001', 'Você não tem permissão para executar essa ação.'); }
        if (!admin.profile.roles.includes('admin')){ throw new Meteor.Error('0000', 'Você não tem permissão para executar essa ação.'); }
        let onHold = false;
        let swap = false;
        let service = Services.findOne({'_id': pack._id});
        if (!service){ service = ServicesOnHold.findOne({'_id': pack._id}); onHold = true; }
        if (!service){  throw new Meteor.Error('0002', 'Não foi possível identificar o prestador.'); }
        if ((!pack.verified && !onHold) || (pack.verified && onHold)){ swap = true; }
        if (!onHold){
            service = Services.update({'_id': pack._id}, { $set:{'display_name':pack.display_name, 'color':pack.color, 'email':pack.email, 'birthday':pack.birthday, 'cpf':pack.cpf, 'cnpj':pack.cnpj, 'phone':pack.phone, 'cellphone':pack.cellphone, 'verified':pack.verified, 'permaHidden':pack.permaHidden}});
        }else{
            service = ServicesOnHold.update({'_id': pack.id}, { $set:{'display_name':pack.display_name, 'color':pack.color, 'email':pack.email, 'birthday':pack.birthday, 'cpf':pack.cpf, 'cnpj':pack.cnpj, 'phone':pack.phone, 'cellphone':pack.cellphone, 'verified':pack.verified, 'permaHidden':pack.permaHidden}});
        }
        if (!swap){ return; }
        if (!onHold){
            service = Services.findOne({'_id': pack._id});
            if (!service){ throw new Meteor.Error('0003', 'Ocorreu um erro ao atualizar o perfil do prestador.'); }
            ServicesOnHold.insert(service);
            Services.remove({'_id': pack._id });
        }else{
            service = ServicesOnHold.findOne({'_id': pack._id});
            if (!service){ throw new Meteor.Error('0004', 'Ocorreu um erro ao atualizar o perfil do prestador.'); }
            Services.insert(service);
            ServicesOnHold.remove({'_id': pack._id });
        }
    }   
});
export const Services = new Mongo.Collection('services');