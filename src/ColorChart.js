import React from 'react';

export default class Chart extends React.Component {
    render() {
        var width = this.props.width;
        var height = this.props.height;
        var squares = [];
        var bars = [];
        var verticalText = [];
        var m = this.props.distribution;
        var intensity = this.props.intensity;
        if (width == 1) {
            var tmp = intensity;
            intensity = [];
            intensity.push(tmp);
            tmp = m;
            m = [];
            for (var i = 0; i < height; i++) {
                m.push([tmp[i]]);
            }
        }

        for (var i = 0; i < width; i++) {
            bars.push(
                <rect width="10" height={101 * intensity[i]} x={i * 11 + 8} y={height * 11 + 20}
                    fill="grey" opacity="0.8" />
            );
            for (var j = 0; j < height; j++) {
                var color =
                    "rgb(" + 255 +
                    ", " + Math.floor(Math.pow(1 - m[j][i], 5) * 255) +
                    ", 0)";
                squares.push(
                    <rect width="10" height="10" x={i * 11 + 8} y={j * 11}
                        fill={color} />
                );
            }
        }


        for (var i = 0; i < height; i++) {
            bars.push(
                <text x={0} y={i * 11 + 8}
                    fontFamily="Verdana" fontSize="7"
                    fill="black">
                    {i + 1}
                </text>
            );
        }

        for (var i = 0; i < 10; i++) {
            bars.push(
                <text x={0} y={height * 11 + 25 + i * 11}
                    fontFamily="Verdana" fontSize="7"
                    fill="black">
                    {"." + i}
                </text>
            );
        }

        return (
            <svg width={width * 11 + 50} height={height * 11 + 200}>
               
                {bars}
                {squares}
                 <rect width="10" height={height * 11} x={this.props.current + 8} y="0"
                 opacity="0.2"/>
            </svg>
        );
    }
}