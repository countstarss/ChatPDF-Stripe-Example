import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import StripeButton from "@/components/StripeButton";
import { checkSubscription } from "@/lib/subscription";

export default async function Home() {
  const { userId } = auth()
  const isAuth = !!userId
  const isPro = await checkSubscription()
  
  return (
    <>
    <div className='absolute top-[5vh] right-[5vh] scale-150'>
        <UserButton />
    </div>
    <div className='w-screen min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className="flex flex-col items-center text-center">
          <div className='flex items-center'>
            <h1 className='mr-3 text-5xl font-semibold text-grey' >Chat with any PDF & MarkDown</h1>
          </div>
          

          <div className='flex m-4'>
            { isAuth && (
              <>
                <Button className='text-xl rounded-2xl mx-2'>Go To Chats</Button>
                <StripeButton isPro={isPro}/>
              </>
            )
            }
          </div>
          
          <p 
            className='max-w-2xl min-w-md mt-1 text-lg line-clamp-2'>
            Used by some of the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components.
          </p>

          <div className='w-full mt-4 px-10'>
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="sign-in">
                <Button className='text-bold text-xl text-white rounded-2xl'>Get Started 
                  <LogIn className='w-4 h-4 ml-2'/>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
