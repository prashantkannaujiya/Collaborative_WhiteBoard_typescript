import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useRef, useState } from 'react';
import {Outlet,useNavigate} from 'react-router-dom';
import './Style/Home.css'
 const Home=()=>{
    const { keycloak, initialized } = useKeycloak();
    const navigate=useNavigate()
useEffect(()=>{
if(keycloak.authenticated)
{                                   // provide access to connect with a room after authentication
navigate('/room')
}
},[keycloak.authenticated])
    return(
        <div className="home">
      <div >
                 {!keycloak.authenticated && (
                   <button                        // display login button for user to authenticate
                     type="button"
                    
                     onClick={() => keycloak.login()}
                   >
                     Login
                   </button>
                 )}

                 {!!keycloak.authenticated && (
                   <button                         // display logout button for authenticated users
                     type="button"
                    
                     onClick={() => {navigate('/');keycloak.logout();}}
                   >
                     Logout ({keycloak.tokenParsed!.preferred_username})
                   </button>
                 )}
               </div>
               <div>

               </div>
               <Outlet/>
    </div>
 
    )
   }
 export default Home;