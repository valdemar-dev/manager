"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react';

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
    <main className="min-h-screen mx-auto overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl text-text p-4 pt-12 box-border">
      <h1 className="text-4xl font-semibold fadeIn mb-2">Welcome to ManagerX</h1>
      <p className="fadeIn animation-delay-600">The All-Purpose Manager for Enhanced Productivity and Clarity.</p>

      {/* divider */}
      <div className="h-10"></div>

      <div className="flex flex-row gap-2">
        <a className="bg-accent text-primary sm:hover:shadow-2xl transition-all duration-200 font-semibold text-lg px-5 py-2 rounded-md fadeIn animation-delay-800" href="/user/register">Register</a>
        <a className="bg-secondary active:bg-secondary-darker sm:hover:bg-secondary transition-all duration-200 font-semibold text-lg px-5 py-2 rounded-md fadeIn animation-delay-900" href="/user/login">Login</a>
      </div>

      {/* divider */}
      <div className="h-10"></div>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-primary shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1000 h-min">
          <h3 className="text-xl font-semibold">Account management</h3>
          <p>Remove the hassle of remembering account details. Encrypted and safe, forever.</p>
        </section>

        <section className="bg-secondary shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1200 h-min">
          <h3 className="text-xl font-semibold">Contacts</h3>
          <p>Create contact information for people you know. Names, phone numbers, social medias, etc.</p>
        </section>

        <section className="bg-secondary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1600">
          <h3 className="text-xl font-semibold mb-2">Tasks</h3>
          <div className="flex items-center gap-2 bg-secondary-darker px-3 py-2 rounded-lg">
            <p className="text-lg">Releases in 1.0</p>
          </div>
        </section>

        <section className="bg-primary drop-shadow-xl p-4 rounded-xl flex flex-col gap-2 animation-delay-1400">
          <h3 className="text-xl font-semibold mb-2">Notes</h3>
          <div className="flex items-center gap-2 bg-primary-darker px-3 py-2 rounded-lg">
            <p className="text-lg">Planned for 1.1</p>
          </div>
        </section>
      </div>
    </main>
  )
}
