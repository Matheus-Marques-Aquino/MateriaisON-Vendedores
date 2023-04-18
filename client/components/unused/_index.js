import React, { Component } from 'react';
import MainHeader from './subcomponents/mainHeader';
import Waiting from './subcomponents/widgets/waiting';
import history from './subcomponents/widgets/history';

class IndexPage extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    render(){
        if (Meteor.userId()){
            this.errors.push('Aguarde enquanto verificamos seus dados, você será notificado assim que for aprovado.');
            Meteor.logout();
        }
        history.push('/entrar')
        return(<div>
            <MainHeader/>
        </div>);
    }
}
export default IndexPage;