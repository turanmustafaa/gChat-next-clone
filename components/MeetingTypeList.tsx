"use client"
import Image from 'next/image'
import React from 'react'
import HomeCard from './HomeCard'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import Loader from './Loader'
import { useToast } from './ui/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Input } from './ui/input'


const MeetingTypeList = () => {
  const {toast} = useToast()
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const  {user} = useUser();
    const client = useStreamVideoClient()
    const initialValues = {
      dateTime: new Date(),
      description: '',
      link: '',
    };
    const [values,setValues] = useState(initialValues)
    const [callDetails,setCallDetails] = useState<Call>()
    const createMeeting = async () => {
      if (!client || !user) return;
      try {
        if(!values.dateTime) {
          toast({title: 'pelase select date and time',description: 'Please select a date and time',variant: 'destructive'})
          return;
        }
        const id = crypto.randomUUID();
        const call = client.call('default', id);
        if (!call) throw new Error('Failed to create meeting');
        const startsAt =
          values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || 'Instant Meeting';
        await call.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: {
              description,
            },
          },
        });
        setCallDetails(call);
        if (!values.description) {
          router.push(`/meeting/${call.id}`);
        }
        toast({title: 'meeting created',description: 'Meeting created successfully'})
      } catch (error) {
        toast({title: 'Error',description: 'Failed to create meeting',variant: 'destructive'})
        console.error(error);
      }
    };

    if (!client || !user) return <Loader />;

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
     <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-1"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/recordings')}
      />

      {
        !callDetails ? 
        <MeetingModal
        buttonText='Schedule Meeting'
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose = {() => setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
        >
          <div className='flex flex-col gap-2.5'>
            <label className='text-base text-normal leading-6 text-sky-2'>Add a Description</label>
            <Textarea  className='border-none bg-dark-2 focus-visible:ring-0 focus-visible-ring-offset-0'
            onChange={(e) => setValues({...values,description: e.target.value})}/>
          </div>
          <div className='flex w-full flex-col gap-2.5 '>
          <label className='text-base text-normal leading-6 text-sky-2'>Select Date and Time</label>
          <ReactDatePicker
          className='w-full rounded bg-dark-2'
          selected={values.dateTime} onChange={(date) => setValues({...values,dateTime: date!})}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='time'
          dateFormat={'dd/MM/yyyy h:mm aa'} />
          </div>
        </MeetingModal>
        : (
          <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose = {() => setMeetingState(undefined)}
          title="Start an instant meeting"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({title: 'meeting link copied',description: 'Meeting link copied successfully'})
          }}
          image='/icons/checked.svg'
          buttonIcon='/icons/copy.svg'
          buttonText='Copy Link'
          />
        )
      }
      <MeetingModal
      isOpen={meetingState === 'isInstantMeeting'}
      onClose = {() => setMeetingState(undefined)}
      title="Start an instant meeting"
      className="text-center"
      buttonText="Start Meeting"
      handleClick={createMeeting}
      />

<MeetingModal
      isOpen={meetingState === 'isJoiningMeeting'}
      onClose = {() => setMeetingState(undefined)}
      title="Type Link here"
      className="text-center"
      buttonText="Join Meeting"
      handleClick={() => router.push(values.link)}
      >
        <Input placeholder='meeting link....'
        className='border-none bg-dark-2'
        onChange={(e) => setValues({...values,link: e.target.value})} />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList