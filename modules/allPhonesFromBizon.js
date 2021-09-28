// Получаем номера телефонов из Бизона со всех лендингов в рамках одной задачи

const fetch = require('node-fetch')
const fs = require('fs')

const config = require('./config.json')

async function allPhonesFromBizon(bizonToken, pageIds) {
  // Вчерашняя дата
  let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))

  // Принимает pageId
  // Возвращает json-ответ
  async function getDataFromBizon(pageId) {
    // Данные для формирования URL GET-запроса
    const bizonApiUrl = {
      url: 'https://online.bizon365.ru/api/v1/webinars/subpages/getSubscribers',
      pageId: `${pageId}`, // Идентификатор страницы регистрации
      registeredTimeMin: yesterday, // Вчерашняя дата
    }

    // Получаем все данные о подписчиках
    const getAllDataFromBizon = await fetch(`${bizonApiUrl.url}?pageId=${bizonApiUrl.pageId}&registeredTimeMin=${bizonApiUrl.registeredTimeMin}`, {
      method: 'GET',
      headers: {
        // Для автоматической авторизации в Бизоне
        'X-Token': bizonToken,
      },
    })

    // Парсим в JSON
    const allDataFromBizon = await getAllDataFromBizon.json()

    if (config.outputFromBizon) {
      fs.writeFile(`${__dirname}/../output/output_${pageId.split(':')[1]}.json`, JSON.stringify(allDataFromBizon, null, 2), 'utf8', (err) => {
        if (err) throw err
      })
    }

    return allDataFromBizon
  }

  // Принимает json
  // Возвращает номера телефонов
  function phonesFromBizon(allDataFromBizon) {
    // Проходим по списку подписчиков
    // allDataFromBizon.list возвращает массив объектов, поэтому преобразуем объекты в массивы
    const phonesArray = Object.entries(allDataFromBizon.list).map((element) => {
      // Нулевым элементом массива является порядковый номер подписчика, нужные данные в первом элементе
      return element[1].phone
    })

    // zvonok.com требует список номеров телефонов как строку, где в каждой новой строке отдельный номер
    const phones = phonesArray.join('\r\n')

    return phones
  }

  // Генерируем массив промисов, каждый из которых возвращает телефоны
  let phonesFromIds = pageIds.map(async (pageId) => {
    let allDataFromBizon = await getDataFromBizon(pageId)
    return phonesFromBizon(allDataFromBizon)
  })

  let allPhones = '' // Здесь будут все телефоны со всех лендингов

  // Собираем промисы
  try {
    // Получаем массив данных со всех лендингов
    let data = await Promise.all(phonesFromIds)
    allPhones = data.reduce((accumulator, value) => {
      return accumulator + '\r\n' + value
    })
  } catch (error) {
    console.log(error)
  }

  return allPhones
}

module.exports = allPhonesFromBizon
