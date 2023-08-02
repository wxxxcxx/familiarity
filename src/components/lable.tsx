import React from "react"

class Label extends React.Component<{
    text: string,
    data: {
        code: number,
        definitions: string[],
        message: string | null
    }

}>{


    render(): React.ReactNode {
        return <span className="label">
            {this.props.text}
            {this.props.data && this.props.data.definitions != null && this.props.data.definitions.length > 0 && <span className="label-corner">{this.props.data.definitions[0]}</span>}
        </span>
    }
}

export default Label

