import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Vendors } from './vendors';
Meteor.methods({
    'message.insert': function(pack){
        let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
        let inbloxSession = OrderInbox.findOne({'order_id': pack.order_id});        
        /*if (!inbloxSession){
            let messages = [{
                from: 1,
                date: new Date(),
                message: pack.message
            }];
            OrderInbox.insert({'order_id': pack.order_id, 'vendor_id': Meteor.userId(), 'messages':messages});
            return;
        }*/
        let messages = inbloxSession.messages;
        messages.push({
            from: 0,
            date: new Date(),
            message: pack.message,
            type: 'text'
        });
        OrderInbox.update({'order_id': pack.order_id}, {$set:{'messages':messages}});
    },
    'image.insert': function(pack){
        let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
        let inbloxSession = OrderInbox.findOne({'order_id': pack.order_id});        
        /*if (!inbloxSession){
            let messages = [{
                from: 1,
                date: new Date(),
                message: pack.message
            }];
            OrderInbox.insert({'order_id': pack.order_id, 'vendor_id': Meteor.userId(), 'messages':messages});
            return;
        }*/
        let messages = inbloxSession.messages;
        messages.push({
            from: 0,
            date: new Date(),
            message: pack.message,
            type: 'image'
        });
        OrderInbox.update({'order_id': pack.order_id}, {$set:{'messages':messages}});
    }
})
export const OrderInbox = new Mongo.Collection('orderInbox');