import React from 'react';

export default class FloorSideBar extends React.Component {
    render() {
        var pos = this.props.position;
        var opa = this.props.opacity;
        var rects = [];
        for (var i = 0; i < this.props.waiting; i++) {
            rects.push(
                <rect width={5} height="10" y={pos + 5} x={260+6*i} opacity={opa} />
            )
        }
        return (
            <svg>
                {rects}
            </svg>
        );
    }

}