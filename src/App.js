import React, {Component} from 'react';
import './App.css';

const maxHeight = 700; // because fuck it

const Meuble = function({rectangle}) {
    return (
        <rect width={rectangle.width}
              height={rectangle.height}
              x={rectangle.x}
              y={rectangle.y}
              style={{fill: "blue", strokeWidth: 1, stroke: "black"}}/>
    );
}

const Room = function() {
    return (
        <rect margin="auto"
              width='100%'
              height="100%"
              style={{fill: "none", strokeWidth: 3, stroke: "black"}}/>
    );
}

const DrawingBox = function({width, height, children}) {
    return (
        <svg width={width} height={height}>
            {children}
        </svg>
    )
}

// width, height, furnitureList
const DivDrawingBox = function({width, height, furnitureList}) {
    return ( // height is ignored. don't know why.
        <div height={maxHeight} display="flex" backgroundColor="pink">
        </div>
    )
}

let idCounter = 0;
// functional component because no state.
const AddRectangleForm = function ({title, submitText, addRectangleFunc}) {
    console.log('running AddRectangleForm for', title);
    let widthInput = React.createRef();
    let heightInput = React.createRef();
    let badCounter = 0; //initializing counter here resets it to zero at each callback. Because func has rerun (possible rendering update).

    const handleSubmit = function (event) {
        event.preventDefault();
        const newRectangle = {
            width: widthInput.current.value,
            height: heightInput.current.value,
            badId: badCounter,
            id: idCounter
        };
        badCounter = badCounter + 1;
        idCounter = idCounter + 1;
        console.log("new rectangle", newRectangle);
        addRectangleFunc(newRectangle);
    };

    // uncontrolled form because I'm not doing fancy validation.
    return (
        <form onSubmit={handleSubmit}>
            <div>{title}</div>
            <label>
                Width:
                <input type="number" ref={widthInput}/>
            </label>
            <label>
                Height:
                <input type="number" ref={heightInput}/>
            </label>
            <input type="submit" value={submitText}/>
        </form>
    )
};

// class component to test rendering differences
// {title, submitText, addRectangleFunc}
class AddRectangleFormClass extends Component {
    constructor(props) {
        super(props);

        console.log('constructor AddRectangleFormClass for', this.props.title);
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
        };
        this.idCounter = this.idCounter + 1;
        console.log("new rectangle", newRectangle);
        this.props.addRectangleFunc(newRectangle);
    };

    // uncontrolled form because I'm not doing fancy validation.
    render() {
        console.log('rendering AddRectangleFormClass for', this.props.title);
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
        this.state = {furnitureList: [], room: {width: 600, height: 700}};
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
                <AddRectangleFormClass addRectangleFunc={drawRoom} title="Room size" submitText="Set Room Size"/>
                <AddRectangleFormClass addRectangleFunc={addFurniture} title="Furniture" submitText="Add Furniture"/>

                <DrawingBox width={this.state.room.width} height={this.state.room.height}>
                    <Room/>

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
