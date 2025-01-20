import React, { useState, useRef, useEffect } from 'react';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const UserMenu = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [menuDirection, setMenuDirection] = useState('down');
    const [username, setUsername] = useState('');
    const menuRef = useRef(null);

    // Fetch username from localStorage
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
        setUsername(storedUsername);
        }
    }, []);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        // Navigate to login page with ?logout=true
        window.location = `/login?logout=true`
        
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            closeMenu(); // Close the menu if the click is outside
        }
        };

        const checkSpace = () => {
        if (menuRef.current) {
            const { bottom, height } = menuRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            setMenuDirection(bottom + height > windowHeight ? 'up' : 'down');
        }
        };

        if (isMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        checkSpace();
        } else {
        document.removeEventListener('mousedown', handleClickOutside);
        }

        window.addEventListener('resize', checkSpace);

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('resize', checkSpace);
        };
    }, [isMenuOpen]);

    return (
        <div
        className={`main-menu-footer-user-holder ${menuDirection === 'up' ? 'pop-up' : ''}`}
        onClick={toggleMenu}
        ref={menuRef}
        >
            <div className='main-menu-footer-user-info'>
                <span>
                <AccountCircleRoundedIcon />
                </span>
                <span>{username || 'Guest'}</span>
            
            </div>
            {isMenuOpen && (
                <div className={`main-menu-footer-user-logout-dropdown ${isMenuOpen ? 'active' : ''}`}>
                <span onClick={handleLogout}>Logout</span>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
