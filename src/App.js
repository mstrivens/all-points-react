import logo from './logo.svg';
import './App.css';
import MapContainer from './components/mapContainer.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">ALL POINTS</h1>
      </header>
      <div className="mapContainer">
            <MapContainer />
      </div>
    </div>
  );
}

export default App;
