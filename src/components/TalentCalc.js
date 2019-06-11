import React from 'react';
import "./../css/global.scss"
import ClassList from './../components/ClassList';
import ClassPanel from './../components/ClassPanel';

import TalentData from './../data/talent-data.js';

class TalentCalc extends React.Component {

  classPanelRef = React.createRef();

  constructor(props) {
    super(props);
    // React caches imports. This would cause all the trees to share data. This gets a fresh import
    let loadData = JSON.parse(JSON.stringify(TalentData));
    this.state = {
      classes: loadData.classes,
      constants: loadData.constants,
      currentClass: loadData.classes[0]
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
        <div className="class-buttons">
          <ul className="class-list">
            { this.mapClassList() }
          </ul>
        </div>
        <div className="talent-section">
          <ClassPanel 
            ref={this.classPanelRef}
            constants={this.state.constants} 
            classType={this.state.currentClass.name} 
            talentTrees={this.state.currentClass.talentTrees} 
          />
        </div>
      </div>
      <hr />
    </div>)
  };
}

export default TalentCalc;