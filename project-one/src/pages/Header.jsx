import React from 'react';
import { NavLink } from 'react-router-dom';
function Header(){
    return (
        <div class="navigationMenuCls">
            <nav>
                <ul>
                    <li><NavLink to={'/'}   activeClassName="acive">Login</NavLink></li>
                     <li><NavLink to={'/signup'} activeClassName="acive">Signup</NavLink></li>
                </ul>
            </nav>
        </div>
    )

}

export default Header;