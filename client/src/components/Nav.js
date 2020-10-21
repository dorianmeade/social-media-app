import React, { useContext, useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth'

function Nav() {
    const { user, logout } = useContext(AuthContext);

    // get url path 
    const pathname = window.location.pathname;

    // changes root to home, else keep path name
    const path = pathname === "/" ? 'home': pathname.substr(1)
    
    // set default active menu tab based on path
    const [activeItem, setActive] = useState(path);

    // changes active menu tab on click
    const handleItemClick = (e, { name }) => setActive(name);

    const menubar = user ? (
        <Menu pointing secondary size="massive" color="purple" >
            <Menu.Item 
                name={user.username}
                active
                as={Link}
                to="/"
            />
            <Menu.Menu position='right'>
            <Menu.Item
                name='logout'
                onClick={logout}
            />
            </Menu.Menu>
        </Menu>
    ) :(
        <Menu pointing secondary size="massive" color="purple" >
            <Menu.Item 
                name='home' 
                active={activeItem === 'home'} 
                onClick={handleItemClick} 
                as={Link}
                to="/"
            />
            <Menu.Menu position='right'>
            <Menu.Item
                name='login'
                active={activeItem === 'login'}
                onClick={handleItemClick}
                as={Link}
                to="/login"
            />
            <Menu.Item
                name='register'
                active={activeItem === 'register'}
                onClick={handleItemClick}
                as={Link}
                to="/register"
            />
            
            </Menu.Menu>
        </Menu>)
    return menubar;
}
export default Nav;