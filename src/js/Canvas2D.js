import * as d3 from 'd3';

export class Canvas2D {
  constructor(divId, containerId, isSubview = false) {
    this.divId = divId;
    this.containerId = containerId;
    this.isSubview = isSubview;

    this.containerDiv = document.getElementById(this.containerId);

    this.width = this.containerDiv.clientHeight / 4;
    this.height = this.containerDiv.clientHeight / 4;

    this.heatmapDivs = document.getElementsByClassName('heatmap-div');

    this.svg0 = d3
      .select(this.heatmapDivs[3])
      .append('svg')
      .attr('id', 'heatmap-0')
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg1 = d3
      .select(this.heatmapDivs[2])
      .append('svg')
      .attr('id', 'heatmap-1')
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg2 = d3
      .select(this.heatmapDivs[1])
      .append('svg')
      .attr('id', 'heatmap-2')
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg3 = d3
      .select(this.heatmapDivs[0])
      .append('svg')
      .attr('id', 'heatmap-3')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  swapCanvasSize() {
    if (this.isSubview) {
      this.containerDiv.classList.replace('subview', 'mainview');

      this.containerDiv.style.width = getComputedStyle(
        this.containerDiv
      ).height;

      this.isSubview = false;
    } else {
      this.containerDiv.classList.replace('mainview', 'subview');

      this.containerDiv.style.width = '100px';

      this.isSubview = true;
    }

    this.resize();
  }

  resize() {
    if (this.isSubview) {
      // 4 stacked divs
      this.width = this.containerDiv.clientHeight / 4;
      this.height = this.containerDiv.clientHeight / 4;

      this.svg0.attr('width', this.width).attr('height', this.height);
      this.svg1.attr('width', this.width).attr('height', this.height);
      this.svg2.attr('width', this.width).attr('height', this.height);
      this.svg3.attr('width', this.width).attr('height', this.height);
    } else {
      // 2 x 2 divs
      this.width = (this.containerDiv.clientHeight * 0.97) / 2;
      this.height = this.containerDiv.clientHeight / 2;

      this.svg0.attr('width', this.width).attr('height', this.height);
      this.svg1.attr('width', this.width).attr('height', this.height);
      this.svg2.attr('width', this.width).attr('height', this.height);
      this.svg3.attr('width', this.width).attr('height', this.height);
    }
  }
}
