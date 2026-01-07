import { clsx } from "clsx"
import React, { useState, type ReactNode, useEffect } from "react"
import { Settings as SettingsIcon } from "lucide-react"

import "../globals.css"

import { sendToBackground } from "@plasmohq/messaging"
import { useSettings } from "../utils/settings"

// ... WordItem and WordList components remain unchanged ...

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
          "hover:bg-main/50 text-text-primary"
        )}
      >
        <div className={clsx("flex-grow text-[1.2em] font-light")}>{this.props.word}</div>
        <button
          className={clsx(
            "cursor-pointer text-text-muted border-none outline-none text-[1.2em] transition-all duration-500 bg-transparent",
            "hover:scale-[1.2] hover:rotate-[72deg] hover:text-star-text",
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
        <div className={clsx("text-[1.2em] font-light italic text-text-muted text-center p-2.5")}>No words starred yet.</div>
      )

    return (
      <div className={clsx("mt-5 w-full max-h-[500px] overflow-y-auto")}>{inner}</div>
    )
  }
}

function Index() {
  const [filterKey, setFilterKey] = useState('')
  const [settings] = useSettings()

  useEffect(() => {
    if (settings.theme === "dark" || (settings.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [settings.theme])

  const openOptions = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('options.html'))
    }
  }

  return (
    <div
      className={clsx(
        "box-border flex flex-col p-4 w-[300px]",
        "bg-surface text-text-primary transition-colors duration-300"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <input
          className={clsx(
            "text-[1.2em] border border-border bg-input text-text-primary rounded h-8 box-border px-2.5 flex-grow",
            "focus:outline-none focus:border-border-highlight",
            "placeholder:text-text-muted/50"
          )}
          type="input"
          placeholder="Type to search words"
          onChange={(event) => {
            setFilterKey(event.target.value)
          }}
          value={filterKey}></input>

        <button
          onClick={openOptions}
          className="p-1 rounded hover:bg-main/50 transition-colors text-text-muted hover:text-text-primary"
          title="Settings"
        >
          <SettingsIcon size={20} />
        </button>
      </div>
      <div>
        <WordList filterKey={filterKey}></WordList>
      </div>
    </div>
  )
}

export default Index
