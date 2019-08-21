import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import ChooseStyle from './components/ChooseStyle';
import Quest from './components/Quest';
import Selfie from './components/Selfie';
import ChooseModel from './components/ChooseModel/ChooseModel';
import TryOn from './components/TryOn/TryOn';
import Order from './components/Order/Order';

import MOrder from './components/Manage/Order/MOrder';
import MOrderDetail from './components/Manage/Detail/MDetail';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false
    }

    this.handleLogout = this.handleLogout.bind(this);
    this.onLoginConfirm = this.onLoginConfirm.bind(this);
    this.onModelChoose = this.onModelChoose.bind(this);
    this.onModelConfirm = this.onModelConfirm.bind(this);
    this.onTryOnConfirm = this.onTryOnConfirm.bind(this);
    this.onOrderConfirm = this.onOrderConfirm.bind(this);
  }

  handleLogout() {
    this.setState({
      isLogin: false,
      user: {}
    })
  }

  onLoginConfirm(result) {
    this.setState({
      isLogin: result.success,
      isModel: false,
      isTryOn: false,
      user: result.result
    })
  }

  onModelChoose(model) {
    console.log('onModelChoose');
    this.setState({
      model: model
    })
  }

  onModelConfirm() {
    console.log('onModelConfirm');
    this.setState({
      isModel: true
    })
  }

  onTryOnConfirm(outfit) {
    console.log('onTryOnConfirm');
    let orderList = [];

    // cloth
    if (outfit.cloth && outfit.cloth.product_id) {
      orderList.push(outfit.cloth);
    }
    // pants
    if (outfit.pants && outfit.pants.product_id) {
      orderList.push(outfit.pants);
    }

    this.setState({
      isTryOn: true,
      orderList: orderList
    })
  }

  onOrderConfirm() {
    this.setState({
      isModel: false,
      isTryOn: false
    })
  }

  render() {
    const { isLogin, isModel, isTryOn, user } = this.state;
    return (
      <Router>
        <div>
          <Header 
            isLogin={isLogin}
            handleLogout={this.handleLogout}
            user={user}
          />

          <Route exact path="/" component={Home} />
          <Route 
            path="/login" 
            render={(props) => {
                return isLogin?
                <Redirect to="/style"/>
                :
                <Login 
                  user={user}
                  confirm={this.onLoginConfirm} 
                  {...props} 
                />
              }
            }
          />
          <Route path="/register" component={Register} />
          <Route 
            path="/style" 
            render={(props) => {
                return !isLogin?
                <Redirect to="/login" />
                :
                <ChooseStyle />
              }
            }
          />
          <Route path="/quest" component={Quest} />
          <Route path="/selfie" component={Selfie} />
          <Route 
            path="/chooseModel"
            render={(props) => {
                return isModel?
                <Redirect to="/tryOn"/>
                :
                <ChooseModel 
                  choose={this.onModelChoose}
                  confirm={this.onModelConfirm} 
                  {...props} 
                />
              }
            }
          />
          <Route 
            path="/tryOn"
            render={(props) => {
                return isTryOn?
                <Redirect to="/order"/>
                :
                <TryOn 
                  model={this.state.model}
                  confirm={this.onTryOnConfirm}
                  {...props} 
                />
              }
            }
          />
          <Route 
            path="/order"
            render={(props) => {
                return !(isModel || isTryOn)?
                <Redirect to="/style"/>
                :
                <Order 
                  user={this.state.user}
                  orderList={this.state.orderList}
                  confirm={this.onOrderConfirm}
                  {...props} 
                />
              }
            }
          />

          <Route exact path="/manage/order" component={MOrder} />
          <Route exact path="/manage/detail" component={MOrderDetail} />
        </div>
      </Router>
    );
  }
}

export default App;
