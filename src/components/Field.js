import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
} from '@elastic/eui';

import CardList from './CardList';

function PlayerField(props) {
  const { field, player, size, onClick, targets, filter, turn} = props;

  return (
    <div>
      <div className={turn ? "curr-player" : "playerName"}>
        {player}
      </div>
      <EuiFlexGroup>
        {filter.indexOf("special") === -1 ?
          <EuiFlexItem style={{ minHeight: 155 }}>
            <div>
              Point
            </div>
            <CardList cards={field[player].point.cards} onClick={onClick} size={size} targets={targets}/>
          </EuiFlexItem>
        : null}
        {filter.indexOf("point") === -1 ?
          <EuiFlexItem style={{ minHeight: 155 }} className="special">
            <div>
              Special field
            </div>
            <CardList cards={field[player].special.cards} onClick={onClick} size={size} targets={targets}/>
          </EuiFlexItem>
        : null}
      </EuiFlexGroup>
    </div>
  );
}

function Field({ data, players, size="118", onClick=null, targets=[], filter=[] }) {
  const isPlayersTurn = data.turn % 2 == players.turn;

  return (
    <div className="field">
      <PlayerField
        field={data.field}
        player={players.other}
        size={size}
        onClick={onClick}
        targets={targets}
        filter={filter}
        turn={!isPlayersTurn}
      />
      {filter.indexOf("opponent") === -1 ? <EuiHorizontalRule />: null}
      {filter.indexOf("opponent") === -1 ?
        <PlayerField
          field={data.field}
          player={players.self}
          size={size}
          onClick={onClick}
          targets={targets}
          filter={filter}
          turn={isPlayersTurn}
        />
      : null}
    </div>
  );
}

export default Field;