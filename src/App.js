import React from 'react';
import './App.css';

import TalentCalc from './components/TalentCalc';
import logo from "./images/wow-classic-logo.png"

class App extends React.Component {

  classPanelRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      talentCalc: [<TalentCalc key={0}/>]
    }
  }

  addTalentCacl = () => {
    let newTalentCalc = this.state.talentCalc;
    newTalentCalc.push(<TalentCalc key={this.state.talentCalc.length}/>)
    this.setState({talentCalc: newTalentCalc})
  }

  mapTalentCalc = () => {
    return this.state.talentCalc.map((talentCalc, i) => {
      return <div key={i}>{talentCalc}</div>
    })
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
