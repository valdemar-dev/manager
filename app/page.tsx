"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import Card from '@/components/CardComponent';
import Divider from '@/components/Divider';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return setLoading(false);
  }, []);

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <>
      <h1 className="text-4xl font-semibold fadeIn mb-2">
        Welcome to <span className="bg-gradient-to-r from-primary-100 to-accent-100 bg-clip-text text-transparent">ManagerX</span>
        </h1>
      <p className="fadeIn animation-delay-600">The All-Purpose Manager for Enhanced Productivity and Clarity.</p>

      <Divider height="h-10"/>

      <div className="flex flex-row gap-2">
        <a className="bg-primary-100 text-primary-text sm:hover:shadow-2xl transition-all duration-200 font-semibold text-lg px-5 py-2 rounded-md fadeIn animation-delay-800" href="/user/register">Register</a>
        <a className="bg-secondary-100 transition-all duration-200 font-semibold text-lg px-5 py-2 rounded-md fadeIn animation-delay-900" href="/user/login">Login</a>
      </div>

      <Divider height="h-10"/>

      <div className="grid md:grid-cols-2 gap-10">

        <Card 
          title="Account management" 
          animationDelay={"animation-delay-1000"}
          type={"secondary"}
        >
          <p className="marker:text-accent-100 list-item text-lg ml-5">Remove the hassle of remembering account details. Encrypted and safe, forever.</p>
        </Card>


        <Card 
          title="Contacts" 
          animationDelay={"animation-delay-1200"}
          type={"secondary"}
        >
          <p className="marker:text-accent-100 list-item text-lg ml-5">Create contacts for people you know. Names, phone numbers, social medias, etc.</p>
        </Card>

        <Card 
          title="Notes" 
          animationDelay={"animation-delay-1400"}
          type={"secondary"}
        >
          <p className="marker:text-green-400 list-item text-lg ml-5">Planned for 1.1</p>
        </Card>

        <Card 
          title="Tasks" 
          animationDelay={"animation-delay-1600"}
          type={"secondary"}
        >
          <p className="marker:text-green-400 list-item text-lg ml-5">Releases in 1.0</p>
        </Card>
      </div>
    </>
  )
}
