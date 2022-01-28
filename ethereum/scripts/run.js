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

  /*
   * Get contract balance
   */
  await logContractBalance(hre, waveContract)
  /*
   * Send wave
   */
  let waveTxn = await waveContract.wave('A message!')
  await waveTxn.wait() // Wait for txn to be mined
  /*
   * Get contract balance
   */
  await logContractBalance(hre, waveContract)

  /*
   * Send another wave
   */
  const [_, randomPerson] = await hre.ethers.getSigners()
  waveTxn = await waveContract.connect(randomPerson).wave('Another message!')
  await waveTxn.wait() // Wait for txn to be mined
  /*
   * Get contract balance
   */
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
