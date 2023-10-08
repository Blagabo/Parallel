"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "./Button";
import { useParams } from "next/navigation";

const Navbar = () => {	

  const connect = async () => {
    try {
      // Connect to wallet
    } catch(err) {
      console.warn(`failed to connect..`, err);
    }
  };

	const disconnect = async () => {
    try {
      // Disconnect to wallet
    } catch(err) {
      console.warn(`failed to disconnect..`, err);
    }
  };

	return (
		<div className="fixed top-5 right-24">
			<Button className="bg-slate-400 flex flex-row gap-4 text-slate-800 hover:text-white" onClick={disconnect} >
				<Image
					src={'/near-logo.png'}
					alt="near logo"
					width={25}
					height={25}
				/>
				Connect
			</Button>
		</div>
	);
}
 
export default Navbar;