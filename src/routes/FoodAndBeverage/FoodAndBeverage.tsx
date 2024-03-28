import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import MenuManagement from '../../components/MenuManagement';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';

const FoodAndBeverage = () => {
  const { user } = useAuth();

  // useEffect
  useCheckToken(user);

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />
        <MenuManagement />
        <div className="h-screen pt-24 mx-8"></div>
      </div>
    </div>
  );
};

export default FoodAndBeverage;
