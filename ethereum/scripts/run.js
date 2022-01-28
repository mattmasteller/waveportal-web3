// yarn hardhat run ethereum/scripts/run.js

const logContractBalance = async (hre, waveContract) => {
  const contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  )
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  )
}

const main = async () => {
  /*
   * Deploy contract
   */
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal')
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  })
  await waveContract.deployed()
  console.log('Contract deployed to:', waveContract.address)

  // Get contract balance
  await logContractBalance(hre, waveContract)

  /*
   * 1st Wave (User #1)
   */
  let waveTxn = await waveContract.wave('Message #1')
  await waveTxn.wait() // Wait for txn to be mined
  // Get contract balance
  await logContractBalance(hre, waveContract)


  /*
   * 2nd Wave (User #2)
   */
  const [_, randomPerson] = await hre.ethers.getSigners()
  waveTxn = await waveContract.connect(randomPerson).wave('Message #2')
  await waveTxn.wait() // Wait for txn to be mined
  // Get contract balance
  await logContractBalance(hre, waveContract)



  /*
   * 3rd Wave (User #1) (should fail)
   */
  waveTxn = await waveContract.wave('Message #3')
  await waveTxn.wait() // Wait for txn to be mined
  // Get contract balance
  await logContractBalance(hre, waveContract)

  
  /*
   * Log wave count and waves
   */
  const waveCount = await waveContract.getTotalWaves()
  console.log(waveCount.toNumber())
  const allWaves = await waveContract.getAllWaves()
  console.log(allWaves)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()
