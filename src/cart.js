import React from "react";
import { thisTypeAnnotation } from "@babel/types";
import  BasicMenu  from "./menu.js";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default class Cart extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showMenu: false,
      products: []     
    };
  }

  fetchProducts = async () => {
    const response = await axios('http://dnc0cmt2n557n.cloudfront.net/products.json')
    const jsonData = await response.data;
    localStorage.setItem('products', JSON.stringify(jsonData.products));
    let products = JSON.parse(localStorage.getItem("products"));
    products.map((value, index) => {
      let product = products[index];
      product["initialPrice"] = value.price;
      products[index] = product
    });

    localStorage.setItem('products', JSON.stringify(products));
    this.setProductValue(0, 1);
    this.forceUpdate();
  }

  getPrice() {
      let price = 0;
      let products = JSON.parse(localStorage.getItem("products"));
      products.map((value) => {
        price = price + Number(value.price);
      });
      return price;
  }

  increaseDecreaseQuantity(action, id) {
    let quantity = Number(document.getElementById("qty"+id).value);
    let price = document.getElementById("price"+id).innerHTML;
    price = Number(price.split("$")[1]);

    let initialPrice = 0;
    let products = JSON.parse(localStorage.getItem("products"));
    products.map((value, index) => {
      if(value.id == id) {
        initialPrice = Number(value.initialPrice);
      }
    });

    if(action == "increase") {
      quantity = quantity + 1;  
      price = price + initialPrice;      
    } else if(action == "decrease") {
      quantity = quantity - 1; 
      price = price - initialPrice;
    }
    
    this.setProductPrice(id, price);    
    this.setProductValue(id, quantity);
  }

  setProductPrice(id, price) {
    let products = [...JSON.parse(localStorage.getItem("products"))];
    products.map((value, index) => {
      let product = products[index];
      if(value.id == id) {
        product ["price"] = price;
      }
      products[index] = product;
    });
    localStorage.setItem("products", JSON.stringify(products));
    document.getElementsByClassName("cartPrice")[0].innerHTML = "$ "+this.getPrice();
    document.getElementById("price"+id).innerHTML = "$"+price;
  }

  setProductValue(id, quantity) {
    let products = [...JSON.parse(localStorage.getItem("products"))];
    if(id == 0) {
      products.map((value, index) => {
        let product = products[index];
        product["quantity"] = 1;
        products[index] = product;
      });
    } else {
      products.map((value, index) => {
        let product = products[index];
        if(id == value.id) {
          product["quantity"] = quantity;
        } 
        products[index] = product;
      });
    }
    localStorage.setItem("products", JSON.stringify(products));
     if(id > 0) {
      document.getElementById("qty"+id).value = quantity;
     }
  }

  showHideMenu() {
    if(this.state.showMenu == true) {
      this.setState({"showMenu": false});
    } else {
      this.setState({"showMenu": true});
    }
  }

  componentWillMount() {
    if(localStorage.getItem("products") == null) {
      this.fetchProducts();
    }
  }

  deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    var array = [...products];
    let arrayIndex  = -1;
    products.map((value, index) => {
        if(value.id == id) {
            arrayIndex = index;
        }
    });
    if(arrayIndex !== -1) {
        array.splice(arrayIndex, 1);
        localStorage.setItem("products", JSON.stringify(array));
        this.forceUpdate();
    }
}
  
  render() {
    let productsData = JSON.parse(localStorage.getItem("products"));
    return (
      <div>
      {productsData.length > 0 ? 
      <div>        
        <div className="cartHeader">
          <div className="cardPriceDetails">
            <span className="cartPrice">{productsData[0].currency} {this.getPrice()}</span><br/>
            <span className="cartItems" onClick={this.showHideMenu.bind(this)}>
              <span>{productsData.length} Items</span>
              <span className="chevron bottom"></span>
            </span><br/>          
            <div className="cartImage" onClick={this.showHideMenu.bind(this)}><img src="../shopping-cart-icon.png"/></div>
          </div>
        </div>
        { this.state.showMenu ? <div>
          <BasicMenu deleteProduct={this.deleteProduct.bind(this)}/>
        </div> : <div>
          {productsData.map((value, index) => {
            return (
              <div className="container" key={index}>
                <div className="productsDetails">               
                  <ul className="products">
                      <li>
                      <span className="productName">{value.title}</span>
                      <br/>
                      <span className="productDesc">{value.desc}</span>
                      </li>
                  </ul>                  
                  <span id={"price" + value.id} className="productPrice">
                    ${value.price}
                  </span>
                  <span className="productsQuantities">
                    <span className="plusMinusIcons" onClick={() => this.increaseDecreaseQuantity("decrease", value.id)}>- </span>
                    <input className="quantity" readOnly id={"qty" + value.id} value={value.quantity} type="textbox"/>
                    <span className="plusMinusIcons" onClick={() => this.increaseDecreaseQuantity("increase", value.id)}> +</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div> 
      }
      </div>:null }
      </div>
    );
  }
}