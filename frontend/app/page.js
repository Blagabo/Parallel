
import Script from 'next/script'
import Image from 'next/image'
import ModelCard from "../components/model-card"
import FileUpload from '../components/file-upload'
import Link from 'next/link';
import SessionComponent from "../components/get-sessions"
// import { create } from 'ipfs-http-client';

const INFURA_API_PRIVATE_KEYS = "25a3694bdef6fb61d97215958a3e5834"
const INFURA_API_KEY = "2WQmth6fe2e0iJCzBKDzqsy3W7e"

export default function Home() {

  // const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

  // const cid = "bafyreifficclmmklkoknnoebx47ejw2wqff2uijk6gcwciaqh2qlft2qzu";
  // // console.log(ipfs)
  // try {
  //   // Use ipfs.cat to retrieve the data associated with the CID
  //   const data = ipfs.cat(cid);

  //   // Now, 'data' contains the retrieved data
  //   console.log('Retrieved Data:', data.toString('utf-8'));
  // } catch (error) {
  //   console.error('Error retrieving data from IPFS:', error);
  // }

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-tr from-violet-900 via-violet-950 to-blue-950">Wellcome to Parallel </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Be part of this growing industry
      </p>
      <hr />
      <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl my-10">Upload a 3D Object</h1>
      <FileUpload />
      <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js"></Script>
      <div className='flex flex-row flex-wrap gap-4 mt-14'>
        <ModelCard modelName={"/cpu.glb"} />
        <ModelCard modelName={"/mining_rig.glb"} />
        <ModelCard modelName={"/gpu.glb"} />
        <ModelCard modelName={"/motherboard.glb"} />
      </div>
      {/* <SessionComponent /> */}
    </>
  )
}
