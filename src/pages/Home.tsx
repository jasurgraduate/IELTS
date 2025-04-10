import { Link } from "react-router-dom";
import "../add/css/home.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faHeadphones, faComments, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from "react";
import Header from '../add/tools/Header';

function Home({ hideNav }: { hideNav: (hide: boolean) => void }) {
    useEffect(() => {
        hideNav(true);
        return () => hideNav(false);
    }, [hideNav]);

    return (
        <div><Header />
            <div className="home">

                <div className="grid-container">
                    <Link to="/writing" className="grid-item">
                        <FontAwesomeIcon icon={faPen} className="icon" />
                        <span>Writing</span>
                    </Link>
                    <Link to="/answer-sheet" className="grid-item">
                        <FontAwesomeIcon icon={faHeadphones} className="icon" />
                        <span>Listening & Reading</span>
                    </Link>
                    <Link to="/feedback" className="grid-item">
                        <FontAwesomeIcon icon={faComments} className="icon" />
                        <span>Feedback</span>
                    </Link>
                    <Link to="/to-do-list" className="grid-item">
                        <FontAwesomeIcon icon={faPlus} className="icon" />
                        <span>To-Do List</span>
                    </Link>
                </div>
            </div></div>
    );
}

export default Home;
