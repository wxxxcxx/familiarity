import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import * as utils from "../../utils"


interface WordItem {
  timespan: number
}

const syncStorage = new Storage({
  area: "sync",
})

const handler: PlasmoMessaging.MessageHandler = async (request, response) => {
  let word = request.body.word
  try {
    if (!word) {
      throw new Error(`No word provided`)
    }
    if (!utils.isEnglishWord(word)) {
      throw new Error(`Not a English word: ${word}`)
    }
    word = word.trim()
    word = word.toLowerCase()
    const key = `word.${word}`
    const value = await syncStorage.getItem<WordItem>(key)
    if (!value) {
      syncStorage.setItem(key, {
        timespan: Date.now(),
      })
    }
    response.send({
      code: 0,
      word: word,
    })
  } catch (ex) {
    response.send({
      code: 1,
      word: word,
      message: ex.message
    })
    return
  }
}

export default handler