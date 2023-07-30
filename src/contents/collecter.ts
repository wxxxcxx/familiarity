import { sendToBackground } from "@plasmohq/messaging"
import type { MouseEvent } from "react"

export { }

const matchWordsPositions = (text: string) => {
  const regex = /\b[a-zA-Z]{3,99}\b/g; // 正则表达式匹配英文单词
  const positions = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    positions.push({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length
    });
  }
  return positions;
}


const renderNode = async (node: Node, words: string[]) => {
  if (node instanceof HTMLScriptElement || node instanceof HTMLStyleElement) {
    return
  }
  if (node.nodeName == 'PRE' || node.nodeName == 'CODE') {
    return
  }
  if (node.nodeName == 'XTOOLTIP-WORD-ANCHOR') {
    // 跳过已经渲染过的单词
    return
  }
  if (node.childNodes.length > 0) {
    // 防止子元素数量变化导致的死循环
    const childNodes = Array.from(node.childNodes)
    for (const child of childNodes) {
      await renderNode(child, words)
    }
    return
  }
  if (node.nodeType != Node.TEXT_NODE || node.textContent.trim() == '') {
    return
  }
  // console.log('Ready to render node:', node)
  let content = node.textContent
  const positions = matchWordsPositions(content).reverse()

  const textNode = node as Text
  for (const position of positions) {
    if (words.includes(position.word.toLowerCase())) {
      textNode.splitText(position.end)
      textNode.splitText(position.start)
      const wordNode = textNode.nextSibling
      const xWordNode = document.createElement('xtooltip-word-anchor')
      xWordNode.dataset.word = position.word
      xWordNode.style.overflow = 'visible'
      xWordNode.innerText = wordNode.textContent
      wordNode.parentNode.replaceChild(xWordNode, wordNode)
    }
  }
}

const render = async () => {
  const response = await sendToBackground({
    name: 'list',
  })
  const words = response.words
  console.log('words', words)
  await renderNode(document.body, words)
}

(async () => {
  // const MutationObserver = window.MutationObserver
  // const observer = new MutationObserver((mutationsList, observer) => {
  //   for (const mutation of mutationsList) {
  //     mutation.addedNodes.forEach(async (node) => {
  //       renderElement(node as HTMLElement)
  //     })
  //   }
  // })
  // observer.observe(document.body, { childList: true, subtree: true })
  await render()

})()

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('Received message in context.js:', message);
  if (message.type === 'query') {
    const response = await sendToBackground({
      name: "query",
      body: {
        word: message.word,
      }
    })
    console.log(response)
    sendResponse(response)
  }
  if (message.type === 'save') {
    const response = await sendToBackground({
      name: "save",
      body: {
        word: message.word,
      }
    })
    console.log(response)
    sendResponse(response)
    render()
  }
});