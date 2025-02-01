import React from 'react';

// import Home from './Home'
const DefaultLayout = ({ children }) => {
  return (
    <div>

      {/* <Home /> */}
      <main>{children}</main>
    </div>
  );
};

export default DefaultLayout;
