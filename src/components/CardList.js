import React from 'react';
import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

import Card from './Card';

function CardList({ cards, size, onClick = null, targets=[] }) {
  const clickable = onClick ? true : false;
  const empty = () => {};

  return (
    <EuiFlexGroup alignItems="flexStart" justifyContent="flexStart" gutterSize="l" wrap={true} responsive={false}>
      {cards.map((card, i) =>
        <EuiFlexItem key={i} grow={false} className={targets.indexOf(card) !== -1 ? "highlight" : null}>
          <Card
            card={card}
            onClick={() => (onClick ?? empty)(card)}
            clickable={clickable}
            width={size}
          />
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  );
}

export default CardList;