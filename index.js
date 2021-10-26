const allPhonesFromBizon = require('./modules/allPhonesFromBizon')
const allPhonesToZvonok = require('./modules/allPhonesToZvonok')
const config = require('./config.json')

async function phonesToZvonok(bizonToken, zvonokAPIKey, pageIds, compaign) {
  let phones = await allPhonesFromBizon(bizonToken, pageIds)
  console.log(phones)

  let responceFromZvonok = await allPhonesToZvonok(zvonokAPIKey, compaign, phones)
  console.log(responceFromZvonok)
}

Object.keys(config.accountsInBizon).forEach((accountInBizon) => {
  const bizonToken = config.accountsInBizon[accountInBizon].bizonToken

  let tasks = Object.entries(config.accountsInBizon[accountInBizon].tasks)
  tasks.forEach((task) => {
    phonesToZvonok(bizonToken, config.zvonokAPIKey, task[1].ids, task[1].compaign)
  })
})
