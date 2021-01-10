import React from 'react';

import { EuiToolTip } from '@elastic/eui';

import { getCardImage, getTooltip } from '../utils/card';



function Card({ card, clickable, width="118", onClick = () => {} }) {

  return (
    <EuiToolTip position="top" content={getTooltip(card)}>
      <img
        className={clickable ? 'clickable': null, `card${card?.value ?? 1000}`}
        src={getCardImage(card)}
        height={width}
        onClick={onClick}
      />
    </EuiToolTip>
  );
}

export default Card;