import { messages } from './../../../lib/db/schema';
import { Configuration, OpenAIApi } from "openai-edge"
//TODO: import流式输出
import {OpenAIStream,StreamingTextResponse} from 'ai'
import toast from 'react-hot-toast';

export const runtime = "edge"

const config = new Configuration({
  // FIXME:使用Gemini代替
  apiKey:process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export async function POST(req:Request) {
  try {
    const { messages } = await req.json()

    // TODO: 在这里创建OPENAI对话
    const response = await openai.createChatCompletion({
      model:'gpt-3.5-turbo',
      messages,
      stream:true
    })
    //TODO: 获取流式输出
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.log(error);
    toast.error('error on StreamingTextResponse')
    
  }
}