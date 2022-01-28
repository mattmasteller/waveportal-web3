import { ethers } from 'ethers'
import 'dotenv/config'
/* 
  Experimental JSON import is behind a flag
  $ node test.mjs # doesn't work
  $ node --experimental-json-modules test.mjs #works
*/
import abi from './utils/WavePortal.json'

const providerUrl = process.env.NETWORK_URL
const contractAddress = process.env.CONTRACT_ADDRESS
const contractABI = abi.abi

const getNumberOfWaves = async () => {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl)
  const wavePortalContract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  )

  const count = await wavePortalContract.getTotalWaves()

  console.log(count.toNumber())
}

const getAllWaves = async () => {
  const provider = new ethers.providers.JsonRpcProvider(providerUrl)
  const contract = new ethers.Contract(contractAddress, contractABI, provider)

  const waves = await contract.getAllWaves()

  console.log('Retrieved all waves...', waves)

  return waves.map((w) => ({
    address: w.waver,
    timestamp: new Date(w.timestamp * 1000),
    message: w.message,
  }))
}

await getNumberOfWaves()

const waves = await getAllWaves()
console.log('waves', waves)
