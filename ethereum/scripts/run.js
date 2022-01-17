// yarn hardhat run ethereum/scripts/run.js

const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal')
  const waveContract = await waveContractFactory.deploy()
  await waveContract.deployed()
  console.log('Contract deployed to:', waveContract.address)

  let waveCount
  waveCount = await waveContract.getTotalWaves()
  console.log(waveCount.toNumber())

  // Send waves
  let waveTxn = await waveContract.wave('A message!')
  await waveTxn.wait() // Wait for txn to be mined

  const [_, randomPerson] = await hre.ethers.getSigners()
  waveTxn = await waveContract.connect(randomPerson).wave('Another message!')
  await waveTxn.wait() // Wait for txn to be mined

  let allWaves = await waveContract.getAllWaves()
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
