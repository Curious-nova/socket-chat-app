import React from 'react'
import ProfileInfo from './ProfileInfo'

const ContactContainer = () => {
  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
      <div>
        {/* Logo */}
      </div>
      <div className='my-5'>
         <div className='flex items-center justify-between pr-10'>
            <Title text="Direct messages"/>
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