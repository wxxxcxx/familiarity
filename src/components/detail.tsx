import { sendToBackground } from "@plasmohq/messaging"
import React from "react"
import styled from "styled-components"
import api from "~contents/renderer"

const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Title = styled.div`
    flex-grow: 1;
    font-size: 1.5em;
    font-weight: bold;
`
const Button = styled.button`
    border: none;
    outline: none;
    font-size: 1.2em;
    transition: all 500ms ease; 
    background: transparent;
    color:inherits
    &:hover{
        transform: scale(1.2,1.2) rotate(0.2turn);
    }
    &:active{
        transform: scale(0.8,0.8);
    }
`

const Definitions = styled.div`
    margin-top: 20px;
`


class Detail extends React.Component<{
    text: string,
    data: {
        code: number,
        definitions: string[],
        starred: boolean,
        message: string | null
    }
}> {

    constructor(props) {
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
            api.renderer.render()
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
            api.renderer.render()
        })
    }


    render() {

        return <div className="detail">
            <Header>
                <Title>{this.props.text}</Title>
                {this.props.data?.starred ?
                    <Button autoFocus={false} onClick={this.unstar}>★</Button> :
                    <Button autoFocus={false} onClick={this.star}>☆</Button>}

            </Header>
            <Definitions>
                {
                    this.props.data?.definitions.map((definition) => {
                        return <p key={definition}>{definition}</p>
                    })
                }
            </Definitions>

        </div>
    }
}

export default Detail