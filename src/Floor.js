import React from 'react';

export default class Floor extends React.Component {
    render() {
        var pos = this.props.position;
        var opa = this.props.opacity;
        return (
            <svg>
            <polygon opacity={opa} 
            points={"0,"+(pos-(-70))+" 200,"+(pos-(-70))+" 260,"+pos+" 60,"+pos}/>
            <line x1="0" y1={pos-(-70)} x2="200" y2={pos-(-70)} 
             strokeWidth="2" stroke="black"/>
            <line x1="260" y1={pos} x2="200" y2={pos-(-70)} 
             strokeWidth="2" stroke="black"/>
            </svg>
        );
    }

}