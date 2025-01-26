import AccountSettings from '../../components/settings/AccountSettings';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';

const Settings = () => {
  const { user } = useAuth();

  // useEffect
  useCheckToken(user);

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />
        <AccountSettings />
      </div>
    </div>
  );
};

export default Settings;
