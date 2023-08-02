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
  let queryKey = request.body.key
  try {
    if (!queryKey) {
      throw new Error(`No word provided`)
    }
    if (!utils.isEnglishWord(queryKey)) {
      throw new Error(`Not a English word: ${queryKey}`)
    }
    queryKey = queryKey.trim()
    queryKey = queryKey.toLowerCase()
    const key = `word.${queryKey}`
    const value = await syncStorage.getItem<WordItem>(key)
    if (!value) {
      syncStorage.setItem(key, {
        timespan: Date.now(),
      })
    }
    response.send({
      code: 0,
      word: queryKey,
    })
  } catch (ex) {
    response.send({
      code: 1,
      word: queryKey,
      message: ex.message
    })
    return
  }
}

export default handler