import { useLocation } from 'react-router-dom';
import style from '../../assets/css/style.module.css';
import cx from 'classnames';

const Nav = () => {
  const path = useLocation().pathname;

  const linkClass = cx(style.sidebarLinks, style.link);
  const productsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/products') ? style.active : null);
  const categoriesClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/categories') ? style.active : null);
  const crewsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/crews') ? style.active : null);
  const paymentMethodsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/methods') ? style.active : null);
  const reportsClass = cx(style.sidebarLinks, style.link, path.includes('/backoffices/reports') ? style.active : null);

  return (
    <nav className={style.sidebar}>
      <header className={style.sidebarHeader}>-- Backoffices --</header>
      <div className={style.sidebarLinks}>
        <a href="/backoffices/products" className={productsClass} aria-label="Navigate to Products">
          Products
        </a>
        <a href="/backoffices/categories" className={categoriesClass} aria-label="Navigate to Categories">
          Categories
        </a>
        <a href="/backoffices/crews" className={crewsClass} aria-label="Navigate to Crews">
          Crews
        </a>
        <a href="/backoffices/methods" className={paymentMethodsClass} aria-label="Navigate to Payment Methods">
          Payment Methods
        </a>
        <a href="/backoffices/reports" className={reportsClass} aria-label="Navigate to Reports">
          Reports
        </a>
      </div>
    </nav>
  );
};

export default Nav;
