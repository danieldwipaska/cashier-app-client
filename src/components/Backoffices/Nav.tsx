import style from '../../assets/css/style.module.css'
import cx from 'classnames'

const Nav = () => {
  return (
    <nav className={style.sidebar}>
      <header className={style.sidebarHeader}>&gt; Backoffices</header>
      <div className={style.sidebarLinks}>
        <a href="/backoffices/products" className={cx(style.sidebarLinks, style.link)}>Products</a>
        <a href="#" className={cx(style.sidebarLinks, style.link)}>Categories</a>
        <a href="#" className={cx(style.sidebarLinks, style.link)}>Crew</a>
        <a href="#" className={cx(style.sidebarLinks, style.link)}>Payment Method</a>
      </div>
    </nav>
  )
}

export default Nav