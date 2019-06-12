import React from 'react';
import TalentTree from './TalentTree';

import { createBrowserHistory } from 'history';

const queryString = require('query-string');
const history = createBrowserHistory();

class ClassPanel extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      availableSkillPoints: 51,
      isInEditMode: false,
      requiredLevel: 0,
      talentPath: {"title": "Skill Tree", "classType": this.props.classType, "talents": []},
      talentTrees: this.props.talentTrees
    }
  }

  componentDidMount() {
    // Parse URL
    let availableSkillPoints = 51;
    let requiredLevel = 9;
    let parsed = queryString.parse(history.location.search);
    let currentTrees = this.state.talentTrees;
    let sharedData;

    if (parsed.talents) {
      sharedData = JSON.parse(parsed.talents);

      sharedData.talents.forEach((tree) => {
        currentTrees.forEach((currentTree, i) => {
          if (currentTree.id === tree.id) {
            currentTree.skills.forEach((skill, j) => {
              tree.skills.forEach((savedSkill) => {
                if (skill.id === savedSkill.id) {
                  skill.currentRank = savedSkill.rank;
                  skill.enabled = savedSkill.rank > 0 ? true : false;
                  availableSkillPoints = availableSkillPoints - savedSkill.rank;
                  requiredLevel = requiredLevel + savedSkill.rank;
                  currentTree.skillPoints = currentTree.skillPoints + savedSkill.rank;
                  
                  currentTree.skills[j] = skill;
                }
              })
            })
            currentTrees[i] = currentTree
          }
        })
      })
    } 
    else {
      sharedData = {"title": "Skill Tree", "classType": this.props.classType, "talents": []};
    }

    if (requiredLevel === 9) {
      requiredLevel = 0;
    }

    this.setState({talentTrees: currentTrees, availableSkillPoints: availableSkillPoints, requiredLevel: requiredLevel, talentPath: sharedData})
    
  }

  copyUrl = () => {
    let url = window.location.href;
    // This is a hack to get the url copy working. We make a fake text area and populate it with the url and remove it after the copy
    var textarea = document.createElement('textarea');
    textarea.textContent = url;
    document.body.appendChild(textarea);
    var selection = document.getSelection();
    var range = document.createRange();
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("copy");

    document.body.removeChild(textarea);
  }

  // Called from Talent Calc and is used to make sure skillPoints and reqLevel are correct for the new Trees
  resetTalentTreeProp = (talentTrees, currentClass) => {
    let skillPoints = 51;
    let reqLevel = 9;

    talentTrees.forEach((tree) => {
      skillPoints = skillPoints - tree.skillPoints;
      reqLevel = reqLevel + tree.skillPoints;
    });

    reqLevel = reqLevel === 9 ? 0 : reqLevel;
    this.setState({talentTrees: talentTrees, availableSkillPoints: skillPoints, requiredLevel: reqLevel, talentPath: {"title": "Skill Tree", "classType": currentClass.name, "talents": []}})
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
      this.removeTreeFromTalentPath(treeId);
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
  addToTalentPath = (treeId, skill) => {
    let currentPath = this.state.talentPath;
    let treeNeeded;
    let treeIndex;
    let foundTree = false;
    currentPath.talents.forEach((tree, i) => {
      if (tree.id === treeId) {
        foundTree = true;
        treeNeeded = tree;
        treeIndex = i;
      }
    })

    if (foundTree) {
      let skillNotFound = true;
      treeNeeded.skills.forEach((treeSkill, i) => {
        if (treeSkill.id === skill.id) {
          skillNotFound = false;
          treeSkill.rank = skill.currentRank;
          treeNeeded.skills[i] = treeSkill;
        }
      })
      
      if (skillNotFound) {
        treeNeeded.skills.push({id: skill.id, rank: skill.currentRank})
      }
      currentPath.talents[treeIndex] = treeNeeded;
    }
    else {
      currentPath.talents.push({ id: treeId, skills: [{id: skill.id, rank: skill.currentRank}]})
    }
    
    this.setState({talentPath: currentPath});
    history.push({
      pathname: '/',
      search: `?talents=${JSON.stringify(this.state.talentPath)}`
    });
  }

  // Remove a skill from the users selected skills
  removeSkillFromTalentPath = (treeId, skill) => {
    let currentPath = this.state.talentPath;
    let treeNeeded;
    let treeIndex;
    let foundTree = false;

    currentPath.talents.forEach((tree, i) => {
      if (tree.id === treeId) {
        foundTree = true;
        treeNeeded = tree;
        treeIndex = i;
      }
    });

    if (foundTree) {
      treeNeeded.skills.forEach((treeSkill, i) => {
        if (treeSkill.id === skill.id) {
          if (skill.currentRank === 0)
          {
            treeNeeded.skills.splice(i, 1)
          }
          else {
            treeSkill.rank = skill.currentRank;
            treeNeeded.skills[i] = treeSkill;
          }
        }
      })

      currentPath.talents[treeIndex] = treeNeeded;
    }

    this.setState({talentPath: currentPath});
    history.push({
      pathname: '/',
      search: `?talents=${JSON.stringify(this.state.talentPath)}`
    });
  }

  // Remove a whole tree from the selected pass this is called on a reset
  removeTreeFromTalentPath = (treeId) => {
    let currentPath = this.state.talentPath;
    let treeIndex;

    currentPath.talents.forEach((tree, i) => {
      if (tree.id === treeId) {
        treeIndex = i;
      }
    });

    currentPath.talents.splice(treeIndex, 1);
    this.setState({talentPath: currentPath});
    history.push({
      pathname: '/',
      search: `?talents=${JSON.stringify(this.state.talentPath)}`
    });
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

  updateTitle = (event) => {
    let currentPath = this.state.talentPath;
    currentPath.title = event.target.value;

    this.setState({ talentPath: currentPath})
    history.push({
      pathname: '/',
      search: `?talents=${JSON.stringify(this.state.talentPath)}`
    });
  }

  changeEditMode = () => {
    this.setState({ isInEditMode: !this.state.isInEditMode})
  }

  renderTitleEdit = () => {
    if (this.state.isInEditMode) {
      return (<div className="talent-title">
        <input type="text" onChange = {(event) => {this.updateTitle(event)}} defaultValue={this.state.talentPath.title} />
        <button onClick = {() => {this.changeEditMode()}}>X</button>
      </div>)
    }
    else {
      return (<div className="talent-title" onClick = {() => {this.changeEditMode()}}>
        { this.state.talentPath.title }
      </div>)
    }
  }

  render () {
    return (
      <div>
        <div className="talent-toolbar">
          <div className="talent-info">
            <p className="talent-info-stat">Skill points: {this.state.availableSkillPoints}</p>
            <p className="talent-info-stat">Required level: {this.state.requiredLevel}</p>
          </div>
          { this.renderTitleEdit() }
          <div className="talent-actions">
            <div className="talent-shared" onClick = {() => { this.copyUrl() }}>
              Share Talent Trees
            </div>
            <div className="talent-remove" onClick = {() => { this.props.removeCalc(this.props.treeKey )}}>
              Remove Calculator
            </div>
          </div>
        </div>
        
        <div className={ this.state.requiredLevel === 60 ? "talent-trees is-max-level" : "talent-trees" }>
          { this.talentTrees() }
        </div>
      </div>
    )
  }

}

export default ClassPanel;