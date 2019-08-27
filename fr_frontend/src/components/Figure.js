import React from "react";

function Figure(props) {
  return (
    <div className="figure-section">
      <div className="figure-fitting-wrap">
        <img 
        	className="fitting-figure" 
        	src={`http://localhost:3001/photo/model/${props.model}`}
        	alt={props.model}
        />
        {
        	props.outfit.cloth && props.outfit.cloth.product_id?
		        <div className="fitting-clothes-wrap">
		          <img 
		          	className="fitting-clothes" 
		          	src={`http://localhost:3001/photo/cloth/${props.outfit.cloth.photo}`}
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
			          src={`http://localhost:3001/photo/pants/${props.outfit.pants.photo}`} 
			          alt={props.outfit.pants.photo}
			          onClick={props.handlePantsOffClick}
		          />
		        </div>
		        :null
        }
      </div>
    </div>
  )
}

export default Figure;
