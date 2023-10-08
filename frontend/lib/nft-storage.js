import { NFTStorage } from "nft.storage"

const STORAGE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY5MzE2RkE1MDE4NDZiYWMzNDYzNzE3MGU3Zjk1MzZEMTAzODQwODMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NjY5MzA0MjAzMywibmFtZSI6ImhhY2thdGhvbiJ9.5uvCo4ri-bpVfF8nSQEhHkeuMWf9RAMGOo3IdoWwasA"

const nftStorage = globalThis.nftStorage || new NFTStorage({ token: STORAGE_API_KEY })

export default nftStorage;

