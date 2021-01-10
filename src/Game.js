import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  EuiButton,
  EuiPage,
  EuiFlexGroup,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiPageContent,
  EuiModalFooter,
  EuiOverlayMask,
} from '@elastic/eui';

import './App.css';

import CardList from './components/CardList';
import Card from './components/Card';
import Field from './components/Field';
import Fish from './components/Fish';

import { hasOneoff, hasPermanent, hasPoint, canCuttle, hasTarget, getTargets } from './utils/card';

const socket = io();

function Game(props) {
  const { player } = props;

  const [data, setData] = useState();
  const [players, setPlayers] = useState();
  const [hands, setHands] = useState();
  const [oneoff, setOneoff] = useState();
  const [selected, setSelected] = useState(null);
  const [target, setTarget] = useState(false);
  const [targetMode, setTargetMode] = useState('field');
  const canPlay = data?.turn % 2 === players?.turn && !data?.over;
  const [targets, setTargets] = useState([]);
  const [type, setType] = useState();
  const selectedCard = selected !== null ? hands[players.self][selected] : null;

  const updateHands = (data) => {
    setData(data);
    socket.emit('get_hands', (data) => {
      console.log('hands', data);
      setHands(data.hands);
    });
  };

  const updateData = () => {
    socket.emit('get_data', (data) => {
      console.log('data', data);
      setData(data);
    });
  };

  const updateOneoff = () => {
    socket.emit('get_oneoff', (data) => {
      console.log('oneoff', data);
      setOneoff(data);
    });
  };

  const updatePlayers = () => {
    socket.emit('get_players', (data) => {
      console.log('players', data);
      setPlayers(data.players);
    });
  };

  const selectCard = (card) => {
    setSelected(hands[players.self].indexOf(card));
  };

  const targetCard = (card) => {
    if (targets.indexOf(card) === -1) {
      setTargets((prev) => [...prev, card]);
    } else {
      setTargets((prev) => prev.filter((prev) => prev !== card));
    }
  };

  useEffect(() => {
    fetch(`/login/${player}`);

    updateData();
    updatePlayers();
    updateHands();

    socket.on('update', (data, players) => {
      console.log('updated data', data);
      if (players) {
        setData(data);
        setPlayers(players.players);
      } else {
        updateHands(data);
      }
    });

    socket.on('connect', () => {
      updateData();
      updatePlayers();
      updateHands();
      updateOneoff();
      setTarget(0);
      setSelected(null);
    });

    socket.on('restart', () => {
      updatePlayers();
      setOneoff();
      setTargets();
    });

    socket.on('players', (players) => {
      console.log('updated players', players);
      setPlayers(players.players);
    });

    socket.on('oneoff', (data) => {
      setOneoff(data);
      console.log('oneoff', data);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [player]);

  return (
    <EuiPageContent>
      <EuiFlexGroup direction="column">
        {/* <Fish /> */}
        {selected !== null ? (
          <EuiOverlayMask onClick={() => setSelected(null)}>
            <EuiModal onClose={() => setSelected(null)}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>Choose an action</EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                <Card card={hands[players.self][selected]} />
              </EuiModalBody>

              <EuiModalFooter>
                <EuiButton
                  disabled={!hasPoint(selectedCard)}
                  onClick={() => {
                    socket.emit(
                      'move',
                      {
                        action: 'play',
                        index: selected,
                        type: 'point',
                        targets: [],
                      },
                      () => {
                        setSelected(null);
                      },
                    );
                  }}
                  fill
                >
                  Play Value
                </EuiButton>

                <EuiButton
                  disabled={!canCuttle(selectedCard, data?.field[players.other].point.cards)}
                  onClick={() => {
                    setTarget(1);
                    setTargets([]);
                    setType('cuttle');
                    setTargetMode(['opponent', 'point']);
                  }}
                  fill
                >
                  Cuttle
                </EuiButton>

                <EuiButton
                  disabled={!hasOneoff(selectedCard) && !hasPermanent(selectedCard)}
                  onClick={() => {
                    if (!hasTarget(selectedCard)) {
                      socket.emit(
                        'move',
                        {
                          action: 'play',
                          index: selected,
                          type: 'special',
                          targets: [],
                        },
                        () => {
                          setSelected(null);
                        },
                      );
                    } else {
                      const values = getTargets(selectedCard);
                      console.log(values);

                      setTarget(values.count);
                      setTargets([]);
                      setTargetMode(values.mode);
                      setType('special');
                    }
                  }}
                  fill
                >
                  Play Effect
                </EuiButton>
              </EuiModalFooter>
            </EuiModal>
          </EuiOverlayMask>
        ) : null}
        {oneoff?.turn % 2 == players?.turn ? (
          <EuiOverlayMask>
            <EuiModal maxWidth={false}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>
                  {players.other}
                  {oneoff.counter ? ' countered' : ' used an one-off card'}
                </EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                <Card card={oneoff.effects[oneoff.effects.length - 1]} />
              </EuiModalBody>

              <EuiModalFooter>
                <EuiButton
                  color="danger"
                  onClick={() => {
                    socket.emit('move', {
                      action: 'accept',
                    });
                    setOneoff(null);
                  }}
                  fill
                >
                  Accept
                </EuiButton>

                <EuiButton
                  disabled={hands[players.self].filter((card) => card.value == 1).length == 0}
                  onClick={() => {
                    const card = hands[players.self].find((card) => card.value == 1);
                    const index = hands[players.self].indexOf(card);
                    socket.emit('move', {
                      action: 'counter',
                      index,
                    });
                    setOneoff(null);
                  }}
                  fill
                >
                  Counter
                </EuiButton>
              </EuiModalFooter>
            </EuiModal>
          </EuiOverlayMask>
        ) : null}
        {target ? (
          <EuiOverlayMask onClick={() => setTarget(0)}>
            <EuiModal onClose={() => setTarget(0)}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>Pick a card to target</EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                {data && players ? (
                  <Field
                    data={data}
                    players={players}
                    onClick={targetCard}
                    targets={targets}
                    filter={targetMode}
                  />
                ) : null}
              </EuiModalBody>

              <EuiModalFooter>
                <EuiButton
                  disabled={target != targets.length}
                  onClick={() => {
                    socket.emit(
                      'move',
                      {
                        action: 'play',
                        index: selected,
                        type,
                        targets,
                      },
                      () => {
                        setTarget(0);
                        setTargets([]);
                        setSelected(null);
                      },
                    );
                  }}
                  fill
                >
                  Confirm
                </EuiButton>
              </EuiModalFooter>
            </EuiModal>
          </EuiOverlayMask>
        ) : null}
        {data?.over ? <div>Winner: {data ? data.winner : null}</div> : null}
        Other hand
        <div className="hand">
          {hands && players ? <CardList cards={hands[players.other]} /> : null}
        </div>
        {data && players ? <Field data={data} players={players} /> : null}
        Hand
        <div className="hand">
          {hands && players ? (
            <CardList cards={hands[players.self]} onClick={canPlay ? selectCard : null} />
          ) : null}
        </div>
        {data?.over ? (
          <EuiButton
            fill
            disabled={data && data.deck === 0}
            onClick={() => {
              socket.emit('restart');
            }}
          >
            Play again
          </EuiButton>
        ) : (
          <EuiButton
            disabled={data?.deck === 0 || !canPlay}
            onClick={() => {
              socket.emit('move', {
                action: 'draw',
              });
            }}
            fill
          >
            Draw ({data?.deck ?? 0})
          </EuiButton>
        )}
      </EuiFlexGroup>
    </EuiPageContent>
  );
}

export default Game;
