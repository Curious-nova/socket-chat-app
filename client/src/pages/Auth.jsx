import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleLogin = () => {
    e.preventDefault()
  }
  const handleRegister = () => {
    e.preventDefault()
  }
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">
                <span className="text-red-400">C</span>hit{" "}
                <span className="text-red-400">C</span>hat
              </h1>
            </div>
            <p className="font-medium text-center">Let's get started!</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          <Tabs className="w-3/4">
            <TabsList className="bg-transparent rounded-none w-full">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-red-500 p-3 transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-red-500 p-3 transition-all duration-300"
              >
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-6 mt-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-6 mt-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex items-center justify-center">
                <Button className="p-6 rounded-full mt-5" onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="register">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-6 mt-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-6 mt-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-6 mt-5"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="flex items-center justify-center">
                <Button
                  className="p-6 rounded-full mt-5"
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
