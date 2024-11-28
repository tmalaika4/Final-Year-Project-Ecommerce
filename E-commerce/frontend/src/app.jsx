import React from 'react';
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import { Route } from 'react-router-dom';
const App = () => {
    return (
      <div>
        <Routes>
            <Route path="/" element={<PlaceOrder />} />
        </Routes>
        
      </div>
    );
  };
  
  export default App;
