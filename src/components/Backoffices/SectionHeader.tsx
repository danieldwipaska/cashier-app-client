import React from 'react';
import cx from 'classnames';
import style from '../../assets/css/style.module.css';

const SectionHeader = ({ title }: { title: string }) => {
  const sectionHeaderClass = cx(style.sectionHeader);

  return (
    <div className={sectionHeaderClass}>
      <h1>{title}</h1>
    </div>
  );
};

export default SectionHeader;
