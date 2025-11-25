import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './sell.css';

const Sell = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    rating: '',
    stock: '',
    option: '',
    image: [],
  });

  const nav = useNavigate();
  const { productId } = useParams();

  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  const descRef = useRef(null);
  const priceRef = useRef(null);
  const stockRef = useRef(null);
  const ratingRef = useRef(null);
  const optionRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const res = await axios.get(
            `http://localhost:8000/product/${productId}`
          );
          setProduct(res.data);
        } catch (err) {
          console.log('Failed to fetch product:', err);
        }
      }
    };
    fetchProduct();
  }, [productId]);

  const addProduct = async () => {
    if (!product.name) {
      alert('Please fill out all required fields');
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in');
      return;
    }

    try {
      const productData = { ...product, userId };
      await axios.post('http://localhost:8000/addproduct', productData);
      alert(' Product added successfully!');
      setProduct({
        name: '',
        category: '',
        description: '',
        price: '',
        rating: '',
        stock: '',
        image: '',
        option: '',
      });
      nav('/allproducts');
    } catch (e) {
      console.log(e.message || 'Product add failed');
    }
  };

  const updateProduct = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.patch(`http://localhost:8000/product/${productId}`, {
        ...product,
        userId,
      });
      alert(' Product updated successfully!');
      nav(`/user/${userId}`);
    } catch (e) {
      console.log('Product update failed:', e);
    }
  };

  const onChange = e => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };
  const imageUpload = async e => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      const formdata = new FormData();
      formdata.append('img', file);
      try {
        const res = await axios.post(
          'http://localhost:8000/upload-img',
          formdata
        );
        const imgUrl = res.data.url || res.data[0]?.url;
        if (imgUrl) uploadedUrls.push(imgUrl);
      } catch (err) {
        console.log('Image upload failed:', err);
      }
    }

    setProduct(prev => ({
      ...prev,
      image: [...prev.image, ...uploadedUrls],
    }));
  };

  return (
    <div className="sell">
      <div className="sell2">
        <h4>
          {productId
            ? ' Edit Your Product'
            : '🛍️ Sell Your Product On Revoo Platform'}
        </h4>
        <div className="sell1">
          <input
            ref={nameRef}
            name="name"
            value={product.name}
            onChange={onChange}
            onKeyDown={e => handleKeyDown(e, categoryRef)}
            type="text"
            placeholder="Name of the Product"
          />

          <select
            ref={categoryRef}
            name="category"
            value={product.category}
            onChange={onChange}
            onKeyDown={e => handleKeyDown(e, descRef)}
            className="option"
          >
            <option value="">Select Category</option>
            <option value="MobilePhone">MobilePhone</option>
            <option value="Electronics">Electronics</option>
            <option value="HomeDecors">Home Decors</option>
            <option value="Fashion">Fashion</option>
            <option value="Beauty">Beauty</option>
            <option value="Toys">Toys</option>
            <option value="Grocery">Grocery</option>
            <option value="Books">Books</option>
          </select>

          <textarea
            ref={descRef}
            name="description"
            value={product.description}
            onChange={onChange}
            onKeyDown={e => handleKeyDown(e, priceRef)}
            placeholder="Description"
          ></textarea>
          <input
            ref={priceRef}
            name="price"
            type="number"
            value={product.price}
            onChange={onChange}
            onKeyDown={e => handleKeyDown(e, stockRef)}
            placeholder="Price"
          />

          <input
            ref={stockRef}
            name="stock"
            type="number"
            value={product.stock}
            onChange={onChange}
            onKeyDown={e => handleKeyDown(e, ratingRef)}
            placeholder="stock of product"
          />

          <input
            ref={ratingRef}
            name="rating"
            type="number"
            value={product.rating}
            onChange={onChange}
            onKeyDown={e => handleKeyDown(e, optionRef)}
            placeholder="Rate you give"
          />

          <select
            ref={optionRef}
            name="option"
            value={product.option}
            onChange={onChange}
            onKeyDown={e => handleKeyDown(e, imgRef)}
            className="option"
          >
            <option value="">Select Option</option>
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>

          <div className="container1">
            <div className="sell3">
              <label>Image</label>
              <input
                ref={imgRef}
                className="img"
                type="file"
                multiple
                onChange={imageUpload}
              />
             {product.image.length > 0 && (
  <div className="preview-container">
    {product.image.map((img, index) => (
      <img key={index} className="preview-img" src={img} alt={`Uploaded ${index + 1}`} />
    ))}
  </div>
)}


              <button
                className="button"
                onClick={() => {
                  if (productId) {
                    updateProduct();
                  } else {
                    addProduct();
                  }
                }}
              >
                {productId
                  ? 'Update Product'
                  : 'Sell Your Product on OldNew App'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
