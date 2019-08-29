import React from "react";
import * as CONSTANT from './constant';

function Figure(props) {
  return (
    <div className="figure-section">
      <div className="figure-fitting-wrap">
        <img 
        	className="fitting-figure" 
        	src={`${CONSTANT.WS_URL}/photo/model/${props.model}`}
        	alt={props.model}
        />
        {
        	props.outfit.cloth && props.outfit.cloth.product_id?
		        <div className="fitting-clothes-wrap">
		          <img 
		          	className="fitting-clothes" 
		          	src={`${CONSTANT.WS_URL}/photo/cloth/${props.outfit.cloth.photo}`}
		          	alt={props.outfit.cloth.photo} 
		          	onClick={props.handleClothOffClick}
		          />
		        </div>
		        :null
        }
        {
        	props.outfit.pants && props.outfit.pants.product_id?
						<div className="fitting-pants-wrap">
		          <img 
			          className="fitting-pants" 
			          src={`${CONSTANT.WS_URL}/photo/pants/${props.outfit.pants.photo}`} 
			          alt={props.outfit.pants.photo}
			          onClick={props.handlePantsOffClick}
		          />
		        </div>
		        :null
        }
        <div className="fitting-shoes-wrap">
          <img 
          	className="fitting-shoes" 
          	src={`${CONSTANT.WS_URL}/photo/shoe/shoes-03_pair.png`}
          	alt=""
          />
        </div>
      </div>
    </div>
  )
}

export default Figure;
