import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import * as utils from "../../utils"

const localStorage = new Storage({
  area: "local",
})

const queryFromCache = async (word: string) => {
  if (!word) {
    throw new Error(`No word provided`)
  }
  if (!utils.isEnglishWord(word)) {
    throw new Error(`Not a English word: ${word}`)
  }
  word = word.trim()
  word = word.toLowerCase()
  const cacheKey = `cache.definition.${word}`
  const value = await localStorage.getItem<string[]>(cacheKey)
  if (value) {
    console.log(`Found word ${word} in cache: ${cacheKey}`)
    return value
  }
}

const saveToCache = async (word: string, definitions: string[]) => {
  if (!word) {
    throw new Error(`No word provided`)
  }
  if (!utils.isEnglishWord(word)) {
    throw new Error(`Not a English word: ${word}`)
  }
  word = word.trim()
  word = word.toLowerCase()
  const cacheKey = `cache.definition.${word}`
  await localStorage.setItem(cacheKey, definitions)
}

export const query = async (word: string) => {
  if (!word) {
    throw new Error(`No word provided`)
  }
  if (!utils.isEnglishWord(word)) {
    throw new Error(`Not a English word: ${word}`)
  }
  word = word.trim()
  word = word.toLowerCase()
  let definitions =await queryFromCache(word)
  if(definitions){
    return definitions
  }
  console.log(`Querying word ${word} from youdao`)
  const result = await fetch(`https://dict.youdao.com/jsonapi?jsonversion=2&dicts=%7B%22count%22%3A99%2C%22dicts%22%3A%5B%5B%22ec%22%2C%22ce%22%5D%5D%7D&q=${word}`)
  if (!result.ok) {
    throw new Error(`Failed to fetch word ${word}: ${result.statusText}`)
  }
  let data = await result.json()
  data = data?.ec?.word[0]
  if (!data || data.trs.length === 0) {
    throw new Error(`Not found definition, response: ${JSON.stringify(data)}`)
  }
  definitions = [];
  for (const tr of data.trs) {
    const definition = tr?.tr[0]?.l?.i[0]
    if (!definition) {
      throw new Error(`Not found definition, response: ${JSON.stringify(data)}`)
    }
    definitions.push(definition)
  }
  await saveToCache(word, definitions)
  return definitions
}

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
    const definitions = await query(word)
    response.send({
      code: 0,
      word: word,
      definitions: definitions,
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