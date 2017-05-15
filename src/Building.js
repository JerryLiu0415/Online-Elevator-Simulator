import React from 'react';
import './index.css';
import { Label } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export default class Building extends React.Component {
    details = [];

    render() {
        var numElevators = this.props.numElev;
        var eDetails = [];
        for (var i = 0; i < numElevators; i++) {
            this.props.onCapacityChange.bind(this, i);
            eDetails.push(
                <div className="pad" key={i}>
                    <div className="pad">
                        <Label>{"Elevator " + (i + 1) + " capacity:"}</Label>
                        <select onChange={this.props.onCapacityChange.bind(this)} defaultValue={4+i*100}>
                            <option value={2+i*100}>2</option>
                            <option value={4+i*100}>4</option>
                            <option value={6+i*100}>6</option>
                            <option value={8+i*100}>8</option>
                            <option value={10+i*100}>10</option>
                            <option value={12+i*100}>12</option>
                            <option value={14+i*100}>14</option>
                            <option value={16+i*100}>16</option>
                            <option value={18+i*100}>18</option>
                            <option value={20+i*100}>20</option>
                        
                        </select>
                        <Label>{"Speed: "}</Label>
                        <select onChange={this.props.onSpeedChange.bind(this)} defaultValue={1+i*10} >
                            <option value={1+i*10}>Normal</option>
                            <option value={2+i*10}>2X</option>
                        </select>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div>
                    <h3>Floors</h3>
                    <div className="slide">
                        <Label>{"NumFloors: "}</Label>
                        <input type="text" placeholder="Type some integer here..."
                            onChange={(e) => this.props.onFloorNumChange(e)} />
                    </div>
                </div>
                <div>
                    <h3>Elevators</h3>
                    <div className="slide">
                        <Label>{"NumElevators: "}</Label>
                        <input type="text" placeholder="Number from 1 to 8"
                            onChange={(e) => this.props.onElevNumChange(e)} />
                    </div>
                    {eDetails}
                </div>
            </div>
        );
    }
}