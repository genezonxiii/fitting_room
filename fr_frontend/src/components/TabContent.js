import React from "react";
import * as CONSTANT from './constant';

function TabContent(props) {
  return (
    <div id={props.id} className="tab_content">
    	<h3 className="title-clothes-suggest">
        <i className="mdi mdi-heart"></i>
        猜你喜歡:
      </h3>
  		<div className="clothes-image-grid">
	    	{
	    		props.list.map((item, index) => (
					  <div 
              key={index}
              className={props.outfit.product_id === item.product_id ? 'clothes-image-card active' : 'clothes-image-card'}
            >
              <img 
              	src={`${CONSTANT.WS_URL}/photo/${item.kind}/${item.photo}`} 
              	alt={`${item.photo}`}
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
					))
	    	}
  		</div>
    </div>
  )
}

export default TabContent;
