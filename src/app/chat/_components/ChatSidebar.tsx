'use client'

import { Button } from '@/components/ui/button'
import { DrizzleChat } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { MessageCircle, PlusCircleIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'



type Props = {
  // TODO: 在Schema导出Chat
  chats:DrizzleChat[],
  chatId:number,
}

const ChatSidebar = ({ chats,chatId }: Props) => {
  const [loading,setLoading] = useState(false)
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className='w-full h-screen p-4 text-gray-200 bg-gray-900'>
      {/* //MARK: New Chat
       */}
      <Link href="/">
        <Button className='w-full border-dashed border-white'>
          <PlusCircleIcon className='mr-2 w-4 h-4'/>
          New Caht</Button>
      </Link>

      {/* //MARK: Chat Message
       */}
      <div className="flex flex-col ">
        {chats.map( chat=> (
          <Link key={chat.id}  href={`/chat/${chat.id}`}>
            {/* //TODO: 下面是一个来自shadcn（@/lib/utils）的特殊方法，可以根据条件赋予样式，前面是样式，后面是条件
             */}
            <div className={
              cn('rounded-lg p-3 text-slate-300 flex items-center',{
                "bg-blue-600 text-white" :chat.id === chatId,
                "hover:text-white":chat.id !== chatId
              })
            }>
              <MessageCircle className='p-2'/>
              <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{chat.pdfName}</p>
            </div>
          </Link>
        ))

        }
      </div>

      {/* //MARK: Bottom Link
       */}
      <div className='absolute bottom-4 left-4'>
        <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap'>
          <Link href="/">Home</Link>
          <Link href="/">Source</Link>
          {/* Stripe Button */}
          <Button className='mt-2 text-white bg-slate-700' onClick={handleSubscription}>
            Upgrade to Pro!
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar;