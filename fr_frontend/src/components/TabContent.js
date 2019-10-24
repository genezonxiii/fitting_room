import React from "react";
import Swiper from 'react-id-swiper';
import * as CONSTANT from './constant';

function TabContent(props) {

  const params = {
    slidesPerView: 5,
    slidesPerGroup: 5,
    spaceBetween: 0,
    watchOverflow: true,
    shouldSwiperUpdate: true,
    pagination: {
      el: '.swiper-pagination.swiper-pagination-clothes',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }

  return (
    <div id={props.id} className="tab_content">
    	<h3 className="title-clothes-suggest">
        <i className="mdi mdi-heart"></i>
        猜你喜歡:
      </h3>
      <div className="clothes-image-grid">
  		<Swiper {...params}>
	    	{
	    		props.list.map((item, index) => (
            <div 
              key={`slide-${index}`}
            >
					  <div 
              key={index}
              className={props.outfit.product_id === item.product_id ? 'clothes-image-card active' : 'clothes-image-card'}
            >
              <img 
              	src={`${CONSTANT.WS_URL}/photo/${item.kind}/thumbnail/${item.thumbnail}`} 
              	alt={`${item.thumbnail}`}
              	data-key={item.product_id}
              	onClick={(e) => props.handleClick(e)}
            	/>
              <a 
                className={props.outfit.product_id === item.product_id ? 'card-check-toggle active' : 'card-check-toggle'}
                data-key={item.product_id}
                onClick={(e) => props.handleClick(e)}
              >
              </a>
            </div>
            </div>
					))
	    	}
  		</Swiper>
      </div>
    </div>
  )
}

export default TabContent;
