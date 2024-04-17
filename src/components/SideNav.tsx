import React from 'react';
import { FaCartShopping, FaFolderOpen } from 'react-icons/fa6';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { IoIosSettings } from 'react-icons/io';
import { Link, useLocation } from 'react-router-dom';

const SideNav = () => {
  const location = useLocation();

  return (
    <div className="h-screen w-1/12 pt-24">
      <div className="grid grid-cols-1 justify-items-center">
        {location?.pathname === '/' ? (
          <Link to={'/'} className="flex flex-col items-center mb-5 duration-500" onClick={() => {}}>
            <FaCartShopping size={30} color="#1eb254" />
            <p className="text-xs text-green-700">Orders</p>
          </Link>
        ) : (
          <Link to={'/'} className="flex flex-col items-center mb-5">
            <FaCartShopping size={30} color="#BDBDBD" />
            <p className="text-xs text-gray-400">Orders</p>
          </Link>
        )}
        {location?.pathname === '/report' ? (
          <Link to={'/report'} className="flex flex-col items-center my-5">
            <FaFolderOpen size={30} color="#1eb254" />
            <p className="text-xs text-green-700">Reports</p>
          </Link>
        ) : (
          <Link to={'/report'} className="flex flex-col items-center my-5">
            <FaFolderOpen size={30} color="#BDBDBD" />
            <p className="text-xs text-gray-400">Reports</p>
          </Link>
        )}
        {location?.pathname === '/fnb' ? (
          <Link to={'/fnb'} className="flex flex-col items-center my-5">
            <BiSolidFoodMenu size={30} color="#1eb254" />
            <p className="text-xs text-green-700">Menu</p>
          </Link>
        ) : (
          <Link to={'/fnb'} className="flex flex-col items-center my-5">
            <BiSolidFoodMenu size={30} color="#BDBDBD" />
            <p className="text-xs text-gray-400">Menu</p>
          </Link>
        )}

        {location.pathname === '/setting' ? (
          <Link to={'/'} className="flex flex-col items-center my-5">
            <IoIosSettings size={30} color="#1eb254" />
            <p className="text-xs text-green-700">Settings</p>
          </Link>
        ) : (
          <Link to={'/'} className="flex flex-col items-center my-5">
            <IoIosSettings size={30} color="#BDBDBD" />
            <p className="text-xs text-gray-400">Settings</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SideNav;
