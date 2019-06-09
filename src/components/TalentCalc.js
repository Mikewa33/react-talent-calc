import React from 'react';
import "./../css/global.scss"
import ClassList from './../components/ClassList';
import ClassPanel from './../components/ClassPanel';

import data from '../data/talent-data.js';
import logo from "./../images/wow-classic-logo.png"

class TalentCalc extends React.Component {

  classPanelRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      classes: data.classes,
      constants: data.constants,
      currentClass: data.classes[0]
    }
  }

  // Used to reset the class panel and tell it which class talent trees to use
  // Not the best way to do it but we want Class Panel to track the tress not the whole calc
  onClassListChange = (id) => {
    this.classPanelRef.current.resetTalentTreeProp(this.state.classes[id].talentTrees);
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
    return (
    <div className="TalentCalc">
      <div>
        <img src={logo} className="logo" alt="logo"/>
			  <h1 className="main-title">Talent Planner</h1>
        <ul className="class-list">
          { this.mapClassList() }
        </ul>
        <ClassPanel 
          ref={this.classPanelRef}
          constants={this.state.constants} 
          classType={this.state.currentClass.name} 
          talentTrees={this.state.currentClass.talentTrees} 
        />
      </div>
    </div>)
  };
}

export default TalentCalc;