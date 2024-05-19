"use client"
import  StreamVideoProvider  from '@/providers/StreamClientProvider';
import React from 'react'

function RootLayout({children} : {children: React.ReactNode}) {
  return (
    <main>
      <StreamVideoProvider>
      {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout;