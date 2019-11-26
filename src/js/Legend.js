import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';

export class Legend {
  constructor() {
    // Color scale G
    this.colorScaleG = d3
      .scaleSequential(d3.interpolateWarm)
      .domain([0.02, 0]);

    // Color scale P
    this.colorScaleP = d3
      .scaleSequential(d3.interpolateWarm)
      .domain([1.8, 1.6]);

    this.containerDiv = document.getElementById('legend-div');

    // SVG
    this.svg = d3
      .select(this.containerDiv)
      .append('svg:svg')
      .attr('width', this.containerDiv.clientWidth)
      .attr('height', this.containerDiv.clientHeight);

      // svg.select(".legendSequential")
      //   .style("fill", '#fff')
      //   .call(legendSequential);
    // legend for 1.6 to 1.8
    this.svg
      .append('g')
      .attr('class', 'legendP')
      .attr('transform', 'translate(0,20)')
      .style("fill", '#fff')

    this.legendP = legendColor()
      .labelFormat(d3.format('.02f'))
      .title('Power (P)')
      .cells(6)
      .orient('vertical')
      .shapePadding(0)
      .scale(this.colorScaleP);

    this.svg.select('.legendP').call(this.legendP);
    
    // legend for 0.0001 to 0.03
    this.svg
      .append('g')
      .attr('class', 'legendG')
      .attr('transform', 'translate(0,200)')
      .style("fill", '#fff')

    this.legendG = legendColor()
      .labelFormat(d3.format('.03f'))
      .title('Ground (G)')
      .cells(6)
      .orient('vertical')
      .shapePadding(0)
      .scale(this.colorScaleG);

    this.svg.select('.legendG').call(this.legendG);
  }
}
