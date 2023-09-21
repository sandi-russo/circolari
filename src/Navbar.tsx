import React, { useState, useRef } from 'react';
import './style.scss';
import { Img } from 'react-image';
import logo from './assets/Logo.png';

type NavbarProps = {
  onSearch: (query: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSearchIconClick = () => {
    setSearchBarVisible(true);
    // Attiva l'input di ricerca quando si preme sull'icona di ricerca
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleBackIconClick = () => {
    setSearchBarVisible(false);
  };

  return (
    <header className="header" id="header">
      <nav className={`navbar container ${isSearchBarVisible ? 'search-visible' : ''}`}>
        <div className="brand" style={{ lineHeight: '1.1' }}>
          <a href="" style={{ display: 'flex', alignItems: 'center' }}>
            <Img
              src={logo}
              alt="Logo"
              className="logo"
              loader={<div className="logo-placeholder" style={{ width: '50px', height: '50px', marginRight: '10px' }} />}
            />
            <div className="brand-name" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-name" style={{ margin: 0, fontSize: '13px' }}>I.I.S. SUPERIORE</span>
              <span className="brand-name" style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>VERONA TRENTO</span>
              <span className="brand-name" style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>MAJORANA</span>
              <span className="brand-name" style={{ margin: 0, fontSize: '13px' }}>MESSINA</span>
            </div>
          </a>
        </div>
        <div className="search-icon" onClick={handleSearchIconClick}>
          <i className={`bx bx-search ${isSearchBarVisible ? 'hidden' : ''}`}></i>
        </div>
        <div className={`search-bar ${isSearchBarVisible ? 'visible' : ''}`}>
          <input
            type="text"
            placeholder="Cerca circolari..."
            value={searchQuery}
            onChange={handleSearchChange}
            ref={searchInputRef} // Aggiungi il riferimento all'input
          />
          <div className="back-icon" onClick={handleBackIconClick}>
            <i className="bx bx-arrow-back"></i>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
