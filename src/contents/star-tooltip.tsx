import type { PlasmoRender, PlasmoGetStyle, PlasmoGetInlineAnchorList, PlasmoMountShadowHost, PlasmoWatchOverlayAnchor, PlasmoCSUIJSXContainer } from "plasmo";
import React from "react";
import { createRoot } from "react-dom/client"
import styleText from "data-text:./style.css";
import Label from "../components/lable";
import Detail from "../components/detail";
import Tooltip from "../components/tooltip";
import api from "./renderer";
import { sendToBackground } from "@plasmohq/messaging";

(async () => {
    window.addEventListener('load', async () => {
        await api.renderer.render()
        api.renderer.observe()
    })
})()

const StarTooltip = (props) => (
    <>
        <style>{styleText}</style>
        <Tooltip
            trigger={
                <span>
                    <Label text={props.text} data={props.data}></Label>
                </span>
            }
            className="tooltip"
            position={['top center', 'bottom center', 'left center', 'right center']}
            on={'hover'}
            closeOnDocumentClick
            keepTooltipInside={true}
        >
            {
                props.data.code == 0 ?
                    <Detail text={props.text} data={props.data}></Detail> :
                    props.data.message
            }
        </Tooltip>
    </>
)


export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () =>
    document.querySelectorAll("xtooltip-star-anchor")

// This function overrides the default `createRootContainer`
export const getRootContainer = () => {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            const rootContainer = document.querySelectorAll("xtooltip-star-anchor")
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
        <StarTooltip text={text} data={response}></StarTooltip>
    )
}


export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
    anchor, // the observed anchor, OR document.body.
    createRootContainer // This creates the default root container
}) => {
    const rootContainer = await createRootContainer()
    if (rootContainer instanceof NodeList) {
        // console.log('Refresh! Root count:', rootContainer.length)
        rootContainer.forEach(async (container) => {
            const rootContainer = (container as HTMLElement)
            await renderRootContainer(rootContainer)
        })

    } else {
        await renderRootContainer(rootContainer as HTMLElement)
    }
}

export default StarTooltip