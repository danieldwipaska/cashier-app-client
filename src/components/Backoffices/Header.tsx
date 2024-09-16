import React from 'react';
import style from '../../assets/css/style.module.css';
import cx from 'classnames';

const Header = ({ title }: { title: string }) => {
  const headerClass = cx(style.header, style.mb50);

  return <header className={headerClass}>{title}</header>;
};

export default Header;
