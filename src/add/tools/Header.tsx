import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop } from '@fortawesome/free-solid-svg-icons';
import "../css/header.css";

function Header() {
    return (
        <header className="header-container">
            <h1>
                <FontAwesomeIcon icon={faLaptop} /> CD IELTS Preparation
            </h1>
        </header>
    );
}

export default Header;
