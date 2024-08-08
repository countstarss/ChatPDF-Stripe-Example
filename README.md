This is a practice case from youtober@elliottchong.I have implemented AWS S3 content upload and Stripe configuration.

### start project

//由于需要添加环境变量才能运行，在根目录创建一个.env文件
//根据下面的提示，将其全部填满，就能达到我上面描述的效果,上传文件到AWS-s3,并且添加stripe订阅的功能

```markdown
TODO: Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

TODO: Neon Database
DATABASE_URL=

TODO: AWS S3
NEXT_PUBLIC_S3_ACCESS_KEY_ID=
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=
NEXT_PUBLIC_S3_BUCKET_NAME=
NEXT_PUBLIC_S3_BUCKET_REGION=

TODO: Pinecone
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=

TODO: STRIPE
STRIPE_API_KEY=
STRIPE_WEBHOOK_SIGNING_SECRET=
NEXT_BASE_URL=http://localhost:3000
```

```bash
yarn install
yarn dev
```

## 1. Clerk

[Clerk Docs](https://clerk.com/docs/quickstarts/nextjs)

- #### 1. 首先在dashboard创建app
- #### 2. 安装Clerk，`yarn add @clerk/nextjs`
- #### 3. 在.env中添加，不同的应用有不同的KEY，注意区别

  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - CLERK_SECRET_KEY
- #### 4. 根目录下添加 `Middleware.ts`

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

- #### 5. Clerk控制访问权限

```ts
const isPublicRoute = createRouteMatcher(
    /*
    TODO: 在这里可以控制没有登陆之前可以访问的页面
    TODO: 下面有的就是你可以不用登录就能访问的页面
    MARK: - 开放访问控制
    */
    [
        '/sign-in(.*)',
        '/sign-up(.*)',
        '/',
        // '/dashboard',
        // '/api/clerk-webhook',
        // '/api/drive-activity/nitification'
    ]
);
export default clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
        auth().protect();
    }
});
```

- #### 6. 在 `app/layout.tsx`中引入 `ClerkProvider`,包裹住所有的内容，赋予登录注册功能
- #### 7. 自定义注册和登录页面

  - 创建对面的路由页面 sign-in & sign-up
  - 更新环境变量
    - NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    - NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

## 2. Drizzle & Deon

- #### 1. 使用Drizzle作为数据库的映射工具
- #### 2. 安装第三方库

  - `yarn add drizzle-orm `
  - `yarn add -D drizzle-kit`
  - `yarn add @neondatabase/serverless`
- #### 3. 添加Neon的环境变量

  - DATABASE_URL='postgresql://`<username>`:`<password>`@ep-holy-frog-a1fb2wdw.ap-southeast-1.aws.neon.tech/chatpdf?sslmode=require'
- #### 4. 配置Drizzle

```ts
/*
MARK: - DOTENV
TODO: 之所以使用dotenv是因为Next.js只能在"/src"文件夹内识别 ".env "
*/
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/lib/db/schema.ts", //TODO: `配置Schema文件位置`
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- #### 5. 链接数据库 /lib/db/index.ts

```ts
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http"

neonConfig.fetchConnectionCache = true

if(!process.env.DATABASE_URL) {
  throw new Error('database url not found')
}

const url = neon(process.env.DATABASE_URL)

export const db = drizzle(url);
```

- #### 6. 创建数据结构 /lib/db/Schema.ts

```ts
// TODO: 从'drizzle-orm/pg-core'引入
import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  pdfName: text('pdf_name').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  fileKey: text('file_key').notNull(), //TODO: key用来识别 AWS 上的文件
})
```

需要注意它的使用方式是:
pgTable('name',{
    id  : XXX,
    name: XXX,
})

- #### 7. 使用 `drizzle-kit generate`命令生成SQL语句

  - 同时会生成一个文件用来存储对应的SQL，数据库中也会生成一个表记录generate的信息
- #### 8. 使用该 `drizzle-kit migrate`命令运行SQL语句
- #### 9. 或者，可以使用 `drizzle kit push`命令将更改直接推送到数据库，代替上面的两句

  - 一般来说，分开写比较稳妥一点，如果有报错可以及时看到
- #### 10. 使用 `npx drizzle-kit studio`运行Drizzle studio

  - 查看和操作Neon数据库
- #### 11. Drizzle的使用方式

  - Drizzle原生支持 `PostgerSQL`,`MySQL`,`SQLite`
    `const chats = await db.select().from(chats).where(eq(chats.userId,userId))`
  - from是表格
  - where是条件

## 3. Drop File

[react-dropzone](https://github.com/react-dropzone/react-dropzone/)

- `yarn add react-dropzone`
- 主要就是使用useDropzone,

```ts
import { useDropzone } from "react-dropzone"

type Props = {}
const FileUpload = () => {
  //TODO: useDropzone能接受哪些配置，可以看代码了解到
  const { getRootProps,getInputProps }  = useDropzone({
    accept:{ "application/pdf": [".pdf"] },
    maxFiles:1,
    onDrop:(acceptedFile) => {
      //TODO: 拿到的是一个数组
      console.log(acceptedFile[0].name);
      //TODO: 拿到上传的文件后进行操作
    }
  });
}

```

## 4. AWS

- #### 1. 安装aws-sdk

  `yarn add aws-sdk`
- #### 2. 创建Bucket
- #### 3. 设置存储桶策略和CORS策略（Permissins）


  - Bucket Policy

  ```json
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "PublicReadGetObject",
              "Effect": "Allow",
              "Principal": "*",
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::<BucketName>/*"
          }
      ]
  }
  ```

  - CORS策略
  - 允许所有的header和方法

  ```json
  [
  {
      "AllowedHeaders":["*"],
      "AllowedMethods":["PUT","POST","DELETE","GET"],
      "AllowedOrigins":["*"],
      "ExposeHeaders":[]
  }  
  ]
  ```
- #### 4. 创建密钥


  - Create Access key
    -> Local code
  - NEXT_PUBLIC_S3_ACCESS_KEY_ID
    -> IAM -> Access Management -> Users -> access key
    -> IAM -> Access Management -> Users -> Security credentials
- #### 5. S3.ts


  - 1. 链接到S3
  - 2. 创建S3实例
  - 3. 上传文件所需参数
  - 4. 上传，获取上传进度
  - 5. 返回需要的内容

```ts
import AWS from "aws-sdk"

// 接受react-dropzone接受的文件
export async function uploadToS3(file:file) {
    // TODO: 01:链接到S3 (密钥)
    try{
        AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        })
        // TODO: 02:创建S3实例 (名字，区域)
        const s3 = new AWS.S3({
        params: {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        },
        region:"ap-southeast-2"
        })

        const file_key = "uploads/" + Date.now().toString() + file.name.replace(" ","-")
        // TODO: 03:上传文件所需的参数 （bucket_name, file_key, file）
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key:file_key,
            Body:file
        }
        //TODO: 04:上传，获取上传进度
        const upload = s3.putObject(params).on('httpUploadProgress',env => {
            console.log('uploading to s3...',parseInt(((env.loaded*100)/env.total).toString())+"%")}).promise()
    
        await upload.then(data => {
            console.log('successfully uopload to S3',file_key)
        })

        //TODO: 05:返回数据
        return Promise.resolve({
            file_key,
            file_name:file.name
        })
    }catch(error) {
        throw new Error('upload to S3 failed')
    }
}

//TODO: 根据拿到的file_key,也就是在 S3中存储的位置 和 存储文件时的名字
export function getS3Url(file_key:string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3-${NEXT_PUBLIC_S3_BUCKET_REGION}.amazonaws.com/${file_key}`
    return url
}
```

- #### 6. 拿到接受的文件，上传前检查
- 这是在FileUpload组件中useDropzone的onDrop函数

```ts
onDrop: async (acceptedFile) => {
    const file = acceptedFile[0]
    // TODO: 文件大小检查
    if(file.size > 10 * 1024 * 1024) {
        alert('more than 10MB,pleace upload smaller file')
        return
    }
    // TODO: 上传文件 ！！！
    try{
        const data = await uploadToS3(file)
        console.log("data:",data)
        const file_url = getS3Url(data.file_key)
        console.log("file_key:",file_url)
    }catch(error) {
        console.log(error)
    }
}
```

## 5. react-query & react-hot-toast

- #### react-query

  - react-query的作用是让组件具有缓存数据的能力
  - 1. 创建一个Provider，包裹Layout

```ts
import React from 'react'
import { QueryClientProvider,QueryClient } from "react-query"

type Props = {
    children: React.ReactNode
}
const queryClient = new QueryClient()
const QueryProvider = ({ children }:Props) => {
    return (
        //TODO: 给组件提供缓存数据的功能
        <QueryProvider client={queryClient}>
            {children}
        <QueryProvider>
    )
}
export default QueryProvider;
```

- #### 2. 将功能添加到Layout.tsx

```ts
import QueryProviders from "@/components/Providers";
import { Toaster } from "react-hot-toast";
    .....
    // TODO: 赋予所有内容React-query的能力
    // TODO: 在Layout内容底部插入<Toaster />,就不需要再单独生成一个，插入元素
    <QueryProviders>
        <html lang="en">
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
        </html>
    </QueryProviders>
    .....
```

- #### 3. 添加useMutation

  - #### 什么是 useMutation？
  - useMutation 是一个 React Hook，主要用于处理数据更新、创建或删除等异步操作。它来自像 React Query 这样的数据获取库，为管理这些异步操作提供了一种规范且灵活的方式。
  - 为什么使用 useMutation？
  - 集中管理异步操作： 将所有的异步操作集中在一个地方管理，使得代码更易于维护和测试。
  - 状态管理： 提供了 isLoading、isError、isSuccess 等状态，方便组件根据操作的状态来显示不同的 UI。
  - 自动重试： 可以配置自动重试失败的请求，提高系统的健壮性。
  - 乐观更新： 在请求发送前，可以先更新 UI，给用户更好的交互体验。
  - 错误处理： 提供了统一的错误处理机制。
  - #### mutate 的作用
  - mutate 是 useMutation 返回的一个函数，用于触发异步操作。当调用 mutate 时，它会执行传入的 mutation 函数，并更新组件的状态。
  - 触发异步操作： 调用 mutate 就相当于发起一个请求，可能是发送一个 POST 请求创建数据，或者发送一个 DELETE 请求删除数据。
  - 更新组件状态： 在请求执行过程中和完成后，useMutation 会自动更新组件的状态，例如 isLoading 变为 true 表示正在加载，isError 变为 true 表示请求失败，isSuccess 变为 true 表示请求成功。
  - 处理响应数据： 可以通过 onSuccess 回调来处理请求成功的响应数据，通过 onError 回调来处理请求失败的错误。

```ts
const FileUpload = () => {

  // MARK: config & fetch
  const [uploading,setUploading] = useState(false)
  //TODO: 提供了 isLoading、isError、isSuccess 等状态，方便组件根据操作的状态来显示不同的 UI
  const { mutate,isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
        file_key: string,
        file_name: string
      }) => {
      const response = await axios.post('/api/create-chat', {
        file_key, file_name
      })
    }
  })

  // MARK: useDropzone
  const { getRootProps, getInputProps } = useDropzone({
    // TODO: 在此配置允许接收的文件类型
    accept: { 
      "application/pdf": [".pdf"],
      // "text/plain":[".md"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFile) => {
      console.log(acceptedFile[0].name);

      const file = acceptedFile[0]
      if (file.size > 10 * 1024 * 1024) {
        //bigger then 10MB
        toast.error('more than 10MB,pleace upload smaller file')
        return
      }
      //TODO: 上传react-dropzone收到的pdf文件，返回文件url以及文件名
      try {
        const data = await uploadTos3(file)

        if (!data.file_key || !data.file_name) {
          console.log("上传react-dropzone went wrong");
          return
        }
        //TODO: 确定data一定存在之后，使用mutate向 `/api/create-chat`发起请求,创建一个对话
        //TODO: 相当于在这里执行了一个 mutationFn
        mutate(data, {
          onSuccess: (response) => {
            console.log(`response:`, response);
            toast.success("success get response")
          },
          onError: (error) => {
            toast.error('mutate went wrong, axios.post('/api/create-chat'）went wrong')
            console.log(error);
          }
        })
      } catch (error) {
        toast.error('fetch data went wrong')
        console.log(error);

      } finally {
        setUploading(false)
      }
    }
  });
    return (
        <h1>Hello World</h1>
    )
}
```

## 5. Pinecone Database

- `yarn add @pinecone-database/pinecone`
- 下载pdf加载器，把pdf转成文字
- `yarn add langchain`
- #### 实现ChatPDF的整体思路

  - 本地上传文件到AWS S3
  - 把上传的文件tongguo `iframe`展示在页面上
  - 通过OpenAI的GPT API，把每一页文档分成若干份，把每一份内容转化成一个向量
  - 所有内容加载完毕之后，推送到Pinecone矢量数据库
  - 用户提出问题之后，把这个问题的也转化成向量，拿去和数据库中当前chat的文档内容做对比，找出最接近的一个向量
  - 把这个向量提出来，设置好要喂给GPT的prompt，流式生成回复
  - 每一个chat以及message都存储在Neon数据库中

//FIXME: 这一部分暂时略过,先完成后面的部分

## 6. ChatSidebar & PDFViewer

- #### 条件控制CSS（来自shadcn）

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- #### 前面的是共有的，后面的object，前半部分是样式，后半部分是条件

```tsx
<div className={
    cn('rounded-lg p-3 text-slate-300 flex items-center',{
        "bg-blue-600 text-white" :chat.id === chatId,
        "hover:text-white":chat.id !== chatId
    })
}>
```

## 7. Chat Component (Vercel AI Chat)

`yarn add ai openai-edge`
`ai`就是 `Vercel AI SDK`
`openai-edge`是openai兼容 `edge-runing`的库

- /api/create-chat
  - 把S3的文件加载到Pinecone中
- /api/chat
  - 创建OpenAI对话，获取流式输出
  - TODO: 这个API应该是每次发出消息之后，就获取用户发出的message，调用/api/chat/,让gpt返回响应

```ts
import { messages } from './../../../lib/db/schema';
import { Configuration, OpenAIApi } from "openai-edge"
//TODO: 获取流式输出
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

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.log(error);
    toast.error('error on StreamingTextResponse')
  
  }
}
```

- #### chat界面 /chat/[chatId]

  - MessageList
  - PDFViewer
  - ChatComponent
  - Input

/lib/context
/lib/embeddings
/lib/utils
以上是后端功能部分，暂时跳过

## 8. Stripe

`yarn add stripe`

- #### 1. 环境变量

  - 创建app之后，会有一个test密钥，这个是STRIPE_API_KEY
  - STRIPE_WEBHOOK_SIGNING_SECRET 后面再说
- #### 2. 配置Scripe

```ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion:"2024-06-20",
  typescript:true
});
```

- #### 3. 在Schema中创建userSubscription,因为订阅需要存储用户和订阅的信息

```ts
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull().unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }).notNull().unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {length: 256,}).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
});
```

- #### 4. /api/stripe
- 这里的思路是，我们只有一个按钮，什么情况下会触发这个stripe呢？那就是要升级的时候
- 首先判断是否已经登录，如果没有登录，是看不到这个按钮的，所以这样我们能拿到用户Id
- 拿到userId，首先去数据库里查询和 `userSubscription.userId`和现在的 `userId`相等的数据
- 如果找到了这条数据，就打开订阅管理界面
- 如果没有找到，说明用户之前没有订阅过，那就创建一个stripe的订阅
- //FIXME: 订阅和管理订阅需要查询文档，看看具体怎么个写法
- //TODO: [创建订阅](https://docs.stripe.com/payments/checkout/how-checkout-works?ui=stripe-hosted)
  - stripe.checkout.sessions.create
- //TODO: [管理订阅](https://docs.stripe.com/payments/checkout/how-checkout-works?ui=stripe-hosted)
  - stripe.billingPortal.sessions.create
  - 管理订阅需要有一个return Url，开发的时候暂时使用 http://localhost:3000,部署上线之后要做更改

```ts
// TODO: api/stripe

import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const return_url = process.env.NEXT_BASE_URL + '/'

export async function GET() {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if(!userId) {
      return new NextResponse('unauthorized',{ status:401 })
    }

    const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId,userId))
    if(_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId) {
      // try to cancel 
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer:_userSubscriptions[0].stripeCustomerId,
        return_url
      })
      return NextResponse.json({url: stripeSession.url})
    }

    // TODO: user's first time trying to subscribe
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: return_url,
      cancel_url: return_url,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "ChatPDF Pro",
              description: "Unlimited PDF sessions!",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    return NextResponse.json({url: stripeSession.url})
  } catch (error) {
    console.log("stripe error", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
```

- 现在应该是可以打开订阅的界面，下一步，配置webhook
- #### 5. /api/webhook/

```ts
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string
    );
  } catch (error) {
    return new NextResponse("webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // new subscription created
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    if (!session?.metadata?.userId) {
      return new NextResponse("no userid", { status: 400 });
    }
    await db.insert(userSubscriptions).values({
      userId: session.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await db
      .update(userSubscriptions)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      })
      .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
  }

  return new NextResponse(null, { status: 200 });
}

```

- 在clerk middleware中，允许访问 /api/webhook/
- - 完成这里之后，就可以测试订单
  - 1. 安装stripe CLI
  - 2. stripe login
  - 3. stripe listen --forward-to localhost:3000/api/webhook (本地运行的地址)

    - 完成这步之后，会得到一个[webhook signing secret]
  - 4. 添加端点：端点监听的事件是 "checkout.session.completed" & "invoice.payment_succeeded"
  - 5. [Enable test portal](https://dashboard.stripe.com/test/settings/billing/portal)
  - 6. 再次提交订单，应该会成功，再次点击，会进入到订阅管理界面

## 9. Deploy

- 上传github
- 到vercel部署
  - 粘贴所有的环境变量，除了STRIPE_BASE_URL，因为这个是要作为动作完成之后的return_url
  - 需要在部署完成之后，把部署后的域名作为环境变量，然后重新部署应用
