import React from 'react';
import TalentTree from './TalentTree';

class ClassList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      availableSkillPoints: 51,
      requiredLevel: 0,
      talentPath: [],
      talentTrees: this.props.talentTrees
    }
  }

  // Called from Talent Calc and is used to make sure skillPoints and reqLevel are correct for the new Trees
  resetTalentTreeProp = (talentTrees) => {
    let skillPoints = 51;
    let reqLevel = 9;

    talentTrees.forEach((tree) => {
      skillPoints = skillPoints - tree.skillPoints;
      reqLevel = reqLevel + tree.skillPoints;
    });

    reqLevel = reqLevel === 9 ? 0 : reqLevel;
    this.setState({talentTrees: talentTrees, availableSkillPoints: skillPoints, requiredLevel: reqLevel})
  }

  // Called when the user selects to reset a single Tree of the tree
  resetTalentTree = (treeId) => {
    let currentTrees = this.state.talentTrees;
    let changeMade = false;

    currentTrees.forEach((tree, i) => {
			if (tree.id === treeId) {
        changeMade = true;
        this.increaseAvailableSkillPoints(tree.skillPoints);
        this.decreaseRequiredLevel(tree.skillPoints);
        tree.skillPoints = 0;
        tree.currentSkillTier = 0;

        tree.skills.forEach((skill, j) => {
          skill.currentRank = 0;
          if(skill.requirements){
            skill.enabled = false;
          }
          tree.skills[j] = skill
        });

        currentTrees[i] = tree;
      }
    });

    if (changeMade) {
      this.setState({talentTrees: currentTrees});
    }
  }

  // A talent was selected availableSkillPoints goes down
  decreaseAvailableSkillPoints = () => {
    this.setState({ availableSkillPoints: this.state.availableSkillPoints - 1 })
  }

  // A talent was deselected availableSkillPoints goes up
  increaseAvailableSkillPoints = (points) => {
    this.setState({ availableSkillPoints: this.state.availableSkillPoints + points })
  }

  // A talent was select so req level goes up
  increaseRequiredLevel = () => {
    if (this.state.requiredLevel === 0) {
      this.setState({requiredLevel: 10 });
    }
    else {
      this.setState({requiredLevel: this.state.requiredLevel + 1 })
    }

    this.checkMaxLevel();
  }

  // A talent was deselected so req level goes down
  decreaseRequiredLevel = (points) => {
    let requiredCheck = this.state.requiredLevel - points;

    if (requiredCheck < 10) {
      this.setState({ requiredLevel: 0});
    } 
    else {
      this.setState({ requiredLevel: requiredCheck });
    }
  }

  // Add to the users selected path. This path is across all classes and trees
  addToTalentPath = (treeId, skillId, skillIcon) => {
    let currentPath = this.state.talentPath;
    currentPath.push({treeId, skillId, skillIcon, faded : false})
    this.setState({talentPath: currentPath})
  }

  // Remove a skill from the users selected skills
  removeSkillFromTalentPath = (treeId, skillId) => {
    let currentPath = this.state.talentPath;
    let talentPathItemIndex = "";

    currentPath.forEach((talentPathItem, i) => {
      if(talentPathItem.treeId === treeId && talentPathItem.skillId === skillId){
        talentPathItemIndex = i;
      }
    });

    if (typeof talentPathItemIndex === 'number') {
      currentPath.splice(talentPathItemIndex, 1)
      this.setState({talentPath: currentPath})
    }
  }

  // Remove a whole tree from the selected pass this is called on a reset
  removeTreeFromTalentPath = (treeId) => {
    let currentPath = this.state.talentPath;
    let changeMade = false;

    currentPath.forEach((talentPathItem, i) => {
			if (talentPathItem.treeId === treeId) {
        changeMade = true;
				currentPath.splice(i, 1);
      }
    });
    
    if (changeMade) {
      this.setState({talentPath: currentPath});
    }
  }

  // Skill was selected update the tree skill count
  upSkill = (treeId, skillId) => {
    let currentTrees = this.state.talentTrees;
    let changeMade = false;

    currentTrees.forEach((tree, i) => {
			if(tree.id === treeId){
        changeMade = true;
        tree.skills[skillId].currentRank = tree.skills[skillId].currentRank + 1;
      }
      
      currentTrees[i] = tree
		});

    if (changeMade) {
      this.setState({talentTrees: currentTrees});
    }
  }

  // Skill was deselected update the tree skill count
  downSkill = (treeId, skillId) => {
    let currentTrees = this.state.talentTrees;
    let changeMade = false;

    currentTrees.forEach((tree, i) => {
			if(tree.id === treeId){
        changeMade = true;
        tree.skills[skillId].currentRank = tree.skills[skillId].currentRank - 1;
      }
      
      currentTrees[i] = tree
		});

    if (changeMade) {
      this.setState({talentTrees: currentTrees});
    }
  }

  // After a skill is selected we want to take a look at the tree and see if any new skills should show as selectable
  checkSkillRequirements = (treeId) => {
    let currentTrees = this.state.talentTrees;
    let changeMade = false;

    currentTrees.forEach((tree, i) => {
			if (tree.id === treeId) {
        tree.skills.forEach((skill, j) => {
          if (skill.requirements) { 
            if (skill.requirements.specPoints && skill.requirements.skill) {
              if (tree.skillPoints >= skill.requirements.specPoints) {
                let requiredSkill = tree.skills[skill.requirements.skill.id]

                if (requiredSkill.currentRank === skill.requirements.skill.skillPoints) {
									skill.enabled = true;
                } 
                else {
									skill.enabled = false;
								}
              }
              else {
                skill.enabled = false;
              }
            }
            else if (skill.requirements.specPoints) {
              if (tree.skillPoints >= skill.requirements.specPoints) {
                skill.enabled = true;
              } 
              else {
                skill.enabled = false;
              }
            }
            else if (skill.requirements.skill) {
              let requiredSkill = tree.skills[skill.requirements.skill.id];

              if (requiredSkill.currentRank === skill.requirements.skill.skillPoints) {
                skill.enabled = true;
              } 
              else {
                skill.enabled = false;
              }
            }
          }
          // Set the skill back on the tree now updated
          tree.skills[j] = skill
        });
      }
      // Set the tree back into the set of trees
      currentTrees[i] = tree
    });

    if (changeMade) {
      this.setState({talentTrees: currentTrees});
    }
  }

  // After a skill is selected we check if the max level has been reached
  checkMaxLevel = () => {
    let currentTree = this.state.talentTrees;

    if (this.state.requiredLevel === 60) {
      currentTree.forEach((tree, i) => {
        tree.skills.forEach((skill, j) => {
          if (skill.currentRank === 0) {
            skill.faded = true;
          }
          tree.skills[j] = skill
        });
        currentTree[i] = tree
      });
    }
    else if (this.state.requiredLevel === 59) {
      currentTree.forEach((tree,i) => {
        tree.skills.forEach((skill, j) => {
          skill.faded = false;
          tree.skills[j] = skill
        });
        currentTree[i] = tree
      });
    }

    this.setState({talentTrees: currentTree});
  }

  // Skill was selected update the tree skillPoint count
  increaseTreeSkillPoints = (treeId) => {
    let currentTrees = this.state.talentTrees;
    let changeMade = false;

    currentTrees.forEach((tree, i) => {
			if (tree.id === treeId) {
        changeMade = true;
				tree.skillPoints++;
      }
      
      currentTrees[i] = tree
		});

    if (changeMade) {
      this.setState({talentTrees: currentTrees});
    }
  }

  // Skill was deselected update the tree skillPoint count
  decreaseTreeSkillPoints = (treeId) => {
    let currentTrees = this.state.talentTrees;
    let changeMade = false;

    currentTrees.forEach((tree, i) => {
			if (tree.id === treeId) {
        changeMade = true;
				tree.skillPoints--;
      }
      
      currentTrees[i] = tree
		});

    if (changeMade) {
      this.setState({talentTrees: currentTrees});
    }
  }

  // Check if when the skill was selected does it open the next tier
  increaseCurrentSkillTier = (treeId, tier) => {
    let currentTrees = this.state.talentTrees;
    let changeMade = false;

    currentTrees.forEach((tree, i) => {
			if (tree.id === treeId) {
        if (tier > tree.currentSkillTier) {
          changeMade = true;
          tree.currentSkillTier = tier;
        }
      }
      
      currentTrees[i] = tree
		});

    if (changeMade) {
      this.setState({talentTrees: currentTrees});
    }
  }

  // Check if when the skill was deselected does it close the next tier
  decreaseCurrentSkillTier = (treeId, tier) => {
    let currentTrees = this.state.talentTrees;
    let changeMade = false;

    let tierSkillPoints = 0;

    currentTrees.forEach((tree, i) => {
			if(tree.id === treeId){
        tree.skills.forEach((skill) => {
          if (skill.position[0] === tier) {
						tierSkillPoints = tierSkillPoints + skill.currentRank;
					}
        })

        if (tierSkillPoints === 0) {
          changeMade = true;
          tree.currentSkillTier = tier - 1;
        }
      }
      
      currentTrees[i] = tree
		});

    if (changeMade) {
      this.setState({talentTrees: currentTrees});
    }
  }

  // Map the 3 trees
  talentTrees = () => {
    return this.state.talentTrees.map((tree) => {
      return <TalentTree
                key = {tree.id} 
                availableSkillPoints = {this.state.availableSkillPoints}
                tree = {tree} 
                constants = {this.props.constants}
                decreaseAvailableSkillPoints = {this.decreaseAvailableSkillPoints}
                increaseAvailableSkillPoints = {this.increaseAvailableSkillPoints}
                decreaseRequiredLevel = {this.decreaseRequiredLevel}
                increaseRequiredLevel = {this.increaseRequiredLevel}
                addToTalentPath = {this.addToTalentPath}
                removeSkillFromTalentPath = {this.removeSkillFromTalentPath}
                removeTreeFromTalentPath = {this.removeTreeFromTalentPath}
                increaseTreeSkillPoints = {this.increaseTreeSkillPoints}
                increaseCurrentSkillTier = {this.increaseCurrentSkillTier}
                checkSkillRequirements = {this.checkSkillRequirements}
                decreaseTreeSkillPoints = {this.decreaseTreeSkillPoints}
                decreaseCurrentSkillTier = {this.decreaseCurrentSkillTier}
                upSkill = {this.upSkill}
                downSkill = {this.downSkill}
                classType = {this.props.classType}
                resetTalentTree = {this.resetTalentTree}
              />
    })
  }

  render () {
    return (
      <div>
        <div className="talent-toolbar">
          <div className="talent-info">
            <p className="talent-info-stat">Skill points: {this.state.availableSkillPoints}</p>
            <p className="talent-info-stat">Required level: {this.state.requiredLevel}</p>
          </div>
        </div>
        <div className={ this.state.requiredLevel === 60 ? "talent-trees is-max-level" : "talent-trees" }>
          { this.talentTrees() }
        </div>
      </div>
    )
  }

}

export default ClassList;