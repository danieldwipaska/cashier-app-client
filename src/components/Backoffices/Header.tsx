import React from 'react';
import style from '../../assets/css/style.module.css';

const Header = ({ title }: { title: string }) => {
  return <header className={style.header}>{title}</header>;
};

export default Header;
