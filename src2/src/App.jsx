import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home'
import Login from './login';
import Publish from './publish'
const App = () => {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} redirect="/home" />
          <Route path="/login" element={<Login />} />
          <Route path="/publish" element={<Publish />} />
        </Routes>
      
      </div>
    </Router>
  );
}
export default App;