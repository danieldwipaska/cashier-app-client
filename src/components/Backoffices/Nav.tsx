import { Link, useLocation } from 'react-router-dom';
import style from '../../assets/css/style.module.css';
import cx from 'classnames';
import { ReactComponent as StackIcon } from '../../assets/img/icons/stacks.svg';

const Nav = () => {
  const path = useLocation().pathname;
  const dashboardClass = cx(style.sidebarLinks, style.link, path === '/backoffices' ? style.active : null);
  const productsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/products') ? style.active : null);
  const categoriesClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/categories') ? style.active : null);
  const reportsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/reports') ? style.active : null);
  const crewsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/crews') ? style.active : null);
  const paymentMethodsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/payment-methods') ? style.active : null);
  const cardsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/cards') ? style.active : null);
  const settingsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/settings') ? style.active : null);
  const modifiersClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/modifiers') ? style.active : null);

  return (
    <nav className={style.sidebar + ' relative'}>
      <header className="flex gap-1 items-center py-5">
        <StackIcon className="w-[25px]" />
        <h1 className="text-xl font-semibold">Backoffice</h1>
      </header>
      <div className={style.sidebarLinks}>
        <Link to='/backoffices' className={dashboardClass} aria-label="Navigate to Products">
          Dashboard
        </Link>
        <Link to='/backoffices/products' className={productsClass} aria-label="Navigate to Products">
          Products
        </Link>
        <Link to='/backoffices/categories' className={categoriesClass} aria-label="Navigate to Categories">
          Categories
        </Link>
        <Link to='/backoffices/modifiers' className={modifiersClass} aria-label="Navigate to Modifiers">
          Modifiers
        </Link>
        <Link to='/backoffices/reports' className={reportsClass} aria-label="Navigate to Payments">
          Reports
        </Link>
        <Link to='/backoffices/crews' className={crewsClass} aria-label="Navigate to Crews">
          Crews
        </Link>
        <Link to='/backoffices/payment-methods' className={paymentMethodsClass} aria-label="Navigate to Payment Method">
          Payment Methods
        </Link>
        <Link to='/backoffices/cards' className={cardsClass} aria-label="Navigate to Cards">
          Cards
        </Link>
        <Link to='/backoffices/settings' className={settingsClass} aria-label="Navigate to Settings">
          Settings
        </Link>
      </div>
      <a href="/" className="absolute bottom-0 w-full" aria-label="Navigate to POS">
        <h4 className="font-semibold px-1 py-3">Go to POS</h4>
      </a>
    </nav>
  );
};

export default Nav;
