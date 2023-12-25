import { sendToBackground } from '@plasmohq/messaging'

function isEnglishWord(word) {
  // 使用正则表达式匹配单词的模式
  const pattern = /^[a-zA-Z'-]+$/
  return pattern.test(word)
}

export { isEnglishWord }
