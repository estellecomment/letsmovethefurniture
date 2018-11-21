import React, {Component} from 'react';
import './App.css';

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

const ScaleBar = function({oneMeterPx}) {
    return (
        <div className="scale-container">
            <div className="scale">
                <div className="scale-line"
                     style={{height: "0px", width:oneMeterPx + "px"}}
                />
                <div>1 m</div>
            </div>
        </div>
    );
};

const DrawingBox = function({room, pxPerCm, children}) {
    let roomPx = { width: room.width * pxPerCm, height: room.height * pxPerCm };

    let roomSizePercent = 90; // room fills X percent of drawingBox
    let drawingBoxHeightPx = Math.floor(roomPx.height/roomSizePercent*100);
    return (
        <div className="drawing-box"
             style={{height: drawingBoxHeightPx + "px"}}
             onDragOver={(e) => { e.preventDefault(); }}
             onDrop={(e) => {
                 console.log('ondrop');
                 console.log(e);
                 console.log(e.clientX);
                 console.log(e.clientY);
             }}
        >
            <div className="width-container"
                 style={{width: roomPx.width + "px"}}>
                <div className="room"
                     style={{
                         height: roomPx.height + "px",
                         width: roomPx.width + "px",
                     }}/>
                <ScaleBar oneMeterPx={pxPerCm * 100}/>
                {children}
            </div>
        </div>
    )
}

// {title, submitText, addRectangleFunc, [initValues, withName]}
class AddRectangleForm extends Component {
    constructor(props) {
        super(props);

        console.log('constructor AddRectangleForm for', this.props.title);
        this.widthInput = React.createRef();
        this.heightInput = React.createRef();
        if (this.props.withName) {
            this.nameInput = React.createRef();
        }
        this.idCounter = 0;

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        console.log('unmounting AddRectangleForm for', this.props.title);
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
        if (this.nameInput) {
            newRectangle.name = this.nameInput.current.value;
        }
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
            <div className="form-body">
                <label>
                    Width:
                    <input type="number" ref={this.widthInput} defaultValue={this.props.initValues ? this.props.initValues.width : ""}/>
                </label>
                <label>
                    Height:
                    <input type="number" ref={this.heightInput} defaultValue={this.props.initValues ? this.props.initValues.height : ""}/>
                </label>
                {
                    this.props.withName &&
                    <label>
                        Name:
                        <input type="text" ref={this.nameInput} />
                    </label>
                }
            </div>
            <input className="submit" type="submit" value={this.props.submitText}/>
        </form>
        )
    };
};

class App extends Component {
    constructor(props) {
        super(props);
        this.defaultRoomSize = { width: 700, height: 500 };
        this.maxRoomSizePx = { width: 800, height: 600 };
        this.state = {
            furnitureList: [],
            room: this.defaultRoomSize,
            pxPerCm: this.computeScale(this.defaultRoomSize)
        };
    }

    computeScale(room) {
        // Stretch width to max
        let pxPerCm = this.maxRoomSizePx.width / room.width;
        // Reduce scale if height is too big
        if (room.height * pxPerCm > this.maxRoomSizePx.height) {
            pxPerCm = this.maxRoomSizePx.height / room.height;
        }
        return pxPerCm;
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
            this.setState({room: roomRectangle, pxPerCm: this.computeScale(roomRectangle) });
        };

        const clearFurniture = (e) => {
            e.preventDefault();
            console.log('clearing furniture');
            this.setState({furnitureList: []});
        };

        return (
            <div className="App">
                <div className="top-bar">
                    <div>
                        <img src={"/sofa-128.png"} />
                        <div>Let's move the furniture!</div>
                    </div>
                    <AddRectangleForm addRectangleFunc={drawRoom}
                                      title="Room size (cm)"
                                      submitText="Set Room Size"
                                      initValues={{width: this.state.room.width, height: this.state.room.height}}/>
                    <AddRectangleForm addRectangleFunc={addFurniture}
                                      title="Furniture (cm)"
                                      withName={true}
                                      submitText="Add Furniture"/>

                    <form onSubmit={clearFurniture}>
                        <input type="submit" value="Remove all furniture"/>
                    </form>
                </div>
                <div>Double click furniture to rotate</div>

                <DrawingBox room={this.state.room} pxPerCm={this.state.pxPerCm}>
                    {this.state.furnitureList.map((rectangle) => (
                        <Meuble key={rectangle.id} rectangle={rectangle} pxPerCm={this.state.pxPerCm}/>
                    ))}
                </DrawingBox>
            </div>
        );
    }
}

export default App;
