This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# 1. Clerk

# 2. Drizzle & Deon

- `yarn add drizzle-orm `
- `yarn add -D drizzle-kit`
- `yarn add @neondatabase/serverless`
- 使用`drizzle-kit generate`命令生成迁移
- 使用该`drizzle-kit migrate`命令运行它们
- 或者，可以使用`drizzle kit push`命令将更改直接推送到数据库
- 使用`npx drizzle-kit studio`运行Drizzle studio，查看和操作Neon数据库

# 3. Drop File

- `yarn add react-dropzone`

# 4. AWS 

- Bucket Policy
``` json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::chatpdf-lukeking/*"
        }
    ]
}
```

- CORS策略
``` json
[
{
    "AllowedHeaders":["*"],
    "AllowedMethods":["PUT","POST","DELETE","GET"],
    "AllowedOrigins":["*"],
    "ExposeHeaders":[]
}    
]
```

- 安装aws-sdk
`yarn add aws-sdk`
- react-query
- axios
- react-hot-toast

# 5. Pinecone Database

- `yarn add @pinecone-database/pinecone`
- 下载pdf加载器，把pdf转成文字
  - `yarn add langchain`

//FIXME: 这一部分暂时略过,先完成后面的部分

# 6. ChatSidebar

# 7. PDFViewer

# 8. Chat Component (Vercel AI Chat)


