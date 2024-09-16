import style from '../../assets/css/style.module.css';
import cx from 'classnames';

const linkClassName = cx(style.sidebarLinks, style.link);

const Nav = () => {
  return (
    <nav className={style.sidebar}>
      <header className={style.sidebarHeader}>&gt; Backoffices</header>
      <div className={style.sidebarLinks}>
        <a href="/backoffices/products" className={linkClassName} aria-label="Navigate to Products">
          Products
        </a>
        <a href="#" className={linkClassName} aria-label="Navigate to Categories">
          Categories
        </a>
        <a href="#" className={linkClassName} aria-label="Navigate to Crews">
          Crews
        </a>
        <a href="#" className={linkClassName} aria-label="Navigate to Payment Method">
          Payment Method
        </a>
      </div>
    </nav>
  );
};

export default Nav;
