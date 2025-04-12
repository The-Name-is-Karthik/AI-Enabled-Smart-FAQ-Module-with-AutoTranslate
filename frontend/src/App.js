import './App.css';
import logo from './assets/logos/logo.svg';
import upRightArrow from './assets/logos/upRightArrow.svg';
import React, { useState } from 'react';
import FAQModule from './components/FAQModule.js';

const Header = ({ isScrolled, isMenuOpen, toggleMenu }) => {
  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <img src={logo} alt="saras-logo" />
      </div>
      
      <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><button className="nav-button">Home</button></li>
          <li><button className="nav-button">Programs</button></li>
          <li><button className="nav-button">Admissions</button></li>
          <li><button className="nav-button">About us</button></li>
          <li><button className="nav-button active">FAQ</button></li>
          <li><button className="nav-button">Contact us</button></li>
        </ul>
      </nav>

      <div className="dropdown-and-apply-now">
        <button className="apply-now">
          <img src={upRightArrow} alt="Arrow icon" />
          <span>Apply Now</span>
        </button>

        {/* Hamburger Menu */}
        <div className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu" aria-expanded={isMenuOpen} aria-controls="dropdown-menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`} id="dropdown-menu" role="menu">
        <ul>
          <li><button className="nav-button" role="menuitem">Home</button></li>
          <li><button className="nav-button" role="menuitem">Programs</button></li>
          <li><button className="nav-button" role="menuitem">Admissions</button></li>
          <li><button className="nav-button" role="menuitem">About us</button></li>
          <li><button className="nav-button active" role="menuitem">FAQ</button></li>
          <li><button className="nav-button" role="menuitem">Contact us</button></li>
        </ul>
      </div>
    </header>
  );
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="App">
      <Header isScrolled={isScrolled} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <FAQModule setIsScrolled={setIsScrolled} />
    </div>
  );
}

export default App;
