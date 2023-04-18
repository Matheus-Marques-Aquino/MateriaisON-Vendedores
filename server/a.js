/*import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {  

  Slingshot.fileRestrictions('profile-pics', {
    allowedFileTypes: ['image/png', 'image/jpeg'],
    maxSize: 10 * 1024 * 1024
  });

  Slingshot.createDirective('profile-pics', Slingshot.S3Storage, {
    bucket: 'materiaison-image',
    region: 'us-east-1',
    AWSAccessKeyId: 'AKIAS5AE4XHRUDLAK7XT',
    AWSSecretAccessKey: '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',
    acl: 'public-read',  
    authorize: function () { return true },  
    key: function (file) { return 'profile-pics/' + Math.random(0).toString(36).slice(-5) + file.name; }
  });
  
  
  meteor add peerlibrary:aws-sdk
  meteor add edgee:slingshot
  s3_upload_settings = {
    maxSize: 10 * 1024 * 1024, // unlimited for now!
    bucket: 'materiaison-image',
    region: 'us-east-1',
    AWSAccessKeyId: 'AKIAS5AE4XHRUDLAK7XT',
    AWSSecretAccessKey: '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',
    acl: "public-read",
    authorize: function(){
      return true
    },
    key: function( file ){      
      return 'uploads/' + file.name;
    }
  },
  service_profile_settings = {
    allowedFileTypes: ['image/png', 'image/jpeg'],
    key: function( file ){
      return 'serviceProfilePics/' + Math.random(0).toString(36).slice(-5) + file.name;
    }
  },
  product_images_settings = {
    allowedFileTypes: ['image/png', 'image/jpeg'],
    key: function( file ){
      return 'productsPics/' + Math.random(0).toString(36).slice(-5) + file.name;
    }
  }
  _.defaults(service_profile_settings, s3_upload_settings);
  _.defaults(product_images_settings, s3_upload_settings);

  Slingshot.createDirective('profile-pics', Slingshot.S3Storage, service_profile_settings);
  Slingshot.createDirective('product-pics', Slingshot.S3Storage, product_images_settings);
 
  Accounts.validateNewUser((user) => {   
    if ( Meteor.users.find({'username': user.username}).count() > 0  ) { throw new Meteor.Error(403, 'Este endereço de e-mail já esta em uso.') }
    let lastVendor = Meteor.user.find({'profile.role': vendor}).sort({'id_vendor':-1}).limit(1);
    let id_vendor = 0;
    if (!lastVendor){
      id_vendor = 1;
    }else{
      id_vendor = lastVendor.profile.vendor_id + 1;
    }
    user.profile.id_vendor = id_vendor;
    user.profile.role = ['on-hold'];    
    /*let email = user.username;
    let name = user.profile.name.split(' ');
    name = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
    let data = {
      name: name,
      to: name + ' <' + email + '>',
      from: 'MateriaisON <contato@materiaison.com.br>',
      subject: 'Seja bem-vindo a MateriaisON, ' + name + '!',
    }          
    let htmlMail = new Email_HTML(data, 'newAccount');
    return true;
  });
  
}); */
