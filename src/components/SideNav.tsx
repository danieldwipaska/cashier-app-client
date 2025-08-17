import { useLocation } from 'react-router-dom';
import { ReactComponent as CartIcon } from '../assets/img/icons/cart.svg';
import { ReactComponent as ArchiveIcon } from '../assets/img/icons/archive.svg';
import { ReactComponent as CardIcon } from '../assets/img/icons/card.svg';
import { ReactComponent as SettingIcon } from '../assets/img/icons/setting.svg';
import { ReactComponent as BackofficeIcon } from '../assets/img/icons/backoffice.svg';
import { ReactComponent as DoubleArrowIcon } from '../assets/img/icons/double-arrow-left.svg';
import { useMediaQuery } from '@mui/material';

const SideNav = ({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: any }) => {
  const location = useLocation();
  const widthMinMd = useMediaQuery('(min-width: 768px)');

  return (
    <div className={`h-screen min-w-24 pt-5 md:pt-24 flex-col justify-between flex absolute md:static bg-white z-50 md:bg-transparent ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 duration-300`}>
      <div className="grid grid-cols-1 justify-items-center">
        {widthMinMd ? null : (
          <button
            className="flex flex-col items-center mb-5"
            onClick={() => {
              setMobileOpen(false);
            }}
          >
            <DoubleArrowIcon className={`h-[36px] text-green-600`} />
          </button>
        )}
        <a href={'/'} className="flex flex-col items-center mb-5">
          <CartIcon className={`h-[36px] ${location?.pathname === '/' ? 'text-green-600' : 'text-gray-400'}`} />
          <p className={`text-xs ${location?.pathname === '/' ? 'text-green-700' : 'text-gray-400'}`}>Orders</p>
        </a>
        <a href={'/report'} className="flex flex-col items-center mb-5">
          <ArchiveIcon className={`h-[36px] ${location?.pathname === '/report' ? 'text-green-600' : 'text-gray-400'}`} />
          <p className={`text-xs ${location?.pathname === '/report' ? 'text-green-700' : 'text-gray-400'}`}>Reports</p>
        </a>
        <a href={'/gift-card'} className="flex flex-col items-center mb-5">
          <CardIcon className={`h-[36px] ${location?.pathname === '/gift-card' ? 'text-green-600' : 'text-gray-400'}`} />
          <p className={`text-xs ${location?.pathname === '/gift-card' ? 'text-green-700' : 'text-gray-400'}`}>Gift Card</p>
        </a>
        <a href={'/settings'} className="flex flex-col items-center mb-5">
          <SettingIcon className={`h-[36px] ${location?.pathname === '/settings' ? 'text-green-600' : 'text-gray-400'}`} />
          <p className={`text-xs ${location?.pathname === '/settings' ? 'text-green-700' : 'text-gray-400'}`}>Settings</p>
        </a>
      </div>
      <a href={'/backoffices'} className="flex flex-col items-center mb-7">
        <BackofficeIcon className="h-[36px] text-gray-400" />
        <p className="text-xs text-gray-400 mt-1">Backoffices</p>
      </a>
    </div>
  );
};

export default SideNav;
