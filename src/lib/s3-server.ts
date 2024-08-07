'use server'
import AWS from "aws-sdk"
import fs from "fs"
import toast from "react-hot-toast"

/*
TODO: 从S3下载文件
MARK: 从S3下载文件
*/
export async function downloadFromS3(file_key:string) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    })

    // TODO: AWS:创建 S3实例
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      // region:"ap-southeast-2"
      region:"us-east-1"
    })

    //TODO: AWS:上传文件需要的参数
    const params = {
      Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    }

    //TODO: AWS:获取AWS上的文件下载到/tmp/文件夹
    const obj = await s3.getObject(params).promise()
    const file_name = `/temp/pdf-${Date.now()}.pdf`
    fs.writeFileSync(file_name,obj.Body as Buffer)

    return file_name
  } catch (error) {
    console.log(error);
    toast.error("Download Failed")
  }
}
