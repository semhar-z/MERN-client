import React from "react";

const Header = () => {
  return (
    <header style={headerStyles}>
      <div style={logoContainerStyles}>
        <img src="/images/logo1.png" alt="Logo" style={logoStyles} />
        <h1 style={titleStyles}>BookWizards</h1>
        <img src="/images/logo1.png" alt="Logo" style={logoStyles2} />
      </div>
    </header>
  );
};

const headerStyles = {
  backgroundColor: "#6a0dad", 
  color: "white",
  padding: "10px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80px",
  width: "100vw",
};

const logoContainerStyles = {
  display: "flex",
  alignItems: "center", 
};

const logoStyles = {
  width: "50px", 
  height: "50px",
  marginRight: "25px", 
};

const logoStyles2 = {
    width: "50px", 
    height: "50px",
    marginLeft: "25px", 
  };

const titleStyles = {
  fontSize: "24px",
  fontWeight: "bold",
};

export default Header;
