'use client'

import React from "react"
import { getColor } from "@/lib/utils"
import { useAppstore } from "@/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, LogOut } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@/lib/api-client"
import { LOGOUT } from "@/utils/constants"

export default function ProfileInfo() {
  const navigate = useNavigate()
  const { userInfo, setUserInfo } = useAppstore()

  const logout = async () => {
    try {
      const apiResponse = await apiClient.post(LOGOUT, {}, { withCredentials: true })

      if (apiResponse.status === 200) {
        setUserInfo(null)
        navigate("/auth")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-gray-700">
          {userInfo.image ? (
            <AvatarImage src={userInfo.image} alt="Profile" className="object-cover" />
          ) : (
            <AvatarFallback className={`text-lg font-semibold uppercase ${getColor(userInfo.color)}`}>
              {userInfo.firstName
                ? userInfo.firstName.charAt(0) + userInfo.lastName.charAt(0)
                : userInfo.email.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-200">
            {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""}
          </span>
          <span className="text-xs text-gray-400">{userInfo.email}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/profile")}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <Edit className="h-5 w-5" />
                <span className="sr-only">Edit Profile</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 border-gray-800 text-gray-200">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={logout}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900 rounded-full transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 border-gray-800 text-gray-200">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}