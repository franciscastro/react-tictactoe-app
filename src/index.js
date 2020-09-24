/*
Author: Francisco Castro, PhD
Last update: 09/24/2020
*/

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

  /* Renders the Square components, passing in value and onClick props.
     - value prop has Game state's squares array status
     - onClick prop has Game state's handleClick() behavior*/
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {

    return (
      <div>
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

  /* Constructor for this component. For the state:
     - squares: 9-element array to track which square has been clicked
     - xIsNext: boolean to determne which player goes next
     The state variables are updated in the handleClick() function. */
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // Updates the state variables of this Game.
  handleClick(i) {

    /* Ensures that if we "go back in time" and then make a new move
       from that point, we throw away all the "future" history that
       would now become incorrect. */
    const history = this.state.history.slice(0, this.state.stepNumber + 1);

    const current = history[history.length - 1];

    // .slice() creates a copy of the state squares array, which is updated.
    const squares = current.squares.slice();

    // If a winner is found, return nothing (no behavior for click)
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    /* Update state variables:
       - squares is replaced with copy,
       - xIsNext is flipped */
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {

    const history = this.state.history;

    // Render the currently selected move according to stepNumber
    const current = history[this.state.stepNumber];

    /* Check if there's a winner through calculateWinner() utility function.
       - winner: not null, display the winner through status variable.
       - winner: null, show next player, tracked through xIsNext state var. */
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
