import React from 'react';

function UserProfile({ name, type }) {
  return (
    <>
    <div className='profile-box'>
      <img src="user-solid.svg" alt="Profile" className='profile-image'/>
      
      <div className='nameNtype'>
      <div className='profile-name'>{name}</div> 
      <div className='profile-type'>{type}</div> 
      </div>
      </div>
    </>
  );
}

export default UserProfile;

