import AWS from "aws-sdk"


export async function uploadTos3(file:File) {
  // TODO: AWS:链接到 `S3`
  try{
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    })
    // TODO: AWS:创建 S3实例
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region:"ap-southeast-2"
    })

    const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ',"-")

    //TODO: AWS:上传文件需要的参数
    const params = {
      Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body:file
    }

    //TODO: AWS:使用Callback函数获得上传的百分比
    const upload = s3.putObject(params).on("httpUploadProgress",evt => {
      console.log('uploading to s3...',parseInt(((evt.loaded*100)/evt.total).toString())+ "%") 
    }).promise()

    await upload.then(data => {
      console.log(`successfully upload to S3`, file_key);
    })

    //TODO: AWS:上传成功之后传回 name 和 Key
    return Promise.resolve({
      file_key,
      file_name:file.name
    })

  }catch(error) {
      throw new Error("uploadTos3 failed")
  }
}

export function getS3Url(file_key:String) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3-ap-southeast-2.amazonaws.com/${file_key}`
  return url
}