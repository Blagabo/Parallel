"use client";

import Image from "next/image";
import { useState } from "react";

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
		<div className="fixed top-5 right-5">
		</div>
	);
}
 
export default Navbar;