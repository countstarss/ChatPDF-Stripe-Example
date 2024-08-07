import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'
import ChatSidebar from "../_components/ChatSidebar"
import PDFViewer from '../_components/PDFViewer'
import ChatComponent from '../_components/ChatComponent'

type Props = {
  params: [
    chatId: string
  ]
}

// const CahtPage = async ({ params: [chatId] }:Props) => {
const CahtPage = async ({ params: [chatId] }:Props) => {
  const { userId } = await auth()
  if(!userId) {
    return redirect('/sign-in')
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId,userId))
  if(!_chats) {
    return redirect('/')
  }
  if(!_chats.find(chat=>chat.id === parseInt(chatId))){
    return redirect('/')
  }

  const currentChat = _chats.find(chat => chat.id === parseInt(chatId))

  return (
    <div className='flex max-h-screen overflow-scroll'>
      <div className='flex w-full max-h-screen overflow-scroll'>
        {/* //MARK: Side Bar
         */}
        <div className='flex-[1] max-w-xs'>
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)}/>
        </div>
        {/* //MARK: PDF Viewer
         */}
        <div className='max-h-screen p-4 overflow-scroll flex-[4]'>
          <PDFViewer pdf_url={currentChat?.pdfUrl || ''}/>
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