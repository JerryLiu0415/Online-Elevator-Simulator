import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var infoPanelXPos = [550, 752, 550, 752, 550, 752, 550, 752];
var infoPanelYPos = [150, 150, 352, 352, 554, 554, 756, 756];

export default class Elevator extends React.Component {
    details = [];

    render() {
        var e = this.props.elevatorData;
        var pos = this.props.position;
        var height = this.props.height;
        var id = e.id;
        if (this.details.length != 0) {
            this.details = [];
            this.showDetail();
        }

        return (
            <svg>
                {this.details}
                <polygon opacity="0.5"
                    points={(id * 20) + "," + pos + " " + (id * 20) + "," + (height + pos) +
                        " " + (id * 20 + 20) + "," +
                        (height + pos) + " " + (id * 20 + 20) + "," + pos} />
                <polygon opacity="0.35"
                    points={(id * 20) + "," + pos + " " + (id * 20 + 20) + ","
                        + pos + " " + (id * 20 + 25) + "," +
                        (pos - 5) + " " + (id * 20 + 5) + "," + (pos - 5)} />
                <polygon opacity="0.35"
                    points={(id * 20 + 20) + "," + pos + " " + (id * 20 + 20) + ","
                        + (height + pos) +
                        " " + (id * 20 + 25) + "," + (height + pos - 5)
                        + " " + (id * 20 + 25) + "," + (pos - 5)} />

                <line x1={id * 20} y1={pos} x2={id * 20 + 20} y2={pos}
                    strokeWidth="2" stroke="black" />
                <line x1={id * 20 + 20} y1={height + pos} x2={id * 20 + 20} y2={pos}
                    strokeWidth="2" stroke="black" />
                <line x1={id * 20 + 20} y1={pos} x2={id * 20 + 24} y2={pos - 4}
                    strokeWidth="2" stroke="black" />

                <line x1={id * 20 + 10} y1="170" x2={id * 20 + 10} y2={pos - 2}
                    strokeWidth="1" stroke="black" opacity="0.5" />
                <line x1={id * 20 + 14} y1="170" x2={id * 20 + 14} y2={pos - 2}
                    strokeWidth="1" stroke="black" opacity="0.5" />

                <text x={infoPanelXPos[e.id] + 120} y={infoPanelYPos[e.id] + 190}
                    fontFamily="Verdana" fontSize="50"
                    fill="black" opacity="1">
                    {"E" + (e.id + 1)}
                </text>
                <text x={infoPanelXPos[e.id] + 15} y={infoPanelYPos[e.id] + 20}
                    fontFamily="Verdana" fontSize="15"
                    fill="black">
                    {"State: " + e.state}
                </text>
                <text x={infoPanelXPos[e.id] + 15} y={infoPanelYPos[e.id] + 40}
                    fontFamily="Verdana" fontSize="15"
                    fill="black">
                    {"Position: " + e.floor}
                </text>
                <text x={infoPanelXPos[e.id] + 15} y={infoPanelYPos[e.id] + 60}
                    fontFamily="Verdana" fontSize="15"
                    fill="black">
                    {"Speed: " + speedToLetter(e.speed)}
                </text>
                <text x={infoPanelXPos[e.id] + 15} y={infoPanelYPos[e.id] + 80}
                    fontFamily="Verdana" fontSize="15"
                    fill="black">
                    {"Next: " + e.heading}
                </text>
                <text x={infoPanelXPos[e.id] + 15} y={infoPanelYPos[e.id] + 100}
                    fontFamily="Verdana" fontSize="15"
                    fill="black">
                    {"NumCalls: " + (e.innerCalls.length + e.outerCallsUp.length
                        + e.outerCallsDown.length).toString()}
                </text>
                <text x={infoPanelXPos[e.id] + 15} y={infoPanelYPos[e.id] + 120}
                    fontFamily="Verdana" fontSize="15"
                    fill="black">
                    {"DistTraveled: " + (e.distTraveled*(3/20000)).toFixed(3) + " km"}
                </text>
                <text x={infoPanelXPos[e.id] + 15} y={infoPanelYPos[e.id] + 160}
                    fontFamily="Verdana" fontSize="15"
                    fill="black">
                    {"Load: " + e.load + "/" + e.capacity}
                </text>
                <rect width="200" height="200" ry="10"
                    x={infoPanelXPos[e.id]} y={infoPanelYPos[e.id]}
                    opacity="0.6" fill={stateToColor(e.state)}
                    onClick={() => this.showDetail()}
                    className="grow" />

            </svg>
        );
    }

    showDetail() {
        var e = this.props.elevatorData;
        if (this.details.length != 0) {
            this.details = [];
            return;
        }
        this.details.push(
            <rect width={Math.ceil(e.maxFloor / 10) * 25} height="200"
                x={infoPanelXPos[e.id] - Math.ceil(e.maxFloor / 10) * 25} y={infoPanelYPos[e.id]}
                opacity="0.6" fill="black" key="-1"
            />
        );
        for (var i = 0; i < e.maxFloor; i++) {
            this.details.push(
                <svg key={i}>
                    <text x={infoPanelXPos[e.id] - Math.ceil(e.maxFloor / 10) * 25 + 25 * Math.floor(i / 10)}
                        y={infoPanelYPos[e.id] + i % 10 * 16 + 12}
                        fontFamily="Verdana" fontSize="10"
                        fill="white">
                        {i + 1}
                    </text>
                    <rect width="20" height="15"
                        x={infoPanelXPos[e.id] - Math.ceil(e.maxFloor / 10) * 25 + 25 * Math.floor(i / 10)}
                        y={infoPanelYPos[e.id] + i % 10 * 16}
                        opacity="0.6" fill={callStateToColor(e, i + 1)}
                        onClick={this.call.bind(this, i + 1)}
                        className="grow" />
                </svg>
            );
        }
    }

    call(n) {
        this.props.onElevatorCall(this.props.elevatorData.id, n);
        this.details = [];
        this.showDetail();
    }
}

function stateToColor(State) {
    switch (State) {
        case "idle":
            return "green";
        case "OutOfService":
            return "black";
        default:
            return "orange";
    }
}

function callStateToColor(elevator, n) {
    if (elevator.innerCalls.indexOf(n) != -1) {
        return "blue";
    }
    else {
        return "white";
    }

}

function speedToLetter(s) {
    if (s == 1) {
        return "Normal";
    }
    else if (s == 2) {
        return "2X";
    }
    else {
        return "";
    }
}
