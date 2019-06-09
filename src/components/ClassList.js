import React from 'react';

class ClassList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      classIconImage: this.props.classType.name.toLowerCase(),
    }
  }

  // New class was selected pass up event to show change made
  isClassSelected() {
    if (this.props.classType.name === this.props.currentClass.name) {
      return (
        <span className="class-list-name">{ this.props.classType.name }</span>
      )
    } 
    else {
      return <span />
    }
  }

  render () {
    return <li onClick={() => this.props.onClick(this.props.classType.id)} className={this.props.currentClass.id === this.props.classType.id ? "active" : ""}>
      <img src={require(`./../images/class-icons/icon-${this.state.classIconImage}.jpg`)} alt={this.props.classType.name} />
      { this.isClassSelected() }
    </li>
  }
}

export default ClassList;