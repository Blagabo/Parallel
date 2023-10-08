"use client";

import { useState } from "react";
import Button from "./Button";

import state from "../state";
import { useSnapshot, subscribe } from "valtio";
import { File } from 'nft.storage'
import nftStorage from "../lib/nft-storage";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader"


async function storeNFT(image, name, description) {

  // call client.store, passing in the image & metadata
  return nftStorage.store({
      image,
      name,
      description,
  })
}

const FileUpload = () => {
	const [file, setFile] = useState()
  const snap = useSnapshot(state);
  const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	console.log("snap.file : ", snap.file)
  const uploadFile = async () => {
		if (file) {
			console.log(file)
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();

      if (fileExtension !== 'glb') {
        console.log("Invalid file format")
        return ;
      }
      // Upload the file to IPFS
      try {
        setIsLoading(true);
        // await axios.post("/api/upload-object", file);
        const result = await storeNFT(file, fileName, `Thaks for saving the file ${fileName}`)
        console.log("Result href: ", result.data.image.href)
        subscribe(state.file, () => {
          console.log('State has changed:', state.file);
        });
        state.file = result.data.image.href;
      } catch (error) {
        console.error("File error: ", error)
      } finally {
				console.log("Worked!")
        setIsLoading(false);
				router.push('/canvas');
      }
    } else {
      console.error("Didnt work")
      return ;
    }
  }


	return (
    <div className="flex flex-col justify-center items-start gap-10">
      {!isLoading ? (
        <div className="border border-black rounded-lg w-fit h-fit flex flex-col gap-3">
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Upload an object</label>
          <input className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "  
          id="file" type="file" placeholder="Select a .glb file" onChange={(e) => {setFile(e.target.files?.[0])}} />
        </div>
      ) : (
        <ClipLoader />
      )}
      <div className="flex flex-row gap-5">
			<Button onClick={() => uploadFile()}>
				Upload
			</Button>
			<Button className={"bg-slate-700 text-slate-300"} onClick={() => router.push('/canvas')}>
        Continue from where you left off
			</Button>
      </div>
    </div>
	);
}
 
export default FileUpload;