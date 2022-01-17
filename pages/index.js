import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import WavesList from '../components/WavesList'
import abi from '../utils/WavePortal.json'

const HomePage = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [waves, setWaves] = useState([])
  const [isMining, setIsMining] = useState(false)

  const providerUrl =
    'https://eth-rinkeby.alchemyapi.io/v2/OV9WPSQh0LDP86kyqyv3SMGe-CjbkbkQ'
  const contractAddress = '0x8B4e0a9f75470d1ccDE8CED3A83E558239d14D9A' // process.env.CONTRACT_ADDRESS
  const contractABI = abi.abi

  const fetchWaves = async () => {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl)
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    const waves = await contract.getAllWaves()

    const wavesData = waves.map((w) => ({
      address: w.waver,
      timestamp: new Date(w.timestamp * 1000),
      message: w.message,
    }))

    console.log('fetchWaves wavesData :>> ', wavesData)
    setWaves(wavesData)
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have metamask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      console.log('Connected', accounts[0])

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        /*
         * Execute the actual wave from your smart contract
         */
        setIsMining(true)
        const waveTxn = await contract.wave('yo, this is a test message')
        console.log('Mining...', waveTxn.hash)

        await waveTxn.wait()
        console.log('Mined -- ', waveTxn.hash)
        setIsMining(false)
      } else {
        console.log('Ethereum object does not exist!')
      }
    } catch (error) {
      console.log('contractAddress', contractAddress)
      console.log('contractABI', contractABI)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchWaves()
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="bg-white py-8 sm:py-0">
      <div className="relative sm:py-16">
        <div aria-hidden="true" className="hidden sm:block">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50 rounded-r-3xl" />
          <svg
            className="absolute top-8 left-1/2 -ml-3"
            width={404}
            height={392}
            fill="none"
            viewBox="0 0 404 392"
          >
            <defs>
              <pattern
                id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={392}
              fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
            />
          </svg>
        </div>
        <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-5xl lg:px-8">
          <div className="relative rounded-2xl px-6 py-10 bg-indigo-600 overflow-hidden shadow-xl sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
            >
              <svg
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 1463 360"
              >
                <path
                  className="text-indigo-500 text-opacity-40"
                  fill="currentColor"
                  d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                />
                <path
                  className="text-indigo-700 text-opacity-40"
                  fill="currentColor"
                  d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                />
              </svg>
            </div>
            <div className="relative">
              <div className="sm:text-center">
                <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                  Hey! 👋 &nbsp; I&rsquo;m Matt.
                </h1>
                <p className="mt-6 mx-auto max-w-2xl text-lg text-indigo-200">
                  Wave at me on the Ethereum blockchain! Maybe send a message
                  too? Connect your wallet, write your message, and then wave 👋
                  .
                </p>
              </div>
              <div className="mt-4 text-center text-lg text-indigo-200">
                {currentAccount && (
                  <span>
                    ✅ &nbsp;&nbsp;Wallet connected!&nbsp;&nbsp;
                    {currentAccount.substring(0, 5)}...
                    {currentAccount.substring(38)}
                  </span>
                )}
              </div>
              {currentAccount ? (
                <div className="mt-8 sm:mx-auto sm:max-w-lg sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="cta-message" className="sr-only">
                      Enter your message here :)
                    </label>
                    <input
                      id="cta-message"
                      disabled={isMining}
                      className="block w-full border border-transparent rounded-md px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                      placeholder="Enter your message here :)"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      disabled={isMining}
                      className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                      onClick={wave}
                    >
                      {isMining ? 'Mining...' : 'Wave at me!'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 sm:mx-auto sm:max-w-lg">
                  <div className="mt-8 sm:mt-0 sm:ml-3">
                    <button
                      className="block w-full rounded-md border border-transparent px-5 py-3 bg-indigo-500 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:px-10"
                      onClick={connectWallet}
                    >
                      Connect your Wallet
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {waves && waves.length > 0 && (
        <div>
          <h2 className="mt-8 text-center text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {waves.length} Wave{waves.length > 1 ? 's' : ''}
          </h2>
          <WavesList waves={waves} />
        </div>
      )}
    </div>
  )
}

export default HomePage
