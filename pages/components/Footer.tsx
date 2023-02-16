import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styles/Footer.module.css'

function Footer() {
  return (
    <main  className={styles.main}>

      <hr style={{width:"100%" , borderTop:" 2px solid #ccc"}}/>

      <p >All Rights Reserved &nbsp;
        <FontAwesomeIcon style={{maxWidth:"18px"}} icon={faCopyright} /> &nbsp;
         Created by: Ziad Alotleh @ www.ziadalotleh.com
      </p>
    </main>
  );
}

export default Footer;
