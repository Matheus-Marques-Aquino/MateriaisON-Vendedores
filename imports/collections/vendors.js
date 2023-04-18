import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { VendorsOnHold } from './vendors_onhold';
Meteor.methods({
    'admin.update.vendor': function(pack){
        let admin = Meteor.users.findOne({'_id': Meteor.userId()});
        if (!admin){ throw new Meteor.Error('0000', 'Você não tem permissão para executar essa ação.'); }
        if (!admin.profile){ throw new Meteor.Error('0000', 'Você não tem permissão para executar essa ação.'); }
        if (!admin.profile.roles){ throw new Meteor.Error('0001', 'Você não tem permissão para executar essa ação.'); }
        if (!admin.profile.roles.includes('admin')){ throw new Meteor.Error('0000', 'Você não tem permissão para executar essa ação.'); }
        let onHold = false;
        let swap = false;
        let vendor = Vendors.findOne({'_id': pack._id});
        if (!vendor){ vendor = VendorsOnHold.findOne({'_id': pack._id}); onHold = true; }
        if (!vendor){  throw new Meteor.Error('0002', 'Não foi possível identificar o vendedor.'); }
        if ((!pack.verified && !onHold) || (pack.verified && onHold)){ swap = true; }
        if (!onHold){
            vendor = Vendors.update({'_id': pack._id}, { $set:{'display_name':pack.display_name, 'color':pack.color, 'email':pack.email, 'cpf':pack.cpf, 'cnpj':pack.cnpj, 'phone':pack.phone, 'cellphone':pack.cellphone, 'razaoSocial':pack.razaoSocial, 'verified':pack.verified, 'displayOnly':pack.displayOnly, 'limitedAccess':pack.limitedAccess, 'permaHidden':pack.permaHidden, 'perfilLock':pack.perfilLock}});
        }else{
            vendor = VendorsOnHold.update({'_id': pack.id}, { $set:{'display_name':pack.display_name, 'color':pack.color, 'email':pack.email, 'cpf':pack.cpf, 'cnpj':pack.cnpj, 'phone':pack.phone, 'cellphone':pack.cellphone, 'razaoSocial':pack.razaoSocial, 'verified':pack.verified, 'displayOnly':pack.displayOnly, 'limitedAccess':pack.limitedAccess, 'permaHidden':pack.permaHidden, 'perfilLock':pack.perfilLock}});
        }
        if (!swap){ return; }
        if (!onHold){
            vendor = Vendors.findOne({'_id': pack._id});
            if (!vendor){ throw new Meteor.Error('0003', 'Ocorreu um erro ao atualizar o perfil do vendedor.'); }
            VendorsOnHold.insert(vendor);
            Vendors.remove({'_id': pack._id });
        }else{
            vendor = VendorsOnHold.findOne({'_id': pack._id});
            if (!vendor){ throw new Meteor.Error('0004', 'Ocorreu um erro ao atualizar o perfil do vendedor.'); }
            Vendors.insert(vendor);
            VendorsOnHold.remove({'_id': pack._id });
        }
    },   
});
export const Vendors = new Mongo.Collection('vendors');