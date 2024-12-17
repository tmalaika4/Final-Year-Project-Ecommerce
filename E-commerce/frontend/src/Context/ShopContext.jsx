import React, { createContext, useState, useEffect } from "react";

const getDefaultCart = ()=>{
    let cart ={};
    for(let index = 0; index < 300+1; index++){
        cart[index] =0;
    }

    return cart;
}

export const ShopContext = createContext(null);

const ShopContextProvider = (props) =>{
    
    const [all_product,setAll_Product] = useState(null);
    const [cartItems,setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        if (!all_product) {
            fetch('https://final-year-project-ecommerce.onrender.com/allproducts')
                .then((response) => response.json())
                .then((data) => setAll_Product(data));
        } else {
            if (localStorage.getItem('auth-token')) {
                fetchCartData();  // Refetch cart data
            }
        }
    }, [all_product]);
    
    
    const fetchCartData = () => {
        if (localStorage.getItem('auth-token')) {
            fetch('https://final-year-project-ecommerce-cart.onrender.com/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            })
            .then((response) => response.json())
            .then((data) => {
                for (const item in data) {
                    if (data[item] > 0 && all_product) {
                        // Check if the item exists in the all_product list
                        let itemInfo = all_product.find((product) => product.id === Number(item));
                        console.log(itemInfo);
                        // Only add to total if the item exists in all_product
                        if (!itemInfo) {
                            data[item] = 0;
                            RemoveFromCart(item,false);
                        }
                    }
                }console.log(data);
                setCartItems(data);  // Update local state with cart data from the server
            });
        }
    };
    
    const addToCart = (itemId) => { 
        // Sync with server
        if (localStorage.getItem('auth-token')) {
            fetch('https://final-year-project-ecommerce-cart.onrender.com/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // After adding to cart, update local state based on the server response
                
                //cartItems[itemId] +=1;
                //setCartItems(cartItems);
                fetchCartData();
            });
        }
    };
    
    const RemoveFromCart = (itemId,refresh = true) => {
        if (localStorage.getItem('auth-token')) {
            fetch('https://final-year-project-ecommerce-cart.onrender.com/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
            })
            .then((response) => response.json())
            .then((data) => {if(refresh){
                console.log('Updated Cart:', data);
                setCartItems(data); // Update the cart state with the latest data from the backend
            }
            })
            .catch((error) => {
                console.error('Error removing item from cart:', error);
            });
        }
    };
    
    
    
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0 && all_product) {
                // Find the product based on the item id
                let itemInfo = all_product.find((product) => product.id === Number(item));
    
                // Check if itemInfo is found and has the 'new_price' property
                if (itemInfo && itemInfo.new_price !== undefined) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };
    

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0 && all_product) {
                // Check if the item exists in the all_product list
                let itemInfo = all_product.find((product) => product.id === Number(item));
    
                // Only add to total if the item exists in all_product
                if (itemInfo) {
                    totalItem += cartItems[item];
                }
            }
        }
        return totalItem;
    };
    
    
    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,RemoveFromCart};
     return(
        <ShopContext.Provider value = {contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider