import React, { useState } from 'react';
import { SidebarData } from './SidebarData';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

import "../../sidebar.css"

function Sidebar({ user }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();


  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  const handleToggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="sidebar">
      {/* <UserProfile name={user.name} type={user.type} /> */}
      <div className='temporary'>profile</div>
      <ul className="sidebarList">
        {SidebarData.map((item, index) => {
          // items with dropdown

          if (item.subItems) {
            return (

              <li key={index} className='dropdown-container'>
                <div
                  className="menu-item"
                  onClick={() => handleToggleDropdown(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.title}
                </div>
                {activeDropdown === index && (
                  <ul className="dropdown">
                    {item.subItems.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="dropdown-item"
                        onClick={() => navigate(subItem.link)}
                        style={{ cursor: 'pointer' }}
                      >
                        {subItem.title}
                      </li>
                    ))}
                  </ul>
                )}
              </li>

            );
          }


          if (item.title === 'Logout') {
            return (
              <li
                key={index}
                className="menu-item"
                onClick={handleLogout}
                style={{ cursor: 'pointer'}}
              >
                {item.title}
              </li>
            );
          }

          //for items that have no dropdown
          return (
            <li
              key={index}
              className="menu-item"
              onClick={() => navigate(item.link)}
              style={{ cursor: 'pointer' }}
            >
              {item.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
