import React from "react";

function ClothInfo(props) {
  return (
    <div className="clothes-info-wrap">
      <div className="form-row" data-key={props.outfit.product_id}>
        <div className="form-label" data-key={props.outfit.product_id}>料號：</div>
        <div className="form-value" data-key={props.outfit.product_id}>
        	{props.outfit.c_product_id}
      	</div>
      </div>
      <div className="form-row" data-key={props.outfit.product_id}>
        <div className="form-label" data-key={props.outfit.product_id}>品名：</div>
        <div className="form-value" data-key={props.outfit.product_id}>
        	{props.outfit.product_name}
        </div>
      </div>
      <div className="form-row" data-key={props.outfit.product_id}>
        <div className="form-label" data-key={props.outfit.product_id}>品牌：</div>
        <div className="form-value" data-key={props.outfit.product_id}>
        	{props.outfit.brand}
      	</div>
      </div>
      <div className="form-row" data-key={props.outfit.product_id}>
        <div className="form-label" data-key={props.outfit.product_id}>風格：</div>
        <div className="form-value" data-key={props.outfit.product_id}>{props.outfit.style}</div>
      </div>
      <div className="form-row" data-key={props.outfit.product_id}>
        <div className="form-label" data-key={props.outfit.product_id}>說明：</div>
        <div className="form-value" data-key={props.outfit.product_id}>
        	{props.outfit.desc}
        </div>
      </div>

      {
        props.sizeList?props.renderSize():null
      }
      {
        props.colorList?props.renderColor():null
      }
    </div>
  )
}

export default ClothInfo;
