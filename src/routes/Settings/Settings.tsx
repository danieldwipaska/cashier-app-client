import AccountSettings from '../../components/settings/AccountSettings';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';
import { useState } from 'react';

const Settings = () => {
  const { user } = useAuth();
  const [showSideNav, setShowSideNav] = useState<boolean>(false);

  // useEffect
  useCheckToken(user);

  return (
    <div>
      <Nav setShowSideNav={setShowSideNav} />

      <div className="flex">
        <SideNav mobileOpen={showSideNav} setMobileOpen={setShowSideNav} />
        <AccountSettings />
      </div>
    </div>
  );
};

export default Settings;
