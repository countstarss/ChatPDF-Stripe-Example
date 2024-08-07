'use client'

import axios from 'axios';
import React, { useState } from 'react'
import { Button } from './ui/button';

type Props = {
  isPro:boolean
}

const StripeButton = ({ isPro }: Props) => {
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
    <>
        <Button className='text-bold text-xl text-white rounded-2xl' onClick={handleSubscription}>
        {isPro? "Manage Subscription" : "Upgrade to Pro!"}
        </Button>
    </>
  )
}

export default StripeButton