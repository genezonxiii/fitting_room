import React from "react";
import HomeNav from "./HomeNav";
import UserInfo from "./UserInfo";
import ClothInfo from "./ClothInfo";
import Popup from "./Popup";
import Chatbot from "./Chatbot";

import * as CONSTANT from './constant';

const axios = require('axios');
var moment = require('moment');
 
class Order extends React.Component {
  constructor(props) {
    super(props)
    const { user, orderList, store } = this.props;

    this.state = {
      user: user,
      orderList: orderList,
      product: {},
      sizeList: [],
      colorList: [],
      finalOrderList: [],
      store: store,
      storeList: [],
      reserveDate: '',
      reserveTime: '',
      msgList: {
        msg1: false,
        msg2: false,
        msg3: false
      }
    }

    this.onChangeStore = this.onChangeStore.bind(this);
    this.onChangeReserveDate = this.onChangeReserveDate.bind(this);
    this.onChangeReserveTime = this.onChangeReserveTime.bind(this);
    this.setSizeAndColor = this.setSizeAndColor.bind(this);
    this.renderSize = this.renderSize.bind(this);
    this.renderColor = this.renderColor.bind(this);
    this.renderMsg1 = this.renderMsg1.bind(this);
    this.renderMsg2 = this.renderMsg2.bind(this);
    this.renderMsg3 = this.renderMsg3.bind(this);
    this.confirmMsg1 = this.confirmMsg1.bind(this);
    this.confirmMsg2 = this.confirmMsg2.bind(this);
    this.confirmMsg3 = this.confirmMsg3.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
  }

  componentDidMount() {
    let order = this.props.orderList[0];
    this.setSizeAndColor(order);
    this.setState({
      product: order
    })
    this.getStoreList();
    this.setState({
      reserveDate: moment().format("YYYY-MM-DD"),
      reserveTime: moment().add(5, "minutes").format("HH:mm"),
    })
  }

  confirmMsg1() {
    const { orderList, finalOrderList, msgList } = this.state;
    const { reserveDate, reserveTime } = this.state;

    if(finalOrderList.length === 0 
      || orderList.some(item=>!item.color || !item.size)
      || finalOrderList.some(item=>!item.color || !item.size)
      || finalOrderList.length < orderList.length
      || reserveDate == ''
      || reserveTime == '') {
      this.setState({
        msgList: {
          ...msgList,
          msg1: true
        }
      })
    } else {
      this.confirmMsg2();
    }
  }

  confirmMsg2() {
    this.setState({
      msgList: {
        ...this.state.msgList,
        msg2: true
      }
    })
  }

  confirmMsg3() {
    this.setState({
      msgList: {
        ...this.state.msgList,
        msg3: true
      }
    })
  }

  confirmOrder() {
    var self = this;
    const { orderList, finalOrderList, store, reserveDate, reserveTime } = this.state;
    const { user, setting } = this.props;

    const order = {
      user_id: user.id,
      detail: finalOrderList,
      setting: setting,
      store: store,
      reserve: `${reserveDate} ${reserveTime}`
    }

    if(finalOrderList.length === 0 || finalOrderList.length < orderList.length) {
      console.log('not yet');
    } else {
      axios.post(`${CONSTANT.WS_URL}/api/order`, order)
        .then(function(response) {
          // handle success
          self.confirmMsg3();
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

  setSizeAndColor(order) {
    const { store } = this.props;
    const self=this;
    axios.get(`${CONSTANT.WS_URL}/api/detail/${order.product_id}/${store}`)
      .then(function(response) {
        // handle success
        const result = response.data;

        // distinct Size
        let setSize = new Set();
        result.forEach(item=>{
          setSize.add(item.size)
        })

        let arSize = [];

        // put color list into size
        setSize.forEach(item=>{
          let setColor = new Set();
          let filter_array = result.filter(d => d.size === item);

          filter_array.forEach(color => {
            setColor.add(color)
          })

          let target = Object.assign({}, filter_array[0], {
            detail: Array.from(setColor )
          })
          arSize.push(target);
        })

        let defColorList = arSize.length>0?arSize[0].detail:[];

        defColorList = order.size?arSize.find(item=>item.size===order.size).detail:defColorList;

        // default color and size
        self.setState({
          sizeList: arSize,
          colorList: defColorList
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

  renderSize() {
    const { product, sizeList, orderList } = this.state;

    const handleBtnSizeClick = (e) => {
      const size = e.target.getAttribute('data-key');
      const colorList=sizeList.find(item=>item.size===size).detail;
      const newProduct = {
        ...product,
        size: size,
        color: ''
      };

      const newOrderList = orderList.map(order=>order.product_id===product.product_id?newProduct:order);

      this.setState({
        colorList: colorList,
        orderList: newOrderList,
        product: newProduct
      })
    }

    return (
      <div className="form-row">
        <div className="clothes-size-wrap">
        {
          sizeList.map(function(d, idx){
            return (
              <span 
                key={`size-${idx}`}
                className={product.size === d.size ? 'clothes-size-option active' : 'clothes-size-option'}
                data-key={d.size}
                onClick={(e) => handleBtnSizeClick(e)}
              >
                {d.size}
              </span>
            )
          })
        }
        </div>
      </div>
    )
  }

  renderColor() {
    const { product, colorList, orderList } = this.state;
    let { finalOrderList } = this.state;

    const handleBtnColorClick = (e) => {
      const color = e.target.getAttribute('data-key');
      const newProduct = {
        ...product,
        color: color,
        qty: 1
      };

      const newOrderList = orderList.map(order=>order.product_id===product.product_id?newProduct:order);

      const found = finalOrderList.some(el => el.product_id === newProduct.product_id);
      if (!found) {
        finalOrderList.push(newProduct);
      } else {
        finalOrderList = finalOrderList.map(item => item.product_id === newProduct.product_id?newProduct:item)
      };

      this.setState({
        orderList: newOrderList,
        product: newProduct,
        finalOrderList: finalOrderList
      })
    }

    return (
      <div className="form-row">
        <div className="clothes-color-wrap">
        {
          colorList.map(function(d, idx){
            return (
              <span 
                key={`color-${idx}`}
                className={product.color === d.color ? `clothes-color-option ${d.color_code} active` : `clothes-color-option ${d.color_code}`}
                data-key={d.color}
                onClick={(e) => handleBtnColorClick(e)}
              >
              </span>
            )
          })
        }
        </div>
      </div>
    )
  }

  renderMsg1() {
    const { msgList } = this.state;

    const handelOK = (e) => {
      this.setState({
        msgList: {
          ...msgList,
          msg1: false
        }
      })
    }

    return (
      <Popup
        active={msgList.msg1}
        msg="請挑選您要試穿的尺寸及顏色，並選擇預約時間唷！"
        btns={{ok:true}}
        ok={handelOK}
      />
    )
  }

  renderMsg2() {
    const { msgList } = this.state;

    const handelOK = (e) => {
      this.confirmOrder();

      this.setState({
        msgList: {
          ...msgList,
          msg2: false
        }
      })
    }

    const handelCancel = (e) => {
      this.setState({
        msgList: {
          ...msgList,
          msg2: false
        }
      })
    }

    return (
      <Popup
        active={msgList.msg2}
        msg="是否確認送出?"
        btns={{ok:true, cancel: true}}
        ok={handelOK}
        cancel={handelCancel}
      />
    )
  }

  renderMsg3() {
    const { msgList, reserveDate, reserveTime } = this.state;

    const handelOK = (e) => {
      this.props.confirm();
      this.setState({
        msgList: {
          ...msgList,
          msg3: false
        }
      })
    }

    return (
      <Popup
        active={msgList.msg3}
        msg={`店員已收到您的試衣清單。於${reserveDate} ${reserveTime} 恭候您的大駕光臨！！您還可以繼續挑選其他的穿搭唷！！`}
        btns={{ok:true}}
        ok={handelOK}
      />
    )
  }

  getStoreList() {
    const self = this;
    axios.get(`${CONSTANT.WS_URL}/api/store/wen`)
      .then(function(response) {
        // handle success
        self.setStore(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  setStore(data) {
    this.setState({
      storeList: data
    })
  }

  onChangeStore (e) {
    this.setState({ store: e.target.value });
  }

  onChangeReserveDate(e) {
    this.setState({ reserveDate: e.target.value });
  }

  onChangeReserveTime(e) {
    this.setState({ reserveTime: e.target.value });
  }

  render() {
    const { orderList, product, sizeList, colorList, msgList, storeList } = this.state;
    
    const handleDivClick = (e) => {
      const product_id = parseInt(e.target.getAttribute('data-key'));
      if (!product_id) return;

      let order = orderList.find(order=>order.product_id===product_id);

      this.setSizeAndColor(order);
      this.setState({
        product: order
      })
    }

    return (
      <div className="page-body">

        <div className="bkg-circle-gray bkg-circle-big"></div>

        <UserInfo 
          user={this.props.user}
          handleLogout={this.props.handleLogout}
        />
        
        <HomeNav title="我要試穿" handleHome={this.props.handleHome} />

        <div className="tryon-wrap">

          <div className="clothes-customize-section ">
            {
              product && product.product_id?
              <div className="clothes-thumbnail">
                <img 
                  src={`${CONSTANT.WS_URL}/photo/${product.kind}/${product.photo}`}
                  alt={product.photo}
                />
              </div>
              :null
            }

            {
              product && product.product_id?
              <ClothInfo
                outfit={product}
                sizeList={sizeList}
                colorList={colorList}
                renderSize={this.renderSize}
                renderColor={this.renderColor}
              />
              :null
            }
          </div>

          <div className="clothes-list-section">
            <div className="reserveForm">
              <div className="form-row">
                <label htmlFor="reserveDate"><i className="mdi mdi-calendar-clock"></i> 預約時間</label>
                <input type="date" id="reserveDate" onChange={this.onChangeReserveDate} value={this.state.reserveDate} />
                <input type="time" onChange={this.onChangeReserveTime} value={this.state.reserveTime} />
              </div>
              <div className="form-row">
                <label htmlFor="reserveStore"><i className="mdi mdi-map-marker"></i> 預約店面</label>
                <select name="store" id="reserveStore" onChange={this.onChangeStore} value={this.state.store}>
                  {
                    storeList.map(function(d, idx){
                      return (
                        <option value={d.type} key={`store-${idx}`}>{d.value}</option>
                      )
                    })
                  }
                </select>
              </div>
            </div>
            <div className="clothes-list-wrap">
            {
              orderList.map(function(d, idx){
                return (
                  <div 
                    key={`order-list-${idx}`}
                    className={product.product_id === d.product_id ? 'clothes-list-card active' : 'clothes-list-card'}
                    data-key={d.product_id}
                    onClick={(e) => handleDivClick(e)}
                  >
                    <div className="clothes-thumbnail" data-key={d.product_id}>
                      <img 
                        src={`${CONSTANT.WS_URL}/photo/${d.kind}/${d.photo}`}
                        alt={d.photo}
                        data-key={d.product_id}
                      />
                    </div>

                    <ClothInfo
                      outfit={d}
                    />
                  </div>
                )
              })
            }
            </div>
          </div>

        </div>

        <div className="footer-control-wrap">
          <a 
            className="btn btn-icon-round" 
            type="button"
            onClick={this.confirmMsg1}
          >
            <div className='icon-round-bkg'><i className="mdi mdi-voice"></i></div>
            <span>通知店員</span>
          </a>
        </div>

        { msgList.msg1?this.renderMsg1():null }
        { msgList.msg2?this.renderMsg2():null }
        { msgList.msg3?this.renderMsg3():null }
        <Chatbot/>
      </div>
    );
  }
}

export default Order;
