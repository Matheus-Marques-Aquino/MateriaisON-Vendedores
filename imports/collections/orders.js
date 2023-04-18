import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Vendors } from './vendors';
Meteor.methods({
    'order.update.tranckingCode': function(pack){
        let trackingCode = pack.trackingCode;
        let order = Orders.findOne({'order_id': pack.order_id});
        let delivery = order.delivery;
        if (delivery.trackingCode == trackingCode){ return; }
        delivery.trackingCode = trackingCode;
        let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
        if (order.vendor_id != vendor._id){ throw new Meteor.Error('0000', 'Ocorreu um erro durante a validação do pedido.'); }
        return Orders.update({'order_id': pack.order_id}, {$set:{'delivery': delivery}});
    },
    'order.update.status': function(pack){
        let order = Orders.findOne({'order_id': pack.order_id});
        let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
        let orderStatus = ['Aguardando pagamento', 'Preparando pedido', 'Pedido em transporte', 'Pedido concluído', 'Pedido cancelado', 'Pagamento recusado'];
        if (order.vendor_id != vendor._id){ throw new Meteor.Error('0000', 'Ocorreu um erro durante a validação do pedido.'); }
        if (pack.status != 0 && pack.status != 1 && pack.status != 2 && pack.status != 3 && pack.status != 4 && pack.status != 5){
            throw new Meteor.Error('0001', 'Ocorreu um erro durante a validação do pedido.');
        }
        order.status.index = pack.status;
        order.status.name = orderStatus[pack.status];
        Orders.update({'order_id': pack.order_id}, {$set:{'status': order.status}});
        return {name: order.status.name, index: order.status.index};
    }
});
export const Orders = new Mongo.Collection('orders');