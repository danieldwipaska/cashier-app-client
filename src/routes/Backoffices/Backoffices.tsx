import React from 'react'
import Layout from './Layout/Layout'
import Header from '../../components/Backoffices/Header'
import Bcm from '../../assets/img/bcm-logo-luxury.svg'

const Backoffices = () => {
  return (
    <Layout>
      <Header title='BACKOFFICES' />
        <div className='flex align-middle justify-center'>
          <img src={Bcm} height={500} width={500} className='opacity-40' />
        </div>
    </Layout>
  )
}

export default Backoffices