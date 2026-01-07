import styleText from 'data-text:../globals.css'
import type {
  PlasmoCSUIJSXContainer,
  PlasmoGetInlineAnchorList,
  PlasmoRender
} from 'plasmo'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { sendToBackground } from '@plasmohq/messaging'

import Detail from '../components/detail'
import Label from '../components/lable'
import Tooltip from '../components/tooltip'
import api from './renderer'

  ; (async () => {
    window.addEventListener('load', async () => {
      await api.renderer.render()
      api.renderer.observe()
    })
  })()

function StarTooltip(props: any) {
  return (
    <>
      <style>{styleText}</style>
      <Tooltip
        trigger={
          <span>
            <Label text={props.text} data={props.data}></Label>
          </span>
        }
        className="tooltip"
        on={'hover'}
        closeOnDocumentClick>
        {props.data.code == 0 ? (
          <Detail text={props.text} data={props.data}></Detail>
        ) : (
          props.data.message
        )}
      </Tooltip>
    </>
  )
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () =>
  document.querySelectorAll('xtooltip-star-anchor')

// This function overrides the default `createRootContainer`
export const getRootContainer = () => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainer = document.querySelectorAll('xtooltip-star-anchor')
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
  root.render(<StarTooltip text={text} data={response}></StarTooltip>)
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

export default StarTooltip
