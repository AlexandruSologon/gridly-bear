import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Logo from './images/GridlyBear paw.svg';

const RedirectComp = () => {

  setTimeout(() => {
    window.location.replace("http://gridlybear.web.app");
  }, 3000);

  setTimeout(() => {
    window.location.href = "http://gridlybear.web.app";
  }, 5000);

  return <p className="loading" style={{fontFamily:'-apple-system, system-ui'}}>Redirecting...</p>;
}

//Render the actual app on the root of the page.
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
      <img src={Logo} height={200} width={200} alt="GridlyBear" style={{margin:'1%'}}/>
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', textAlign:'center'}}>
        
        <h1 style={{fontFamily:'-apple-system, system-ui'}}>GridlyBear has moved to a different URL</h1>
        <RedirectComp/>
        <a style={{fontFamily:'-apple-system, system-ui'}} href="http://gridlybear.web.app">click here to continue now</a> 
      </div>
    </div>
  </StrictMode>
);

