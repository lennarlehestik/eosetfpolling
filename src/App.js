import logo from './logo.svg';
import './App.css';
import Poll from './Poll'
import { withUAL } from "ual-reactjs-renderer";

function App(props) {
  return (
    <div className="App">
      <header className="App-header">
        <Poll />
      </header>
    </div>
  );
}

export default withUAL(App);
