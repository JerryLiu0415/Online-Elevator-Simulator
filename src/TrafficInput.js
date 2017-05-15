import React from 'react';
import ReactDOM from 'react-dom';
import { Label } from 'react-bootstrap';
import { FieldGroup } from 'react-bootstrap';
import Chart from './ColorChart.js';
import { Button } from 'react-bootstrap';



export default class TrafficInput extends React.Component {
    fileUpload;
    constructor() {
        super();
        this.parseFile = this.parseFile.bind(this);
    }


    parseFile() {
        //var obj = JSON.parse(this.filesInput);
        // let formData = new FormData();
        // const files = this.filesInput.files;
        // formData.append('file', files);
        // for (var key in files) {
        //     // check if this is a file:
        //     if (files.hasOwnProperty(key) && files[key] instanceof File) {
        //         formData.append(key, files[key]);
        //     }
        // }
        const file = this.fileUpload.files[0];
        var read = new FileReader();
        read.readAsBinaryString(file);
        read.onloadend = function () {
            try {
                var obj = JSON.parse(read.result);
                var intensity = obj["intensity"];
                alert(intensity);
            } catch (e) {
                alert("Invalid File Uploaded");
                alert(e.message);
            }
        }
    }

    render() {
        var i = 0;
        return (
            <div>
                <h3>Model Preview</h3>
                <Chart width="48" height={this.props.trafficModel.length} x="50" y="50"
                    current={1000}
                    distribution={this.props.trafficModel}
                    intensity={this.props.intensities} />
                <div>
                    <h3>Construct Model</h3>
                    <div>
                        <div className="pad">
                            <div className="pad">
                                <lable>{"BuildInDistrubution: "}</lable>
                                <select onChange={this.props.onDistributionChange.bind(this)}
                                    defaultValue="Default">
                                    <option value="Default">Default</option>
                                    <option value="Uniform">Uniform</option>
                                    <option value="GoHome">GoHome</option>
                                    <option value="Escape">Escape</option>
                                    <option value="Apartment">Apartment</option>
                                </select>
                            </div>
                            <div className="pad">
                                <lable>{"BuildInIntensity: "}</lable>
                                <select onChange={this.props.onIntensityChange.bind(this)}
                                    defaultValue="Default">
                                    <option value="Default" >Default</option>
                                    <option value="Default(Busy)" >Default(Busy)</option>
                                    <option value="DefaultActive">DefaultActive</option>
                                    <option value="DefaultActive(Busy)">DefaultActive(Busy)</option>
                                    <option value="LinerDecay">LinerDecay</option>
                                    <option value="Constant">Constant</option>
                                    <option value="Constant(Busy)">Constant(Busy)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pad4">
                    <h3>Upload Model</h3>
                    <lable className="pad2">{"UseCustomModel: "}</lable>
                    <input
                        className="pad2"
                        type="file"
                        ref={(ref) => this.fileUpload = ref}
                        name="file" />
                    <Button onClick={this.props.onCustomSubmit.bind(this, this.fileUpload)}
                        bsSize="small">Submit</Button>
                </div>
                <div className="pad4">
                    <h3>Run Configuration</h3>
                    <lable className="pad2">{"Simulation Type: "}</lable>
                    <select onChange={this.props.onIntensityChange.bind(this)}
                        defaultValue="Default">
                        <option value="Default">Plain Simulation</option>
                        <option value="DefaultActive">Complex Simulation</option>
                    </select>
                </div>
            </div>
        );
    }
}