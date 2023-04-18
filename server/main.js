import { Meteor } from 'meteor/meteor';
import validate from './helpers/validate';
import { Products } from '../imports/collections/products'
import { Vendors } from '../imports/collections/vendors';
import { VendorsOnHold } from '../imports/collections/vendors_onhold';
import { ProductsOnHold } from '../imports/collections/products_onhold';
import { Services } from '../imports/collections/services';
import { ServicesOnHold } from '../imports/collections/services_onhold';
import { DocumentList } from '../imports/collections/document_list';
import { useReducer } from 'react';
import { BatchInsert } from '../imports/collections/batch_insert';
import { ServiceInbox } from '../imports/collections/service_inbox';
import { IncompleteProducts} from '../imports/collections/incomplete_products';
import { EmailsOnHold} from '../imports/collections/emails_onhold';
import Email_HTML from './emails';
import validateDate from 'validate-date';
import { Orders } from '../imports/collections/orders';
import { OrderInbox } from '../imports/collections/order_inbox';
import removeAccents from 'remove-accents';
//import VendorSettingsPage from '../client/components/vendor/vendor_settings_page';

Meteor.startup(() => {  
  /*Slingshot.createDirective('vendor-images', Slingshot.S3Storage, {
    maxSize: null,
    allowedFileTypes: ['image/png', 'image/jpeg'],
    AWSAccessKeyId: 'AKIAS5AE4XHRQNI4J3MU',
    AWSSecretAccessKey: '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',
    bucket: 'materiaison-image',
    region: 'us-east-1',
    acl: 'public-read',  
    authorize: function(file, meta){
      return true;
    },
    key: function(file, meta){
      console.log(meta);
      console.log(file);
      return 'SligShot/teste1/' + file.name;
    }
  });*/
  s3_upload_settings = {
    maxSize: null, // unlimited for now!    
    AWSAccessKeyId: 'AKIAS5AE4XHRQNI4J3MU',
    AWSSecretAccessKey: '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',
    bucket: 'materiaison-image',
    region: 'us-east-1',
    acl: 'public-read',
    authorize: function(){
      if (!Meteor.userId){ return false; }
      return true
    },
    key: function( file ){      
      return 'uploads/' + file.name;
    }
  }
  images_settings_vendors = {
    allowedFileTypes: ['image/png', 'image/jpeg'],
    authorize: function(file, meta){
      console.log(file)
      if (!Meteor.userId){ throw new Meteor.Error('0000', 'Você deve estar logado para realizar esta ação.'); }
      if (!meta){ throw new Meteor.Error('0001', 'Ocorreu um erro ao subir sua imagem para o servidor.')}
      if (!meta.type){ throw new Meteor.Error('0002', 'Ocorreu um erro ao subir sua imagem para o servidor.')}
      if (!meta.folder){ throw new Meteor.Error('0003', 'Ocorreu um erro ao subir sua imagem para o servidor.')}
      return true
    },
    key: function( file, meta ){     
      let folder = '';    
      let fileType = file.type.split('/');
      let extension = '.'+fileType[fileType.length - 1];
      let fileName = '';
      switch (meta.type){
        case 'usersProfileFolder':
          folder = meta.folder + '/profile/';
          fileName = Math.random(0).toString().slice(-5) + extension;
          return 'vendors/'+ folder + fileName;
          break;
        case 'usersBannerFolder':
          folder = meta.folder + '/banner/';
          fileName = Math.random(0).toString().slice(-5) + extension;
          return 'vendors/'+ folder + fileName;
          break;
        case 'productsImageFolder':
          folder = meta.folder + '/';
          fileName = meta.id+'_'+Math.random(0).toString().slice(-5) + extension;
          return 'products/'+ folder + fileName;
          break;
        case 'chatImageFolder':
          folder = meta.folder + '/';
          fileName = meta.id+'_'+Math.random(0).toString().slice(-5) + extension;
          return 'chat/'+ folder + fileName;
          break;
        default:          
          if (!meta){ folder = 'others/'; }else{ folder = meta.folder + '/'; }          
          return 'vendors/'+ folder + '_' + Math.random(0).toString().slice(-5) + file.name;
          break;
      }      
    }
  }
  images_settings_services = {
    allowedFileTypes: ['image/png', 'image/jpeg'],
    authorize: function(file, meta){
      console.log(file)
      if (!Meteor.userId){ throw new Meteor.Error('0000', 'Você deve estar logado para realizar esta ação.'); }
      if (!meta){ throw new Meteor.Error('0001', 'Ocorreu um erro ao subir sua imagem para o servidor.')}
      if (!meta.type){ throw new Meteor.Error('0002', 'Ocorreu um erro ao subir sua imagem para o servidor.')}
      if (!meta.folder){ throw new Meteor.Error('0003', 'Ocorreu um erro ao subir sua imagem para o servidor.')}
      return true
    },
    key: function( file, meta ){     
      let folder = '';    
      let fileType = file.type.split('/');
      let extension = '.'+fileType[fileType.length - 1];
      let fileName = '';
      switch (meta.type){
        case 'usersProfileFolder':
          folder = meta.folder + '/profile/';
          fileName = Math.random(0).toString().slice(-5) + extension;
          return 'services/'+ folder + fileName;
          break;
        case 'usersBannerFolder':
          folder = meta.folder + '/banner/';
          fileName = Math.random(0).toString().slice(-5) + extension;
          return 'services/'+ folder + fileName;
          break;
        case 'usersGalleryFolder':
          folder = meta.folder + '/gallery/';
          fileName = meta.index + '_' + Math.random(0).toString().slice(-5) + '_' + Math.random(0).toString().slice(-5) + extension;
          return 'services/'+ folder + fileName;
        default:          
          if (!meta){ folder = 'others/'; }else{ folder = meta.folder + '/'; }          
          return 'services/'+ folder + '_' + Math.random(0).toString().slice(-5) + file.name;
          break;
      }      
    }    
  }
  product_images_settings = {
    allowedFileTypes: ['image/png', 'image/jpeg'],    
    key: function( file ){
      return 'productsPics/' + Math.random(0).toString().slice(-5) + file.name;
    }
  }
  documents_images_settings = {
    allowedFileTypes: ['image/png', 'image/jpeg'],
    key: function( file ){
      return 'documentsPics/' + Math.random(0).toString().slice(-5) + file.name;
    }
  }
  _.defaults(images_settings_vendors, s3_upload_settings);
  _.defaults(images_settings_services, s3_upload_settings);

  Slingshot.createDirective('vendor-images', Slingshot.S3Storage, images_settings_vendors);
  Slingshot.createDirective('service-images', Slingshot.S3Storage, images_settings_services);
  Slingshot.createDirective('product-images', Slingshot.S3Storage, images_settings_vendors);
  Slingshot.createDirective('chat-images', Slingshot.S3Storage, images_settings_vendors);

  Meteor.publish('OrderInbox', function(order_id){
    let vendor = Vendors.findOne({'vendor_id':Meteor.userId()});
    console.log(vendor._id);
    return OrderInbox.find({'order_id': order_id, 'vendor_id': vendor._id});
  })
  Meteor.publish('AllUsers', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return Meteor.users.find({});
  });
  Meteor.publish('AllVendors', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return Vendors.find({});
  });
  Meteor.publish('AllVendorsOnHold', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return VendorsOnHold.find({});
  });
  Meteor.publish('AllServices', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return Services.find({});
  });
  Meteor.publish('AllServicesOnHold', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return ServicesOnHold.find({});
  });
  Meteor.publish('AllProducts', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return Products.find({});
  });
  Meteor.publish('AllProductsOnHold', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return ProductsOnHold.find({});
  });
  Meteor.publish('AllIncompleteProducts', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return IncompleteProducts.find({});
  });
  Meteor.publish('AllOrders', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return Orders.find({});
  });
  Meteor.publish('AllOrderInbox', function(){
    let admin = Meteor.users.findOne({'_id': Meteor.userId()});
    if (!admin){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles){ return Meteor.users.find({'_id': 0})};
    if (!admin.profile.roles.includes('admin')){ return Meteor.users.find({'_id': 0})};
    return OrderInbox.find({});
  });
  Meteor.publish('ProfileSettings', function(){
    return Meteor.users.find({'_id': Meteor.userId()});
  });
  Meteor.publish('VendorProducts', function(){
    return Meteor.users.find({'_id': Meteor.userId()});
  });
  Meteor.publish('VendorSettings', function(){
    let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
    if (vendor){ return Vendors.find({'vendor_id': Meteor.userId()}); }
    return VendorsOnHold.find({'vendor_id': Meteor.userId()});
  });
  Meteor.publish('ServiceSettings', function(){
    let service = Services.findOne({'service_id': Meteor.userId()});
    if (service){ return Services.find({'service_id': Meteor.userId()}); }
    return ServicesOnHold.find({'service_id': Meteor.userId()});
  });
  Meteor.publish('ServiceInbox', function(_id){
    return ServiceInbox.find({'service_id': _id});
  });
  Meteor.publish('ProductsList', function(){
    let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
    if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()}); } 
    if (!vendor){vendor = {id: '-1'}} 
    return Products.find({'id_vendor': vendor.id.toString()})
  });
  Meteor.publish('ProductsOnHoldList', function(){
    let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
    if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()}); } 
    return ProductsOnHold.find({'id_vendor': vendor.id.toString()})
  });
  Meteor.publish('IncompleteProductsList', function(){
    let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
    if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()}); } 
    return IncompleteProducts.find({'id_vendor': vendor.id.toString()})
  });
  Meteor.publish('OrdersList', function(){
    let vendor = Vendors.findOne({'vendor_id': Meteor.userId()});
    if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id': Meteor.userId()}); } 
    return Orders.find({'vendor_id': vendor._id})
  });

  function MoutUser(_id, profile){
    let _profile = profile;
    if (!_profile.address){ _profile.address = []; } 
    if (!_profile.firstName){ _profile.firstName = '_____'; } 
    if (!_profile.lastName){ _profile.lastName = '_____'; } 
    if (!_profile.fullName){ _profile.fullName = '_____ _____'; } 
    if (!_profile.cpfCnpj){ _profile.cpfCnpj = ''; } 
    if (!_profile.phone){ _profile.phone = ''; } 
    if (!_profile.mainAddress){ _profile.mainAddress = 0; } 
    if (!_profile.birthday){ _profile.birthday = ''; } 
    console.log(_id)
    Meteor.users.update({'_id':_id}, {$set:{'profile': _profile}}, ()=>{
      FixUsers();
      return;
    });        
  }
  function FixUsers(){
    userList = Meteor.users.find({}).fetch();
    for(let i = 0; i < userList.length; i++){
      if (!userList[i] == undefined){ continue; };
      if (!userList[i].profile){ continue; }
      if (userList[i].profile.address == undefined || userList[i].profile.firstName == undefined || userList[i].profile.lastName == undefined || userList[i].profile.fullName == undefined || userList[i].profile.cpfCnpj == undefined || userList[i].profile.phone == undefined || userList[i].profile.mainAddress == undefined || userList[i].profile.birthday == undefined){ 
        let selected = userList[i];
        MoutUser(selected._id, selected.profile);
        return;
      }
    }
    console.log('Finish');
    return;
  }
  //FixUsers();
  function generateSlug(_id, id, display_name, email){
    function createExclusive(base, count, _id){
      let slug = base;
      if (count > 0){ slug = base + '-' + count.toString(); }
      Vendors.update({'_id': _id}, {$set:{'slug': slug}}, {}, ()=>{
        let check = Vendors.find({'slug': slug}).count();
        if (check > 1){ console.log('Repeat'); createExclusive(base, count + 1, _id); return; }
        console.log(slug);
        createUserName();
      });
    }
    let base = display_name;
    if (!base){  
      if (email.includes('@')){ 
        base = email.split('@');
        base = base[0]; 
      }else{ 
        base = email.replace('.com','').replace('.br', ''); 
      }
      base = base.toString().trim();
      if (!base){ base = id; }
      if (!base){ base = _id; }
    }
    base = base.toString().replace(/\./g, '');
    base = removeAccents(base.trim());
    base = base.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    count = Vendors.find({'slug': base}).count();
    createExclusive(base, count, _id);
    return;
  }
  function createUserName(){
    vendorList = Vendors.find({}).fetch();
    for(let i = 0; i < vendorList.length; i++){
      if (!vendorList[i].slug){ 
        let selected = vendorList[i];
        generateSlug(selected._id, selected.id, selected.display_name, selected.email);
        return;
      }
    }
    console.log('Finish');
    return;
  }
  createUserName()

  function setAccount(_id, password, username, user, displayOnly, limitedAccess, razaoSocial){     
    let last_id = '';    
    if (user.roles.includes('vendor')){
    let vendorCount = Vendors.find({}).count();
    
    last_id = vendorCount.toString() + '_' + Math.random(0).toString().slice(-5);
    if (user.valid){
        Vendors.insert({'id':last_id, 'vendor_id':_id, createdAt:new Date(), 'email':username.toLowerCase(), 'display_name':user.storeName, 'gender':user.gender, 'cnpj':(user.cnpj) ? user.cnpj : '', 'cpf':(user.cpf) ? user.cpf : '', 'verified':true, 'displayOnly':displayOnly, 'limitedAccess':limitedAccess, 'razaoSocial':razaoSocial});
        createUserName()
      }else{
        VendorsOnHold.insert({'id':last_id, 'vendor_id':_id, createdAt:new Date(), 'email':username.toLowerCase(), 'display_name':user.storeName, 'gender':user.gender, 'cnpj':(user.cnpj) ? user.cnpj : '', 'cpf':(user.cpf) ? user.cpf : '', 'verified':false, 'displayOnly':displayOnly, 'limitedAccess':limitedAccess, 'razaoSocial':razaoSocial});
      }
    }
    if (user.roles.includes('service')){
      let serviceCount = Services.find({}).count();
      last_id = serviceCount.toString() + '_' + Math.random(0).toString().slice(-5);
      if (user.valid){
        Services.insert({'id':last_id, 'service_id':_id, createdAt:new Date(), 'email':username.toLowerCase(), 'gender':user.gender, 'cnpj':(user.cnpj) ? user.cnpj : '', 'cpf':(user.cpf) ? user.cpf : '', 'verified':true, 'displayOnly':displayOnly, 'limitedAccess':limitedAccess});
      }else{
        ServicesOnHold.insert({'id':last_id, 'service_id':_id, createdAt:new Date(), 'email':username.toLowerCase(), 'gender':user.gender, 'cnpj':(user.cnpj) ? user.cnpj : '', 'cpf':(user.cpf) ? user.cpf : '', 'verified':false, 'displayOnly':displayOnly, 'limitedAccess':limitedAccess});
      }
    }
    Accounts.setPassword(_id, password); 
  }
  Meteor.methods({
    'AdminCreateAccount': function(profile){
      let validator = new validate();
      let valid = false;
      let displayOnly = false;
      let limitedAccess = false
      let user = {};
      let userCount = Meteor.users.find({}).count();
      let razaoSocial = (profile.razaoSocial)?profile.razaoSocial:'';
      console.log(profile);
      console.log(userCount);
      if ( Meteor.users.find({'username': profile.username}).count() > 0 ) { throw new Meteor.Error('0000', 'Este endereço de e-mail já esta em uso.'); }
      
      user.firstName = 'Parceiro'
      user.lastName = 'MateriaisON'
      user.fullName = 'Parceiro MateriaisON';

      if ( profile.firstName ){
        if (profile.firstName.length < 1 || !validator.check('nome', profile.firstName, '').result){ 
          throw new Meteor.Error('0001', 'Insira seu nome no campo indicado.'); 
        } 
        if (profile.lastName.length < 1 || !validator.check('nome', profile.lastName, '').result){ 
          throw new Meteor.Error('0002', 'Insira seu sobrenome no campo indicado.'); 
        }  
        user.firstName = profile.firstName;
        user.lastName = profile.lastName;
        profile.fullName = profile.firstName + ' ' + profile.lastName;
        user.fullName = profile.fullName;
      }
      user.birthday = '';
      if (profile.birthday){
        if (birthday.length > 0){
          if (!validator('deMaior', user.birthday, 'deMaior').result){ 
            throw new Meteor.Error('0003', 'Você deve ter mais de 18 anos para se cadastrar na plataforma.');
          }
        }
      }
      if (profile.roles.length < 2){
        throw new Meteor.Error('0003', 'Você deve escolher uma das opções acima para configurarmos seu tipo de conta.');        
      }else{ user.roles = profile.roles; }
      user.cellphone = '';
      if (profile.cellphone){
        if (!validator.check('telefone', profile.cellphone, '').result){
          throw new Meteor.Error('0004', 'O número de celular informado não é válido.');
        }else{ user.cellphone = profile.cellphone; }   
      } 
      user.cpf = '';
      if (profile.cpf){
        if (!validator.check('cpf', profile.cpf, '').result){
          throw new Meteor.Error('0005', 'O CPF informado não é válido.');
        }else{ user.cpf = profile.cpf; }   
      } 
      user.cnpj = '';
      if (profile.cnpj){
        if (!validator.check('cnpj', profile.cnpj, '').result){
          console.log(profile.cnpj)
          throw new Meteor.Error('0006', 'O CNPJ informado não é válido.');
        }else{ user.cnpj = profile.cnpj; }  
      }      
      user.cpfCnpj = '';
      if (profile.cpf){ user.cpfCnpj = profile.cpf; }
      if (profile.cnpj){ user.cpfCnpj = profile.cnpj; }
      if (profile.gender){
        if (profile.gender != 'Masculino' && profile.gender != 'Feminino' && profile.gender != 'Outro'){
          throw new Meteor.Error('Você deve selecionar um generô.');
        }else{ user.gender = profile.gender; }  
      }      
      if (!validator.check('email', profile.username, '').result){
        throw new Meteor.Error('0007', 'O e-mail informado não é válido.');
      }

      if (profile.storeName){    
        if (profile.storeName.length < 3){
          throw new Meteor.Error('0008', 'Preencha o nome completo de ser estabelecimento.');
        }else{ user.storeName = profile.storeName; }          
      }
      if (profile.verified){
        profile.verified = profile.verified;
        user.valid = profile.verified;
      }else{
        user.valid = false;
      } 
      if (profile.displayOnly){ displayOnly = true; } 
      if (profile.limitedAccess){ limitedAccess = true; }
      profile.id = userCount.toString();
      profile.id = profile.id + '_' + Math.random(0).toString().slice(-5);
      user.id = profile.id;

      user.phone = user.cellphone
      user.address = [];
      user.mainAddress = 0;
      var _id = Accounts.createUser({username: profile.username, email: profile.username, profile: user});
      delete user.phone
      setAccount(_id, profile.password, profile.username, user, displayOnly, limitedAccess, razaoSocial);
    },
    'AccountSettings': function(){ },
    'saveVendorAddress': function(pack){
      if (!Meteor.userId()){ return; }
      let onHold = false;
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      if (!user){
        throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.');
      }
      if (!user.profile.roles.includes('vendor')){
        throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.');
      }
      let vendor = Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true;}
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      if (!vendor.address){        
        vendor.address = {}; 
        if (!vendor.address.coords){ vendor.address.coords = {}; }
        if (!vendor.address.coords.selected){ vendor.address.coords.selected = {lat: 0, lng: 0}; }
        if (!vendor.address.coords.address){ vendor.address.coords.address = { lat: 0, lng: 0}; }
      }
      if (pack.numero != undefined){ vendor.address.numero = pack.numero; }
      if (pack.rua != undefined){ vendor.address.rua = pack.rua; }
      if (pack.bairro != undefined){ vendor.address.bairro = pack.bairro; }
      if (pack.cidade != undefined){ vendor.address.cidade = pack.cidade; }
      if (pack.UF != undefined){ vendor.address.UF = pack.UF; }
      if (pack.estado != undefined){ vendor.address.estado = pack.estado; }
      if (pack.pais != undefined){ vendor.address.pais = pack.pais; }
      if (pack.cep != undefined){ vendor.address.cep = pack.cep; }
      if (pack.complemento != undefined){ vendor.address.complemento = pack.complemento;  }else{ vendor.address.complemento = ''; }
      if (!vendor.address.coords){ vendor.address.coords = {}; }
      if (pack.coords){
        if (pack.coords.selected){ 
          if (pack.coords.selected.lat != undefined && pack.coords.selected.lng != undefined){
            vendor.address.coords.selected = pack.coords.selected; 
          }
        }
        if (pack.coords.address){
          if (pack.coords.address.lat != undefined && pack.coords.address.lng != undefined){
             vendor.address.coords.address = pack.coords.address; 
            }
          }
      }           
      if (onHold){
        VendorsOnHold.update({'vendor_id':user._id}, {$set:{ 'address': {
          'numero': vendor.address.numero,
          'rua': vendor.address.rua,
          'bairro': vendor.address.bairro,
          'cidade': vendor.address.cidade,
          'UF': vendor.address.UF,
          'estado': vendor.address.estado,
          'pais': vendor.address.pais,
          'cep': vendor.address.cep,
          'complemento': vendor.address.complemento,
          'coords':{
            'selected':{
              'lat': vendor.address.coords.selected.lat,
              'lng': vendor.address.coords.selected.lng
            },
            'address':{
              'lat': vendor.address.coords.address.lat,
              'lng': vendor.address.coords.address.lng
            }
          }
        }}});
      }else{
        Vendors.update({'vendor_id':user._id}, {$set:{ 'address': {
          'numero': vendor.address.numero,
          'rua': vendor.address.rua,
          'bairro': vendor.address.bairro,
          'cidade': vendor.address.cidade,
          'UF': vendor.address.UF,
          'estado': vendor.address.estado,
          'pais': vendor.address.pais,
          'cep': vendor.address.cep,
          'complemento': vendor.address.complemento,
          'coords':{
            'selected':{
              'lat': vendor.address.coords.selected.lat,
              'lng': vendor.address.coords.selected.lng
            },
            'address':{
              'lat': vendor.address.coords.address.lat,
              'lng': vendor.address.coords.address.lng
            }
          }
        }}});
      }
      return true;      
    },
    'saveVendorSettings': function(pack){
      if (!Meteor.userId()){ return; }
      let onHold = false;
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      if (!user){
        throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.');
      }
      if (!user.profile.roles.includes('vendor')){
        throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.');
      }
      let vendor = Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true;}
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      if (pack.display_name != undefined){ vendor.display_name = pack.display_name; }
      if (pack.img_url != undefined){ vendor.img_url = pack.img_url; }      
      if (pack.banner_url != undefined){ vendor.banner_url = pack.banner_url; } 
      if (pack.phone != undefined){ vendor.phone = pack.phone; }      
      if (pack.cellphone != undefined){ vendor.cellphone = pack.cellphone; }  
      if (pack.forceOpenIndex != undefined){ vendor.forceOpenIndex = pack.forceOpenIndex; }
      if (pack.openTime != undefined){
        if ( !vendor.terms ){ vendor.terms = {} };
        pack.openTime.map((day, index)=>{
          let start = day.start.split(':');
          let end = day.end.split(':');
          start[0] = parseInt(start[0]);
          start[1] = parseInt(start[1]);
          end[0] = parseInt(end[0]);
          end[1] = parseInt(end[1]);
          if (start[0] > end[0]){ throw new Meteor.Error('0007', 'Ocorreu um erro na validação de seu horário de funcionamento, verifique sua tabela novamente ou entre em contato com nossa equipe de suporte.')}
          if (start[0] == end [0]){
            if (start[1] > end[1]){ throw new Meteor.Error('0007', 'Ocorreu um erro na validação de seu horário de funcionamento, verifique sua tabela novamente ou entre em contato com nossa equipe de suporte.')}
            if (start[1] == end[1]){ throw new Meteor.Error('0007', 'Ocorreu um erro na validação de seu horário de funcionamento, verifique sua tabela novamente ou entre em contato com nossa equipe de suporte.')}
          }
        });
        vendor.terms.openTime = pack.openTime;
      }      
      if (onHold){
        VendorsOnHold.update({'vendor_id':user._id}, {$set:{ 'display_name': vendor.display_name, 'img_url': vendor.img_url, 'banner_url': vendor.banner_url, 'phone': vendor.phone, 'cellphone': vendor.cellphone, 'forceOpenIndex': vendor.forceOpenIndex, 'terms': vendor.terms }});
      }else{
        Vendors.update({'vendor_id':user._id}, {$set:{ 'display_name': vendor.display_name, 'img_url': vendor.img_url, 'banner_url': vendor.banner_url, 'phone': vendor.phone, 'cellphone': vendor.cellphone, 'forceOpenIndex': vendor.forceOpenIndex, 'terms': vendor.terms }});
      }
      return true;      
    },
    'vendorInsertDocuments': function(name, url){
      if (!Meteor.userId()){
        throw new Meteor.Error('0006', 'Verifique se você esta logado, ou se não esta conctado à internet.');
      }
      let user = findOne({'_id': Meteor.userId()});
      let onHold = Vendors.findOne({'_id': Meteor.userId()});
      let vendor = undefined;
      if (!onHold){
        vendor = Vendors.findOne({'_id': Meteor.userId()});
      }      
      if (!user || !onHold || !vendor){
        throw new Meteor.Error('0006', 'Verifique se você esta logado, ou se não a uma falha em sua conexão com a internet.');
      }
      let validator = new validate();
      if (!validator.check('name', name) || name.length < 3){
        throw new Meteor.Error('0007', 'Verifique se seu nome esta completo como no documento no campo anterior');         
      }
      if (!name.include(' ')){
        throw new Meteor.Error('0008', 'Verifique se seu nome esta completo como no documento no campo anterior');
      }
      if (!Array.isArray(url)){
        throw new Meteor.Error('0010', 'Verifique se os arquivos foram incluídos corretamente, ou tente envia-los novamente');
      }
      if (url.length > 0){
        throw new Meteor.Error('0011', 'Favor inserir seus documentos para que possa ser feita a análise de seu perfil.');
      }  
      let documentArray = [];
      if (vendor){
        url.map((documentUrl, inde)=>{
          let document = {verified: false, url: documentUrl};
          documentArray.push(document);          
        })
        Vendors.update({'_id': Meteor.userId()}, {$set:{ name: name, documents:documentArray }});
        DocumentList.insert({ userId:Meteor.userId(), name:name, documents:documentArray });
        return true;
      }    
      if (onHold){
        url.map((documentUrl, index)=>{
          let document = {verified: false, url: documentUrl};
          documentArray.push(document);          
        });
        VendorsOnHold.update({'_id': Meteor.userId(), $set:{ name: name, documents:documentArray }});
        DocumentList.insert({ userId:Meteor.userId(), name:name, documents:documentArray });
        return true;        
      }
    },
    'vendorSaveBankAccount': function(pack){
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;

      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      if (!user.profile.roles.includes('vendor')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }
      if (!user.profile.roles){ throw new Meteor.Error('0003', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }

      let vendor = Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true; }
      if (!vendor){ throw new Meteor.Error('0003', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      
      if (!pack){ throw new Meteor.Error('0004', 'Ocorreu um erro na validação dos seus dados.'); }
      if (pack.accountOuwner.length < 5){ throw new Meteor.Error('0005', 'Insira o nome completo do titular da conta bancária.'); }
        if (pack.cpfCNPJ.length == ''){ 
          throw new Meteor.Error('0006', 'Insira o CPF ou CNPJ do titular da conta bancária.'); 
        }else{            
          if (pack.cpfCNPJ.length < 14){ 
            this.errors.push('O CPF inserido não é válido.'); 
        }else{
            if (pack.cpfCNPJ.length == 14){
              if (!(/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(pack.cpfCNPJ))){ 
                throw new Meteor.Error('0007', 'O CNPJ inserido não é válido.');
                console.log('a')
              }
            }else{
              if (pack.cpfCNPJ.length > 14 && pack.cpfCNPJ.length < 18){ 
                throw new Meteor.Error('0008', 'O CNPJ inserido não é válido');      
                console.log('b')                      
              }else{
                if (pack.cpfCNPJ.length == 18){
                  console.log('c')
                  if (!(/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(pack.cpfCNPJ))){ 
                    console.log('d')
                    throw new Meteor.Error('0009', 'O CNPJ inserido não é válido');
                  }
                }
              }
            }  
          }
        }
        if (pack.bankName.length == ''){ throw new Meteor.Error('0010', 'Insira o nome do banco.');}
        if (pack.accountType == '' || pack.accountType == 'Selecione o tipo de conta'){ throw new Meteor.Error('0011', 'Seleicone o tipo de conta.'); }
        if (pack.agencia.length < 3){ throw new Meteor.Error('0012', 'Digite o número da agência.'); }
        if (pack.conta.length < 3){ throw new Meteor.Error('0013', 'Digite o número da conta.'); }
        
        if (onHold){
          VendorsOnHold.update({'_id': vendor._id}, {$set:{'bankData':{'titular': pack.accountOuwner, 'CPFCNPJ': pack.cpfCNPJ, 'banco': pack.bankName, 'tipo': pack.accountType, 'agencia': pack.agencia, 'conta':pack.conta, 'canDelivery': pack.canDelivery}}});
          return;
        }
        Vendors.update({'_id': vendor._id}, {$set:{'bankData':{'titular': pack.accountOuwner, 'CPFCNPJ': pack.cpfCNPJ, 'banco': pack.bankName, 'tipo': pack.accountType, 'agencia': pack.agencia, 'conta':pack.conta, 'canDelivery': pack.canDelivery}}});
        return;
    },
    'vendorInsertProduct': function(pack){
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      let img_error = true;

      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      if (!user.profile.roles.includes('vendor')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }
      if (!user.profile.roles){ throw new Meteor.Error('0003', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      
      let vendor = Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true; }
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }

      if (pack.name.trim().length < 3){ throw new Meteor.Error('0007', 'Você deve atribuir um nome ao produto.'); }
      pack.name = pack.name.trim().charAt(0).toUpperCase() + pack.name.trim().slice(1);
      if (pack.description.length < 10){ throw new Meteor.Error('0008', 'Você deve atribuir uma descrição de pelo menos 10 caracteres.'); }
      if (pack.category.length == 0){ throw new Meteor.Error('0009', 'Você deve escolher uma categoria para seu produto.'); }
      if (pack.category.length == 1 && pack.category[0].name == 'Selecione uma categoria'){ throw new Meteor.Error('0010', 'Você deve escolher uma categoria para seu produto.'); }
      if (pack.stock_quantity.length == 0 && !pack.stockDisable){ throw new Meteor.Error('0011', 'Você deve atribuir uma quantidade de estoque ao produto.'); }
      if (pack.price.length == 0){ 
        throw new Meteor.Error('0012', 'Você deve atribuir um preço ao produto'); 
      }else{
        if (!parseFloat(pack.price.replace(',', '.')) > 0){ throw new Meteor.Error('0013', 'O produto deve ter um preço atribuido maior do que 0.'); }
      }
      if (!pack.stock_quantity && pack.stockDisable){ pack.stock_quantity = '0'; }
      if (!pack.img_url.length > 0){ throw new Meteor.Error('0019', 'Seu produto deve ter uma foto principal.'); }
      if (!pack.tags){ pack.tags = []; }
      if (!pack.hidden){ pack.hidden = false; }
      if (!pack.brand){ pack.brand = ''; }
      if (!pack.minQuantity){ pack.minQuantity = {enabled: false, quantity: '0'}; }
      if (!pack.minQuantity.enabled){ pack.minQuantity.enabled = false; }
      if (!pack.minQuantity.quantity){ pack.minQuantity.quantity = '0'}
      if (!pack.stockDisable){ pack.stockDisable = false; }
      if (!pack.canDelivery){ pack.canDelivery = { motoboy: true, correios:true, transportadora:true} }
      pack.minQuantity.quantity = parseInt(pack.minQuantity.quantity);
      if (isNaN(pack.minQuantity.quantity)){ pack.minQuantity.quantity = 0; }
      pack.brand = pack.brand.trim();
      pack.price = (parseFloat(pack.price).toFixed(2)).toString();  
      let _detail = [0, 0, 0, 0]
      pack.details.map((detail, index)=>{
        if (detail.name == 'Altura (cm)' || detail.name == 'Largura (cm)' || detail.name == 'Comprimento (cm)' || detail.name == 'Peso (kg)'){
          switch(detail.name){
            case 'Altura (cm)':
              _detail[0] = 1;
              break;
            case 'Largura (cm)':
              _detail[1] = 1;
              break;
            case 'Comprimento (cm)':
              _detail[2] = 1;
              break;
            case 'Peso (kg)':
              _detail[3] = 1;
              break;
          }
          if (!parseFloat(detail.detail.replace(',', '.')) > 0){               
            switch(detail.name){
              case 'Altura (cm)':
                throw new Meteor.Error('0014', 'A altura do produto não pode ser nula.');
                break;
              case 'Largura (cm)':
                throw new Meteor.Error('0015', 'A largura do produto não pode ser nula.');
                break;
              case 'Comprimento (cm)':
                throw new Meteor.Error('0016', 'O comprimento do produto não pode ser nulo.');
                break;
              case 'Peso (kg)':
                throw new Meteor.Error('0017', 'O peso do produto não pode ser nulo.');
                break;
              default:
                throw new Meteor.Error('0018', 'Nenhum atributo do produto não pode ser nulo.');
                break;
            }               
          }
        }
      });  
      if (_detail[0] == 0 || _detail[1] == 0 || _detail[2] == 0 || _detail[3] == 0){
        console.log(_detail)
        throw new Meteor.Error('0024', 'Nenhum atributo do produto não pode ser nulo.');
      }  
      if (Array.isArray(pack.img_url)){
        pack.img_url.map((img, index) =>{
          if (!img.src.includes('http') && index == 0){ throw new Meteor.Error('0019', 'Seu produto deve ter uma foto principal.'); }
          if (img.src.includes('http')){ img_error = false; }
        })
      }else{
        throw new Meteor.Error('0019', 'Seu produto deve ter uma foto principal.');
      }
      if (img_error){ throw new Meteor.Error('0019', 'Seu produto deve ter uma foto principal.'); }
      pack.category.map((_category, index)=>{
          if (_category.name == ''){ pack.category[index].name = 'Outros'; pack.category[index].slug = 'outros';
          }else{pack.category[index].slug = removeAccents(_category.name.trim().toLowerCase().replace(/\s/g, '-').replace(/\//g, '')); }        
      });

      let id = '0';
      let lastProduct = Products.find({}).count();
      let lastProductOnHold = ProductsOnHold.find({}).count();
      let lastIncompleteProduct = IncompleteProducts.find({}).count();
      let lastId = '0';
      let lastIdOnHold = '0';
      let lastIdIncomplete = '0';
      let createAt = new Date();
      
      if (!lastProduct){ 
        lastId = 0; 
      }else{ 
        lastId = lastProduct + 1; 
      }
      if (!lastProductOnHold){ 
        lastIdOnHold = 0; 
      }else{ 
        lastIdOnHold = lastProductOnHold + 1; 
      }
      if (!lastIncompleteProduct){ 
        lastIdIncomplete = 0; 
      }else{ 
        lastIdIncomplete = lastIncompleteProduct + 1; 
      }      

      lastId = lastId;
      lastIdOnHold = lastIdOnHold
      lastIdIncomplete = lastIdIncomplete

      if (lastId < lastIdOnHold){ lastId = lastIdOnHold; }
      if (lastId < lastIdIncomplete){ lastId = lastIdIncomplete; }

      id = lastId.toString() + '_' + Math.random(0).toString().slice(-6)+'_';

      pack.id = id;
      pack.vendor_id = vendor._id;         
      
      if (onHold){
        ProductsOnHold.insert({'id': id, 'id_vendor': vendor.id.toString(), 'vendor_id': pack.vendor_id, 'createAt': createAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery})
        VendorsOnHold.update({'_id': vendor._id}, {$set:{ 'lastProductId': id }});
      }else{
        Products.insert({'id': id, 'id_vendor': vendor.id.toString(), 'vendor_id': pack.vendor_id, 'createAt': createAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery})
        Vendors.update({'_id': vendor._id}, {$set:{ 'lastProductId': id }});
      }
      return pack.id;
    },
    'vendorEditProduct': function(pack){
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      let editAt = new Date();
      let type = 'product';

      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      if (!user.profile.roles.includes('vendor')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }
      if (!user.profile.roles){ throw new Meteor.Error('0003', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      if (!user.profile.roles.includes('vendor')){ throw new Meteor.Error('0004', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      
      let vendor = Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true}
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }

      let product = Products.findOne({'_id':pack._id});
      if (!product){ type = 'on-hold'; product = ProductsOnHold.findOne({'_id':pack._id}); }
      if (!product){ type = 'incomplete'; product = IncompleteProducts.findOne({'_id':pack._id}); }
      if (!product){ throw Meteor.Error('0007', 'Não foi possível encontrar o produto a ser editado.'); }
      if (product.vendor_id != vendor._id){ throw Meteor.Error('0008', 'Não foi possível encontrar o produto a ser editado em sua lista.'); }
      
      if (!pack.stock_quantity && pack.stockDisable){ pack.stock_quantity = '0'; }
      if (pack.name.trim().length < 3){ throw Meteor.Error('0009', 'Você deve atribuir um nome ao produto.'); }
      if (pack.description.length < 10){ throw Meteor.Error('0010', 'Você deve atribuir uma descrição de pelo menos 10 caracteres.'); }
      if (pack.category.length == 0){ throw Meteor.Error('0011', 'Você deve escolher uma categoria para seu produto.'); }
      if (pack.category.length == 1 && pack.category[0].name == 'Selecione uma categoria'){ throw Meteor.Error('0010', 'Você deve escolher uma categoria para seu produto.'); }
      if (pack.stock_quantity.length == 0 && !pack.stockDisable ){ throw Meteor.Error('0012', 'Você deve atribuir uma quantidade de estoque ao produto.'); }
      if (!pack.img_url.length > 0){ throw Meteor.Error('0013', 'Seu produto deve ter uma foto principal.'); }
      if (!pack.tags){ pack.tags = []; }
      if (!pack.hidden){ pack.hidden = false; }
      if (!pack.brand){ pack.brand = ''; }
      if (!pack.minQuantity){ pack.minQuantity = {enabled: false, quantity: '0'}; }
      if (!pack.minQuantity.enabled){ pack.minQuantity.enabled = false; }
      if (!pack.minQuantity.quantity){ pack.minQuantity.quantity = '0'}
      if (!pack.stockDisable){ pack.stockDisable = false; }
      if (!pack.canDelivery){ pack.canDelivery = { motoboy: true, correios:true, transportadora:true} }
      pack.minQuantity.quantity = parseInt(pack.minQuantity.quantity);
      if (isNaN(pack.minQuantity.quantity)){ pack.minQuantity.quantity = 0; }
      pack.brand = pack.brand.trim();
      if (pack.price.length == 0){ 
        throw Meteor.Error('0014', 'Você deve atribuir um preço ao produto'); 
      }else{
        if (!parseFloat(pack.price.replace(',', '.')) > 0){ throw Meteor.Error('0015', 'O produto deve ter um preço atribuido maior do que 0.'); }
      }
      if (Array.isArray(pack.img_url)){
        pack.img_url.map((img, index) =>{
          if (!img.src.includes('http') && index == 0){ throw new Meteor.Error('0019', 'Seu produto deve ter uma foto principal.'); }
          if (img.src.includes('http')){ img_error = false; }
        });
      }else{ throw new Meteor.Error('0019', 'Seu produto deve ter uma foto principal.'); }
      pack.name = pack.name.trim().charAt(0).toUpperCase() + pack.name.trim().slice(1);
      pack.price = (parseFloat(pack.price).toFixed(2)).toString();  
      let _detail = [0, 0, 0, 0];
      pack.details.map((detail, index)=>{
        if (detail.name == 'Altura (cm)' || detail.name == 'Largura (cm)' || detail.name == 'Comprimento (cm)' || detail.name == 'Peso (kg)'){
          switch(detail.name){
            case 'Altura (cm)': _detail[0] = 1; break;
            case 'Largura (cm)': _detail[1] = 1; break;
            case 'Comprimento (cm)': _detail[2] = 1; break;
            case 'Peso (kg)': _detail[3] = 1; break;
          }
          if (!(parseFloat(detail.detail.replace(',', '.')) > 0)){               
            switch(detail.name){
              case 'Altura (cm)': throw new Meteor.Error('0016', 'A altura do produto não pode ser nula.'); break;
              case 'Largura (cm)': throw new Meteor.Error('0017', 'A largura do produto não pode ser nula.'); break;
              case 'Comprimento (cm)': throw new Meteor.Error('0018', 'O comprimento do produto não pode ser nulo.'); break;
              case 'Peso (kg)': throw new Meteor.Error('0019', 'O peso do produto não pode ser nulo.'); break;
              default: throw new Meteor.Error('0020', 'Nenhum atributo do produto não pode ser nulo.'); break;
            }               
          }
        }
      });  
      if (_detail[0] == 0 || _detail[1] == 0 || _detail[2] == 0 || _detail[3] == 0){ console.log(_detail); throw new Meteor.Error('0024', 'Nenhum atributo do produto não pode ser nulo.'); }     
      pack.category.map((_category, index)=>{
          if (_category.name == ''){ pack.category[index].name = 'Outros'; pack.category[index].slug = 'outros';
          }else{ pack.category[index].slug = removeAccents(_category.name.trim().toLowerCase().replace(/\s/g, '-').replace(/\//g, '')); }
      });
      if (onHold == true){
        if (type == 'product'){
          product = Products.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
          product = Products.findOne({'_id': pack._id});
          ProductsOnHold.insert(product);
          Products.remove({'_id': pack._id})
        }else{
          if (type == 'on-hold'){
            ProductsOnHold.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
          }else{
            if (type == 'incomplete'){
              product = IncompleteProducts.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
              product = IncompleteProducts.findOne({'_id': pack._id});
              ProductsOnHold.insert(product);
              IncompleteProducts.remove({'_id': pack._id})
            }else{
              throw new Meteor.Error('0021', 'Não foi possível editar o produto');
            }
          }  
        }
        return pack._id;        
      }
      if (onHold == false){
        if (type == 'product'){
          Products.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
        }else{
          if (type == 'on-hold'){
            product = ProductsOnHold.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
            product = ProductsOnHold.findOne({'_id': pack._id});
            Products.insert(product);
            ProductsOnHold.remove({'_id': pack._id})
          }else{
            if (type == 'incomplete'){
              product = IncompleteProducts.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
              product = IncompleteProducts.findOne({'_id': pack._id});
              ProductsOnHold.insert(product);
              IncompleteProducts.remove({'_id': pack._id})
            }else{
              throw new Meteor.Error('0022', 'Não foi possível editar o produto');
            }
          }        
        }            
        return pack.id;
      }
      Meteor.Error('0023', 'Não foi possível editar o produto');
    },
    'vendorEditIncompleteProduct': function(pack){
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      let editAt = new Date();
      let type = 'product';

      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      if (!user.profile.roles){ throw new Meteor.Error('0003', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      if (!user.profile.roles.includes('vendor')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }

      let vendor = Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true}
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }

      let product = Products.findOne({'_id':pack._id});
      if (!product){ product = ProductsOnHold.findOne({'_id':pack_id}); type = 'on-hold'}
      if (!product){ product = IncompleteProducts.findOne({'_id':pack._id}); type = 'incomplete'}
      if (!product){ throw new Meteor.Error('0007', 'Não foi possível encontrar o produto a ser editado.'); }
      if (product.vendor_id != vendor._id){ throw new Meteor.Error('0008', 'Não foi possível encontrar o produto a ser editado em sua lista.'); }
      
      if (pack.name.trim().length < 3){ throw new Meteor.Error('0009', 'Você deve atribuir um nome ao produto.'); }      
      pack.name = pack.name.trim().charAt(0).toUpperCase() + pack.name.trim().slice(1);
      if (pack.stock_quantity.length == 0){ pack.stock_quantity = 0; }
      if (!pack.tags){ pack.tags = []; }
      if (!pack.hidden){ pack.hidden = false; }
      if (!pack.brand){ pack.brand = ''; }
      if (!pack.minQuantity){ pack.minQuantity = {enabled: false, quantity: '0'}; }
      if (!pack.minQuantity.enabled){ pack.minQuantity.enabled = false; }
      if (!pack.minQuantity.quantity){ pack.minQuantity.quantity = '0'}
      if (!pack.stockDisable){ pack.stockDisable = false; }
      if (!pack.canDelivery){ pack.canDelivery = { motoboy: true, correios:true, transportadora:true} }
      pack.minQuantity.quantity = parseInt(pack.minQuantity.quantity);
      if (isNaN(pack.minQuantity.quantity)){ pack.minQuantity.quantity = 0; }
      pack.brand = pack.brand.trim();
      if (pack.price.length == 0){ pack.price = '0'; }else{ if (!parseFloat(pack.price.replace(',', '.')) > 0){ pack.price = '0'; } }
      pack.price = (parseFloat(pack.price).toFixed(2)).toString();        
      if (!pack.details){
        pack.details = [
          {name: 'Altura (cm)', detail: '0'}, 
          {name: 'Largura (cm)', detail: '0'}, 
          {name: 'Comprimento (cm)', detail: '0'}, 
          {name: 'Peso (kg)', detail: '0'}, 
        ];
      }
      if (!Array.isArray(pack.details)){
        pack.details = [
          {name: 'Altura (cm)', detail: '0'}, 
          {name: 'Largura (cm)', detail: '0'}, 
          {name: 'Comprimento (cm)', detail: '0'}, 
          {name: 'Peso (kg)', detail: '0'}, 
        ];
      }
      if (!parseFloat(pack.details[0].detail.replace(',', '.')) > 0){ pack.details[0] =  {name: 'Altura (cm)', detail: '0'}; } 
      if (!parseFloat(pack.details[1].detail.replace(',', '.')) > 0){ pack.details[1] = {name: 'Largura (cm)', detail: '0'}; } 
      if (!parseFloat(pack.details[2].detail.replace(',', '.')) > 0){ pack.details[2] = {name: 'Comprimento (cm)', detail: '0'}; } 
      if (!parseFloat(pack.details[3].detail.replace(',', '.')) > 0){ pack.details[3] = {name: 'Peso (kg)', detail: '0'}; }       
      if (!pack.category){ pack.category = []; }       
      pack.category.map((_category, index)=>{
          if (_category.name == ''){ pack.category[index].name = 'Outros'; pack.category[index].slug = 'outros';
          }else{ pack.category[index].slug = removeAccents(_category.name.trim().toLowerCase().replace(/\s/g, '-').replace(/\//g, '')); }        
      });
      if (type == 'product'){        
        product = Products.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
        product = Products.findOne({'_id': pack._id});
        IncompleteProducts.insert(product);
        Products.remove({'_id': pack._id});
      }else{
        if (type == 'on-hold'){
          product = ProductsOnHold.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
          product = ProductsOnHold.findOne({'_id': pack._id});
          IncompleteProducts.insert(product);
          ProductsOnHold.remove({'_id': pack._id});
        }else{
          if (type == 'incomplete'){
            IncompleteProducts.update({'_id': pack._id}, {$set:{'editAt': editAt, 'img_url': pack.img_url, 'name': pack.name, 'description': pack.description, 'price': pack.price, 'category': pack.category, 'stock_quantity': pack.stock_quantity, 'details': pack.details, 'units': pack.units, 'brand': pack.brand, 'tags': pack.tags, 'hidden': pack.hidden, 'stockDisable':pack.stockDisable, 'minQuantity':pack.minQuantity, 'canDelivery': pack.canDelivery}})
          }else{
            Meteor.Error('0021', 'Não foi possível editar o produto');
          }
        }  
      }
      return pack._id;
    },
    'vendorImportCompleteProducts': function(pack){      
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      let img_error = true;
      
      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.');}
      if (!user.profile.roles.includes('vendor')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }

      let vendor = Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor= VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true; }
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      
      let lastId = 0;
      let indexArray = [];
      let productArray = []; 
      let lastProduct = Products.find({}).count();   
      let lastProductOnHold = ProductsOnHold.find({}).count(); 
      let productIndex = { id: '0_' + Math.random(0).toString().slice(-5) };
      let index = 0;

      if (!lastProduct){ lastProduct = lastProductOnHold; }
      if (!lastProduct){ 
        productIndex = lastProduct; 
        index = lastProduct; 
        if (!index){ index = 0; }
      }

      console.log('lastIndex: ' + index.toString());   
      console.log(pack);

      pack.map((_pack, i)=>{
        let canImport = true;
        if (_pack.name.trim().length < 3){ canImport = false; }
        _pack.name = _pack.name.trim().charAt(0).toUpperCase() + _pack.name.trim().slice(1);
        if (_pack.description.length < 10){ canImport = false; }
        if (_pack.category.length == 0){ canImport = false; }
        if (!_pack.tags){ _pack.tags = []; }
        if (_pack.stock_quantity.length == 0){ canImport = false; }
        if (!_pack.img_url.length > 0){ canImport = false; }
        if (!_pack.hidden){ _pack.hidden = false; }
        if (!_pack.brand){ _pack.brand = ''; }
        _pack.brand = _pack.brand.trim();
        if (_pack.price.length > 0){ if (!parseFloat(_pack.price.replace(',', '.')) > 0){ canImport = false; } }else{ canImport = false; }
        if (_pack.category.length == 1 && pack.category[0].name == 'Selecione uma categoria'){ canImport = false; }
        if (Array.isArray(_pack.img_url)){
          _pack.img_url.map((img, index) =>{
            if ((!img.src.includes('http') || img.src.includes('blob')) && index == 0){ canImport = false; }
            if (!img.src.includes('http') || img.src.includes('blob')){ img_error = false; }
          }) }else{ canImport = false; }
        _pack.details.map((detail, index)=>{
          if (detail.name == 'Altura (cm)' || detail.name == 'Largura (cm)' || detail.name == 'Comprimento (cm)' || detail.name == 'Peso (kg)'){
            _pack.details[index].detail = _pack.details[index].detail.replace(',', '.');
            if (!(parseFloat(detail.detail.replace(',', '.')) > 0)){               
              switch(detail.name){
                case 'Altura (cm)':
                  canImport = false;
                  break;
                case 'Largura (cm)':
                  canImport = false;
                  break;
                case 'Comprimento (cm)':
                  canImport = false;
                  break;
                case 'Peso (kg)':
                  canImport = false;
                  break;
                default:
                  canImport = false;
                  break;
              }               
            }
          }
        });        
        _pack.category.map((_category, index)=>{
          if (_category.name == ''){ 
            canImport = false;
          }else{
            _pack.category[index].slug = removeAccents(_category.name.trim().toLowerCase().replace(/\s/g, '-').replace(/\//g, '')); }          
        });
        _pack.id = (index + i + 1).toString();            
        _pack.id = _pack.id + '_' + Math.random(0).toString().slice(-5) + '_' + _pack.id + Math.random(0).toString().slice(-5);
        _pack.price = parseFloat(_pack.price)
        if (!_pack.price){ canImport = false; }else{ _pack.price = _pack.price.toFixed(2); }
        _pack.id_vendor = vendor.id.toString()
        _pack.vendor_id = vendor._id;
        _pack.createAt = new Date();         
        lastId = (index + i + 1);
        if (canImport){ productArray.push(_pack); if ( _pack.index != undefined ){ indexArray.push(_pack.index); } }
        console.log('product_id:' + _pack.id);        
      });       
      if (!productArray.length > 0){throw new Meteor.Error('0001', 'Ocorreu um erro ao importar os produtos.');}
      if (onHold){
        VendorsOnHold.update({'vendor_id': vendor._id}, {$set:{ 'lastProductId': lastId }});
      }else{
        Vendors.update({'vendor_id': vendor._id}, {$set:{ 'lastProductId': lastId }});
      }
      if (onHold){
        var ProductsImport = ProductsOnHold.batchInsert(productArray, function(error, result){ if (error){ return error; } });
      }else{
        var ProductsImport = Products.batchInsert(productArray, function(error, result){ if (error){ return error; } });
      }     
      return {products: productArray, index: indexArray};
    },
    'vendorImportIncompleteProducts': function(pack){
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      if (!user.profile.roles.includes('vendor')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }

      let vendor =  Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true; }
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      
      let lastId = 0;
      let indexArray = [];
      let productArray = []; 
      let lastProduct = Products.find({}).count();
      let lastProductOnHold = ProductsOnHold.find({}).count(); 
      let lastIncompleteProduct = IncompleteProducts.fins({}).count();    
      let productIndex = { id: '0_' + Math.random(0).toString().slice(-5) };
      let index = 0;
      
      if (lastProduct){ lastProduct = lastProduct;}
      if (lastProductOnHold){ 
        if (!lastProduct){ 
          lastProduct = lastProductOnHold; 
        }else{
          let _index = lastProduct;
          if (!_index){ _index = 0; }
          let __index = lastProductOnHold;
          if (!__index){ __index = 0; }
          if (__index > _index){ lastProduct = lastProductOnHold; }
        }
      }
      if (lastIncompleteProduct){
        if (!lastProduct){ 
          lastProduct = lastIncompleteProduct; 
        }else{
          let _index = lastProduct;
          if (!_index){ _index = 0; }
          let __index = lastIncompleteProduct;
          if (!__index){ __index = 0; }
          if (__index > _index){ lastProduct = lastIncompleteProduct; }
        }
      }      
      if (lastProduct){ 
        productIndex = lastProduct; 
        index = lastProduct
        if (!index){ index = 0; }
      }

      console.log('lastIndex: ' + index.toString())   
      console.log(pack);

      pack.map((_pack, i)=>{

        if (!_pack.name){ _pack.name =''; }
        if (!_pack.description){ _pack.description = ''; }
        if (!_pack.category){ _pack.category = []; }      
        if (!_pack.stock_quantity){ _pack.stock_quantity = 0; }
        if (!_pack.price){ _pack.price = '0'; }        
        if (!_pack.img_url){ _pack.img_url = []; }
        if (!_pack.tags){ _pack.tags = []; }
        if (!_pack.hidden){ _pack.hidden = false; }
        if (!_pack.brand){ _pack.brand = ''; }
        if (_pack.index != undefined){ indexArray.push(_pack.index); }

        if (!_pack.details){ 
          _pack.details = [
            {name: 'Altura (cm)', detail: '0'},
            {name: 'Largura (cm)', detail: '0'},
            {name: 'Comprimento (cm)', detail: '0'},
            {name: 'Peso (kg)', detail: '0'},
          ]; 
        }        

        if (!_pack.details[0].detail || _pack.details[0].name != 'Altura (cm)'){ _pack.details[0] = {name: 'Altura (cm)', detail: '0'}; }
        if (!_pack.details[1].detail || _pack.details[1].name != 'Largura (cm)'){ _pack.details[2] = {name: 'Largura (cm)', detail: '0'}; }
        if (!_pack.details[2].detail || _pack.details[2].name != 'Comprimento (cm)'){ _pack.details[2] = {name: 'Comprimento (cm)', detail: '0'}; }
        if (!_pack.details[3].detail || _pack.details[3].name != 'Peso (kg)'){ _pack.details[3] = {name: 'Peso (kg)', detail: '0'}; }

        _pack.category.map((_category, index)=>{ _pack.category[index].slug = removeAccents(_category.name.trim().toLowerCase().replace(/\s/g, '-').replace(/\//g, '')); });

        _pack.id = (index + i + 1).toString();            
        _pack.id = _pack.id + '_' + Math.random(0).toString().slice(-5) + '_' + _pack.id + Math.random(0).toString().slice(-5);
        _pack.price = parseFloat(_pack.price)
        if (!_pack.price){ _pack.price = 0; }
        _pack.price = _pack.price.toFixed(2);
        _pack.id_vendor = vendor.id.toString()
        _pack.vendor_id = vendor._id;
        _pack.createAt = new Date();         
        lastId = (index + i + 1);
        if (_pack.name.length > 2){ productArray.push(_pack); }        
      }); 
      if (!productArray.length > 0){ throw new Meteor.Error('0001', 'Ocorreu um erro ao importar os produtos.'); }
      if (onHold){
        VendorsOnHold.update({'_id': vendor._id}, {$set:{ 'lastProductId': lastId }});
        var incompleteProducts = IncompleteProducts.batchInsert(productArray, function(error, result){ if (error){ return error; } });
      }else{
        Vendors.update({'_id': vendor._id}, {$set:{ 'lastProductId': lastId }});
        var incompleteProducts = IncompleteProducts.batchInsert(productArray, function(error, result){ if (error){ return error; } });
      }      
      return {products: productArray, index: indexArray};
    },    
    'vendorRemoveProduct': function(pack){
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      let incomplete = false;
      let product = pack.product
      if (!user){
        throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      
      if (!user.profile.roles.includes('vendor')){
        throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }
      
      
      let vendor = Vendors.findOne({'vendor_id':user._id});      
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); }      
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
                 
      if (product._id){        
        product = Products.findOne({'_id': product._id});
        if (!product){ product = ProductsOnHold.findOne({'_id': product._id}); onHold = true
          if (!product){ product = IncompleteProducts.findOne({'_id': product._id}); incomplete = true; }          
          if (!product){ throw new Meteor.Error('0019', 'Não foi possível encontrar o produto.'); }
        }
      }else{
        throw new Meteor.Error('0019', 'Não foi possível encontrar o produto.'); 
      }
      if (!product){ throw new Meteor.Error('0019', 'Não foi possível encontrar o produto.'); }
      if (vendor._id != product.vendor_id.toString()){ throw new Meteor.Error('0020', 'O produto não aparenta ser seu, atualize a página e tente novamente.'); } 
 
      if (incomplete){
        IncompleteProducts.remove({'_id': product._id})
        return product._id;
      }  
      if (onHold){
        ProductsOnHold.remove({'_id': product._id});
        return product._id;
      }
      Products.remove({'_id': product._id});
      return product._id;
      
    },
    'vendorEditDelivery': function(pack){
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      if (!user.profile.roles.includes('vendor')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }

      let vendor = Vendors.findOne({'vendor_id':user._id});
      if (!vendor){ vendor = VendorsOnHold.findOne({'vendor_id':user._id}); onHold = true; }       
      if (!vendor){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.');} 
      
      if (!vendor.terms){ vendor.terms = {}; }
      if (!vendor.terms.delivery){ vendor.terms.delivery = []; }
      if (!vendor.terms.deliveryData){ vendor.terms.deliveryData = []; }
      if (!pack.transportData){ throw new Meteor.Error('0007', 'Ocorreu um erro na validação dos dados inseridos no formulário, verifique se todos os campos foram preenchidos e tente novamente.'); }
      if (!pack.motoboyData){ throw new Meteor.Error('0008', 'Ocorreu um erro na validação dos dados inseridos no formulário, verifique se todos os campos foram preenchidos e tente novamente.'); }
      if (!pack.distanceLimit){ throw new Meteor.Error('0009', 'Ocorreu um erro na validação dos dados inseridos no formulário, verifique se todos os campos foram preenchidos e tente novamente.'); }
      
      for(let key in pack.transportData){
        if (key != 'freeDelivery'){ pack.transportData[key] = pack.transportData[key].toString().replace(',','.'); }
      }
      for(let key in pack.transportData.freeDelivery){
        if (key != 'enabled' && key != 'byPrice'){ pack.transportData.freeDelivery[key] = pack.transportData.freeDelivery[key].toString().replace(',','.'); }
      }
      for(let key in pack.motoboyData){
        if (key != 'freeDelivery' && key != 'box'){ pack.motoboyData[key] = pack.motoboyData[key].toString().replace(',','.'); }
      }
      for(let key in pack.motoboyData.freeDelivery){
        if (key != 'enabled' && key != 'byPrice'){ pack.motoboyData.freeDelivery[key] = pack.motoboyData.freeDelivery[key].toString().replace(',','.'); }
      }
      for(let key in pack.motoboyData.box){
        pack.motoboyData.freeDelivery[key] = pack.motoboyData.box[key].toString().replace(',','.'); 
      }

      if (!pack.distanceLimit){ pack.distanceLimit = { enabled: false, distance: 50}; }
      pack.distanceLimit.distance = parseFloat(pack.distanceLimit.distance.toString().replace(',', '.'));
      if (!pack.distanceLimit.distance > 0){ pack.distanceLimit.enabled = false; }
      vendor.terms.delivery[0] = pack.doMotoboy ? pack.doMotoboy : false;
      vendor.terms.delivery[1] = pack.doCorreios ? pack.doCorreios : false;
      vendor.terms.delivery[2] = pack.doCorreios ? pack.doCorreios : false;
      vendor.terms.delivery[3] = pack.doTransport ? pack.doTransport : false;
      vendor.terms.delivery[4] = pack.doTakeIn ? pack.doTakeIn : false; 
      vendor.terms.delivery[5] = pack.doMotoboy_2 ? pack.doMotoboy_2 : false;     
      vendor.terms.deliveryData[1] = pack.motoboyData;
      vendor.terms.deliveryData[4] = pack.transportData;

      if (!onHold){ 
        Vendors.update({'vendor_id': user._id}, { $set: {'distanceLimit': pack.distanceLimit, 'terms': vendor.terms } });
      }else{
        VendorsOnHold.update({'vendor_id': user._id}, { $set: {'distanceLimit': pack.distanceLimit, 'terms': vendor.terms } });
      }

    },
    'saveServiceAddress': function(pack){
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      if (!user.profile.roles.includes('service')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de fornecedor para realizar esta ação.'); }

      let service = Services.findOne({'service_id':user._id});
      if (!service){ service = ServicesOnHold.findOne({'service_id':user._id}); onHold = true; }
      if (!service){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }
      if (!service.address){       
        service.address = {}; 
        if (!service.address.coords){ service.address.coords = {}; }
        if (!service.address.coords.selected){ 
          service.address.coords.selected = {lat: 0, lng: 0}; 
          pack.valid = false;
        }
        if (!service.address.coords.address){ 
          service.address.coords.address = { lat: 0, lng: 0}; 
          pack.valid = false;
        }
      }
      if (pack.numero != undefined){ service.address.numero = pack.numero; }
      if (pack.rua != undefined){ service.address.rua = pack.rua; }
      if (pack.bairro != undefined){ service.address.bairro = pack.bairro; }
      if (pack.cidade != undefined){ service.address.cidade = pack.cidade; }
      if (pack.UF != undefined){ service.address.UF = pack.UF; }
      if (pack.estado != undefined){ service.address.estado = pack.estado; }
      if (pack.pais != undefined){ service.address.pais = pack.pais; }
      if (pack.cep != undefined){ service.address.cep = pack.cep; }
      if (pack.complemento != undefined){ service.address.complemento = pack.complemento;  }else{ service.address.complemento = ''; }
      pack.valid = true;
      if (pack.coords){      
        if (pack.coords.selected){ 
          if (pack.coords.selected.lat != undefined && pack.coords.selected.lng != undefined){
            service.address.coords.selected = pack.coords.selected; 
            if (pack.coords.selected.lat == 0 || pack.coords.selected.lng == 0){
              pack.valid = false;
            }
          }
        }
        if (pack.coords.address){
          if (pack.coords.address.lat != undefined && pack.coords.address.lng != undefined){
              service.address.coords.address = pack.coords.address; 
              if (pack.coords.address.lat == 0 || pack.coords.address.lng == 0 ){
                pack.valid = false;
              }
            }
          }
      }
      if (onHold){
        ServicesOnHold.update({'service_id':user._id}, {$set:{ 'address': {
          'numero': service.address.numero,
          'rua': service.address.rua,
          'bairro': service.address.bairro,
          'cidade': service.address.cidade,
          'UF': service.address.UF,
          'estado': service.address.estado,
          'pais': service.address.pais,
          'cep': service.address.cep,
          'complemento': service.address.complemento,
          'coords':{
            'selected':{
              'lat': service.address.coords.selected.lat,
              'lng': service.address.coords.selected.lng
            },
            'address':{
              'lat': service.address.coords.address.lat,
              'lng': service.address.coords.address.lng
            }
          },
          'valid': pack.valid
        }}});
      }else{
        Services.update({'service_id':user._id}, {$set:{ 'address': {
          'numero': service.address.numero,
          'rua': service.address.rua,
          'bairro': service.address.bairro,
          'cidade': service.address.cidade,
          'UF': service.address.UF,
          'estado': service.address.estado,
          'pais': service.address.pais,
          'cep': service.address.cep,
          'complemento': service.address.complemento,
          'coords':{
            'selected':{
              'lat': service.address.coords.selected.lat,
              'lng': service.address.coords.selected.lng
            },
            'address':{
              'lat': service.address.coords.address.lat,
              'lng': service.address.coords.address.lng
            }
          },
          'valid': pack.valid
        }}});
      }
      return true;      
    }, 
    'saveServiceSettings': function(pack){
      if (!Meteor.userId()){ return; }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      let onHold = false;
      let clientSideErrors = pack.clientSideErrors;
      let serverSideErrors = [];
      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.'); }
      if (!user.profile.roles.includes('service')){ throw new Meteor.Error('0002', 'Você deve ter um perfil de prestador de serviço para realizar esta ação.'); }
      let services = [];
      let lineBreaks = []; 
      let service = Services.findOne({'service_id':user._id});
      if (!service){ service = ServicesOnHold.findOne({'service_id':user._id}); onHold = true;}
      if (!service){ throw new Meteor.Error('0006', 'Ocorreu um erro na validação da sua conta, entre em contato com nossa equipe de suporte para relatar o problema.'); }  
      
      if (pack.img_url != undefined){ service.img_url = pack.img_url; }else{ service.img_url = ''; }      
      if (pack.banner_url != undefined){ service.banner_url = pack.banner_url; }else{ service.banner_url = ''; } 
      if (pack.display_name != undefined){ service.display_name = pack.display_name; }else{ service.display_name = ''; }
      if (pack.birthday != undefined){ service.birthday = pack.birthday; }else{ service.birthday = ''; }
      if (pack.cpf != undefined){ service.cpf = pack.cpf; }else{ service.cpf = ''; }
      if (pack.cnpj != undefined){ service.cnpj = pack.cnpj; }else{ service.cnpj = ''; }
      if (pack.phone != undefined){ service.phone = pack.phone; }else{ service.phone = ''; }      
      if (pack.cellphone != undefined){ service.cellphone = pack.cellphone; }else{ service.cellphone = ''; }
      if (pack.description != undefined){ service.description = pack.description; }else{ service.description = ''; }
      if (pack.hidden != undefined){ service.hidden = pack.hidden }else{ service.hidden = true; }
      service.social = {};
      if (pack.facebook != undefined){ service.social.facebook = pack.facebook; }else{ service.facebook = ''; }
      if (pack.instagram != undefined){ service.social.instagram = pack.instagram; }else{ service.social.instagram = ''; }
      if (pack.twitter != undefined){ service.social.twitter = pack.twitter; }else{ service.social.twitter = ''; }
      if (pack.linkedin != undefined){ service.social.linkedin = pack.linkedin; }else{ service.social.linkedin = ''; }
      service.gallery = [];
      if (pack.gallery != undefined){ if (Array.isArray(pack.gallery)){ service.gallery = pack.gallery; } }
      if (pack.services != undefined){
        if (Array.isArray(pack.services)){
          if (pack.services.length > 0){
            pack.services.map((service, index)=>{
              if (!service.length < 3){ services.push(service); }
            });
            if (services.length == 0){
              serverSideErrors.push('Você deve selecinar ao menos uma categoria de serviço.');
            }else{
              service.services = services;
            }
          }else{
            serverSideErrors.push('Você deve selecinar ao menos uma categoria de serviço.');
          }
        }else{
          serverSideErrors.push('Você deve selecinar ao menos uma categoria de serviço.');
        }
      }else{
        serverSideErrors.push('Você deve selecinar ao menos uma categoria de serviço.');
      }
      if (pack.display_name.length < 3){
        serverSideErrors.push('O campo "Nome completo" é obrigatório.');
      }
      if (pack.birthday.length < 10){
        serverSideErrors.push('O campo "Data de nascimento" é obrigatório.');
      }else{
        if (!validateDate(pack.birthday, 'boolean', 'dd/mm/yyyy')){
          serverSideErrors.push('A data de nascimento inserida não é válida.');
        }
      }
      if (pack.cpf.length < 14){
        serverSideErrors.push('O campo "CPF" é obrigatório.');
      }
      if (pack.cellphone.length < 13){
        serverSideErrors.push('O campo "Celular" é obrigatório.');
      }
      if (pack.description.length < 3){
        serverSideErrors.push('O campo "Apresentação breve" é obrigatório.');
      }  
      if (pack.description.length > 500){
        serverSideErrors.push('Sua apresentação deve ter no máximo 500 caracteres.');
      }
      if (pack.description != null && pack.description != undefined){
        lineBreaks = pack.description.match(/\r\n?|\n/g);
        if (lineBreaks != null && lineBreaks != undefined){
          if (lineBreaks.length > 25){
            if (!this.serverSideErrors.includes('Sua apresentação deve ter no mínimo 30 caracteres.')){ this.serverSideErrors.push('Sua apresentação deve ter no mínimo 30 caracteres.'); }
          } 
          if (pack.description.length - lineBreaks.length < 30){
            if (!this.serverSideErrors.includes('Sua apresentação deve ter no mínimo 30 caracteres.')){ this.serverSideErrors.push('Sua apresentação deve ter no mínimo 30 caracteres.'); }
          }
        }        
      }
      if (pack.description.length < 30){        
        if (!this.serverSideErrors.includes('Sua apresentação deve ter no mínimo 30 caracteres.')){ this.serverSideErrors.push('Sua apresentação deve ter no mínimo 30 caracteres.'); }
      } 
      service.status = (serverSideErrors.length > 0) ? 'incomplete' : 'complete';
      if (!service.hidden){ service.hidden = (serverSideErrors.length > 0); }
      if (onHold){
        ServicesOnHold.update({'_id':service._id}, {$set:{    
          'perfilStatus': service.status,        
          'img_url': service.img_url, 
          'banner_url': service.banner_url,
          'display_name': service.display_name, 
          'birthday': service.birthday,
          'cpf': service.cpf,
          'cnpj': service.cnpj,
          'phone': service.phone, 
          'cellphone': service.cellphone, 
          'description': service.description,
          'services': service.services,
          'gallery': service.gallery,
          'social': service.social,
          'hidden': service.hidden
        }});
      }else{
        Services.update({'_id':service._id}, {$set:{       
          'perfilStatus': service.status,       
          'img_url': service.img_url, 
          'banner_url': service.banner_url,
          'display_name': service.display_name, 
          'birthday': service.birthday,
          'cpf': service.cpf,
          'cnpj': service.cnpj,
          'phone': service.phone, 
          'cellphone': service.cellphone, 
          'description': service.description,
          'services': service.services,
          'gallery': service.gallery,
          'social': service.social,
          'hidden': service.hidden
        }});
      }
      return {serverErrors: serverSideErrors, clientErrors: clientSideErrors};
    },
    'admin.update.user': function(pack){
        let admin = Meteor.users.findOne({'_id': Meteor.userId()});
        if (!admin.profile){ throw new Meteor.Error('0000', 'Você não tem permissão para executar essa ação.'); }
        if (!admin.profile.roles){ throw new Meteor.Error('0001', 'Você não tem permissão para executar essa ação.'); }
        if (!admin.profile.roles.includes('admin')){ throw new Meteor.Error('0000', 'Você não tem permissão para executar essa ação.'); }
        let user = Meteor.users.findOne({'_id': pack._id});
        if (!user){  throw new Meteor.Error('0002', 'Não foi possível identificar o usuário.'); }
        let emails = user.emails;
        if (!emails){ emails = []; }
        emails[0] = {address: pack.email, verified: false};
        let cpfCnpj = (pack.cnpj) ? pack.cnpj : user.profile.cpfCnpj;
        cpfCnpj = (pack.cpf) ? pack.cpf : user.profile.cpfCnpj;
        if (/^\d{2}.\d{3}.\d{3}\/\d{4}\-\d{2}$/.test(pack.cnpj)){ cpfCnpj = pack.cnpj; }
        if (/^\d{3}.\d{3}.\d{3}\-\d{2}$/.test(pack.cpf)){ cpfCnpj = pack.cpf; }        
        Meteor.users.update({'_id': pack._id}, { $set:{'username':pack.email, 'emails':emails, 'profile.fullName':pack.firstName+' '+pack.lastName, 'profile.firstName':pack.firstName, 'profile.lastName':pack.lastName, 'profile.cpf':pack.cpf, 'profile.cnpj':pack.cnpj, 'profile.cpfCnpj':cpfCnpj, 'profile.phone':pack.phone, 'profile.birthday':pack.birthday}});
        return;
    },
    'admin.update.password': function(pack){
      let admin = Meteor.users.findOne({'_id': Meteor.userId});
      if (!admin){ throw new Meteor.Error('0000', 'Você não tem permissão para executar essa ação.'); }
      if (!admin.profile){ throw new Meteor.Error('0001', 'Você não tem permissão para executar essa ação.'); }
      if (!admin.profile.roles){ throw new Meteor.Error('0002', 'Você não tem permissão para executar essa ação.'); }
      if (!admin.profile.roles.includes('admin')){ throw new Meteor.Error('0003', 'Você não tem permissão para executar essa ação.'); }
      let user = Meteor.users.findOne({'_id': pack.user_id});
      if (!user){ throw new Meteor.Error('0004', 'Não foi possível identificar o usuário.'); }
      if (pack.password.length < 8){ throw new Meteor.Error('0005', 'A senha deve ter pelo menos 8 caracteres.'); }
      Accounts.setPassword(pack.user_id, pack.password);
    },
    'profile.internChangePassword': function(oldPassword, password){
      let user = Meteor.users.findOne({'_id': Meteor.userId()});
      let resetToken = user.resetToken;
      let name = user.profile.firstName.trim();
      let email = user.username;
      name = name.split(' ');
      name = name[0];
      name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();     

      if (!resetToken){ resetToken = {}; }
      resetToken.insideChange = { token: '', date: new Date };
      if (!user){ throw new Meteor.Error('1001', 'Ocorreu um erro durante a validação do usuario.'); }
      if (!password){ password = ''; }
      if (!password.length > 7){ throw new Meteor.Error('1002', 'Sua senha deve conter ao menos 8 caracteres.'); }
      if (user.resetToken){
        if (user.resetToken.insideChange){
          let token = user.resetToken.insideChange;
          let now = (new Date).getTime()/1000/60/60;
          if (now - token.date.getTime()/1000/60/60 < 24){ throw new Meteor.Error('1002', 'Você deve aguardar ao menos 24 horas para que seja possível alterar sua senha novamente.'); }
        }
      }      
      
      user = Meteor.user();
      if (!user){ throw new Meteor.Error('1003', 'Ocorreu um erro durante a validação do usuario.'); }
      let encrypt = {digest: oldPassword, algorithm: 'sha-256'}
      let result = Accounts._checkPassword(user, encrypt);
      console.log(result);
      if (result.error != null){ throw new Meteor.Error('1004', 'Não foi possível efetuar a troca de senha, verifique se sua senha atual esta correta.'); }
      
      let data = {
        name: name,
        to: name + ' <' + email + '>',
        from: 'MateriaisON <contato@materiaison.com.br>',
        subject: 'Alteração de senha na MateriaisON',
      }
      let htmlMail = new Email_HTML(data, 'internChangePassword');
      
      Meteor.users.update({'_id': user._id}, {$set:{'resetToken': resetToken}});
      return true
    },
    'serviceInboxOrderOpen': function(_id){
      let user = Meteor.users.findOne({'_id': Meteor.userId()});
      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados tente novamente mais tarde, ou entre em contato com a equipe de suporte.'); }
      if (!user.profile){ if (!user){ throw new Meteor.Error('0002', 'Ocorreu um erro na validação dos dados tente novamente mais tarde, ou entre em contato com a equipe de suporte.'); } }
      if (!user.profile.roles.includes('service')){ throw new Meteor.Error('0003', 'Você deve ser um prestador de serviço para realizar esta ação.'); }
      
      let service = Services.findOne({ 'service_id': Meteor.userId() });
      if (!service){ ServicesOnHold.findOne({ 'service_id': Meteor.userId() });} 
      if (!service){ throw new Meteor.Error('0004', 'Não foi possível encontrar seu registro como prestador de seriviço, tente atualizar a página ou entrar em contato com a equipe de suporte'); }
      
      let mail = ServiceInbox.findOne({'_id': _id});
      if (mail.service_id == service._id){ ServiceInbox.update({'_id': _id}, { $set:{'seen': true}}); return; }
      
    },
    'serviceInboxOrderDelete': function(_id){
      let user = Meteor.users.findOne({'_id': Meteor.userId()});
      if (!user){ throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados tente novamente mais tarde, ou entre em contato com a equipe de suporte.'); }
      if (!user.profile){ if (!user){ throw new Meteor.Error('0002', 'Ocorreu um erro na validação dos dados tente novamente mais tarde, ou entre em contato com a equipe de suporte.'); } }
      if (!user.profile.roles.includes('service')){ throw new Meteor.Error('0003', 'Você deve ser um prestador de serviço para realizar esta ação.'); }
      
      let service = Services.findOne({ 'service_id': Meteor.userId() });
      if (!service){ ServicesOnHold.findOne({ 'service_id': Meteor.userId() });} 
      if (!service){ throw new Meteor.Error('0004', 'Não foi possível encontrar seu registro como prestador de seriviço, tente atualizar a página ou entrar em contato com a equipe de suporte'); }
      
      let mail = ServiceInbox.findOne({'_id': _id});
      console.log(mail)
      console.log(Meteor.userId());
      console.log(_id)
      if (mail.service_id == service._id){
          ServiceInbox.remove(_id);
          return;
      }
    },
    'joinOurTeam': function(user){
      let userEmail = EmailsOnHold.findOne({'email': user.email.toLowerCase()});
      let newEmail = false; 
      let now = new Date();
      if (userEmail){
        newEmail = false;
        if (!userEmail.emailExchange){ userEmail.emailExchange = {}; }        
      }else{
        newEmail = true;
        userEmail = { emailExchange: { joinOurTeam: { lastEmail: new Date(), block: false } } };
      }
      if (!newEmail){
        if (!userEmail.emailExchange.joinOurTeam){ 
          userEmail.emailExchange.joinOurTeam = { lastEmail: new Date(), block: false }; 
        }else{
          let block = userEmail.emailExchange.joinOurTeam.block;
          let lastEmail = userEmail.emailExchange.joinOurTeam.lastEmail;
          if (block){
            throw new Meteor.Error('0001', 'Seu e-mail esta temporariamente bloqueado, entre em contato com nossa equipe de suporte para mais informações.');
          }        
          if ((now - lastEmail) / 1000 / 60 < 15){
            console.log((now - lastEmail) / 1000 / 60);
            throw new Meteor.Error('0002', 'Você acabou de se cadastrar em nossa plataforma, aguarde alguns minutos caso queira enviar novamente, ou entre em mande um e-mail para nossa equipe de suporte.');
          }
        }        
      }
      let fullName = user.nome;
      let name = fullName.split(' ');
      let mail = {
        to: 'contato@materiaison.com.br',
        from: 'MateriaisON <contato@materiaison.com.br>',
        subject:name[0].charAt(0).toUpperCase() + name[0].slice(1) + ' quer se juntar a nossa plataforma!',
        html: `
          <div style="width:100%;">Nome: ` + user.nome + `</div>
          <div style="width:100%;">Celular: ` + user.celular + `</div>
          <div style="width:100%;">Email: ` + user.email + `</div>        
        `
      }
      Email.send(mail)
      
      let mailData = {
        name: name[0].charAt(0).toUpperCase() + name[0].slice(1),
        to: user.email,
        from: 'MateriaisON<contato@materiaison.com.br>',
        subject: 'Obrigado por se cadastrar na MateriaisON!',
      }
      let htmlMail = new Email_HTML(mailData, 'joinOurTeam');
      if (newEmail){
        EmailsOnHold.insert({'email': user.email, 'name': fullName, 'emailExchange': userEmail.emailExchange});
      }else{
        userEmail.emailExchange.joinOurTeam.lastEmail = new Date();
        EmailsOnHold.update({'email': user.email}, { $set:{'emailExchange': userEmail.emailExchange}})
      }
      return;
    },
    'sendMessage': function(message){      
      if (!Meteor.userId()){ 
        throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.');
      }
      let user = Meteor.users.findOne({ '_id': Meteor.userId() });
      if (!user){
        throw new Meteor.Error('0001', 'Ocorreu um erro na validação dos dados, verifique sua conexão com a internet e tente novamente.');
      } 
      let userEmail = EmailsOnHold.findOne({'email': user.username.toLowerCase()});
      let newEmail = false; 
      let now = new Date();
      if (userEmail){
        newEmail = false;
        if (!userEmail.emailExchange){ userEmail.emailExchange = {}; }
        if (!userEmail.emailExchange.contactUs){ userEmail.emailExchange.contactUs = { lastEmail: new Date(), block: false }; }
      }else{
        newEmail = true;
        userEmail = { emailExchange: { contactUs: { lastEmail: new Date(), block: false } } };
      }
      if (!newEmail){
        let block = userEmail.emailExchange.contactUs.block;
        if (block){
          throw new Meteor.Error('0001', 'Seu e-mail esta temporariamente bloqueado, entre em contato com nossa equipe de suporte para mais informações.');
        }
        let lastEmail = userEmail.emailExchange.contactUs.lastEmail;
        if ((now - lastEmail) / 1000 / 60 < 15){
          throw new Meteor.Error('0002', 'Você acabou de entrar em contato conosco, aguarde 15 minutos caso queira mandar outra mensagem.');
        }
      }
      let data = {
        user: user,
        message: message,
        to: '<Vendedor ' + user.profile.firstName + '>',
        from: 'MateriaisON<contato@materiaison.com.br>',
        subject: 'O vendedor ' + user.profile.fullName + ' acabou de entrar em contato!'
      }      
      if (newEmail){
        EmailsOnHold.insert({'email': user.username.toLowerCase(), 'name': user.profile.fullName, 'emailExchange': userEmail.emailExchange});
      }else{
        userEmail.emailExchange.contactUs.lastEmail = new Date();
        EmailsOnHold.update({'email': user.username.toLowerCase()}, { $set:{'emailExchange': userEmail.emailExchange}})
      
        let htmlMail = new Email_HTML(data, 'vendorContact');}
      return;
    },
    //ADMIN
    'admin.impersonateUser': function(_id){
      let user = Meteor.users.findOne({'_id': _id});
      let admin = Meteor.users.findOne({'_id': Meteor.userId()});
      if (!user){ throw new Meteor.Error('0000', 'Não foi possível encontrar o usuáro.'); }
      if (!admin.profile){ throw new Meteor.Error('0001', 'Você deve ter uma conta de administrador para executar essa ação.'); }
      if (!admin.profile.roles){ throw new Meteor.Error('0002', 'Você deve ter uma conta de administrador para executar essa ação.'); }
      if (!admin.profile.roles.includes('admin')){ throw new Meteor.Error('0003', 'Você deve ter uma conta de administrador para executar essa ação.'); }
      this.setUserId(_id);
    }

  })
  
});
