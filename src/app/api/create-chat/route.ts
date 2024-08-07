'use server'
import { loadS3IntoPinecone } from "@/lib/pinecone";
//TODO: /api/create-chat

import { NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function POST(req:Request, res:Response) {
  try{
    const body = await req.json()
    const { file_key,file_name } = body

    // TODO: 把`S3`的文件加载到 `pinecone`
    const pages = await loadS3IntoPinecone(file_key);
    if(!pages) {
      console.log('router => loadS3IntoPinecone failed');
      toast.error('router => loadS3IntoPinecone failed')
      return
    }
    return NextResponse.json({pages})
  }catch(error) {
    console.log(error);
    return NextResponse.json(
      {error:"Internal server error"},
      {status:500}
    )
  }
}
// FIXME: SetUp Pinecone