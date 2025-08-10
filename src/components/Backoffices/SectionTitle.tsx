import React from 'react';
import cx from 'classnames';
import style from '../../assets/css/style.module.css';

const SectionTitle = ({ title, Buttons }: { title: string, Buttons?: JSX.Element }) => {
  const sectionHeaderClass = cx(style.sectionHeader);

  return (
    <div className={sectionHeaderClass}>
      <h2>{title}</h2>
      <div className='flex gap-2'>
        {Buttons}
      </div>
    </div>
  );
};

export default SectionTitle
