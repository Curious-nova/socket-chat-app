import { useAppstore } from '@/store'
import React from 'react'

const Profile = () => {
  const {userInfo}=useAppstore();
  return (
    <div>
      Profile
      <div>Email: {userInfo.email} </div>
    </div>
  )
}

export default Profile
