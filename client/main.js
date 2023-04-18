import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Link } from "react-router";
import history from './components/subcomponents/widgets/history';
import InvitePage from './components/invite_page';
//Cadastro
import ContactPage from './components/contact_page';
import LoginPage from './components/login_page';
import VendorSettingsPage from './components/vendor/vendor_settings_page';
import VendorAddressPage from './components/vendor/vendor_address_page';
import VendorBankPage from './components/vendor/vendor_bank_page';
import VendorDeliveryPage from './components/vendor/vendor_delivery_page';
import VendorDocumentsPage from './components/vendor/vendor_documents_page';
import ImportProductPage from './components/vendor/import_products';

import ServiceDocumentPage from './components/service/service_documents_page';
import ServiceBankPage from './components/service/service_bank_page';
import ServiceSettingsPage from './components/service/service_settings_page';
import ServiceAddressPage from './components/service/service_address_page';
import NewProductPage from './components/vendor/new_product_page';
import EditProductPage from './components/vendor/edit_product_page';
import InternAccountCreatePage from './components/intern_register';
import AccountIndexPage from './components/account_index';
import ProductListPage from './components/vendor/product_list';
import PrivacyPolicyPage from './components/privacy_policy_page';
import ServiceOrderPage from './components/service/service_orders_page';
import OrderPage from './components/vendor/order_page';
import OrdersListPage from './components/vendor/order_list';
import ConfigurationPage from './components/configuration_page';
import AccountValidatePage from './components/login_validation'
import CompleteOrdersListPage from './components/vendor/order_list_complete';
import UserListPage from './components/user_list_page';
import OrderExamplePage from './components/vendor/order_example_page';

const routes = (
<Router history={history}>
  <Switch> 
    {/*<Route path='/registrar/1'>
      <VendorCreateStoreAccountPage />         
    </Route>
    <Route path='/registrar/2'>
      <VendorCreateCNPJ
      AccountPage />      
    </Route>*/} 
    <Route path='/lista-de-usuarios'>
      <UserListPage/>
    </Route>
    <Route path='/validar'>
      <AccountValidatePage/>
    </Route>
    <Route path='/orcamentos-do-prestador-de-servico'>
      <ServiceOrderPage />
    </Route>
    <Route path='/endereco-do-prestador-de-servico'>
      <ServiceAddressPage />
    </Route>
    <Route path='/perfil-do-prestador-de-servico'>
      <ServiceSettingsPage />         
    </Route>
    <Route path='/configuracoes'>
      <ConfigurationPage/>
    </Route>
    <Route path='/contato'>
      <ContactPage/>
    </Route>
    <Route path='/politica-de-privacidade'>
      <PrivacyPolicyPage/>
    </Route>
    <Route path='/pedidos-em-andamento'>
      <OrdersListPage/>
    </Route>
    <Route path='/lista-de-pedidos'>
      <CompleteOrdersListPage/>
    </Route>
    <Route path='/pedido/'>
      <OrderPage/>
    </Route>
    <Route path='/pedido-teste/'>
      <OrderExamplePage/>
    </Route>
    <Route path='/documentos-do-fornecedor'>
      <VendorDocumentsPage />         
    </Route>   
    <Route path='/importar-produtos'>
      <ImportProductPage />
    </Route>
    <Route path ='/editar-produto/'>
      <EditProductPage />
    </Route>
    <Route path='/lista-de-produtos'>
      <ProductListPage />
    </Route>
    <Route path='/envio-do-fornecedor'>
      <VendorDeliveryPage />
    </Route>
    <Route path='/dados-bancarios-do-fornecedor'>
      <VendorBankPage />
    </Route>
    <Route path='/novo-produto'>
      <NewProductPage />         
    </Route>
    <Route path='/endereco-do-fornecedor'>
      <VendorAddressPage />         
    </Route>
    <Route path='/perfil-do-fornecedor'>
      <VendorSettingsPage />         
    </Route>
    <Route path='/index'>
      <AccountIndexPage />         
    </Route> 
    <Route path='/registrar'>
      <InternAccountCreatePage />         
    </Route>
    <Route path='/cadastre-se'>
      <InvitePage />         
    </Route>
    <Route path="/entrar">
      <LoginPage />
    </Route>
    <Route path="/">
      <LoginPage />
    </Route>    
    {/*

    <Route path='/importar-produtos'>
      <VendorImportProductPage />
    </Route>
    <Route path='/contato'>
      <ContactPage />
    </Route>
    <Route path='/endereco-do-prestador-de-servico'>
      <ServiceAddressPage />
    </Route>    
    <Route path='/documentos-do-prestador-de-servico'>
      <ServiceDocumentPage/>         
    </Route>
    <Route path='/dados-bancarios-do-prestador-de-servico'>
      <ServiceBankPage />         
    </Route>
    <Route path='/novo-produto'>
      <NewProductPage />         
    </Route>
    <Route path='/editar-produto'>
      <EditProductPage />         
    </Route>
    <Route path='/cadastrar-fornecedor'>
      <VendorCreateAccountPage />         
    </Route>
    
    <Route path='/endereco-do-fornecedor'>
      <VendorAddressPage />         
    </Route>
    <Route path='/dados-bancarios-do-fornecedor'>
      <VendorBankPage />         
    </Route>
    <Route path='/envio-do-vendedor'>
      <VendorDeliveryPage />
    </Route>
    <Route path='/produtos-do-fornecedor'>
      <VendorProductsPage />         
    </Route>
    <Route path='/documentos-do-fornecedor'>
      <VendorDocumentsPage />         
    </Route>    
    <Route path="/lista-de-produtos">
      <VendorProductListPage />
    </Route>
    
    
    <Route path="/">
      <LoginPage />
    </Route>*/}

    {/*
    <Route path="/registrar">
      <CreateAccountPage />         
    </Route>
    <Route path="/pedido/">
      <OrderPage/>         
    </Route>
    <Route path="/lista-de-produtos">
      <ProductListAccountPage />         
    </Route>
    <Route path="/novo-produto">
      <NewProductPage />         
    </Route>
     <Route path="/registrar">
      <CreateAccountPage />         
    </Route>
    <Route path="/entrar">
      <LoginPage />         
    </Route>
    <Route path="/">
      <IndexPage />         
    </Route>*/}
  </Switch>
</Router>)

Meteor.startup(() => {
  ReactDOM.render( routes, document.querySelector('.mainContainer'));
});
