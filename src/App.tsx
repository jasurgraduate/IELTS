// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPen, faHeadphones, faComments } from '@fortawesome/free-solid-svg-icons';
import Home from "./pages/Home";
import Writing from "./pages/Writing";
import AnswerSheet from "./pages/AnswerSheet";
import Feedback from "./add/tools/Feedback";
import Footer from "./add/tools/Footer";
import Online from "./add/tools/Online";

import "./add/css/home.css";
import { useState } from "react";
import ToDoList from "./pages/ToDoList";

function App() {
  const [isNavHidden, setIsNavHidden] = useState(false);

  const hideNav = (hide: boolean) => {
    setIsNavHidden(hide);
  };

  return (
    <Router>
      <div className="App">

        <div className="home-container">
          <Routes>
            <Route path="/" element={<Home hideNav={hideNav} />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/answer-sheet" element={<AnswerSheet />} />
            <Route path="/to-do-list" element={<ToDoList />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
        <Online />
        <Footer />
        {!isNavHidden && (
          <nav className="nav-icons">
            <Link to="/" className="nav-link">
              <FontAwesomeIcon icon={faHome} />
            </Link>
            <Link to="/writing" className="nav-link">
              <FontAwesomeIcon icon={faPen} />
            </Link>
            <Link to="/answer-sheet" className="nav-link">
              <FontAwesomeIcon icon={faHeadphones} />
            </Link>
            <Link to="/feedback" className="nav-link">
              <FontAwesomeIcon icon={faComments} />
            </Link>
          </nav>
        )}
      </div>
    </Router>
  );
}

export default App;
