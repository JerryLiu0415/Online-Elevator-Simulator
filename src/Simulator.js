import React from 'react';
import './index.css';
import { DropdownButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import { Jumbotron } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Label } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Floor from './Floor.js';
import GraphRep from './GraphRepresentation.js';
import Ground from './Ground.js';
import Elevator from './Elevator.js';
import FloorSideBar from './FloorSideBar.js';
import ElevatorData from './DataObjects/ElevatorData.js';
import Person from './DataObjects/PassengerData.js';
import People from './DataObjects/ListOfPassengers.js';
import Chart from './ColorChart.js';

const ticks = 528; //26s
var oldInd = 0;

export default class Simulator extends React.Component {
  prevMaxFloor;
  elevatorsData = [];
  passengers = new People();
  actualCounts;

  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      counter: 0,
      opacity: 15,
      scaleConstant: 100,
      actualTraffic: arrayOfZeros(this.props.numFloors),
      maxFloor: this.props.numFloors,
      numElevators: this.props.numElevators,
    };
    this.actualCounts = arrayOfZeros(this.props.numFloors)
    this.tick = this.tick.bind(this, this.state.counter);
    this.handleElevatorDataChange = this.handleElevatorDataChange.bind(this);
  }
  componentDidMount() {
    let timer = setInterval(this.tick, 50);
    this.setState({ timer });
  }
  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }

  tick() {
    if (this.props.startIsGiven) {
      var index = Math.floor((this.state.counter / 4 % (ticks)) / 11)
      var range;
      var trigger = 2;

      if ((this.state.counter / 4) % (ticks) == 0 && this.state.counter != 0) {
        var avg = this.passengers.totalWaiting / this.passengers.numServiced
        for (var p of this.passengers.data) {
          if (!p.serviced) {
            this.passengers.totalWaiting += p.wait + avg;
            this.passengers.numServiced++;
          }
        }
        this.props.onConfigChange(this.passengers.totalWaiting / this.passengers.numServiced);
        this.passengers.resetPassengers();
      }

      if (index < 48) {
        var intensity = this.props.intensities[index];
        range = (1 / intensity) * 20;
      }
      else {
        range = 100;
        trigger = -1;
      }
      var prev = this.state.counter;
      var rand = Math.floor(Math.random() * range);
      var at = Math.floor(Math.random() * this.props.numElevators)
      this.setState({
        counter: prev + 1,
        maxFloor: this.props.numFloors
      });

      if (rand == trigger) {
        var randomSrc = generateRandomSrc(this.props.numFloors, getCol(this.props.trafficModel, 0));
        var randomDst = 1;
        if (randomSrc == 1) { randomDst = this.props.numFloors }
        this.passengers.pushPassenger(new Person(randomSrc, randomDst, at, this.state.counter));
      }

      for (var p of this.passengers.data) {
        p.nextState(this.elevatorsData);
      }

      for (var e of this.props.elevators) {
        e.nextState(this.passengers);
      }

      if (index != oldInd) {
        oldInd = index;
        this.props.onTimeIntervalChange(index * 11);
      }
    }
  }

  setOpacity = (event) => {
    this.setState({
      opacity: event.target.value
    });
    console.log(event.target.value);
  };

  setAlpha = (event) => {
    this.setState({
      scaleConstant: event.target.value
    });
  };

  showDetail() {
    var msg = "NumPass: " + this.passengers.data.length + "\n";
    for (var i = 0; i < this.passengers.data.length; i++) {
      var p = this.passengers.data[i];
      msg += p.src + "->" + p.dst + " Id: " + p.id + "\n";
    }
    if (this.passengers.numServiced > 0) {
      msg += "Avg waiting: " + (this.passengers.totalWaiting / this.passengers.numServiced).toString();
    }
    alert(msg);
  }

  render() {

    var pos = this.state.counter;
    var floors = [];
    var floorBars = [];
    var initYPos = 100;
    var opa = this.state.opacity;
    var alpha = this.state.scaleConstant;
    var maxFloor = this.props.numFloors + 1;
    var numElev = this.props.numElevators;
    if (floors.length != maxFloor) {
      for (var i = 0; i < maxFloor; i++) {
        if (i == maxFloor - 1) {
          floors.push(
            <Ground position={(i * 20 * (alpha / 100)) + initYPos} opacity={opa / 100} key={i} />);
        }

        floors.push(
          <Floor position={(i * 20 * (alpha / 100)) + initYPos} opacity={opa / 100}
            key={maxFloor + i} />);
      }
    }

    floorBars = [];
    for (i = maxFloor - 2; i >= 0; i--) {
      floorBars.push(
        <FloorSideBar
          position={(i * 20 * (alpha / 100)) + initYPos}
          opacity={opa / 100}
          waiting={this.passengers.countNumWaitingAt(maxFloor - i - 1)}
          key={maxFloor + i} />);
    }

    if (this.elevatorsData.length != this.props.elevators.length) {
      this.elevatorsData = this.props.elevators;
    }

    var elevators = [];
    for (var i = 0; i < numElev; i++) {
      elevators.push(
        <Elevator
          key={i}
          position={((this.props.elevators[i].position - 170) * alpha / 100) + 170}
          height={20 * alpha / 100}
          elevatorData={this.props.elevators[i]}
          onElevatorCall={this.handleElevatorDataChange} />);
    }

    return (
      <div>
        {"Time elapsed: " + this.state.counter}
        <div className="slide">
          <Label>{"Opacity: " + opa / 100}</Label>
          <input type="range" min="5" max="50" value={opa}
            onChange={this.setOpacity} />
          <Label>{"Scaling: " + alpha / 100}</Label>
          <input type="range" min="40" max="200" value={alpha}
            onChange={this.setAlpha} />
        </div>
        <div>
        </div>
        <Button onClick={() => this.showDetail()}>Debug </Button>
        <Tabs defaultActiveKey={0} id="uncontrolled-tab-example"
          bsStyle="pills" className="boarder">
          <Tab eventKey={0} title="Real">
            <svg width="1000"
              height={Math.max(maxFloor * 40 + 200, 200 + Math.ceil(numElev / 2) * 200)}>
              <polygon opacity="0.5"
                points="0,170 200,170 260,100 60,100" />
              <text x="70" y="150" fontFamily="Verdana" fontSize="55"
                fill="white">
                {maxFloor - 1}
              </text>
              {floors}
              {floorBars}
              {elevators}
            </svg>
          </Tab>
          <Tab eventKey={1} title="Graph">
            <GraphRep numFloors={this.props.numFloors} />
          </Tab>
        </Tabs>
        <div>
        </div>
      </div >
    );
  }

  call(i) {
    this.elevatorsData[0].innerCalls.push(i);
  }

  handleElevatorDataChange(id, floorNum) {
    console.log("Floor " + floorNum + " Added for E" + id);
    this.elevatorsData[id].innerCalls.push(floorNum);
  }

}

function generateRandomSrc(maxFloor, distribution) {
  var prefixSum = [];
  for (var i = 0; i < maxFloor; i++) {
    prefixSum.push(0);
  }
  prefixSum[0] = distribution[0];
  for (i = 1; i < maxFloor; i++) {
    prefixSum[i] = prefixSum[i - 1] + distribution[i];
  }
  var rand = Math.random();
  if (0 <= rand && rand < prefixSum[0]) {
    return 1;
  }
  for (i = 1; i < maxFloor; i++) {
    if (prefixSum[i - 1] <= rand && rand < prefixSum[i]) {
      return i + 1;
    }
  }
  return 3
}

function getCol(matrix, col) {
  var column = [];
  for (var i = 0; i < matrix.length; i++) {
    column.push(matrix[i][col]);
  }
  return column;
}

function sum(array) {
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function arrayOfZeros(n) {
  var res = [];
  for (var i = 0; i < n; i++) {
    res.push(0);
  }
  return res;
}

