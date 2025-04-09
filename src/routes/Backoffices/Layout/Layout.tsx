import style from '../../../assets/css/style.module.css';
import Nav from '../../../components/Backoffices/Nav';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Nav />
      <main className={style.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
