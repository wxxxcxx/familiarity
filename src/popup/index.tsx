import type { PlasmoGetStyle } from 'plasmo'
import React, { useState, type ReactNode } from 'react'
import styled from 'styled-components'

import { sendToBackground } from '@plasmohq/messaging'

const styleContent = `
  body {
    background-color: transparent;
    margin: 0px;
    padding: 0px;
  }
`

const Wrapper = styled.div`
  box-sizing: border-box;
  display: 'flex';
  flex-direction: 'column';
  padding: 16px;
  background-color: #eee;
  color: #333;
  @media screen and (prefers-color-scheme: dark) {
    & {
      background-color: #444;
      color: #999;
    }
  }
`

const ListWrapper = styled.div`
  margin-top: 20px;
  width: 250px;
  max-height: 500px;
  overflow-y: auto;
`

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
`

const ItemTitle = styled.div`
  flex-grow: 1;
  font-size: 1.2em;
  font-weight: 400;
`
const ItemButton = styled.button`
  cursor: pointer;
  color: inherit;
  border: none;
  outline: none;
  font-size: 1.2em;
  transition: all 500ms ease;
  background: transparent;
  color:inherits &:hover {
    transform: scale(1.2, 1.2) rotate(0.2turn);
  }
  &:active {
    transform: scale(0.8, 0.8);
  }
`

const Search = styled.input`
  font-size: 1.2em;
  border: 1px solid #eee;
  background-color: #eee;
  color: #333;
  border-radius: 4px;
  line-height: 2em;
  height: 2em;
  width: 100%;
  &:focus {
    outline: none;
  }
  box-sizing: border-box;
  padding: 0 10px;
  @media screen and (prefers-color-scheme: dark) {
    & {
      border: 1px solid #999;
      background-color: #555;
      color: #ccc;
    }
  }
`

const EmplyList = styled.div`
  font-size: 1.2em;
  font-weight: 200;
  font-style: italic;
  color: #999;
  text-align: center;
  padding: 10px;
`

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
      <ItemWrapper>
        <ItemTitle>{this.props.word}</ItemTitle>
        <ItemButton onClick={this.unstar}>★</ItemButton>
      </ItemWrapper>
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
        <EmplyList>No words starred yet.</EmplyList>
      )

    return <ListWrapper>{inner}</ListWrapper>
  }
}

function Index() {
  const [filterKey, setFilterKey] = useState('')

  return (
    <Wrapper>
      <style>{styleContent}</style>
      <div>
        <Search
          type="input"
          placeholder="Type to search words"
          onChange={(event) => {
            setFilterKey(event.target.value)
          }}
          value={filterKey}></Search>
      </div>
      <div>
        <WordList filterKey={filterKey}></WordList>
      </div>
    </Wrapper>
  )
}

export default Index
