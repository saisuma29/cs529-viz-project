import * as d3 from "d3";

export class Canvas2D {
  constructor(divId, containerId, isSubview = false) {
    this.divId = divId;
    this.containerId = containerId;
    this.isSubview = isSubview;

    this.width = document.getElementById(this.containerId).clientWidth;
    this.height = document.getElementById(this.containerId).clientWidth * 4;
    this.svg = d3
      .select(`#${containerId}`)
      .append("svg:svg")
      .attr("id", this.divId)
      .attr("width", this.width)
      .attr("height", this.height);
  }

  swapCanvasSize() {
    if (this.isSubview) {
      document
        .getElementById(this.containerId)
        .classList.replace("subview", "mainview");
      this.isSubview = false;
    } else {
      document
        .getElementById(this.containerId)
        .classList.replace("mainview", "subview");
      this.isSubview = true;
    }

    // this.resize();
  }

  resize() {
    if (this.isSubview) {
      this.width = document.getElementById(this.containerId).clientWidth;
      this.height = document.getElementById(this.containerId).clientWidth * 4;
      this.svg.attr("width", this.width).attr("height", this.height);
    } else {
      this.width = document.getElementById(this.containerId).clientHeight / 4;
      this.height = document.getElementById(this.containerId).clientHeight;
      this.svg.attr("width", this.width).attr("height", this.height);
    }
  }
}
