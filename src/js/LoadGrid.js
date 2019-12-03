import * as d3 from 'd3';

export class LoadGrid {
  init(loads) {
    this.svg1 = d3.select('#load-div-1')
      .append('svg'); // example
  }

  update(loads, timestamp) {

  }
}
