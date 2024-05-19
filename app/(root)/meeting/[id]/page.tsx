"use client"
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React from 'react'
import { useState } from 'react';
import { useGetCallById } from '@/hooks/useGetCallById';
import Loader from '@/components/Loader';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const Meeting = ({params} : {params: {id: string}}) => {
  const {call,isCallLoading} = useGetCallById(params.id);
  const {user,isLoaded} = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if(!isLoaded || isCallLoading) return <Loader />
  return (
    <main className='h-screen  w-full'>
      <StreamCall call={call}>
      <StreamTheme>
    {
      !isSetupComplete ? 
      <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
      : 
      <MeetingRoom />
    }
      </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting;