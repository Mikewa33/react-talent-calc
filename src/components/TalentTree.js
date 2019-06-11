import React from 'react';
import Skill from './Skill';

class TalentTree extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // Figure out the background image for the talent tree
  getTreeBackgroundImage = () => {
    let classType = this.props.classType.toLowerCase();
    let tree = this.props.tree.name.toLowerCase().replace(/ /g,'-');
    let background = require(`./../images/backgrounds/background-${classType}-${tree}.jpg`);

    return {
      backgroundImage: `url("${background}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  // Map the skills for render
  mapSkills = () => {
    return this.props.tree.skills.map((skill) => {
      return <Skill 
        key={skill.id}
        skill={skill}
        constants={this.props.constants}
        tree={this.props.tree}
        classType={this.props.classType}
        currentSkillTier={this.props.tree.currentSkillTier}
        addToTalentPath = {this.props.addToTalentPath}
        availableSkillPoints={this.props.availableSkillPoints}
        increaseTreeSkillPoints={this.props.increaseTreeSkillPoints}
        decreaseTreeSkillPoints={this.props.decreaseTreeSkillPoints}
        increaseCurrentSkillTier={this.props.increaseCurrentSkillTier}
        decreaseCurrentSkillTier={this.props.decreaseCurrentSkillTier}
        decreaseAvailableSkillPoints = {this.props.decreaseAvailableSkillPoints}
        increaseRequiredLevel = {this.props.increaseRequiredLevel}
        checkSkillRequirements = {this.props.checkSkillRequirements}
        increaseAvailableSkillPoints = {this.props.increaseAvailableSkillPoints}
        decreaseRequiredLevel = {this.props.decreaseRequiredLevel}
        removeSkillFromTalentPath = {this.props.removeSkillFromTalentPath}
        upSkill = {this.props.upSkill}
        downSkill = {this.props.downSkill}
      />
    });
  }

  render () {
    return (
      <div className="talent-tree-panel">
        <div className="talent-tree-header">
          <h3 className="talent-tree-title">{this.props.tree.name} <span className="talent-tree-points">({this.props.tree.skillPoints})</span></h3>
          <span className="talent-tree-title reset" onClick={() => { this.props.resetTalentTree(this.props.tree.id) }}> Reset</span>
        </div>
        <div className="talent-tree" style={this.getTreeBackgroundImage()}>
          { this.mapSkills() }
        </div>
        
      </div>
    )
  }

}

export default TalentTree;