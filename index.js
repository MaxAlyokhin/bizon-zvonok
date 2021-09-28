const allPhonesFromBizon = require('./modules/allPhonesFromBizon')
const allPhonesToZvonok = require('./modules/allPhonesToZvonok')
const config = require('./config.json')

async function phonesToZvonok(bizonToken, zvonokAPIKey, pageIds, compaign) {
  let phones = await allPhonesFromBizon(bizonToken, pageIds)
  let responceFromZvonok = await allPhonesToZvonok(zvonokAPIKey, compaign, phones)
  console.log(responceFromZvonok)
}

let tasks = Object.entries(config.tasks)
tasks.forEach((task) => {
  phonesToZvonok(config.bizonToken, config.zvonokAPIKey, task[1].ids, task[1].compaign)
})
