import React from 'react';

class Tooltip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // Check if there is a requirment amount and include it in the tool tip
  skillReqCheck = () => {
    if (this.props.skill.requirements && !this.props.skill.enabled) {
      var requirement = null;
      var spec_points = null;
      if (this.props.skill.requirements.skill) {
        requirement = <p className="tooltip-requirement">Requires {this.props.skill.requirements.skill.skillPoints} points in { this.props.skill.name } </p>
      }
      if (this.props.skill.requirements.specPoints) {
        spec_points = <p className="tooltip-requirement">Requires {this.props.skill.requirements.specPoints} points in { this.props.treeName } talents</p>
      }
      return (
        <div>
          { requirement }
          { spec_points }
        </div>
      )
    }
  }

  // See if it has a next rank or is at max rank
  hasNextRank = () => {
    if (this.props.skill.currentRank > 0 && this.props.skill.currentRank !== this.props.skill.maxRank) {
      return (
        <div>
          <p className="tooltip-next-rank">Next rank:</p>
        </div>
      )
    }
  }

  // Check if you can decrase the skill
  isValidDecrease = () => {
    if (this.props.isValidDecrease) {
      if (this.props.isMobile()) {
        return (
          <div>
            <p className="tooltip-mobile-message">Tap &amp; hold talent to remove</p>
          </div>
        )
      }
      else {
        return (
          <div>
            <p className="tooltip-mobile-message">Right click talent to remove</p>
          </div>
        )
      }
    }
  }

  render () {
    if (this.props.showTooltip && !this.props.skillFaded) {
      return (
        <div className="tooltip" style={this.props.tooltipPosition}>
          <h3 className="tooltip-skill-name">{this.props.skill.name}</h3>
          <p className="tooltip-rank-description">{this.props.skill.rankDescription[this.props.skill.currentRank-1]}</p>
          { this.skillReqCheck() }
          { this.hasNextRank() }
          <p className="tooltip-rank-description">{this.props.skill.rankDescription[this.props.skill.currentRank]}</p>
          { this.isValidDecrease() } 
        </div>
      )
    }
    else {
      return null
    }
  }

}

export default Tooltip;