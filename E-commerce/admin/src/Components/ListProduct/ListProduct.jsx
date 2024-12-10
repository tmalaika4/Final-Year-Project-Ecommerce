import React, { useEffect, useState } from 'react';
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);

    const fetchInfo = async () => {
        try {
            const response = await fetch('https://final-year-project-ecommerce.onrender.com/allproducts');
            const data = await response.json();
            console.log('Fetched Data:', data);  // Log data to check for duplicates or unexpected issues
            setAllProducts(data); // Set the fetched products in the state
        } catch (error) {
            console.error('Error fetching products:', error); // Error handling
        }
    };

    useEffect(() => {
        fetchInfo(); // Fetch the products when the component mounts
    }, []); // Empty dependency array means it only runs once on mount

    


     const remove_product = async (id)=>{
        await fetch('https://final-year-project-ecommerce.onrender.com/removeproduct',{
            method:'POST',
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
            },
            body:JSON.stringify({id:id})
        })
        await fetchInfo();
     }


  return (
    <div className='list-product'>
        <h1>All Products List</h1>
        <div className="listproduct-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Old Price</p>
            <p>New Price</p>
            <p>Category</p>
            <p>Remove</p>
        </div>
        <div className="listproduct-allproducts">
    <hr />
    {allproducts.map((product) => (
        <React.Fragment key={product.id}> {/* Assign a unique key here */}
            <div className="listproduct-format-main listproduct-format">
                <img src={product.image} alt="" className="listproduct-product-icon" />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                    onClick={() => remove_product(product.id)}
                    className="listproduct-remove-icon"
                    src={cross_icon}
                    alt=""
                />
            </div>
            <hr />
        </React.Fragment>
    ))}
</div>

    </div>
  )
}

export default ListProduct