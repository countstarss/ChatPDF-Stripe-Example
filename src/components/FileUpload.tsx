'use client'
import { getS3Url, uploadTos3 } from "@/lib/s3";
import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone"
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useState } from "react";

const FileUpload = () => {

  // MARK: config & fetch
  const [uploading,setUploading] = useState(false)
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
        mutate(data, {
          onSuccess: (data) => {
            console.log(`data:`, data);
            toast.success("success get data")
          },
          onError: (error) => {
            toast.error('mutate went wrong')
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

  // MARK: return
  return (
    <div className='p-2 bg-white rounded-xl w-[500px] mx-auto'>
      <div {...getRootProps({
        className: 'text-white border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-10 flex justify-center items-center flex-col'
      })}>
        <input {...getInputProps()} />
        {(uploading || isLoading ) ? (
          <>
          <Loader2 className='h-10 w-10 text-blue-500 animate-spin'/>
          <p className='mt-2 text-sm text-slate-400'>
            Splling Tea to GPT ...
          </p>
          </>
        ) : (  
        <div className='flex flex-col items-center text-center'>
          <Inbox className='w-10 h-10 text-blue-500' />
          <h2 className='text-blue-400'>Drop File Here</h2>
        </div>
        )}
      </div>
    </div>
  )
}

export default FileUpload;