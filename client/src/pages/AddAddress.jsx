
import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

// Reusable Input Field Component
const InputField = ({ type, placeholder, name, handleChange, value }) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={value}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded outline-none text-gray-700 focus:border-primary transition"
  />
);

const AddAddress = () => {
  const {axios,user,navigate} = useAppContext()
  const [address, setAddress] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress, 
      [name]: value,
    }));
  };

const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.post('/api/address/add', { address });
    if (data.success) {
      toast.success(data.message);
      navigate('/cart');
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


useEffect(()=>{
if(!user){
  navigate('/cart')
}
},[])

  return (
    <div className="mt-16 pb-16 px-4">
      <p className="text-2xl md:text-3xl text-gray-600">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-2xl">
          <form onSubmit={onSubmitHandler} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                value={address.firstName}
                name="firstName"
                type="text"
                placeholder="First Name"
              />
              <InputField
                handleChange={handleChange}
                value={address.lastName}
                name="lastName"
                type="text"
                placeholder="Last Name"
              />
              </div>

              <InputField
                handleChange={handleChange}
                value={address.email}
                name="email"
                type="email"
                placeholder="Email"
              />
              <InputField
                handleChange={handleChange}
                value={address.phone}
                name="phone"
                type="tel"
                placeholder="Phone Number"
              />
              <InputField
                handleChange={handleChange}
                value={address.street}
                name="street"
                type="text"
                placeholder="Street Address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                value={address.city}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                value={address.state}
                name="state"
                type="text"
                placeholder="State"
              />
              </div>
              <InputField
                handleChange={handleChange}
                value={address.zipcode}
                name="zipcode"
                type="text"
                placeholder="Zip Code"
              />
              <div>
              <InputField
                handleChange={handleChange}
                value={address.country}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>

            <button
              type="submit"
              className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'            >
              Save Address
            </button>
          </form>
        </div>

        <img
          className="md:mr-16 mb-10 md:mb-0 md:mt-0 max-w-sm"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;