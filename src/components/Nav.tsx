import React from 'react';
import { useAuth } from '../context/AuthContext';

const Nav = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white h-16 w-full grid grid-cols-1 content-center fixed">
      <div className="flex my-auto justify-between">
        <div className="flex items-stretch mx-10">
          <div className="self-center">BAHARI</div>
        </div>
        <div className="flex-col mx-12">
          <div className="text-xs text-gray-500">Cashier</div>
          {user.username ? <div className="">{user.username}</div> : <div className="">Login</div>}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
