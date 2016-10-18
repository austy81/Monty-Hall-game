var Summary = React.createClass({
    _renderChart: function(data) {
        this.chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: data,
                type: 'pie'
            }
        });
    },
    componentDidMount: function () {
        var data = [
            ['stick', 0],
            ['change', 0]
        ];
        this._renderChart(data);
    },
    componentWillReceiveProps: function (newProps) {
        var stickRatio = newProps.totalWinsChangeStrategy / newProps.totalGamesChangeStrategy;
        var changeRatio = newProps.totalWinsStickStrategy / newProps.totalGamesStickStrategy;
        this.chart.load({
            columns: [
            ['stick', stickRatio],
            ['change', changeRatio]
        ]
        }); // or whatever API you need
    },
    render: function() {
        return (
            <div className='panel panel-info'>
                <div className='panel-heading'>Wins strategy summary</div>
                <div className='panel-body'>
                    <div className='col-sm-12'>
                        <div className='col-sm-6'>Change:</div>
                        <div className='col-sm-6'>{this.props.totalWinsChangeStrategy}/{this.props.totalGamesChangeStrategy}</div>
                        <div className='col-sm-6'>Stick:</div>
                        <div className='col-sm-6'>{this.props.totalWinsStickStrategy}/{this.props.totalGamesStickStrategy}</div>
                    </div>
                    <div id="chart"></div>
                </div>
            </div>
        );
    }
});

var Moderator = React.createClass({
  onRestartClick: function() {
    this.props.restartGame();
  },
  render: function() {
    var currentRound = this.props.currentRound;

    var message;
    switch (currentRound) {
        case 1:
            message = 'Choose your doors.';
            break;
        case 2:
            message = 'I will make it easier for you.\n Behind the doors number ' + this.props.openedEmptyDoors + ' is nothing.'
            break;
        case 3:
            message = 'Sorry, you have lost. :-(';
            if(this.props.won) message = 'Congrats! The car is yours.';
            break;
    }

    var wellStyle = {
        maxHeight: '153px',
        minHeight: '153px'
    };

    return (
            <div className="well" style={wellStyle}>
                <div><em>Moderator:</em></div>
                <h3>{message}</h3>
                { currentRound == 3 ? <button className="btn btn-default" onClick={this.onRestartClick}>Restart</button> : null}
            </div>
        
    );
  }
});

var Door = React.createClass({
  onNextRoundClick: function(selectedDoors) {
       this.props.nextRound(selectedDoors);
  },
  render: function() {

    var doorNumber = this.props.doorNumber; //[1,2,3]
    var currentRound = this.props.currentRound; //1-3

    //bools
    var treasure = this.props.treasure; 
    var openedEmptyDoors = this.props.openedEmptyDoors; 
    var selectedByPlayer = this.props.selectedByPlayer;
    
    //funtions
    var nextRound = this.props.nextRound;
    
    var className = "panel panel-";
    switch(currentRound) {
    case 1:
        className += "primary";
        break;
    case 2:
        if(selectedByPlayer) className += "warning";
        else if(openedEmptyDoors) className += "default";
        else className += "primary";
        break;
    default:
        if(selectedByPlayer && treasure)   className += "success";
        if(selectedByPlayer && !treasure)   className += "danger";
        if(openedEmptyDoors) className += "default";
        if(!selectedByPlayer && !openedEmptyDoors) className += "primary";
    }

    var showOpenButton = true;
    if(currentRound==3) showOpenButton = false;
    if(currentRound==2 && openedEmptyDoors) showOpenButton = false;
    
    var divStyle = {
        maxHeight: '100px',
        minHeight: '100px'
    };
    return (
                <div className={className}>
                    <div className="panel-heading">
                        <h3 className="panel-title">Doors {doorNumber}</h3>
                    </div>
                    <div className="panel-body" style={divStyle} >
                        { showOpenButton ? <button className="btn btn-info" onClick={this.onNextRoundClick.bind(this,doorNumber)}>Open</button> : null}
                    </div>
                </div>
    );
  }
});

var Game = React.createClass({
    getInitialState: function() {
        return {
            secretTreasureDoors: Math.floor(Math.random() * 3) + 1,
            selectedDoorsByPlayer: 0,
            openedEmptyDoors: 0,
            currentRound: 1,
            playersStrategyChange: false,
            totalWinsChangeStrategy: 0,
            totalGamesChangeStrategy: 0,
            totalWinsStickStrategy: 0,
            totalGamesStickStrategy: 0
        }
    },
    nextRound: function(selectedDoors) {

        this.setState(
            {
                currentRound: this.state.currentRound + 1,
                selectedDoorsByPlayer: selectedDoors,
                playersStrategyChange: (this.state.currentRound == 2 && this.state.selectedDoorsByPlayer != selectedDoors) ? true : this.state.playersStrategyChange
            }
        );

        if(selectedDoors && this.state.currentRound == 1)
        {
            var doorsToOpen = [1,2,3];
            var indexOfSelected = selectedDoors - 1;
            doorsToOpen.splice(indexOfSelected,1);
            var indexOfTreasure = doorsToOpen.indexOf(this.state.secretTreasureDoors);
            if(indexOfTreasure > -1) doorsToOpen.splice(indexOfTreasure,1);

            var openedEmptyDoors = 0;
            if(doorsToOpen.length == 1) {
                openedEmptyDoors = doorsToOpen[0];
            }
            else {
                var randomDoorToOpen = Math.floor(Math.random() * 2);
                openedEmptyDoors = doorsToOpen[randomDoorToOpen];
            }

            this.setState({
                openedEmptyDoors: openedEmptyDoors
            });
        }
      
    },
    restartGame: function() {
        var win = this.state.selectedDoorsByPlayer == this.state.secretTreasureDoors;
        var changed = this.state.playersStrategyChange;

        this.setState(
            {
                secretTreasureDoors: Math.floor(Math.random() * 3) + 1,
                selectedDoorsByPlayer: 0,
                openedEmptyDoors: 0,
                currentRound: 1,
                playersStrategyChange: false,
                totalWinsChangeStrategy: changed && win ? this.state.totalWinsChangeStrategy+1 : this.state.totalWinsChangeStrategy,
                totalGamesChangeStrategy: changed ? this.state.totalGamesChangeStrategy+1 : this.state.totalGamesChangeStrategy,
                totalWinsStickStrategy: !changed && win ? this.state.totalWinsStickStrategy+1 : this.state.totalWinsStickStrategy,
                totalGamesStickStrategy: !changed ? this.state.totalGamesStickStrategy+1 : this.state.totalGamesStickStrategy
            }
        )
    },
    render: function() {
        return (
        <div>
            <div className="row" id="doors">
                <div className="col-sm-1"></div>
                <div className="col-sm-2">
                    <Door 
                        doorNumber = {1}
                        currentRound={this.state.currentRound} 
                        treasure={this.state.secretTreasureDoors==1} 
                        openedEmptyDoors={this.state.openedEmptyDoors==1} 
                        selectedByPlayer={this.state.selectedDoorsByPlayer==1} 
                        nextRound={this.nextRound} />
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-2">
                    <Door 
                        doorNumber = {2}
                        currentRound={this.state.currentRound} 
                        treasure={this.state.secretTreasureDoors==2} 
                        openedEmptyDoors={this.state.openedEmptyDoors==2} 
                        selectedByPlayer={this.state.selectedDoorsByPlayer==2} 
                        nextRound={this.nextRound} />
                </div>
                <div className="col-sm-2"></div>
                <div className="col-sm-2">
                    <Door 
                        doorNumber = {3}
                        currentRound={this.state.currentRound} 
                        treasure={this.state.secretTreasureDoors==3} 
                        openedEmptyDoors={this.state.openedEmptyDoors==3} 
                        selectedByPlayer={this.state.selectedDoorsByPlayer==3} 
                        nextRound={this.nextRound} />
                </div>
                <div className="col-sm-1"></div>
            </div>
            <div className="col-sm-6">
            <Moderator 
                currentRound={this.state.currentRound} 
                restartGame={this.restartGame}
                openedEmptyDoors={this.state.openedEmptyDoors} 
                won={this.state.secretTreasureDoors == this.state.selectedDoorsByPlayer}/>
            </div>
            <div className="col-sm-6">
                <Summary
                    totalWinsChangeStrategy={this.state.totalWinsChangeStrategy}
                    totalGamesChangeStrategy={this.state.totalGamesChangeStrategy}    
                    totalWinsStickStrategy={this.state.totalWinsStickStrategy}
                    totalGamesStickStrategy={this.state.totalGamesStickStrategy} />
            </div>
        </div> 
        );
    }
});

ReactDOM.render(
  <Game/>,
  document.getElementById('container')
);