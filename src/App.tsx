import Generator from "./Generator";
import "./App.css";

window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  return (
    <>
      <div className="outer-container">
        <Generator />
      </div>
    </>
  );
}

export default App;
