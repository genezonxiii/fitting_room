import React from "react";
import "./MOrder.css";

const axios = require('axios');
 
class Order extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderList: []
    }

    this.getList = this.getList.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  componentDidMount () {
    this.getList()
  }

  getList() {
    var self = this;
    axios.get(`http://localhost:3001/mapi/order`)
      .then(function(response) {
        // handle success
        self.setState({
          orderList: response.data
        })
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  renderList() {
    const { orderList } = this.state;
    return (
      <div
        className="order_list"
      >
        {
          orderList.map((item) => {
            return (
              <div
                className="order"
              >
                <span className="column">
                  {item.order_no}
                </span>
                <span className="column">
                  {item.mobile}
                </span>
                <span className="column">
                  {item.nick_name}
                </span>
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    return (
      <div>
        <div 
          className="order_list"
        >
          { this.renderList() }
        </div>
      </div>
    );
  }
}

export default Order;
