import React, {Component} from 'react';
import './App.css';

// props : rectangle
class Meuble extends Component {
    constructor(props) {
        super(props);
        this.state = {x: props.rectangle.x, y: props.rectangle.y};
    }

    render() {
        return (
            <div className="meuble"
                 style={{
                     width: this.props.rectangle.width + "px",
                     height: this.props.rectangle.height + "px",
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
            />
        );
    }
}


const DrawingBox = function({width, height, children}) {
    let roomPercentageScale = 90;
    let drawingBoxHeight = Math.floor(height/roomPercentageScale*100);
    return (
        <div className="drawing-box"
             style={{height: drawingBoxHeight + "px"}}
             onDragOver={(e) => { e.preventDefault(); }}
             onDrop={(e) => {
                 console.log('ondrop');
                 console.log(e);
                 console.log(e.clientX);
                 console.log(e.clientY);
             }}
        >
            <div className="room"
                 style={{
                     height: height + "px",
                     width: width + "px",
                 }}/>
            {children}
        </div>
    )
}

// {title, submitText, addRectangleFunc}
class AddRectangleForm extends Component {
    constructor(props) {
        super(props);

        console.log('constructor AddRectangleForm for', this.props.title);
        this.widthInput = React.createRef();
        this.heightInput = React.createRef();
        this.idCounter = 0;

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const newRectangle = {
            width: this.widthInput.current.value,
            height: this.heightInput.current.value,
            id: this.idCounter,
            x: 0,
            y: 0
        };
        this.idCounter = this.idCounter + 1;
        console.log("new rectangle", newRectangle);
        this.props.addRectangleFunc(newRectangle);
    };

    // uncontrolled form because I'm not doing fancy validation.
    render() {
        console.log('rendering AddRectangleForm for', this.props.title);
        return (
        <form onSubmit={this.handleSubmit}>
            <div>{this.props.title}</div>
            <label>
                Width:
                <input type="number" ref={this.widthInput}/>
            </label>
            <label>
                Height:
                <input type="number" ref={this.heightInput}/>
            </label>
            <input type="submit" value={this.props.submitText}/>
        </form>
        )
    };
};

class App extends Component {
    constructor(props) {
        super(props);
        const defaultRoomHeight = 500;
        const defaultRoomWidth = 700;
        this.state = {furnitureList: [], room: {width: defaultRoomWidth, height: defaultRoomHeight}};
    }

    render() {

        const addFurniture = (newRectangle) => {
            console.log('setting state : new furniture piece', newRectangle);
            this.setState(oldState => {
                oldState.furnitureList.push(newRectangle);
                return {furnitureList: oldState.furnitureList};
            });
        }

        const drawRoom = (roomRectangle) => {
            console.log('setting state : new room', roomRectangle);
            this.setState({room: roomRectangle});
        };

        return (
            <div className="App">
                <AddRectangleForm addRectangleFunc={drawRoom} title="Room size" submitText="Set Room Size"/>
                <AddRectangleForm addRectangleFunc={addFurniture} title="Furniture" submitText="Add Furniture"/>

                <DrawingBox width={this.state.room.width} height={this.state.room.height}>
                    {this.state.furnitureList.map((rectangle) => (
                        <Meuble key={rectangle.id} rectangle={rectangle}/>
                    ))}
                </DrawingBox>

                <button onClick={()=> this.setState({})}>setState()</button>
            </div>
        );
    }
}

export default App;
