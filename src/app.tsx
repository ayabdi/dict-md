import * as ReactDOM from 'react-dom';
import { Markdown } from "./markdown";


//@ts-ignore
const App = () => {
  return (
      <Markdown/>
  );
}


function render() {
  ReactDOM.render(<div className='app'><App/></div>, document.body);
}

render();