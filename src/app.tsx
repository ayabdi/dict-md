import * as ReactDOM from 'react-dom';
import { Markdown } from "./markdown";


//@ts-ignore
const App = () => {
  return (
    <div>
      <Markdown/>
    </div>
  );
}


function render() {
  ReactDOM.render(<div><App/></div>, document.body);
}

render();