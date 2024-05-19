import { cn } from '@/lib/utils'
import { CallControls, CallParticipantsList, CallStatsButton, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import EndCallButton from './EndCallButton'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Loader from './Loader'
import { useRouter } from 'next/navigation'


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'
const MeetingRoom = () => {
  const router =useRouter();
  const searchParams = useSearchParams();
  const isPersonelRoom = !!searchParams.get('personel')
  const [layout,setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants,setShowParticipants] = useState(false)

  const {useCallCallingState} = useCallStateHooks()

  const callingState = useCallCallingState()

  if(callingState !== CallingState.JOINED) return <Loader />
  const CallLayout = () => {
    switch(layout) {
      case 'grid' :
      return <PaginatedGridLayout />
      case 'speaker-right' : 
      return <SpeakerLayout participantsBarPosition={'left'} />
      default:
      return <SpeakerLayout participantsBarPosition={'right'} />
    }
    
  }
  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center'>
        <div className='flex size-full max-w-[1000px] items-center'>
          <CallLayout />
        </div>
        <div className={cn('h-[calc(100vh-86px)] hidden',{'show-block' :showParticipants})}>
          <CallParticipantsList onClose={() => setShowParticipants(false) } />
        </div>
      </div>
      <div className='fixed flex-wrap bottom-0 flex w-full items-center justify-center gap-5'>
        <CallControls onLeave={()=>  {
          router.push('/')
        }} />

        <DropdownMenu>

          <div className=' flex items-center '></div>
  <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] py-2 px-4 hover:bg-slate-400'>
    <LayoutList size={20} className='text-white' />
  </DropdownMenuTrigger>
  <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
    {['grid', 'speaker-left', 'speaker-right'].map((item,index) => (
      <div key={index}>
        <DropdownMenuItem
         className='cursor-pointer'
         onClick={() => setLayout(item.toLocaleLowerCase() as CallLayoutType)}>
          {item}
        </DropdownMenuItem>
    <DropdownMenuSeparator className='border-dark-1' />
      </div>
    )

    )}
  </DropdownMenuContent>
</DropdownMenu>
<CallStatsButton />
<button onClick={() => setShowParticipants((prev) => !prev)}>
  <div className='cursor-pointer rounded-2xl bg-[#19232d] py-2 px-4 hover:bg-slate-400'>
    <Users size={20} className='text-white' />
  </div>
</button>
{!isPersonelRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom