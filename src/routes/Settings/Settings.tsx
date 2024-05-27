import AccountSettings from '../../components/AccountSettings';
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
        <div className="h-screen pt-24 mx-8"></div>
      </div>
    </div>
  );
};

export default Settings;
