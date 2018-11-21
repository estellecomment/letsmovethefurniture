import {Component} from "react";
import React from "react";

// onTrashedEvent(trashedId)
class Trash extends Component {
    constructor(props) {
        super(props);

        this.state = { isDraggedOver: false };
    }

    render() {
        return (
            <div className={this.state.isDraggedOver ? "is-dragged-over" : undefined}
                onDragOver={(e) => {
                    e.preventDefault()
                }}
                onDragEnter={(e) => {
                    e.preventDefault();
                    console.log('dragenter on trash');
                    this.setState({isDraggedOver: true});
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    console.log('dragleave on trash');
                    this.setState({isDraggedOver: false});
                }}
                 onDrop={(e) => {
                     e.preventDefault();
                     console.log('drop on trash');
                     let meubleId = e.dataTransfer.getData("text/plain");
                     this.setState({isDraggedOver: false});
                     this.props.onTrashedEvent(meubleId);
                 }}
            >
                <img alt="trash" src={"/trash-64.png"} />
            </div>
        );
    }
}

export default Trash;