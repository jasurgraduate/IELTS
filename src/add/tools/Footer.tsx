import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import "../css/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; 2023{currentYear > 2023 ? `-${currentYear}` : ""}{" "}
          <a href="https://jasurlive.uz">jasurlive.uz</a> | All rights reserved.
        </p>
        <div className="social-icons"></div>
      </div>
    </footer>
  );
};

export default Footer;
