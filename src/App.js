import React, {Component} from 'react';

import AddRectangleForm from './AddRectangleForm';
import DrawingBox from "./DrawingBox";
import Meuble from './Meuble';

import './App.css';
import Trash from "./Trash";


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

    printState(e) {
        e.preventDefault();
        console.log(this.state);
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

        const removeMeuble = (meubleId) => {
            console.log('removing meuble', meubleId);
            this.setState((state) => {
                let listWithoutMeuble = state.furnitureList.filter((meuble) => {
                    return ("" + meuble.id) !== ("" + meubleId); // cast to string
                });
                return {furnitureList: listWithoutMeuble};
            });
        };

        return (
            <div className="App">
                <div className="top-bar">
                    <div>
                        <img alt="sofa" src={"/sofa-128.png"} />
                        <div>Let's move the furniture!</div>
                    </div>
                    <AddRectangleForm addRectangleFunc={drawRoom}
                                      title="Set room size (cm)"
                                      submitText="Set Room Size"
                                      initValues={{width: this.state.room.width, height: this.state.room.height}}/>
                    <AddRectangleForm addRectangleFunc={addFurniture}
                                      title="Create furniture (cm)"
                                      withName={true}
                                      submitText="Add Furniture"/>

                    <div className="top-bar-column">
                        <div>Remove furniture</div>
                        <Trash onTrashedEvent={removeMeuble}/>
                        <form onSubmit={clearFurniture}>
                            <input type="submit" value="Remove all furniture"/>
                        </form>
                      <div><a href="" onClick={(e) => { this.printState(e) }}>Print state to console</a></div>
                    </div>
                </div>
                <div>Double click furniture to rotate it, drag it to trash can to remove it</div>

                <DrawingBox
                    room={this.state.room}
                    pxPerCm={this.state.pxPerCm}
                >
                    {this.state.furnitureList.map((rectangle) => (
                        <Meuble key={rectangle.id} rectangle={rectangle} pxPerCm={this.state.pxPerCm}/>
                    ))}
                </DrawingBox>
            </div>
        );
    }
}

export default App;
