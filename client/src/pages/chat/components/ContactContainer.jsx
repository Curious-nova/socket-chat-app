import React ,{useEffect}from 'react'
import ProfileInfo from './ProfileInfo'
import NewDM from './NewDm'
import { apiClient } from '@/lib/api-client'
import { GET_DM_CONTACTS_ROUTES } from '@/utils/constants'
import { useAppstore } from '@/store'
import ContactList from "../../../components/ui/contact-list"

const ContactContainer = () => {
  const {setDirectMessagesContacts,directMessagesContacts} = useAppstore();
  useEffect(() => {
    const getContacts = async () => {
      const response=await apiClient.get(GET_DM_CONTACTS_ROUTES,{withCredentials:true});
      if(response.data.contacts){
        setDirectMessagesContacts(response.data.contacts);
      }
    }
    getContacts();
  }, [])
  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div>
        {/* Logo */}
      </div>
      <div className='my-5'>
         <div className='flex items-center justify-between pr-10'>
            <Title text="Direct messages"/>
            <NewDM />
         </div>
         <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
              <ContactList contacts={directMessagesContacts}/>
         </div>
      </div><div className='my-5'>
         <div className='flex items-center justify-between pr-10'>
            <Title text="Channel"/>
         </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

export default ContactContainer

const Title =({text}) => {
return(
  <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>
    {text}
  </h6>
)
}