import React from 'react';
import logo from './logo.svg';
import './App.css';
import "./css/global.scss"
import ClassList from './components/ClassList';
import ClassPanel from './components/ClassPanel';

import talentData from './data/talent-data.json';
import logo2 from "./images/wow-classic-logo.png"

class App extends React.Component {

  classPanelRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      classes: talentData.classes,
      constants: talentData.constants,
      currentClass: talentData.classes[0]
    }
  }

  componentDidMount() {

  }

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
    return (<div className="App">
      <div>
        <img src={logo2} className="logo" alt="logo"/>
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

export default App;
