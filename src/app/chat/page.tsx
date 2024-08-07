import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'
import ChatSidebar from "./_components/ChatSidebar"
import PDFViewer from './_components/PDFViewer'
import ChatComponent from './_components/ChatComponent'



// const CahtPage = async ({ params: [chatId] }:Props) => {
const CahtPage = async () => {



  return (
    <div className='flex max-h-screen overflow-scroll'>
      <div className='flex w-full max-h-screen overflow-scroll'>
        {/* //MARK: Side Bar
         */}
        <div className='flex-[1] max-w-xs'>
          {/* <ChatSidebar chats={_chats} chatId={4}/> */}
        </div>
        {/* //MARK: PDF Viewer
         */}
        <div className='max-h-screen p-4 overflow-scroll flex-[4]'>
          <PDFViewer pdf_url=""/>
        </div>
        {/*// MARK:ChatComponent
         */}
        <div className='flex-[3] border-l-4 border-l-slate-200'>
          <ChatComponent />
        </div>
      </div>
    </div>
  )
}

export default CahtPage;