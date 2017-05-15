import React from 'react';

export default class GraphRep extends React.Component {
    render() {
        var numFloors = this.props.numFloors;
        var circles = [];
        var edges = [];
        var initX = 200;
        var initY = 200;
        var ptsX = [];
        var ptsY = [];
        for (var i = 0; i < numFloors; i++) {
            var theta = i * (2 * Math.PI / numFloors);
            ptsX.push(initX * Math.cos(theta) - Math.sin(theta) * initY + 400);
            ptsY.push(initX * Math.sin(theta) + Math.cos(theta) * initY + 400);
            circles.push(
                <circle cx={initX * Math.cos(theta) - Math.sin(theta) * initY + 400}
                    cy={initX * Math.sin(theta) + Math.cos(theta) * initY + 400}
                    r="10" stroke="black" stroke-width="3" fill="grey" />
            );
        }

        for (var i = 0; i < numFloors; i++) {
            for (var j = i + 1; j < numFloors; j++) {
                edges.push(
                    <line x1={ptsX[i]} x2={ptsX[j]} y1={ptsY[i]} y2={ptsY[j]}
                        strokeWidth="1" stroke="black" opacity="0.5" />
                );
            }
        }
        return (
            <svg width="1000" height="1000">
                {circles}
                {edges}
            </svg>
        );
    }

}