import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuItem = ({ icon: Icon, name, page }) => {
    return (
        <NavLink 
            to={page} 
            activeClassName="active"
            className="main-menu-item"
            exact
        >
            <span className='main-menu-item-icon'>
                <Icon />
            </span>
            <span className='main-menu-item-name'>
                {name}
            </span>
        </NavLink>
    );
};

export default MenuItem;
