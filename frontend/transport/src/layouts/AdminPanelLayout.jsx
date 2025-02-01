import React from 'react'; 
import AdminHeader from './Header'; 
import AdminSideBar from './AdminSideBar'; 
import Footer from './Footer'; 

const AdminPanelLayout = ({ children }) => { 
  return ( 
    <div className="flex min-h-screen bg-gray-100"> 
      {/* Sidebar with Scroll Fix */}
      <div className="h-screen w-64 overflow-y-auto bg-white shadow-lg">
        <AdminSideBar /> 
      </div>

      {/* Main Content Area */} 
      <div className="flex-1 flex flex-col h-screen overflow-y-auto"> 
        {/* Header */} 
        <AdminHeader /> 

        {/* Dynamic Content */} 
        <main className="p-8 flex-1 overflow-y-auto">{children}</main> 

        {/* Footer */} 
        {/* <Footer /> */}
      </div> 
    </div> 
  ); 
}; 

export default AdminPanelLayout;
