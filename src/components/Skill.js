import React from 'react';
import Tooltip from './Tooltip';

class Skill extends React.Component {

  constructor(props) {
    super(props);
    this.skillRef = React.createRef();

    this.state = {
      showTooltip: false,
			tooltipPosition: {
				'left': '100%',
      },
    }  
  }

  isValidDecrease = () => {
    if(this.props.skill.currentRank == 0){
      return false;
    }
    if(this.hasAdjacentSkillRequirement()){
      return false;
    }
    if(this.props.skill.requirements) {
      if(this.props.skill.requirements.specPoints < this.props.tree.skillPoints - 1){
        return true;
      }
    }
    if(this.props.skill.position[0] == this.props.currentSkillTier){
      return true;
    }
    else {
      return false;
    } 
      
  }

  onIncreaseSkillRank = () => {
    if(this.props.skill.enabled && this.props.availableSkillPoints > 0) {
      if(this.props.skill.currentRank < this.props.skill.maxRank){
        this.props.upSkill(this.props.tree.id, this.props.skill.id)
        this.props.decreaseAvailableSkillPoints();
        this.props.increaseRequiredLevel();
        this.props.addToTalentPath(this.props.tree.id, this.props.skill.id, this.props.skill.skillIcon);
        this.props.increaseTreeSkillPoints(this.props.tree.id);
        this.props.increaseCurrentSkillTier(this.props.tree.id, this.props.skill.position[0]);
        this.props.checkSkillRequirements(this.props.tree.id);
      }
    }
  }

  onDecreaseSkillRank = (event) => {
    event.preventDefault();
    if(this.isValidDecrease()){
      this.props.downSkill(this.props.tree.id, this.props.skill.id)
      this.props.increaseAvailableSkillPoints(1);
      this.props.decreaseRequiredLevel(1);
      this.props.removeSkillFromTalentPath(this.props.tree.id, this.props.skill.id);
      this.props.decreaseTreeSkillPoints(this.props.tree.id);
      this.props.decreaseCurrentSkillTier(this.props.tree.id, this.props.skill.position[0]);
      this.props.checkSkillRequirements(this.props.tree.id);
    }
  }

  hasAdjacentSkillRequirement = () => {
    let adjacentSkill = this.props.tree.skills[this.props.skill.id + 1];
    if(adjacentSkill && adjacentSkill.requirements && adjacentSkill.requirements.skill){
      return adjacentSkill.requirements.skill.id === this.props.skill.id && adjacentSkill.currentRank > 0;
    } 
    else {
      return false;
    }
  }

  isMobile() {
    let windowWidth = window.innerWidth;
    if(windowWidth <= 700)
      return true;
    else 
      return false;
  }

  onShowTooltip = () => {
    if (this.skillRef.current) {
      let positionLeft = this.skillRef.current.getBoundingClientRect().left;
      let windowWidth = window.innerWidth;
      let distanceFromRightOfScreen = windowWidth - positionLeft;
      let tooltipWidth = 360;
      if(this.isMobile()){
        this.setState({
          showTooltip: true,
          tooltipPosition: {'left': -positionLeft + (windowWidth - tooltipWidth) / 2 + 'px'}
        })
      } else {
        if(distanceFromRightOfScreen < (tooltipWidth + 80)){
          this.setState({
            showTooltip: true,
            tooltipPosition: {'left': 'initial', 'right': '100%'}
          })
        } 
        else {
          this.setState({
            showTooltip: true,
            tooltipPosition: {'left': 100 + '%'}
          })
        }
      }
    }
  }

  onHideTooltip = () => {
    this.setState({ showTooltip: false });
  }

  getGridPosition = () => {
    if (this.props.skill.position !== 'undefined')
    {
      return {
        gridRowStart: this.props.skill.position[0],
        gridColumnStart: this.props.skill.position[1],
      }
    }
  }

  skillIcon = () => {
    let classType = this.props.classType.toLowerCase();
    let treeName = this.props.tree.name.replace(/ /g,'-').toLowerCase();
    let skillName = this.props.skill.name.replace("'","").replace(':','').replace(/ /g,'-').replace('(','').replace(')','').toLowerCase()
    return require(`./../images/skill-icons/${classType}/${treeName}/${skillName}.jpg`)
  }

  skillRequirementArrow = () => {
    if(this.props.skill.requirements && this.props.skill.requirements.skill){
      let requiredSkill = this.props.tree.skills[this.props.skill.requirements.skill.id],
						cssClassName = [],
						arrowYDistance = this.props.skill.position[0] - requiredSkill.position[0],
            arrowXDistance = this.props.skill.position[1] - requiredSkill.position[1];
      if(arrowYDistance == 1){
        cssClassName = "down-arrow";
      } else if(arrowYDistance == 2){
        cssClassName = "down-arrow medium-arrow";
      } else if(arrowYDistance == 3){
        cssClassName = "down-arrow large-arrow";
      }

      if(arrowXDistance == 1){
        cssClassName = "side-arrow";
      }
      if(arrowYDistance == 1 && arrowXDistance == 1){
        cssClassName = "corner-arrow";
      }
      return cssClassName;
    }
    return ""
  }

  render () {
    let classes = "skill " + this.skillRequirementArrow()
    classes = classes + (this.props.skill.enabled ? " is-enabled" : "")
    classes = classes + (this.props.skill.currentRank ===  this.props.skill.maxRank ? " is-max-rank" : "")
    classes = classes + (this.props.skill.faded ? " is-faded" : "")
    return (
      <div className={classes} style={ this.getGridPosition()  } ref={this.skillRef}>
        <div className="skill-icon" onClick={() => {this.onIncreaseSkillRank() }} onContextMenu={(event) => { this.onDecreaseSkillRank(event) }}onMouseEnter={() => { this.onShowTooltip() }} onMouseLeave = {() =>{ this.onHideTooltip() }}>
          <img src={ this.skillIcon() } className="skill-icon-image" alt={this.props.skill.name} />
        </div>
        <span className="skill-rank">{this.props.skill.currentRank}/{this.props.skill.maxRank}</span>
        <Tooltip 
          skill = { this.props.skill } 
          showTooltip = { this.state.showTooltip }
          skillFaded = { this.props.skill.faded }
          tooltipPosition = { this.state.tooltipPosition }
          isValidDecrease = { this.isValidDecrease }
          treeName = { this.props.tree.name }
          isMobile = { this.isMobile }
        />
      </div>
    )
  }

}

export default Skill;