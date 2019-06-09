import React from 'react';
import './App.css';

import TalentCalc from './components/TalentCalc';

class App extends React.Component {

  classPanelRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      talentCalc: [<TalentCalc key={0}/>]
    }
  }

  /* DOESNT WORK CAUSE ALL DATA IS SHARED CURRENTLY addTalentCacl = () => {
    /let newTalentCalc = this.state.talentCalc;
    newTalentCalc.push(<TalentCalc key={this.state.talentCalc.length}/>)
    this.setState({talentCalc: newTalentCalc})
  }*/

  render() {
    return (<div className="App">
      <div>
       {this.state.talentCalc}
      </div>

    </div>)
  };
}

export default App;
