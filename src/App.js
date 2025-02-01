import React, { useState } from "react";
import './App.css'; // Importing CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FaExclamationCircle } from "react-icons/fa"; // For error icon

function App() {
  const [formData, setFormData] = useState({
    name: "",
    pinCode: "",
    city: "",
    state: "",
    country: "India", // Default to India
    address: "",
  });

  const [addresses, setAddresses] = useState([]); // Store the list of addresses
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query
  const [addressSavedMessage, setAddressSavedMessage] = useState(""); // New state for "Address Saved" message
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePinCodeChange = async (e) => {
    const pinCode = e.target.value;
    
    // Update formData with pinCode while typing
    setFormData((prevData) => ({ ...prevData, pinCode }));

    // Show error immediately if pinCode length is less than 6
    if (pinCode.length < 6) {
      setErrorMessage("Invalid PinCode");
      return; // Don't proceed with the API call if pinCode is not 6 digits yet
    }

    // Validate if pinCode is exactly 6 digits
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`);
      const data = response.data[0];

      if (data.Status === "Success" && data.PostOffice && data.PostOffice.length > 0) {
        const { District: city, State: state } = data.PostOffice[0];
        
        // Successfully fetched the data, update the formData with city and state
        setFormData((prevData) => ({
          ...prevData,
          city,
          state,
          pinCode,
        }));
        setErrorMessage(""); // Clear any previous errors
      } else {
        setErrorMessage("Invalid PinCode"); // Show error if pin code is invalid
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      setErrorMessage("Invalid PinCode"); // Show error if the API request fails
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setAddresses((prev) => [...prev, formData]); // Add new address to the list

    // Show "Address Saved" message
    setAddressSavedMessage("Address Saved!");

    // Hide the message after 3 seconds
    setTimeout(() => {
      setAddressSavedMessage(""); // Clear "Address Saved" message
    }, 3000);
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      pinCode: "",
      city: "",
      state: "",
      country: "India",
      address: "",
    });
  };

  // Filter addresses by City or State
  const filterAddresses = () => {
    return addresses.filter((address) => {
      return (
        address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Smart Address Book</h1>

      {/* Search bar to filter addresses */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by city or state"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Address Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <input
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="mb-3">
          <label>Pin Code</label>
          <input
            type="text"
            className="form-control"
            name="pinCode"
            value={formData.pinCode}
            onChange={handlePinCodeChange}
            required
            maxLength="6"
          />
          {/* Error Message */}
          {errorMessage && (
            <div className="text-danger mt-2">
              <FaExclamationCircle /> {errorMessage}
            </div>
          )}
        </div>

        {/* Other address fields */}
        <div className="mb-3">
          <label>City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="mb-3">
          <label>State</label>
          <input
            type="text"
            className="form-control"
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled
          />
        </div>

    
        <div className="mb-3">
          <label>Country</label>
          <input
            className="form-control"
            name="country"
            value={formData.country}
            onChange={handleChange}
            rows="3"
          />
        </div>


        <button type="submit" className="btn btn-primary">Save Address</button>
      </form>

         {/* Display "Address Saved" message */}
      {addressSavedMessage && (
        <div className="alert alert-success text-center">
          {addressSavedMessage}
        </div>
      )}

      <div className="search-results mt-4">
          {searchQuery && (
            <div>
              <h3>Search Results</h3>
              {filterAddresses().length > 0 ? (
                filterAddresses().map((address, index) => (
                  <div key={index} className="address-card mb-2">
                    <p><strong>Name:</strong> {address.name}</p>
                    <p><strong>Address:</strong> {address.address}</p>
                    <p><strong>City:</strong> {address.city}</p>
                    <p><strong>State:</strong> {address.state}</p>
                    <p><strong>PIN Code:</strong> {address.pinCode}</p>
                  </div>
                ))
              ) : (
                <p>No matching addresses found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

export default App;

