import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

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

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false
    }

    this.onLoginConfirm = this.onLoginConfirm.bind(this);
    this.onModelConfirm = this.onModelConfirm.bind(this);
    this.onTryOnConfirm = this.onTryOnConfirm.bind(this);
  }

  onLoginConfirm(result) {
    this.setState({
      isLogin: result.success,
      user: result.result
    })
  }

  onModelConfirm(model) {
    console.log('onModelConfirm');
    this.setState({
      model: model
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
      orderList: orderList
    })
  }

  render() {
    return (
      <Router>
        <div>
          <Header 
            user={this.state.user}
          />

          <Route exact path="/" component={Home} />
          <Route 
            path="/login" 
            render={(props) => <Login 
                user={this.state.user}
                confirm={this.onLoginConfirm} 
                {...props} 
              />
            }
          />
          <Route path="/register" component={Register} />
          <Route path="/style" component={ChooseStyle} />
          <Route path="/quest" component={Quest} />
          <Route path="/selfie" component={Selfie} />
          <Route 
            path="/chooseModel"
            render={(props) => <ChooseModel 
                confirm={this.onModelConfirm} 
                {...props} 
              />
            }
          />
          <Route 
            path="/tryOn"
            render={(props) => <TryOn 
                model={this.state.model}
                confirm={this.onTryOnConfirm}
                {...props} 
              />
            }
          />
          <Route 
            path="/order"
            render={(props) => <Order 
                user={this.state.user}
                orderList={this.state.orderList}
                {...props} 
              />
            }
          />
        </div>
      </Router>
    );
  }
}

export default App;
