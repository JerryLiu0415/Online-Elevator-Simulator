// Elevator data objects
// Data structure for storing an instance of elevator
export default class ElevatorData {
    id;
    position;
    state = "idle";
    maxFloor;
    cd = 80;
    innerCalls = [];
    outerCallsUp = [];
    outerCallsDown = [];
    heading = 1;
    direction = "up";
    skip = false;
    load = 0;
    capacity = 4;
    speed = 1;
    floor = 1;
    distTraveled = 0;



    constructor(id, maxFloor, capacity) {
        this.id = id;
        this.maxFloor = maxFloor;
        this.position = 170 + ((maxFloor - 1) * 20);
        this.capacity = capacity;
    }

    updatePassengers(passengers) {
        this.passengers = passengers;
    }

    nextState(passengers) {
        this.floor = Math.round(this.findFloor(this.position));
        var state = this.state;
        this.heading = this.findHeading();
        switch (state) {
            case "idle":
                // If the elevator is called, exit idle state to either loading or running state.
                if (!this.isFree()) {
                    // If neighbour call exists, enter loading state directly
                    if (this.neighbourCall()) {
                        this.cd = 50;
                        this.state = "loading";
                        return -1;
                    }
                    // Otherwise go to running state with computed destination
                    this.state = "running";
                    return -1;
                }
                break;
            case "running":
                // Destination floor reached
                this.skip = false;
                var dstPos = this.findPos(this.heading);
                if (dstPos == this.position) {
                    this.cd = 50;
                    this.state = "loading";
                    return -1;
                }
                else if (dstPos > this.position) {
                    this.position = this.position + this.speed;
                    this.distTraveled += this.speed;
                    return -1;
                }
                else if (dstPos < this.position) {
                    this.position = this.position - this.speed;
                    this.distTraveled += this.speed;
                    return -1;
                }
                else {
                    break;
                }
            case "loading":
                var currentFloor = this.findFloor(this.position);
                // Dec cd
                this.cd--;

                // Loading finished
                if (this.cd <= 0) {
                    this.cd = 0;
                    if (this.isFree()) {
                        this.state = "idle";
                        return -1;
                    }
                    else {
                        this.state = "running";
                        return -1;
                    }
                }

                // Release
                var innerInd = this.innerCalls.indexOf(currentFloor);
                // alert("cur F: " + currentFloor);
                // alert(innerInd);
                var toBeRemoved = [];
                if (innerInd > -1) {
                    this.innerCalls.splice(innerInd, 1);

                    // Release Passengers reached their destination

                    for (var p of passengers.data) {
                        if (p.at == this.id &&
                            p.serviced &&
                            this.findPos(p.dst) == this.position) {
                            // remove p from passengers
                            this.load--;
                            if (this.load < 0) {
                                alert("???");
                            }
                            toBeRemoved.push(p.id)
                            passengers.totalWaiting += p.wait;
                            passengers.numServiced++;
                        }
                    }

                    for (var id of toBeRemoved) {
                        passengers.removePassenger(id);
                    }
                }

                // Downward pickup 
                var outerDownInd = this.outerCallsDown.indexOf(currentFloor);
                if (outerDownInd > -1 && this.direction == "down") {
                    for (var i = 0; i < passengers.data.length; i++) {
                        var p = passengers.data[i];
                        if (p.at == this.id &&
                            !p.serviced &&
                            this.findPos(p.src) == this.position &&
                            p.dst < p.src) {
                            if (this.load < this.capacity) {
                                this.load++;
                                this.cd += 10;
                                p.serviced = true;
                            }
                            // If elevator is full
                            // The remaining passengers need to call again
                            // Skip command is out
                            else {
                                this.skip = true;
                                p.called = false;
                                p.serviced = false;
                                break;
                            }
                        }
                    }

                    // If complete pickup occurs, remove the call
                    if (!this.skip) {
                        outerDownInd = this.outerCallsDown.indexOf(currentFloor);
                        if (outerDownInd > -1) {
                            this.outerCallsDown.splice(outerDownInd, 1);
                        }
                    }
                }

                // Upward pickup
                var outerUpInd = this.outerCallsUp.indexOf(currentFloor);
                if (outerUpInd > -1 && this.direction == "up") {
                    for (var i = 0; i < passengers.data.length; i++) {
                        var p = passengers.data[i];
                        if (p.at == this.id &&
                            !p.serviced &&
                            this.findPos(p.src) == this.position &&
                            p.dst > p.src) {
                            if (this.load < this.capacity) {
                                this.load++;
                                p.serviced = true;
                                this.cd += 10;
                            }
                            else {
                                this.skip = true;
                                p.called = false;
                                p.serviced = false;
                                break;
                            }
                        }
                    }
                    if (!this.skip) {
                        outerUpInd = this.outerCallsUp.indexOf(currentFloor);
                        if (outerUpInd > -1) {
                            this.outerCallsUp.splice(outerUpInd, 1);
                        }
                    }
                }

                break;
            case "OutOfService":
                break;
            default:
                break;
        }
        return -1;
    }

    // Return position based on floor number
    findPos(floor) {
        return -20 * floor + (170 + 20 * this.maxFloor);
    }

    findFloor(pos) {
        return (-1 / 20) * pos + (this.maxFloor + 17 / 2)
    }

    // Return true if the calls is at the same floor
    neighbourCall() {
        for (var c of this.outerCallsUp) {
            if (this.findPos(c) == this.position) { return true; }

        }
        for (var c of this.outerCallsDown) {
            if (this.findPos(c) == this.position) { return true; }
        }
        return false;
    }

    // Find the next floor to go
    findHeading() {
        var dir = this.direction;
        var visibleCalls = [];
        var c;

        // No tasks
        if (this.isFree()) {
            return this.findFloor(this.position);
        }

        // If direction is up
        if (dir == "up") {
            // Select calls of P1 area (pos <= this.pos)
            // Normally, this won't include current floor
            for (c of this.innerCalls) {
                if (this.findPos(c) <= this.position) {
                    visibleCalls.push(c);
                }
            }
            for (c of this.outerCallsUp) {
                if (this.findPos(c) <= this.position && visibleCalls.indexOf(c) == -1) {
                    visibleCalls.push(c);
                }
            }

            // Current floor has incomplete pickup situation
            // If skip command is given, current floor is ignored
            if (this.skip) {
                var ind = visibleCalls.indexOf(this.findFloor(this.position));
                visibleCalls.splice(ind, 1);
            }

            // Find the lowest floor in P1 area
            if (visibleCalls.length != 0) {
                var minFloor = this.maxFloor + 5;
                for (c of visibleCalls) {
                    if (c < minFloor) {
                        minFloor = c;
                    }
                }
                return minFloor;
            }

            // P1 area is empty, consider P2 area
            if (visibleCalls.length == 0) {
                var maxFloor = -2;
                for (c of this.outerCallsDown) {
                    if (this.findPos(c) < this.position) {
                        visibleCalls.push(c);
                    }
                }

                // P2 area non-empty return highest
                if (visibleCalls.length != 0) {
                    for (c of visibleCalls) {
                        if (c > maxFloor) {
                            maxFloor = c;
                        }
                    }
                    return maxFloor;
                }

                // No calls above, reverse direction
                else {
                    this.direction = "down";
                    return this.findHeading();
                }
            }
        }

        // Moving direction is down
        else {
            // Select calls of P1
            for (c of this.innerCalls) {
                if (this.findPos(c) >= this.position) {
                    visibleCalls.push(c);
                }
            }
            for (c of this.outerCallsDown) {
                if (this.findPos(c) >= this.position && visibleCalls.indexOf(c) == -1) {
                    visibleCalls.push(c);
                }
            }

            if (this.skip) {
                var ind = visibleCalls.indexOf(this.findFloor(this.position));
                visibleCalls.splice(ind, 1);
            }

            // Find the highest floor in P1
            if (visibleCalls.length != 0) {
                var maxFloor = -2;
                for (c of visibleCalls) {
                    if (c > maxFloor) {
                        maxFloor = c;
                    }
                }
                return maxFloor;
            }

            // No call of first priority, consider secondary priority calls
            if (visibleCalls.length == 0) {
                // Find the lowest floor going up
                var minFloor = this.maxFloor + 2;
                for (c of this.outerCallsUp) {
                    if (this.findPos(c) > this.position) {
                        visibleCalls.push(c);
                    }
                }
                if (visibleCalls.length != 0) {
                    for (c of visibleCalls) {
                        if (c < minFloor) {
                            minFloor = c;
                        }
                    }
                    return minFloor;
                }
                // No calls above, reverse direction
                else {
                    this.direction = "up";
                    return this.findHeading();
                }
            }
        }

    }

    isFree() {
        return (this.innerCalls.length == 0 &&
            this.outerCallsUp.length == 0 &&
            this.outerCallsDown.length == 0);
    }

    resetElevator() {
        this.position = 170 + ((this.maxFloor - 1) * 20);
        this.innerCalls = [];
        this.outerCallsUp = [];
        this.outerCallsDown = [];
        this.heading = 1;
        this.direction = "up";
        this.skip = false;
        this.state = "idle";
        this.cd = 80;
    }


}