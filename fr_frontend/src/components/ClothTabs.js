import React from "react";

function ClothTabs(props) {
  return (
    <ul className="clothes-tabs">
    	{
    		props.clothTabs.tabs.map((item, index) => (
				  <li
				  	data-key={index}
				    key={`tab-${index}`}
				    className={props.clothTabs.active === index ? 'active' : ''}
			    >
				    <a href={item.tab}>
		  				<img 
		  					src={`images/${item.src}`} 
		  					alt="" 
		  					data-key={index}
		  					onClick={props.handleTabClick}
  						/>
		  				{item.desc}
		  			</a>
				  </li>
				))
    	}
    </ul>
  )
}

export default ClothTabs;
