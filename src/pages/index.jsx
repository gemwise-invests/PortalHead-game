import React from 'react';
import Head from 'next/head';
import { Box } from '@chakra-ui/core';
import { useMachine } from '@xstate/react';

import { duplicateArray, shuffleArray } from '../utils';
import { FlippableCard, WelcomeScreen, WonModal } from '../components';
import { flippingCardsGame } from '../machines';

const HomePage = () => {
  const allImagesRef = React.useRef(shuffleArray(duplicateArray(images)));
  const [state, send] = useMachine(flippingCardsGame, {
    devTools: true,
  });

  const handleFlip = React.useCallback(
    (flipIndex) => {
      send({ type: 'FLIP', index: flipIndex });
    },
    [send],
  );

  const handleStartGame = React.useCallback(() => {
    send('START_GAME', { allCards: allImagesRef.current, flipCardDuration: FLIP_CARD_ANIMATION_DURATION });
  }, [send]);

  const handleResetGame = React.useCallback(() => {
    send('RESET_GAME');
    allImagesRef = React.useRef(shuffleArray(duplicateArray(images)));
  }, [send]);

  return (
    <>
      <Head>
        <title>PortalHeads Demo</title>
        <link href="https://fonts.googleapis.com/css2?family=Lily+Script+One&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <Box as="main">
        {state.matches('playing') && (
          <Box
            height="100vh"
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gridTemplateRows="repeat(3, 1fr)"
            alignItems="center"
            alignContent="center"
            gridGap={8}
            p={10}
          >
            {allImagesRef.current.map((image, index) => (
              <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" key={index}>
                <FlippableCard
                  image={image}
                  flipped={state.context.correctIndexes.includes(index) || state.context.flippedIndexes.includes(index)}
                  animationDuration={FLIP_CARD_ANIMATION_DURATION}
                  onFlip={() => handleFlip(index)}
                />
              </Box>
            ))}
          </Box>
        )}

        {state.matches('standby') && <WelcomeScreen onStartButtonClick={handleStartGame} />}

        <WonModal isOpen={state.matches('won')} onBackButtonClick={handleResetGame} />
      </Box>
    </>
  );
};

const images = [
  'https://portalheads.io/assets/images/14.png',
  'https://portalheads.io/assets/images/15.png',
  'https://portalheads.io/assets/images/17.png',
  'https://portalheads.io/assets/images/19.png',
  'https://portalheads.io/assets/images/21.png',
  'https://portalheads.io/assets/images/22.png', 
];

const FLIP_CARD_ANIMATION_DURATION = 600;

export default HomePage;
