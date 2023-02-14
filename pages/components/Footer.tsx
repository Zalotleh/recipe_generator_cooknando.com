import React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <Card body bg='transparent' style={{width:"100%"}}>
      <p>All Rights Reserved &nbsp;
        <FontAwesomeIcon style={{maxWidth:"18px"}} icon={faCopyright} /> &nbsp;
         Created by: Ziad Alotleh @ www.ziadalotleh.com
      </p>
    </Card>
  );
}

export default Footer;
