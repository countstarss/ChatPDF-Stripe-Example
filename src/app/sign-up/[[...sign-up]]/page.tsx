import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return(
  <div className='w-screen min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <SignUp />
      </div>
    </div>
  );
}