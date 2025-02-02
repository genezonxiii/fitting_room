import React from 'react';
import './App.css';

import 'react-id-swiper/lib/styles/css/swiper.css';
import './vendor/materialdesignicons.min.css';
import './styles.css';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ChooseStyle from './components/ChooseStyle';
import Quest from './components/Quest';
import Selfie from './components/Selfie';
import ChooseModel from './components/ChooseModel';
import TryOn from './components/TryOn';
import Order from './components/Order';

import MOrder from './components/Manage/Order/MOrder';
import MOrderDetail from './components/Manage/Detail/MDetail';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,
      isTryOn: false,
      model: '',
      orderList: []
    }

    this.handleHome = this.handleHome.bind(this);
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

  handleHome() {
    this.setState({
      isModel: false,
      isTryOn: false,
      model: ''
    })
  }

  onLoginConfirm(result, store) {
    this.setState({
      isLogin: result.success,
      isModel: false,
      isTryOn: false,
      user: result.result,
      store: store
    })
  }

  onModelChoose(data) {
    this.setState({
      sex: data.sex,
      model: data.model,
      setting: {
        sex: data.sex,
        model: data.model,
        model_id: data.model_id,
        method: data.method,
        age: data.age,
        sex_hide: data.sex_hide,
        age_hide: data.age_hide,
        persona: data.persona
      }
    })
  }

  onModelConfirm() {
    this.setState({
      isModel: true
    })
  }

  onTryOnConfirm(outfit) {
    let orderList = [];

    // cloth
    if (outfit.cloth && outfit.cloth.product_id) {
      orderList.push(outfit.cloth);
    }
    // pants
    if (outfit.pants && outfit.pants.product_id) {
      orderList.push(outfit.pants);
    }
    // dress
    if (outfit.dress && outfit.dress.product_id) {
      orderList.push(outfit.dress);
    }

    this.setState({
      isTryOn: true,
      orderList: orderList
    })
  }

  onOrderConfirm() {
    this.setState({
      isModel: false,
      isTryOn: false,
      model: ''
    })
  }

  render() {
    const { isLogin, isModel, isTryOn, user } = this.state;
    const { sex, model, setting, orderList, store } = this.state;
    return (
      <Router basename="vfit">
        <div>
          <Redirect exact from="/" to="/login" />
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
          <Route 
            path="/register" 
            render={(props) => {
                return isLogin?
                <Redirect to="/style"/>
                :
                <Register 
                  user={user}
                  {...props} 
                />
              }
            }
          />
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
          <Route 
            path="/quest" 
            render={(props) => {
                return isModel?
                <Redirect to="/tryOn"/>
                :
                <Quest 
                  user={user}
                  handleLogout={this.handleLogout}
                  handleHome={this.handleHome}
                  choose={this.onModelChoose}
                  confirm={this.onModelConfirm} 
                  {...props} 
                />
              }
            }
          />
          <Route 
            path="/selfie"
            render={(props) => {
                return isModel?
                <Redirect to="/tryOn"/>
                :
                <Selfie 
                  user={user}
                  handleLogout={this.handleLogout}
                  handleHome={this.handleHome}
                  choose={this.onModelChoose}
                  confirm={this.onModelConfirm}
                  {...props} 
                />
              }
            }
          />
          <Route 
            path="/chooseModel"
            render={(props) => {
                return isModel?
                <Redirect to="/tryOn"/>
                :
                <ChooseModel 
                  user={user}
                  handleLogout={this.handleLogout}
                  handleHome={this.handleHome}
                  choose={this.onModelChoose}
                  confirm={this.onModelConfirm} 
                  model={model}
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
                  user={user}
                  handleLogout={this.handleLogout}
                  handleHome={this.handleHome}
                  sex={sex}
                  model={model}
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
                  user={user}
                  handleLogout={this.handleLogout}
                  handleHome={this.handleHome}
                  orderList={orderList}
                  confirm={this.onOrderConfirm}
                  setting={setting}
                  store={store}
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
