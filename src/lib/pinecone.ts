import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import toast from 'react-hot-toast';


const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });


const indexName = "docs-quickstart-index"

pinecone.createIndex({
  name: indexName,
  dimension: 1536,
  metric: 'cosine',
  spec: { 
    serverless: { 
      cloud: 'aws', 
      region: 'ap-southeast-2' 
    }
  } 
});
const index = await pinecone.index(indexName);


export async function loadS3IntoPinecone(file_key: string) {
  //TODO: 1. obtain the pdf -> download and read from pdf
  console.log("Download s3 into file system");
  const file_name = await downloadFromS3(file_key);
  if (!file_name) {
    toast.error("Invalid file_name")
    console.log("Invalid file_name");
    return;
  }
  // FIXME: 寻找解决方案
  // import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
  const loader = new PDFLoader(file_name!)
  const pages = await loader.load()
  return pages

}

  //FIXME: Setup PineconeDB
export default { pinecone }
