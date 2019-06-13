import React from 'react';
import "./../css/global.scss"
import ClassList from './../components/ClassList';
import ClassPanel from './../components/ClassPanel';

import TalentData from './../data/talent-data.js';

import { createBrowserHistory } from 'history';

const queryString = require('query-string');
const history = createBrowserHistory();

class TalentCalc extends React.Component {

  classPanelRef = React.createRef();

  constructor(props) {
    super(props);
    let parsed = queryString.parse(history.location.search);
    let loadData = JSON.parse(JSON.stringify(TalentData));
    let currentClassId = 0;
    // Parse json in the params
    if (parsed.talents) {
      let talents = JSON.parse(parsed.talents);
      
      if (talents.classType) {
        loadData.classes.forEach(setClass => {
          if (setClass.name === talents.classType) {
            currentClassId = setClass.id
          }
        });
      }
      else {
        currentClassId = 0
      }
    }

    this.state = {
      classes: loadData.classes,
      constants: loadData.constants,
      currentClass: loadData.classes[currentClassId]
    }
  }

  // Used to reset the class panel and tell it which class talent trees to use
  // Not the best way to do it but we want Class Panel to track the tress not the whole calc
  onClassListChange = (id) => {
    this.classPanelRef.current.resetTalentTreeProp(this.state.classes[id].talentTrees, this.state.classes[id]);
    this.setState({ currentClass: this.state.classes[id]})
  }

  mapClassList() {
    return this.state.classes.map((item) => {
      return <ClassList
                key={item.id} 
                classType={item} 
                constants={this.state.constants} 
                currentClass={this.state.currentClass} 
                onClick={this.onClassListChange}
              />
    })
  }

  render() {
    console.log(this.props)
    if (!this.props.hide) {
      return (
        <div className="TalentCalc">
          <div>  
            <div className="class-buttons">
              <ul className="class-list">
                { this.mapClassList() }
              </ul>
            </div>
            <div className="talent-section">
              <ClassPanel 
                ref = {this.classPanelRef}
                constants = {this.state.constants} 
                classType = {this.state.currentClass.name} 
                talentTrees = {this.state.currentClass.talentTrees} 
                removeCalc = {this.props.removeCalc}
                treeKey = {this.props.treeKey}
              />
            </div>
          </div>
          <hr />
        </div>
      )
    }
    else {
      return <div></div>
    }
  }
}

export default TalentCalc;