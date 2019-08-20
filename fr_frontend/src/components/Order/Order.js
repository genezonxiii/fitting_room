import React from "react";
import "./Order.css";

const axios = require('axios');
 
class Order extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: this.props.user,
      orderList: this.props.orderList,
      product: {
        product_id: '',
        kind: '',
        c_product_id: '',
        product_name: '',
        brand: '',
        photo: '',
        desc: '',
        color: '',
        size: ''
      },
      sizeList: [],
      colorList: [],
      finalOrderList: []
    }

    this.renderProduct = this.renderProduct.bind(this);
    this.renderSize = this.renderSize.bind(this);
    this.renderColor = this.renderColor.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    var self = this;
    const { orderList, finalOrderList } = this.state;

    const order = {
      user_id: this.props.user.id,
      detail: finalOrderList
    }

    if(finalOrderList.length == 0 || finalOrderList.length < orderList.length) {
      console.log('not yet');
    } else {
      axios.post(`http://localhost:3001/api/order`, order)
        .then(function(response) {
          // handle success
          console.log(response);
          self.props.confirm();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }
  }

  renderSize() {
    const { product, sizeList } = this.state;
    const product_id = product.product_id;

    const handleBtnSizeClick = (e) => {
      const size = e.target.getAttribute('data-key');

      var self = this;
      axios.get(`http://localhost:3001/api/color/${product_id}/${size}`)
        .then(function(response) {
          // handle success
          self.setState({
            colorList: response.data,
            product: {
              ...self.state.product,
              size: size
            }
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

    return (
      <div>
        {
          sizeList.map(function(d, idx){
            return (
              <button 
                key={`size-${idx}`}
                data-key={d.size}
                onClick={(e) => handleBtnSizeClick(e)}
              >
                {d.size}
              </button>
            )
          })
        }
      </div>
    )
  }

  renderColor() {
    const { product, colorList } = this.state;
    const product_id = product.product_id;
    let { finalOrderList } = this.state;
    
    const handleBtnColorClick = (e) => {
      const color = e.target.getAttribute('data-key');
      const newProduct = Object.assign({}, product, {
        color: color,
        qty: 1
      });

      const found = finalOrderList.some(el => el.product_id === newProduct.product_id);
      if (!found) {
        finalOrderList.push(newProduct);
      } else {
        finalOrderList = finalOrderList.map((item) => {
          if (item.product_id === newProduct.product_id) {
            return newProduct;
          } else {
            return item;
          }
        })
      };

      this.setState({
        product: newProduct,
        finalOrderList: finalOrderList
      })
    }

    return (
      <div>
        {
          colorList.map(function(d, idx){
            return (
              <button 
                key={`color-${idx}`}
                data-key={d.color}
                onClick={(e) => handleBtnColorClick(e)}
              >
                {d.color}
              </button>
            )
          })
        }
      </div>
    )
  }

  renderProduct() {
    const { product, colorList } = this.state;
    const product_id = product.product_id;

    return (
      <div>
        料號：{product.c_product_id}<br/>
        品名：{product.product_name}<br/>
        品牌：{product.brand}<br/>
        {
          product.size?`選擇尺寸: ${product.size}`:undefined
        }
        {
          product.color?`選擇顏色: ${product.color}`:undefined
        }

        <img 
          className="order_image"
          src={`http://localhost:3001/photo/${product.kind}/${product.photo}`} 
          alt={`${product.photo}`}
        />
        { this.renderSize() }
        { colorList.length > 0?this.renderColor():undefined }
      </div>
    )
  }

  render() {
    const { orderList, product } = this.state;
    
    const handleDivClick = (e) => {
      e.stopPropagation();

      const product_id = e.target.getAttribute('data-key');

      var self = this;
      axios.get(`http://localhost:3001/api/product/${product_id}`)
        .then(function(response) {
          // handle success

          //reset colorList
          self.setState({
            product: response.data[0],
            colorList: []
          })
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });

      axios.get(`http://localhost:3001/api/size/${product_id}`)
        .then(function(response) {
          // handle success
          self.setState({
            sizeList: response.data
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

    return (
      <div>
        <div 
          className="order_list"
        >
          {
            orderList.map(function(d, idx){
              return (
                <div 
                  key={`${idx}`}
                  onClick={(e) => handleDivClick(e)}
                >
                  <div data-key={d.product_id}>
                    {d.product_id}
                  </div>
                  <div data-key={d.product_id}>
                    料號: {d.c_product_id}
                  </div>
                  <div data-key={d.product_id}>
                    品牌: {d.brand}
                  </div>
                </div>
              )
            })
          }
        </div>

        { product.product_id?this.renderProduct():undefined }

        <button onClick={this.confirm}>
          確認
        </button>
      </div>
    );
  }
}

export default Order;
