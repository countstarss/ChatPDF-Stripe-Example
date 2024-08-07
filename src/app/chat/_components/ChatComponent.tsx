// import { Input } from '@/components/ui/input';
import React from 'react'
// import { useChat } from "ai/react"
// import { Button } from '@/components/ui/button';
// import { Send } from 'lucide-react';
// import MessageList from './MessageList';

type Props = {}

const ChatComponent = (props: Props) => {
  return (
    <h1>ChatComponent</h1>
  )
//   const { input,handleInputChange,handleSubmit,messages } = useChat({
//     api:'/api/chat'
//   });
//   return (
//     <div className='relative max-h-screen overflow-scroll'>
//       {/* header */}
//       <div className='sticky top-0 inset-x-0 p-4 bg-white h-fit'>
//         <h3 className='text-2xl font-bold'>Chat</h3>
//       </div>

//       {/* message list */}
//       <MessageList messages={messages} />

//       <form className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white' onSubmit={handleSubmit}>
//         <div className='flex'>
//           <Input value={input} onChange={handleInputChange} placeholder='Ask any question...' className='w-full'/>
//           <Button>
//               <Send className='w-4 h-4' />
//           </Button>
//         </div>
//       </form>


//     </div>
//   )
}

export default ChatComponent;