import React from 'react';

export default class Bar extends React.Component {
    render() {
        var bars = [];
        var faces = [];
        var heights = this.props.data;

        for (var i = 0; i < heights.length; i++) {
            for (var j = 0; j < heights[0].length; j++) {
                var pt1x = (300 + i * 71 - 51 * j).toString();
                var pt1y = (330 + j * 51 - heights[i][j]).toString();
                var pt2x = (350 + i * 71 - 51 * j).toString();
                var pt2y = (330 + j * 51 - heights[i][j]).toString();
                var pt3x = (380 + i * 71 - 51 * j).toString();
                var pt3y = (300 + j * 51 - heights[i][j]).toString();
                var pt4x = (330 + i * 71 - 51 * j).toString();
                var pt4y = (300 + j * 51 - heights[i][j]).toString();
                var pts = pt1x + "," + pt1y + " " +
                    pt2x + "," + pt2y + " " + pt3x + "," + pt3y + " " + pt4x + "," + pt4y;

                var pt1x = (300 + i * 71 - 51 * j).toString();
                var pt1y = (330 + j * 51 - heights[i][j]).toString();
                var pt2x = (350 + i * 71 - 51 * j).toString();
                var pt2y = (330 + j * 51 - heights[i][j]).toString();
                var pt3x = (350 + i * 71 - 51 * j).toString();
                var pt3y = (330 + j * 51).toString();
                var pt4x = (300 + i * 71 - 51 * j).toString();
                var pt4y = (330 + j * 51).toString();
                var pts2 = pt1x + "," + pt1y + " " +
                    pt2x + "," + pt2y + " " + pt3x + "," + pt3y + " " + pt4x + "," + pt4y;

                var pt2x = (350 + i * 71 - 51 * j).toString();
                var pt2y = (330 + j * 51 - heights[i][j]).toString();
                var pt3x = (380 + i * 71 - 51 * j).toString();
                var pt3y = (300 + j * 51 - heights[i][j]).toString();
                var pt4x = (380 + i * 71 - 51 * j).toString();
                var pt4y = (300 + j * 51).toString();
                var pt5x = (350 + i * 71 - 51 * j).toString();
                var pt5y = (330 + j * 51).toString();
                var pts3 = pt2x + "," + pt2y + " " +
                    pt3x + "," + pt3y + " " + pt4x + "," + pt4y + " " + pt5x + "," + pt5y;


                bars.push(
                    <svg>
                        <polygon opacity="0.9" fill="rgb(55,76,117)" stroke="white"
                            points={pts} />
                        <polygon opacity="0.9" fill="rgb(85,124,183)" stroke="white"
                            points={pts2} />
                        <polygon opacity="0.9" fill="rgb(55,76,117)" stroke="white"
                            points={pts3} />
                        <text x={335 + i * 71 - 51 * j} y={315 + j * 51 - heights[i][j]}
                            fill="white">
                            {heights[i][j]}
                        </text>
                    </svg>
                );

                if (i == heights.length-1) {
                    bars.push(
                        <text x={400 + i * 71 - 51 * j} y={330 + j * 51}
                            fill="black">
                            {"Capacity=" + ((j+1)*4).toString()}
                        </text>
                    );
                }
            }
            bars.push(
                <text x={150 + i * 71} y={525}
                    fill="black">
                    {"#E=" + (i + 1).toString()}
                </text>
            );
        }


        return (
            <svg width="1000" height="600">
                {bars}
            </svg>
        );
    }
}