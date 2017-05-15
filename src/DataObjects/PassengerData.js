export default class Person {
  id;
  src;
  dst;
  wait;
  called;
  serviced;
  at;
  

  elevators = []

  constructor(src, dst, at, id) {
    this.id = id;
    this.dst = dst;
    this.src = src;
    this.wait = 0;
    this.serviced = false;
    this.called = false;
    this.innerCalled = false;
    this.at = at;
  }

  nextState(elevators) {
    this.wait++;
    if (!this.called) {
      if (this.src > this.dst && elevators[this.at].outerCallsDown.indexOf(this.src) == -1) {
        elevators[this.at].outerCallsDown.push(this.src);
      }
      if (this.src < this.dst && elevators[this.at].outerCallsUp.indexOf(this.src) == -1) {
        elevators[this.at].outerCallsUp.push(this.src);
      }
      this.called = true;
    }
    else {
      if (this.serviced && !this.innerCalled) {
        if (elevators[this.at].innerCalls.indexOf(this.dst) == -1) {
          elevators[this.at].innerCalls.push(this.dst);
        }
        this.innerCalled = true;
      }
      else {
        return
      }
    }
  }
}

function countTimesOccur(array, element) {
  var counter = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] == element) {
      counter++;
    }
  }
  return counter;
}