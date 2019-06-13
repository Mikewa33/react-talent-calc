import React from 'react';
import './App.css';

import TalentCalc from './components/TalentCalc';
import logo from "./images/wow-classic-logo.png"

class App extends React.Component {

  classPanelRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      talentCalc: [
        <TalentCalc 
          key={0} 
          treeKey = {0}
          removeCalc = {this.removeCalc}
          hide = {false}
        />
      ]
    }
  }

  addTalentCacl = () => {
    let newTalentCalc = this.state.talentCalc;
    newTalentCalc.push(
    <TalentCalc 
      key = {this.state.talentCalc.length} 
      treeKey = {this.state.talentCalc.length}
      removeCalc = {this.removeCalc}
      hide = {false}
    />)
    this.setState({talentCalc: newTalentCalc})
  }

  mapTalentCalc = () => {
    return this.state.talentCalc.map((talentCalc, i) => {
      return <div key={i}>{talentCalc}</div>
    })
  }

  removeCalc = (treeKey) => {
    let newTalentCalc = this.state.talentCalc;
    newTalentCalc[treeKey] = <TalentCalc 
                              key = { newTalentCalc[treeKey].treeKey} 
                              treeKey = {newTalentCalc[treeKey].treeKey}
                              removeCalc = {this.removeCalc}
                              hide = {true}
                            />
    this.setState({talentCalc: newTalentCalc});
  }

  render() {
    return (<div className="App">
      <img src={logo} className="logo" alt="logo"/>
			<h1 className="main-title">Talent Planner</h1>
      <div>
        <div className="add" onClick ={() => {this.addTalentCacl() }}>
          Add Another Calculator
        </div>
       {this.mapTalentCalc()}
      </div>

    </div>)
  };
}

export default App;
