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

function App() {
  return (
    <Router>
      <div>
        <Header />

        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/style" component={ChooseStyle} />
        <Route path="/quest" component={Quest} />
        <Route path="/selfie" component={Selfie} />
        <Route path="/chooseModel" component={ChooseModel} />
        <Route path="/tryOn" component={TryOn} />
        <Route path="/order" component={Order} />
      </div>
    </Router>
  );
}

export default App;
