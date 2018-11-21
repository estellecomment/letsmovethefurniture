import React, {Component} from 'react';

// props : rectangle
class Meuble extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: props.rectangle.x,
            y: props.rectangle.y,
            width: props.rectangle.width,
            height: props.rectangle.height
        };
    }

    rotate() {
        this.setState((state) => {
            return { width: state.height, height: state.width }
        });
    }

    componentWillUnmount() {
        console.log('unmounting meuble', this.props.rectangle.name);
    }

    render() {
        let rectanglePx = {
            width: this.state.width * this.props.pxPerCm,
            height: this.state.height * this.props.pxPerCm
        };
        return (
            <div className="meuble"
                 style={{
                     width: rectanglePx.width + "px",
                     height: rectanglePx.height + "px",
                     top: this.state.y + "px",
                     left: this.state.x + "px"
                 }}
                 draggable="true"
                 onDragStart={(e) => {
                     console.log('onDragStart');
                     console.log(e);
                     console.log(e.clientX);
                     console.log(e.clientY);
                     this.dragStartPosition = {x: e.clientX, y: e.clientY};
                 }}
                 onDragEnd={(e) => {
                     console.log('onDragEnd');
                     console.log(e);
                     let dragStopPosition = {x: e.clientX, y: e.clientY};
                     console.log('dragStopPosition ', dragStopPosition);
                     console.log('dragStartPosition ', this.dragStartPosition);

                     let dragDiff = {
                         x: e.clientX - this.dragStartPosition.x,
                         y: e.clientY - this.dragStartPosition.y
                     };
                     console.log('dragdiff', dragDiff);

                     this.setState((state) => {
                         let newState = {x: state.x + dragDiff.x, y: state.y + dragDiff.y };
                         console.log('newState', newState);
                         return newState;
                     })

                 }}
                 onDoubleClick={(e) => {
                     console.log('ondblclick');
                     console.log(e);
                     this.rotate();
                 }}
            >
                <div>{this.props.rectangle.name}</div>
                <div className="meuble-width">{this.state.width} cm</div>
                <div className="meuble-height">{this.state.height} cm</div>
            </div>
        );
    }
}

export default Meuble;
