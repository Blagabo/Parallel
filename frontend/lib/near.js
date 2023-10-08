"use client";

import { keyStores } from "near-api-js";

const CONTRACT_ADDRESS = "Contract address"

const myKeystone = new keyStores.BrowserLocalStorageKeyStore();

export default myKeystone;