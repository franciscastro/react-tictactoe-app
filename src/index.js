import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


/* Square defined as a function component because it only has a render()
   method and doesn't have its own state. */
function Square(props) {

    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );

}


// Board creates the Board by instantiating instances of Square components
class Board extends React.Component {

  /* Constructor for this component. For the state:
     - squares: 9-element array to track which square has been clicked
     - xIsNext: boolean to determne which player goes next
     The state variables are updated in the handleClick() function. */
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }


  // Updates the state variables of this Board.
  handleClick(i) {

    // .slice() creates a copy of the state squares array, which is updated.
    const squares = this.state.squares.slice();

    // If a winner is found, return nothing (no behavior for click)
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    /* Update state variables:
       - squares is replaced with copy,
       - xIsNext is flipped */
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }


  /* Renders the Square components, passing in value and onClick props.
     - value prop has Board state's squares array status
     - onClick prop has Board state's handleClick() behavior*/
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {

    /* Check if there's a winner through calculateWinner() utility function.
       - winner: not null, display the winner through status variable.
       - winner: null, show next player, tracked through xIsNext state var. */
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


// Game creates instance of the Board component
class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}


// ========================================


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


/* Given an array of 9 squares, this calculateWinner() will
   check for a winner and return 'X', 'O', or null as appropriate. */
function calculateWinner(squares) {

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
