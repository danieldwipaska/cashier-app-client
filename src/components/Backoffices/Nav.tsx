import { useLocation } from 'react-router-dom';
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

  return (
    <nav className={style.sidebar + ' relative'}>
      <header className="flex gap-1 items-center py-5">
        <StackIcon className="w-[25px]" />
        <h1 className="text-xl font-semibold">Backoffice</h1>
      </header>
      <div className={style.sidebarLinks}>
        <a href="/backoffices" className={dashboardClass} aria-label="Navigate to Products">
          Dashboard
        </a>
        <a href="/backoffices/products" className={productsClass} aria-label="Navigate to Products">
          Products
        </a>
        <a href="/backoffices/categories" className={categoriesClass} aria-label="Navigate to Categories">
          Categories
        </a>
        <a href="/backoffices/reports" className={reportsClass} aria-label="Navigate to Payments">
          Reports
        </a>
        <a href="/backoffices/crews" className={crewsClass} aria-label="Navigate to Crews">
          Crews
        </a>
        <a href="/backoffices/payment-methods" className={paymentMethodsClass} aria-label="Navigate to Payment Method">
          Payment Methods
        </a>
        <a href="/backoffices/cards" className={cardsClass} aria-label="Navigate to Cards">
          Cards
        </a>
      </div>
      <a href="/" className="absolute bottom-0 w-full" aria-label="Navigate to POS">
        <h4 className="font-semibold px-1 py-3">Go to POS</h4>
      </a>
    </nav>
  );
};

export default Nav;
