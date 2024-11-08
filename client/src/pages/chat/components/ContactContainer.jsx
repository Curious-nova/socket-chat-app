'use client'

import React, { useEffect } from 'react'
import ProfileInfo from './ProfileInfo'
import NewDM from './NewDm'
import { apiClient } from '@/lib/api-client'
import { GET_DM_CONTACTS_ROUTES, GET_USER_CHANNEL_ROUTE } from '@/utils/constants'
import { useAppstore } from '@/store'
import ContactList from "../../../components/ui/contact-list"
import CreateChannel from './CreateChannel'
import { PlusCircle } from 'lucide-react'

export default function ContactContainer() {
  const { setDirectMessagesContacts, directMessagesContacts, channels, setChannels } = useAppstore()

  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, { withCredentials: true })
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts)
      }
    }
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNEL_ROUTE, { withCredentials: true })
      if (response.data.channels) {
        setChannels(response.data.channels)
      }
    }
    getContacts()
    getChannels()
  }, [])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 w-full">
      <div className="p-4">
        {/* Logo placeholder */}
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg mb-6"></div>
      </div>
      <div className="space-y-6">
        <Section title="Direct messages" action={<NewDM />}>
          <div className="max-h-[38vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <ContactList contacts={directMessagesContacts} />
          </div>
        </Section>
        <Section title="Channels" action={<CreateChannel />}>
          <div className="max-h-[38vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <ContactList contacts={channels} isChannel={true} />
          </div>
        </Section>
      </div>
      <ProfileInfo />
    </div>
  )
}

function Section({ title, children, action }) {
  return (
    <div className="px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function Title({ text }) {
  return (
    <h6 className="uppercase tracking-widest text-gray-400 font-medium text-xs">
      {text}
    </h6>
  )
}