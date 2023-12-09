/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { useState } from 'react';
import { useDebounce } from 'react-use';

import { getCoords } from '../../api/api.ts';

import MapTest from '../Map/Map.tsx';
import type { LngLat } from '../../types/ymaps.ts';

import styles from './App.module.css';

const App = () => {
  const [firstPoint, setFirstPoint] = useState<string>('');
  const [firstCoord, setFirstCoord] = useState<LngLat | undefined>();

  const [secondPoint, setSecondPoint] = useState<string>('');
  const [secondCoord, setSecondCoord] = useState<LngLat | undefined>();

  useDebounce(
    () => {
      getCoords(firstPoint).then((coords) =>
        setFirstCoord([coords?.longitude!, coords?.latitude!]),
      );
    },
    1000,
    [firstPoint],
  );

  useDebounce(
    () => {
      getCoords(secondPoint).then((coords) =>
        setSecondCoord([coords?.longitude!, coords?.latitude!]),
      );
    },
    1000,
    [secondPoint],
  );

  return (
    <div className={styles.app}>
      <input
        className={styles.input}
        type="text"
        value={firstPoint}
        onChange={(event) => setFirstPoint(event.target.value)}
      />
      <input
        className={styles.input}
        type="text"
        value={secondPoint}
        onChange={(event) => setSecondPoint(event.target.value)}
      />
      <MapTest
        className={styles.map__wrapper}
        routePoints={
          firstCoord && secondCoord ? [firstCoord, secondCoord] : undefined
        }
      />
    </div>
  );
};

export default App;
