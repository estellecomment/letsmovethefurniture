import React from "react";

const ScaleBar = function({oneMeterPx}) {
    return (
        <div className="scale">
            <div className="scale-line"
                 style={{height: "0px", width:oneMeterPx + "px"}}
            />
            <div>1 m</div>
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
                 console.log('ondrop', e.clientX, e.clientY);
             }}
        >
            <div className="width-container"
                 style={{width: roomPx.width + "px"}}>
                <div className="room"
                     style={{
                         height: roomPx.height + "px",
                         width: roomPx.width + "px",
                     }}/>
                <div className="bottom-bar">
                    <ScaleBar oneMeterPx={pxPerCm * 100}/>
                </div>
                {children}
            </div>
        </div>
    )
}

export default DrawingBox;