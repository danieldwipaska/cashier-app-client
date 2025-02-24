import { FaCartShopping, FaFolderOpen } from 'react-icons/fa6';
import { IoIosSettings } from 'react-icons/io';
import { FaAddressCard } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { GrDatabase } from 'react-icons/gr';

const SideNav = () => {
  const location = useLocation();

  return (
    <div className="h-screen min-w-24 pt-24 flex flex-col justify-between">
      <div className="grid grid-cols-1 justify-items-center">
        {location?.pathname === '/' ? (
          <Link to={'/'} className="flex flex-col items-center mb-3 duration-500" onClick={() => {}}>
            <FaCartShopping size={30} color="#1eb254" />
            <p className="text-xs text-green-700">Orders</p>
          </Link>
        ) : (
          <Link to={'/'} className="flex flex-col items-center mb-3">
            <FaCartShopping size={30} color="#BDBDBD" />
            <p className="text-xs text-gray-400">Orders</p>
          </Link>
        )}
        {location?.pathname === '/report' ? (
          <Link to={'/report'} className="flex flex-col items-center my-3">
            <FaFolderOpen size={30} color="#1eb254" />
            <p className="text-xs text-green-700">Reports</p>
          </Link>
        ) : (
          <Link to={'/report'} className="flex flex-col items-center my-3">
            <FaFolderOpen size={30} color="#BDBDBD" />
            <p className="text-xs text-gray-400">Reports</p>
          </Link>
        )}

        {location?.pathname === '/gift-card' ? (
          <Link to={'/gift-card'} className="flex flex-col items-center my-3">
            <FaAddressCard size={30} color="#1eb254" />
            <p className="text-xs text-green-700">Gift Card</p>
          </Link>
        ) : (
          <Link to={'/gift-card'} className="flex flex-col items-center my-3">
            <FaAddressCard size={30} color="#BDBDBD" />
            <p className="text-xs text-gray-400">Gift Card</p>
          </Link>
        )}

        {location.pathname === '/settings' ? (
          <Link to={'/settings'} className="flex flex-col items-center my-3">
            <IoIosSettings size={30} color="#1eb254" />
            <p className="text-xs text-green-700">Settings</p>
          </Link>
        ) : (
          <Link to={'/settings'} className="flex flex-col items-center my-3">
            <IoIosSettings size={30} color="#BDBDBD" />
            <p className="text-xs text-gray-400">Settings</p>
          </Link>
        )}
      </div>
      <Link to={'/backoffices'} className="flex flex-col items-center mb-7">
        <GrDatabase size={30} color="#BDBDBD" />
        <p className="text-xs text-gray-400 mt-1">Backoffices</p>
      </Link>
    </div>
  );
};

export default SideNav;
