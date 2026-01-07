import type { PlasmoGetStyle } from 'plasmo'
import React, { useState, type ReactNode } from 'react'
import { clsx } from "clsx"

import "../globals.css"


import { sendToBackground } from '@plasmohq/messaging'

class WordItem extends React.Component<{
  word: string
  onUnstar: (word: string) => void
}> {
  unstar = () => {
    sendToBackground({
      name: 'unstar',
      body: {
        key: this.props.word
      }
    }).then((response) => {
      this.props.onUnstar(this.props.word)
    })
  }

  render(): ReactNode {
    return (
      <div
        className={clsx(
          "flex flex-row items-center p-2.5 box-border w-full transition-all duration-500 rounded-sm",
          "hover:bg-[#dddddd11]"
        )}
      >
        <div className={clsx("flex-grow text-[1.2em] font-light")}>{this.props.word}</div>
        <button
          className={clsx(
            "cursor-pointer text-inherit border-none outline-none text-[1.2em] transition-all duration-500 bg-transparent",
            "hover:scale-[1.2] hover:rotate-[72deg]",
            "active:scale-[0.8]"
          )}
          onClick={this.unstar}
        >
          ★
        </button>
      </div>
    )
  }
}

class WordList extends React.Component<{
  filterKey: string
}> {
  declare state: {
    words: string[]
  }
  constructor(props) {
    super(props)
    this.state = {
      words: []
    }
  }

  refresh = () => {
    sendToBackground({
      name: 'list'
    }).then((response) => {
      this.setState({
        words: response.keys
      })
    })
  }

  componentDidMount(): void {
    this.refresh()
  }

  render(): ReactNode {
    const list = this.state.words.filter((word) =>
      word.includes(this.props.filterKey)
    )
    const inner =
      list.length > 0 ? (
        list.map((word) => {
          return (
            <WordItem key={word} word={word} onUnstar={this.refresh}></WordItem>
          )
        })
      ) : (
        <div className={clsx("text-[1.2em] font-light italic text-[#999] text-center p-2.5")}>No words starred yet.</div>
      )

    return (
      <div className={clsx("mt-5 w-full max-h-[500px] overflow-y-auto")}>{inner}</div>
    )
  }
}

function Index() {
  const [filterKey, setFilterKey] = useState('')

  return (
    <div
      className={clsx(
        "box-border flex flex-col p-4 bg-[#eee] text-[#333] w-[300px]",
        "dark:bg-[#444] dark:text-[#999]"
      )}
    >
      <div>
        <input
          className={clsx(
            "text-[1.2em] border border-[#eee] bg-[#eee] text-[#333] rounded h-8 w-full box-border px-2.5",
            "focus:outline-none",
            "dark:border-[#999] dark:bg-[#555] dark:text-[#ccc]"
          )}
          type="input"
          placeholder="Type to search words"
          onChange={(event) => {
            setFilterKey(event.target.value)
          }}
          value={filterKey}></input>
      </div>
      <div>
        <WordList filterKey={filterKey}></WordList>
      </div>
    </div>
  )
}

export default Index
