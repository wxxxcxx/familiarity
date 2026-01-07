import { clsx } from "clsx"
import React from 'react'

import { sendToBackground } from '@plasmohq/messaging'

import api from '~contents/renderer'

class WordCard extends React.Component<{
  text: string
  data: {
    code: number
    definitions: string[]
    starred: boolean
    message: string | null
  }
}> {
  constructor(props: any) {
    super(props)
  }

  star = () => {
    sendToBackground({
      name: 'star',
      body: {
        key: this.props.text
      }
    }).then((response) => {
      if (response.code != 0) {
        console.log(response.message)
        return
      }
      return api.renderer.render()
    })
  }

  unstar = () => {
    sendToBackground({
      name: 'unstar',
      body: {
        key: this.props.text
      }
    }).then((response) => {
      if (response.code != 0) {
        console.log(response.message)
        return
      }
      return api.renderer.render()
    })
  }

  render() {
    return (
      <div className="detail">
        <div className={clsx("flex flex-row items-center")}>
          <div className={clsx("flex-grow text-[1.5em] font-bold")}>{this.props.text}</div>
          {this.props.data?.starred ? (
            <button
              className={clsx(
                "border-none outline-none text-[1.2em] bg-transparent text-inherit",
                "transition-all duration-500 ease-in-out cursor-pointer",
                "hover:scale-[1.2] hover:rotate-[72deg]",
                "active:scale-[0.8]"
              )}
              autoFocus={false}
              onClick={this.unstar}
            >
              ★
            </button>
          ) : (
            <button
              className={clsx(
                "border-none outline-none text-[1.2em] bg-transparent text-inherit",
                "transition-all duration-500 ease-in-out cursor-pointer",
                "hover:scale-[1.2] hover:rotate-[72deg]",
                "active:scale-[0.8]"
              )}
              autoFocus={false}
              onClick={this.star}
            >
              ☆
            </button>
          )}
        </div>
        <div className={clsx("mt-5")}>
          {this.props.data?.definitions.map((definition) => {
            return <p key={definition}>{definition}</p>
          })}
        </div>
      </div>
    )
  }
}

export default WordCard
