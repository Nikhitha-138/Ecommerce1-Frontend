import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './userproduct.css';

const UserPrdouct = () => {
  const [pro, setPro] = useState([]);
  const [del, setDel] = useState(false);
  const [dels, setDels] = useState(null);
  const nav=useNavigate()
  const { userId } = useParams();
  const userProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/user/${userId}`);
      
      setPro(res.data.products);
      console.log(
        'items of this user is fetched successfully' || res.data.products
      );
    } catch (e) {
      console.log(e.message || 'unsuccessfull fetching');
    }
  };
  useEffect(() => {
    userProducts();
  }, []);
  const username = localStorage.getItem('name');

 const onDelete = async (productId) => {
  try {
    await axios.delete(`http://localhost:8000/product/${productId}`);
   
    setPro((prev) => prev.filter((item) => item._id !== productId));
    console.log('Deleted successfully');
  } catch (e) {
    console.log(e.message || 'unsuccessful delete');
  }
};

  const onEdit = (productId) => {

    nav(`/edit/${productId}`)
  };

  const closeModal = () => setDel(false);
  return (
    <div className="userpro">
      {del && (
        <>
          <div className="usepro8"></div>
          <div className="usepro9">
            <h4>
              Are You Sure you want to delete this product,since you are creater
              of this product when you delete it,it will remove from the overall
              site.
            </h4>
            <button
              onClick={ () => {
                 onDelete(dels);
                setDel(false);
                 setDels('');
              }}
            >
              Yes
            </button>
            <button onClick={closeModal}>No</button>
          </div>
        </>
      )}

      <div className="usepro1">
        <h3>The Product added by the {username}</h3>
      </div>
      <div className="usepro2">
        {pro.length > 0 ? (
          pro.map(ite => {
            return (
              <div className="usepro3">
                <div className="usepro5">
                  <div className="image-containers">
                    <img src={ite.image[0]} alt={ite.name} className="image" />
                  </div>
                  <div className="usepro7">
                    <h4 className='name'>Title :{ite.name}</h4> <br />
                    <h4>Price:{ite.price}</h4>
                  </div>
                </div>
                <p className="alert">
                  You only have the access to view this page as well as you only
                  have right to add and edit this product since it is added by
                  you
                </p>

                <div className="usepro4">
                  <button className="remove"  onClick={()=>{onEdit(ite._id)}}>EDIT</button>
                  <button
                    className="del"
                    onClick={() => {
                      setDels(ite._id), setDel(true);
                    }}
                  >
                   
                    <FaTrash />
                  </button>
                  <button className='navi' onClick={()=>{nav('/allproducts')}} >Continue Shopping</button>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No item for this user</h1>
        )}
      </div>
    </div>
  );
};
export default UserPrdouct;
