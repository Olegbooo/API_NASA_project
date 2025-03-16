import MarsRoverExplorer from "./components/MarsRoverExplorer";
import ApodComponent from "./components/PhotoDay";

function App() {
  return (
    <>
      <div>
        <ApodComponent />
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Mars Rover Photos</h1>
        <MarsRoverExplorer />
      </div>
    </>
  );
}

export default App;