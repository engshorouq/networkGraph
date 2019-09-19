import React, { Component } from "react";
import * as d3 from "d3";

import "./style.css";

export default class index extends Component {
  static defaultProps = {
    width: 1230,
    height: 500
  };
  state = {
    input: {
      source: "",
      newName: "",
      color: ""
    },
    nodes: [{ id: 0, name: "shorouq", color: "red" }],
    links: []
  };
  componentDidMount() {
    const { width, height } = this.props;
    const { nodes, links } = this.state;
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(
        d3.zoom().on("zoom", function() {
          svg.attr("transform", d3.event.transform);
        })
      );
    svg.append("g").attr("class", "links");
    svg.append("g").attr("class", "nodes");
    let simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("link", d3.forceLink().links(links))
      .on("tick", this.tiked);
  }
  componentDidUpdate(prevProps, pervState) {
    const { width, height } = this.props;
    const { nodes, links, add } = this.state;
    if (add) {
      let simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-20))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink().links(links))
        .on("tick", this.tiked);
    }
  }

  tiked = () => {
    this.updateNodesLinks();
  };
  updateNodesLinks = () => {
    const { nodes } = this.state;
    const { links } = this.state;
    let u = d3
      .select(".links")
      .selectAll("line")
      .data(links);

    const links2 = u
      .enter()
      .append("line")
      .merge(u)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "gray");

    u.exit().remove();

    u = d3
      .select(".nodes")
      .selectAll("circle")
      .data(nodes);
    u.enter()
      .append("circle")
      .merge(u)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 7)
      .attr("fill", d => d.color)
      .attr("fill-opacity", 0.5)
      .attr("stroke", "white")
      .attr("stroke-width", 2);
    //   .call(d3.drag().on("drag", dragged));
    // function dragged(d) {
    //   d.x = d3.event.x;
    //   d.y = d3.event.y;
    //   d3.select(this)
    //     .attr("cx", d.x)
    //     .attr("cy", d.y);
    //   links2
    //     .filter(function(l) {
    //       return l.source === d;
    //     })
    //     .attr("x1", d.x)
    //     .attr("y1", d.y);
    //   links2
    //     .filter(function(l) {
    //       return l.target === d;
    //     })
    //     .attr("x2", d.x)
    //     .attr("y2", d.y);
    // }

    u.exit().remove();
  };

  handleChange = e => {
    const { value, name } = e.target;
    if (name === "color") {
      if (value) e.target.style.background = value;
      else e.target.style = "";
    }
    this.setState(prev => ({
      input: { ...prev.input, [name]: value },
      add: false,
      error: ""
    }));
  };
  handleClick = () => {
    const { newName, color, source } = this.state.input;
    if (newName && color && source)
      this.setState(prev => ({
        nodes: [...prev.nodes, { id: prev.nodes.length, name: newName, color }],
        links: [...prev.links, { source, target: prev.nodes.length }],
        add: true,
        error: ""
      }));
    else this.setState({ error: "Please fill all field" });
  };
  render() {
    const { nodes, error } = this.state;
    const colors = [
      "red",
      "blue",
      "pink",
      "yellow",
      "orange",
      "gray",
      "violet",
      "thistle",
      "aliceblue",
      "antiquewhite",
      "aqua",
      "aquamarine",
      "yellowgreen"
    ];

    return (
      <div>
        <div id="chart" />
        <div className="content">
          <div className="element">
            <select
              onChange={this.handleChange}
              name="source"
              className="source"
            >
              <option>Select Persone</option>
              {nodes.map(ele => (
                <option key={ele.id} value={ele.id}>
                  {ele.name}
                </option>
              ))}
            </select>
          </div>
          <div className="element">
            <input
              type="text"
              name="newName"
              onChange={this.handleChange}
              className="name"
              placeholder="The name of friend"
            />
          </div>
          <div className="element">
            <select onChange={this.handleChange} name="color" className="color">
              {colors.map((ele, i) => (
                <option
                  key={i}
                  style={{ background: ele }}
                  value={ele}
                ></option>
              ))}
            </select>
          </div>

          <button onClick={this.handleClick}>Add</button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }
}
