import type { PlasmoRender, PlasmoGetStyle, PlasmoGetInlineAnchorList, PlasmoMountShadowHost, PlasmoWatchOverlayAnchor, PlasmoCSUIJSXContainer } from "plasmo";
import React from "react";
import { createRoot } from "react-dom/client"
import { sendToBackground } from "@plasmohq/messaging";
import styleText from "data-text:./tooltip.css"


export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () =>
    document.querySelectorAll("xtooltip-word-anchor")

// This function overrides the default `createRootContainer`
export const getRootContainer = () => {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            const rootContainer = document.querySelectorAll("xtooltip-word-anchor")
            if (rootContainer) {
                clearInterval(checkInterval)
                // console.log(rootContainer)
                resolve(rootContainer)
            }
        }, 1000)
    })
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
    anchor, // the observed anchor, OR document.body.
    createRootContainer // This creates the default root container
}) => {
    const rootContainer = await createRootContainer()
    if (rootContainer instanceof NodeList) {
        // console.log('Refresh! Root count:', rootContainer.length)
        rootContainer.forEach((container) => {
            const rootContainer = (container as HTMLElement)
            if (rootContainer.shadowRoot) {
                return
            }
            const shadow = rootContainer.attachShadow({ mode: 'open' })

            const root = createRoot(shadow)
            const word = rootContainer.dataset.word
            root.render(
                <WTooltip word={word} />
            )
        })

    } else {
        if (rootContainer.shadowRoot) {
            return
        }
        const shadow = rootContainer.attachShadow({ mode: 'open' })

        const root = createRoot(shadow)
        const word = rootContainer.textContent
        root.render(
            <WTooltip word={word} />
        )
    }
}


class WordCard extends React.Component<{
    word: string
}, {
    definitions: string[]
}> {

    constructor(props) {
        super(props)
        this.state = {
            definitions: []
        }
    }

    componentDidMount(): void {
        sendToBackground({
            name: 'query',
            body: {
                word: this.props.word
            }
        }).then((response) => {
            console.log(response)
            this.setState({
                definitions: response.definitions
            })
            console.log(this.state)
        })
    }

    render() {
        return <div className="word-card">
            <div className="header">
                <div className="title">{this.props.word}</div>
                <div className="icon star">★</div>
            </div>
            <div className="content">
                {
                    this.state.definitions.map((definition) => {
                        return <p key={definition}>{definition}</p>
                    })
                }
            </div>

        </div>
    }
}

class WTooltip extends React.Component<{
    word: string
}> {
    declare state: Readonly<{
        tooltip: {
            visible: boolean,
            offset: {
                x: number,
                y: number
            },
            direction: 'left' | 'right' | 'top' | 'bottom'
        }
    }>;

    declare ref: React.RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props)
        this.state = {
            tooltip: {
                visible: false,
                offset: {
                    x: 0,
                    y: 0
                },
                direction: 'bottom'
            }
        }
        this.ref = React.createRef()
    }

    show = async (event: React.MouseEvent) => {
        console.log('show')
        const target = event.target as HTMLElement
        const word = target.textContent
        this.setState({ word: word })
        const target_rect = target.getBoundingClientRect()
        if (this.ref.current == null) {
            return
        }
        const tooltip_rect = this.ref.current?.getBoundingClientRect()
        let direction = 'bottom'
        if (target_rect.top + target_rect.height + tooltip_rect.height > window.innerHeight) {
            direction = 'top'
        }
        this.setState({
            tooltip: {
                visible: true,
                direction: direction
            }
        })
    }

    hide = () => {
        console.log('hide')
        this.setState({
            tooltip: {
                visible: false,
                direction: 'bottom'
            }
        })
    }

    stopEvent = (event: React.MouseEvent) => {
        event.preventDefault()
        event.stopPropagation()
    }

    render(): React.ReactNode {
        return <div style={{
            display: 'inline',
            position: 'relative'
        }} onMouseEnter={this.show} onMouseLeave={this.hide}>
            <style>{styleText}</style>
            <span className="label">{this.props.word}</span>
            <div ref={this.ref} onClick={this.stopEvent} className={`tooltip ${this.state.tooltip.direction} ${this.state.tooltip.visible ? 'visible' : ''}`}>
                <div className="container">
                    <WordCard word={this.props.word} />
                    <i></i>
                </div>
            </div>
        </div>
    }
}

export default WTooltip