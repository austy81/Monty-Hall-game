var Moderator = React.createClass({
  render: function() {
    var currentRound = this.props.currentRound;
    var message = 'Choose your doorsx.';
    if(currentRound >= 2) message = 'I will make it easier for you.'
    return (
        <div className="row">
            <div className="col-sm-12">
                <div>Moderator:</div>
                <div id="moderator">{message}</div>
                <div>{currentRound}</div>
            </div>
        </div>
    );
  }
});

var Door = React.createClass({
  render: function() {

    var currentRound = this.props.currentRound; 
    var treasure = this.props.treasure; 
    var openedEmptyDoors = this.props.openedEmptyDoors; 
    var selectedByPlayer = this.props.selectedByPlayer;
    var nextRound = this.props.nextRound;

    return (
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">Doors X.</h3>
                    </div>
                    <div className="panel-body">
                        <div>CR = {currentRound}</div>
                        <div>T = {treasure}</div>
                        <div>OED = {openedEmptyDoors}</div>
                        <div>SBP = {selectedByPlayer}</div>
                        <button className="btn btn-info" onClick={this.props.nextRound}>Open</button>
                    </div>
                </div>
    );
  }
});

var Game = React.createClass({
    getInitialState: function() {
        return {
            secretTreasureDoors: 0,
            selectedDoorsByPlayer: 0,
            openedEmptyDoors: 0,
            currentRound: 1
        }
    },
    nextRound: function() {
        this.setState(
            {currentRound: this.state.currentRound+1 }
        );
    },
    render: function() {
        return (
        <div>
            <div className="row" id="doors">
                <div className="col-sm-1"></div>
                <div className="col-sm-2">
                    <Door 
                        currentRound={this.state.currentRound} 
                        treasure={this.state.secretTreasureDoors == 1} 
                        openedEmptyDoors={this.state.openedEmptyDoors} 
                        selectedByPlayer={this.state.selectedDoorsByPlayer==1} 
                        nextRound={this.nextRound} />
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-2">
                    <Door 
                        currentRound={this.state.currentRound} 
                        treasure={this.state.secretTreasureDoors == 2} 
                        openedEmptyDoors={this.state.openedEmptyDoors} 
                        selectedByPlayer={this.state.selectedDoorsByPlayer==2} 
                        nextRound={this.nextRound} />
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-2">
                    <Door 
                        currentRound={this.state.currentRound} 
                        treasure={this.state.secretTreasureDoors == 3} 
                        openedEmptyDoors={this.state.openedEmptyDoors} 
                        selectedByPlayer={this.state.selectedDoorsByPlayer==3} 
                        nextRound={this.nextRound} />
                </div>
                <div className="col-sm-1"></div>
            </div> 
            <Moderator currentRound={this.state.currentRound}/>
        </div> 
        );
    }
});

ReactDOM.render(
  <Game/>,
  document.getElementById('container')
);