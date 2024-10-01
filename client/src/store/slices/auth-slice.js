// export const createAuthSlice = (set)=>(
//     {
//         userInfo:undefined,
//         setuserInfo:(userInfo)=>set({userInfo})
//     }
// )
export const createAuthSlice = (set) => ({
    userInfo: undefined,
    setUserInfo: (userInfo) => set({ userInfo }), // Updated to setUserInfo
  });
  