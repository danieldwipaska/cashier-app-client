import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as CartIcon } from '../assets/img/icons/cart.svg';
import { ReactComponent as ArchiveIcon } from '../assets/img/icons/archive.svg';
import { ReactComponent as CardIcon } from '../assets/img/icons/card.svg';
import { ReactComponent as SettingIcon } from '../assets/img/icons/setting.svg';
import { ReactComponent as BackofficeIcon } from '../assets/img/icons/backoffice.svg';

const SideNav = () => {
  const location = useLocation();

  return (
    <div className="h-screen min-w-24 pt-24 flex flex-col justify-between">
      <div className="grid grid-cols-1 justify-items-center">
        <Link to={'/'} className="flex flex-col items-center mb-5 duration-500">
          <CartIcon className={`h-[36px] ${location?.pathname === '/' ? 'text-green-600' : 'text-gray-400'}`} />
          <p className={`text-xs ${location?.pathname === '/' ? 'text-green-700' : 'text-gray-400'}`}>Orders</p>
        </Link>
        <Link to={'/report'} className="flex flex-col items-center mb-5 duration-500">
          <ArchiveIcon className={`h-[36px] ${location?.pathname === '/report' ? 'text-green-600' : 'text-gray-400'}`} />
          <p className={`text-xs ${location?.pathname === '/report' ? 'text-green-700' : 'text-gray-400'}`}>Reports</p>
        </Link>
        <Link to={'/gift-card'} className="flex flex-col items-center mb-5 duration-500">
          <CardIcon className={`h-[36px] ${location?.pathname === '/gift-card' ? 'text-green-600' : 'text-gray-400'}`} />
          <p className={`text-xs ${location?.pathname === '/gift-card' ? 'text-green-700' : 'text-gray-400'}`}>Gift Card</p>
        </Link>
        <Link to={'/settings'} className="flex flex-col items-center mb-5 duration-500">
          <SettingIcon className={`h-[36px] ${location?.pathname === '/settings' ? 'text-green-600' : 'text-gray-400'}`} />
          <p className={`text-xs ${location?.pathname === '/settings' ? 'text-green-700' : 'text-gray-400'}`}>Orders</p>
        </Link>
      </div>
      <Link to={'/backoffices'} className="flex flex-col items-center mb-7">
        <BackofficeIcon className="h-[36px] text-gray-400" />
        <p className="text-xs text-gray-400 mt-1">Backoffices</p>
      </Link>
    </div>
  );
};

export default SideNav;
