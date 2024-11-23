import React, { useEffect, useState } from 'react'
import ProfileInfo from './ProfileInfo'
import NewDM from './NewDm'
import { apiClient } from '@/lib/api-client'
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNEL_ROUTE } from '@/utils/constants'
import { useAppstore } from '@/store'
import ContactList from "@/components/ui/contact-list"
import CreateChannel from './CreateChannel'
import { PlusCircle, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useSocket } from "@/context/SocketContext"
import Logo from "../../../assets/Logo.png"
export default function ContactContainer() {
  const {
    setDirectMessagesContacts,
    directMessagesContacts = {},
    channels = [],
    setChannels,
    userInfo
  } = useAppstore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDMContacts, setFilteredDMContacts] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const socket = useSocket();

  // Fetch contacts and channels on mount
  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, { withCredentials: true });
        if (response.data.contacts) {
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNEL_ROUTE, { withCredentials: true });
        if (response.data.channels) {
          setChannels(response.data.channels);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    getContacts();
    getChannels();
  }, [setDirectMessagesContacts, setChannels]);

  // Filter and sort contacts
  useEffect(() => {
    const filterAndSortContacts = () => {
      const directMessagesArray = Object.values(directMessagesContacts || {});
      
      const filteredDM = directMessagesArray
        .filter(contact =>
          `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      
      setFilteredDMContacts(filteredDM);

      const filteredCh = (channels || [])
        .filter(channel =>
          channel.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      
      setFilteredChannels(filteredCh);
    };

    filterAndSortContacts();
  }, [searchTerm, setDirectMessagesContacts, directMessagesContacts, channels]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 w-full h-screen flex flex-col">
      <div className="p-4 flex-shrink-0">
        <div className='flex items-center'>
        <div className="mb-4">
            <img src={Logo} alt="Logo" className="w-16 h-16 rounded-full" />
          </div>
        <p className='text-4xl ml-5 mb-7'><span className='text-red-500'>C</span>hit <span className='text-red-500'>C</span>hat</p>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search contacts or channels"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="space-y-6 px-4">
          <Section title="Direct messages" action={<NewDM />}>
            <ContactList contacts={filteredDMContacts} />
          </Section>
          <Section title="Channels" action={<CreateChannel />}>
            <ContactList contacts={filteredChannels} isChannel={true} />
          </Section>
        </div>
      </div>
      <ProfileInfo />
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}