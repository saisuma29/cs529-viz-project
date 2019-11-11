import * as d3 from 'd3';

export class Canvas2D {
  constructor(divId, containerId, isSubview = false) {
    this.divId = divId;
    this.containerId = containerId;
    this.isSubview = isSubview;

    this.width = document.getElementById(this.containerId).clientWidth;
    this.height = document.getElementById(this.containerId).clientHeight;
    this.svg = d3
      .select(`#${containerId}`)
      .append('svg:svg')
      .attr('id', this.divId)
      .attr('width', this.width)
      .attr('height', this.height);
  }
}
