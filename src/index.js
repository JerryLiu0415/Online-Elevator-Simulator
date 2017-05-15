import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import './index.css';
import { DropdownButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import { Jumbotron } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Simulator from './Simulator.js';
import Building from './Building.js';
import Chart from './ColorChart.js';
import Bar from './3DBar.js';
import TrafficInput from './TrafficInput.js';
import ElevatorData from './DataObjects/ElevatorData.js';
import Person from './DataObjects/PassengerData.js';
import People from './DataObjects/ListOfPassengers.js';

var destination = document.querySelector("#container");

class App extends React.Component {
  currentTab = 0;
  defaultTraffic;
  defaultIntensity;
  elevators = [];
  passengers = [];
  currentInterval = 0;
  capacity = 4;
  barChartData = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
  [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
  [0, 0, 0, 0], [0, 0, 0, 0]];
  startIsGiven = false;

  constructor() {
    super();
    this.state = {
      trigger: 0,
      numFloors: 20,
      numElevators: 1,
    }
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleElevhange = this.handleElevhange.bind(this);
    this.handleCapacityChange = this.handleCapacityChange.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);
    this.handleDistributionChange = this.handleDistributionChange.bind(this);
    this.handleIntensityChange = this.handleIntensityChange.bind(this);
    this.handleCustomIntensityChange = this.handleCustomIntensityChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleTimeIntervalChange = this.handleTimeIntervalChange.bind(this);
    this.handleConfigChange = this.handleConfigChange.bind(this);

    this.defaultTraffic = generateDefaultTraffic(this.state.numFloors, "Default");
    this.defaultIntensity = generateDefaultIntensity("Default");
    for (var i = 0; i < this.state.numElevators; i++) {
      this.elevators.push(new ElevatorData(i, this.state.numFloors, 4));
    }
  }

  handleFloorChange(e) {
    this.setState({
      numFloors: parseInt(e.target.value)
    });
    for (var i of this.elevators) {
      i.maxFloor = parseInt(e.target.value);
      i.position = 170 + ((i.maxFloor - 1) * 20);
    }
    this.defaultTraffic = generateDefaultTraffic(parseInt(e.target.value), "Default");
  };

  handleElevhange(e) {
    this.setState({
      numElevators: parseInt(e.target.value)
    });
    this.elevators = [];
    for (var i = 0; i < e.target.value; i++) {
      this.elevators.push(new ElevatorData(i, this.state.numFloors, 4));
    }
  };

  handleCapacityChange(event) {
    var val = parseInt(event.target.value);
    var ind = Math.floor(val / 100);
    var newCap = val % 100;
    this.elevators[ind].capacity = newCap;
  }

  handleSpeedChange(event) {
    var val = parseInt(event.target.value);
    var ind = Math.floor(val / 10);
    var newSpeed = val % 10
    this.elevators[ind].speed = newSpeed;
  }

  handleDistributionChange(event) {
    this.defaultTraffic = generateDefaultTraffic(this.state.numFloors, event.target.value);
    this.setState({ trigger: Math.random() });
  }

  handleIntensityChange(event) {
    this.defaultIntensity = generateDefaultIntensity(event.target.value);
    this.setState({ trigger: Math.random() });
  }

  handleCustomIntensityChange(fileUpload) {
    const file = fileUpload.files[0];
    var read = new FileReader();
    read.readAsBinaryString(file);

    read.onloadend = function () {
      try {
        var obj = JSON.parse(read.result);
        var intensity = obj["intensity"];
        var dist = obj["distribution"];
        if (dist.length != this.state.numFloors) {
          alert("Floor number doesn't match existing!");
          return;
        }
        this.defaultIntensity = intensity;
        this.defaultTraffic = dist;
        this.setState({ trigger: Math.random() });
      } catch (e) {
        alert("Invalid File Uploaded");
        alert(e.message);
      }
    }.bind(this);
  }

  handleSelect(key) {
    this.currentTab = key;
    this.setState({ trigger: Math.random() });
  }

  handleTabChange(n) {
    this.currentTab = n;
    this.setState({ trigger: Math.random() });
    if (n == 3) {
      this.startIsGiven = true;
    }
  }

  handleTimeIntervalChange(n) {
    this.currentInterval = n;
    this.setState({ trigger: Math.random() });
  }

  handleConfigChange(n) {
    var prev = this.state.numElevators;
    var i;
    var j;
    if (this.capacity > 16) {
      return;
    }
    if (prev < 8) {
      i = prev - 1;
      j = (this.capacity / 4) - 1
      this.state.numElevators++;
    }
    else {
      i = 7;
      j = (this.capacity / 4) - 1
      this.state.numElevators = 1;
      this.capacity += 4;
    }
    this.elevators = [];
    for (var k = 0; k < this.state.numElevators; k++) {
      this.elevators.push(new ElevatorData(k, this.state.numFloors, this.capacity));
    }
    this.barChartData[i][j] = Math.floor(n / 10);
  }


  render() {
    return (
      <div>
        <h1>Elevator System Simulator 2.0</h1>
        <Tabs activeKey={this.currentTab} id="controlled-tab-example"
          bsStyle="pills" className="boarder"
          onSelect={this.handleSelect}>
          <Tab eventKey={0} title="Intro">
            <div className="boarder">
            </div>
          </Tab>
          <Tab eventKey={1} title="Building">
            <Building
              onFloorNumChange={this.handleFloorChange}
              onElevNumChange={this.handleElevhange}
              onCapacityChange={this.handleCapacityChange}
              onSpeedChange={this.handleSpeedChange}
              numElev={this.state.numElevators} />
            <div className="pad3">
              <Button bsStyle="primary" onClick={() => this.handleTabChange(2)}> Next</Button>
            </div>
          </Tab>
          <Tab eventKey={2} title="Traffic">
            <div className="boarder">
              <TrafficInput
                trafficModel={normalize(this.defaultTraffic)}
                intensities={this.defaultIntensity}
                onDistributionChange={this.handleDistributionChange}
                onIntensityChange={this.handleIntensityChange}
                onCustomSubmit={this.handleCustomIntensityChange} />
            </div>
            <div className="pad3">
              <Button bsStyle="primary" onClick={() => this.handleTabChange(3)}>Start!</Button>
            </div>
          </Tab>
          <Tab eventKey={3} title="Simulation" disabled={false}>
            <div className="boarder">
              <div>
                <p>Expected Traffic</p>
                <Chart width="48" height={this.state.numFloors} x="50" y="50"
                  current={this.currentInterval}
                  distribution={this.defaultTraffic}
                  intensity={this.defaultIntensity} />
              </div>
              <Simulator
                startIsGiven={this.startIsGiven}
                numFloors={this.state.numFloors}
                numElevators={this.state.numElevators}
                trafficModel={normalize(this.defaultTraffic)}
                intensities={(this.defaultIntensity)}
                elevators={this.elevators}
                passengers={this.passengers}
                onTimeIntervalChange={this.handleTimeIntervalChange}
                onConfigChange={this.handleConfigChange} />
            </div>
          </Tab>
          <Tab eventKey={4} title="Stats" disabled={false}>
            <div className="boarder">
              <h3>General performance summary</h3>
              <Bar data={this.barChartData} />
              <h3>Current run summary </h3>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <App />
  </div>,
  destination
);

function normalize(matrix) {
  var res = matrix;
  var height = res.length;
  var width = res[0].length;
  for (var i = 0; i < width; i++) {
    var colSum = sum(getCol(matrix, i));
    for (var j = 0; j < height; j++) {
      res[j][i] = res[j][i] / colSum;
    }
  }
  return res;
}

function sum(array) {
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function getCol(matrix, col) {
  var column = [];
  for (var i = 0; i < matrix.length; i++) {
    column.push(matrix[i][col]);
  }
  return column;
}

function generateDefaultTraffic(numFloors, modelName) {
  switch (modelName) {
    case "Default":
      var res = [];
      res.push(arrayOfX(48, 2));
      for (var i = 1; i < numFloors; i++) {
        res.push(arrayOfX(48, i / numFloors));
      }
      return res;
    case "Uniform":
      var res = [];
      for (var i = 0; i < numFloors; i++) {
        res.push(arrayOfX(48, 2));
      }
      return res;
    case "GoHome":
      var res = [];
      res.push(arrayOfX(48, 3));
      for (var i = 1; i < numFloors; i++) {
        res.push(arrayOfX(48, Math.pow(i / numFloors, 2)));
      }
      return res;
    case "Escape":
      var res = [];
      res.push(arrayOfX(48, 0.5));
      for (var i = 1; i < numFloors; i++) {
        res.push(arrayOfX(48, i / numFloors));
      }
      return res;
    case "Apartment":
      var res = [];
      res.push(arrayOfX(48, 0.5));
      for (var i = 1; i < numFloors; i++) {
        var midNight = arrayOfX(12, 0.5);
        var morning = arrayOfX(12, i * 2 / numFloors);
        var afternoon = arrayOfX(12, Math.pow(i / numFloors, 2));
        var evening = arrayOfX(12, i / numFloors);
        var tmp = midNight.concat(morning, afternoon, evening);
        res.push(tmp);
      }
      return res;
    default:
      break;
  }
}

function generateDefaultIntensity(modelName) {
  switch (modelName) {
    case "Default":
      var res = [];
      for (var i = 0; i < 48; i++) {
        res.push(Math.abs(Math.sin(i / 15)) / 2);
      }
      return res;
    case "Default(Busy)":
      var res = [];
      for (var i = 0; i < 48; i++) {
        res.push(Math.abs(Math.sin(i / 15)));
      }
      return res;
    case "DefaultActive":
      var res = [];
      for (var i = 0; i < 48; i++) {
        res.push(Math.abs(Math.sin(i / 2)) / 2);
      }
      return res;
    case "DefaultActive(Busy)":
      var res = [];
      for (var i = 0; i < 48; i++) {
        res.push(Math.abs(Math.sin(i / 2)));
      }
      return res;
    case "LinerDecay":
      var res = [];
      for (var i = 47; i >= 0; i--) {
        res.push(i / 50);
      }
      return res;
    case "Constant":
      var res = [];
      for (var i = 47; i >= 0; i--) {
        res.push(0.3);
      }
      return res;
    case "Constant(Busy)":
      var res = [];
      for (var i = 47; i >= 0; i--) {
        res.push(0.7);
      }
      return res;
    default:
      break;
  }
}



function arrayOfX(n, X) {
  var res = [];
  for (var i = 0; i < n; i++) {
    res.push(X);
  }
  return res;
}


