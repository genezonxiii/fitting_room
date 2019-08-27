import React from "react";
import Slider from "react-slick";

import HomeNav from "../HomeNav";
import UserInfo from "../UserInfo";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const axios = require('axios');
 
class ChooseModel extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        modelList: []
      }

      this.getModelList = this.getModelList.bind(this);
  }

  componentDidMount () {
    const sex = 'F';
    this.getModelList(sex);
  }

  getModelList(sex) {
    var self = this; 

    axios.get(`http://localhost:3001/api/model/${sex}`)
      .then(function(response) {
        // handle success
        self.setState({
          modelList: response.data
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

  render() {
    const { modelList } = this.state;
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1
    };

    const imageClick = (e) => {
      this.props.choose(e.target.getAttribute('data-value'))
    } 

    return (
      <div className="page-body">
        <div className="bkg-circle-green bkg-circle-big"></div>
        <div className="bkg-circle-green bkg-circle-small"></div>

        <UserInfo 
          user={this.props.user}
          handleLogout={this.props.handleLogout}
        />

        <HomeNav title="自行選擇" handleHome={this.props.handleHome} />

        <Slider {...settings}>
        {
          modelList.map(function(d, idx){
            return (
              <div key={`slide-${idx}`}>
                <img 
                  className="model"
                  onClick={imageClick}
                  data-value={d.photo}
                  src={`http://localhost:3001/photo/model/${d.photo}`} alt={`${d.photo}`}
                />
              </div>
            )
          })
        }
        </Slider>

        <div className="footer-control-wrap">
          <a 
            className="btn btn-icon-round btn-blue" 
            type="button"
            onClick={this.props.confirm}
          >
            <div className='icon-round-bkg'><i className="mdi mdi-check-circle-outline"></i></div>
            <span>符合風格</span>
          </a>
        </div>
      </div>
    );
  }
}

export default ChooseModel;
