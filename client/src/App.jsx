import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import Chat from './pages/chat/Chat';
import Profile from './pages/profile/Profile';
import { useAppstore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppstore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppstore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  // const { userInfo, setUserInfo } = useAppstore();
  const { userInfo, setUserInfo } = useAppstore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
        console.log({ response });
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path='/auth'
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path='/chat'
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path='*' element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;


// import React, { Children, useEffect,useState } from 'react'
// import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// import Auth from './pages/auth/Auth'
// import Chat from './pages/chat/Chat'
// import Profile from './pages/profile/Profile'
// import { useAppstore } from './store'
// import { apiClient } from './lib/api-client'
// import { GET_USER_INFO } from './utils/constants'

// const PrivateRoute = ({ Children }) => {
//   const { userInfo } = useAppstore();
//   const isAuthenticated = !!userInfo;
//   return isAuthenticated ? Children : <Navigate to="/auth" />
// }

// const AuthRoute = ({ Children }) => {
//   const { userInfo } = useAppstore();
//   const isAuthenticated = !!userInfo;
//   return isAuthenticated ? <Navigate to="/chat" /> : Children;
// }

// const App = () => {
//   const {userInfo,setUserInfo}= useAppstore();
//   const [loading, setLoading] = useState(true);
//   useEffect(()=>{
//     const getUserData =async()=>{
//       try{
//         const response=await apiClient.get(GET_USER_INFO,{ withCredentials: true });
//         if(response.status===200 && response.data.id){
//           setUserInfo(response.data);
//         } 
//         else{
//           setUserInfo(undefined);
//         }
        
//         console.log({response});
//       }
//       catch(error){
//         // setUserInfo(undefined);
//       }
//       finally{
//         setLoading(false);
//       }
//     }
//     if(!userInfo){
//       getUserData();
//     }
//     else{
//       setLoading(false);
//     }
//   },[userInfo,setUserInfo]);

//   if(loading){
//     return <div>loading...</div>
//   }

//   return (
//     <div>
//       <BrowserRouter>
//         <Routes>
//           <Route path='/auth' element={
//             <AuthRoute>
//               <Auth />
//             </AuthRoute>
//           } />
//           <Route path='/chat' element={<PrivateRoute> <Chat /> </PrivateRoute>} />
//           <Route path='/profile' element={<PrivateRoute> <Profile /> </PrivateRoute>} />
//           <Route path='*' element={<Navigate to="/auth" />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }

// export default App
