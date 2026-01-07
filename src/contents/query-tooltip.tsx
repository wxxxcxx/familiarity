import styleText from 'data-text:../globals.css'
import type {
  PlasmoCSUIJSXContainer,
  PlasmoGetInlineAnchor,
  PlasmoRender
} from 'plasmo'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { sendToBackground } from '@plasmohq/messaging'

import { isEnglishWord } from '~utils'

import Detail from '../components/detail'
import Tooltip from '../components/tooltip'

const querySelection = () => {
  document.querySelectorAll('.xtooltip-query-anchor').forEach((element) => {
    element.remove()
  })

  const selection = window.getSelection()
  if (
    selection == null ||
    selection.toString().trim() == '' ||
    selection.rangeCount == 0
  ) {
    return
  }
  const range = selection.getRangeAt(0)
  const text = range.toString().trim()
  if (text === '' || !isEnglishWord(text)) {
    return
  }
  const rect = range.getBoundingClientRect()
  const element = document.createElement('div')
  element.className = 'xtooltip-query-anchor'
  element.style.position = 'fixed'
  element.style.pointerEvents = 'none'
  // element.style.backgroundColor = '#55ff0099'
  element.style.display = 'block'
  element.style.top = rect.top + 'px'
  element.style.left = rect.left + 'px'
  element.style.width = range.getBoundingClientRect().width + 'px'
  element.style.height = range.getBoundingClientRect().height + 'px'
  element.dataset.key = text.toLowerCase().trim()
  element.dataset.text = text
  document.body.appendChild(element)
}
document.body.addEventListener('mouseup', querySelection)

function QueryToolTip(props: any) {
  return (
    <>
      <style>{styleText}</style>
      <Tooltip
        trigger={
          <div
            style={{
              height: '100%',
              width: '100%'
            }}></div>
        }
        className="tooltip"
        open={props.open}
        on={'click'}
        closeOnDocumentClick>
        {props.data.code == 0 ? (
          <Detail text={props.text} data={props.data} />
        ) : (
          props.data.message
        )}
      </Tooltip>
    </>
  )
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector('.xtooltip-query-anchor')

// This function overrides the default `createRootContainer`
export const getRootContainer = () => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainer = document.querySelectorAll('.xtooltip-query-anchor')
      if (rootContainer) {
        clearInterval(checkInterval)
        resolve(rootContainer)
      }
    }, 1000)
  })
}

const renderRootContainer = async (rootContainer: HTMLElement) => {
  if (rootContainer.shadowRoot) {
    return
  }
  const shadow = rootContainer.attachShadow({ mode: 'open' })
  const root = createRoot(shadow)
  const key = rootContainer.dataset.key
  const text = rootContainer.dataset.text
  const response = await sendToBackground({
    name: 'query',
    body: {
      key: key
    }
  })
  root.render(
    <QueryToolTip open={true} text={text} data={response}></QueryToolTip>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer // This creates the default root container
}) => {
  const rootContainer = await createRootContainer()
  if (rootContainer instanceof NodeList) {
    // console.log('Refresh! Root count:', rootContainer.length)
    rootContainer.forEach((container) => {
      const rootContainer = container as HTMLElement
      renderRootContainer(rootContainer)
    })
  } else {
    await renderRootContainer(rootContainer as HTMLElement)
  }
}

export default QueryToolTip
