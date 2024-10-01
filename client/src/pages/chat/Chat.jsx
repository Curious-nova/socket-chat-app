import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppstore } from '@/store'


const Chat = () => {
  const {userInfo}=useAppstore();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast('Please setup profile to continue.');
      navigate("/profile");
    }
  },[userInfo,navigate]);
  return (
    <div>
      Chat
      <div>Email: {userInfo.email} </div>
    </div>
  )
}

export default Chat
