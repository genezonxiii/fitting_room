import React from "react";
import "./MDetail.css";
import * as CONSTANT from '../../constant';

const axios = require('axios');
 
class MOrderDetail extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      orderDetailList: []
    }

    this.getDetailList = this.getDetailList.bind(this);
    this.renderDetailList = this.renderDetailList.bind(this);
  }

  componentDidMount () {
    this.getDetailList()
  }

  getDetailList() {
    var self = this;
    axios.get(`${CONSTANT.WS_URL}/mapi/detail/1`)
      .then(function(response) {
        // handle success
        self.setState({
          orderDetailList: response.data
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

  renderDetailList() {
    const { orderDetailList } = this.state;
    return (
      <div
        className="order_list"
      >
        {
          orderDetailList.map((item) => {
            return (
              <div
                className="order"
              >
                <span className="column">
                  {item.color}
                </span>
                <span className="column">
                  {item.size}
                </span>
                <span className="column">
                  {item.product_name}
                </span>
                <span className="column">
                  {item.brand}
                </span>
                <img 
                  className="model"
                  src={`${CONSTANT.WS_URL}/photo/${item.kind}/${item.photo}`} 
                  alt={`${item.photo}`}
                />
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
          { this.renderDetailList() }
        </div>
      </div>
    );
  }
}

export default MOrderDetail;
