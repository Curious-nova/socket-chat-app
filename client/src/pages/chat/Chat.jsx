import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppstore } from '@/store'
import ContactContainer from './components/ContactContainer';
import EmptyChatContainer from './components/EmptyChatContainer';
import ChatContainer from './components/ChatContainer';


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
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactContainer/>
      {/* <EmptyChatContainer/> */}
      <ChatContainer/>
    </div>
  )
}

export default Chat
