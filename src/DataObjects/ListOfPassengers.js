export default class People {
    data = []
    count = 0;
    totalWaiting = 0;
    numServiced = 0;

    pushPassenger(p) {
        this.data.push(p);
        this.count++;
    }

    removePassenger(id) {
        var ind;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].id == id) {
                ind = i;
                break;
            }
        }
        this.data.splice(ind, 1);
        this.count--;
    }

    countNumWaitingAt(n) {
        var res = 0;
        for (var i = 0; i < this.data.length; i++) {
            var p = this.data[i];
            if (p.src == n && !p.serviced) {
                res++;
            }
        }
        return res;
    }

    countNumWaitingAtOfId(n, eid, dir) {
        var res = 0;
        if (dir = "up") {
            for (var i = 0; i < this.data.length; i++) {
                var p = this.data[i];
                if (p.src == n && !p.serviced && p.at == eid && p.src < p.dst) {
                    res++;
                }
            }
        }
        else {
            for (var i = 0; i < this.data.length; i++) {
                var p = this.data[i];
                if (p.src == n && !p.serviced && p.at == eid && p.src > p.dst) {
                    res++;
                }
            }

        }
        return res;
    }

    resetPassengers() {
        this.data = [];
        this.count = 0;
        this.totalWaiting = 0;
        this.numServiced = 0;
    }
}