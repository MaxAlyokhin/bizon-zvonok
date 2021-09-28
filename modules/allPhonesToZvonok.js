// Отправляет номера телефонов в рамках одной задачи
// Принимает строку номеров
// Возвращает ответ API zvonok.com

const fetch = require('node-fetch')
const FormData = require('form-data')

async function allPhonesToZvonok(zvonokAPIKey, compaign, phones) {
  // API требует данные в формате FormData
  const zvonokParameters = new FormData()
  zvonokParameters.append('public_key', zvonokAPIKey)
  zvonokParameters.append('campaign_id', compaign)
  zvonokParameters.append('phones', phones)

  const postPhonesToZvonok = await fetch('https://zvonok.com/manager/cabapi_external/api/v1/phones/append/calls/', {
    method: 'POST',
    body: zvonokParameters,
  })

  // Ответ от zvonok.com
  return await postPhonesToZvonok.json()
}

module.exports = allPhonesToZvonok
