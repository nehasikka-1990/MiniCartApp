import React from "react";
import { thisExpression } from "@babel/types";

export default class BasicMenu extends React.Component {
    constructor(props) {
        super(props);
    }    

    render() {
        let menuProducts = JSON.parse(localStorage.getItem("products"));
        var deleteProduct = this.props.deleteProduct;
        return (
            <div className="box arrow-top">
                {menuProducts.map((value, index) => {
                return (
                <div className="menu" key={index}>
                <div className="productsDetails">               
                  <ul className="menuProducts">
                      <li>
                      <span className="menuDelete" id={value.id} onClick={() => deleteProduct(value.id)}>X</span>
                      <span className="menuName">{value.title}</span>
                      <br/>
                      <span className="menuPrice">${value.price}</span>
                      </li>
                  </ul>                  
                  <span className="menuQuantity">
                    Qty {value.quantity}
                  </span>
                </div>
              </div>
              )
            })}
            </div>
        )
    }
}