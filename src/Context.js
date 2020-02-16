import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data/data';

/*{
  Context API has three parts:
  1. Context itself
  2. The producer or Provider
  3. The consumer
}*/

//Context
const ProductContext = React.createContext();

//Provider
class ProductProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      detailProduct: detailProduct,
      cart: [],
      modalOpen: false,
      modalProduct: detailProduct,
      cartSubTotal: 0,
      cartTax: 0,
      cartTotal: 0

    };
  }

  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    })
    this.setState((prevState) => {
      return {
        ...prevState,
        products: tempProducts
      }
    });
  }

  handleDetail = (id) => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product }
    });
  };

  addToCart = (id) => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    this.setState((prevState) => {
      return {
        ...prevState,
        products: tempProducts,
        cart: [...this.state.cart, product]
      }
    }, () => {
      this.addTotals();
    });
  };

  openModal = (id) => {
    const product = this.getItem(id);
    this.setState((prevState) => {
      return {
        ...prevState,
        modalProduct: product,
        modalOpen: true
      }
    });

  };

  closeModal = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        modalOpen: false
      }
    });

  };

  getItem = (id) => {
    const product = this.state.products.find(item => item.id === id)
    return product;
  }

  componentDidMount() {
    this.setProducts();
  };

  increament = (id) => {
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count + 1;
    product.total = product.price * product.count;
    this.setState((prevState) => {
      return {
        ...prevState,
        cart: [...tempCart]
      }
    }, () => {
      this.addTotals();
    });
  };

  decreament = (id) => {
    
    let tempCart = [...this.state.cart];
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];
    product.count = product.count - 1;
    if(product.count === 0){
      this.removeItem(id);
      return;
    }
    product.total = product.price * product.count;
    this.setState((prevState) => {
      return {
        ...prevState,
        cart: [...tempCart]
      }
    }, () => {
      this.addTotals();
    });

  };

  removeItem = (id) => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    tempCart = tempCart.filter(item => item.id !== id);

    const index = tempProducts.indexOf(this.getItem(id));
    const removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState((prevState) => {
      return {
        ...prevState,
        products: [...tempProducts],
        cart: [...tempCart]
      }
    }, () => {
      this.addTotals();
    });

  };

  clearCart = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        cart: [],
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0
      }
    }, () => {
      this.setProducts();
      this.addTotals();
    });

  };

  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map(item => subTotal += item.total);
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState((prevState) => {
      return {
        ...prevState,
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total
      }
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={
          {
            ...this.state,
            handleDetail: this.handleDetail,
            addToCart: this.addToCart,
            openModal: this.openModal,
            closeModal: this.closeModal,
            increament: this.increament,
            decreament: this.decreament,
            removeItem: this.removeItem,
            clearCart: this.clearCart
          }
        }>
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}

//Consumer
const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };
