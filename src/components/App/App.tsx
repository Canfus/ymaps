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

  const [interPoint, setInterPoint] = useState<string>('');
  const [interCoord, setInterCoord] = useState<LngLat | undefined>();

  useDebounce(
    () => {
      getCoords(firstPoint).then((coords) =>
        setFirstCoord({
          latitude: coords?.latitude!,
          longitude: coords?.longitude!,
        }),
      );
      if (!firstPoint.length) {
        setFirstCoord(undefined);
      }
    },
    1000,
    [firstPoint],
  );

  useDebounce(
    () => {
      getCoords(secondPoint).then((coords) =>
        setSecondCoord({
          latitude: coords?.latitude!,
          longitude: coords?.longitude!,
        }),
      );
      if (!secondPoint.length) {
        setSecondCoord(undefined);
      }
    },
    1000,
    [secondPoint],
  );

  useDebounce(
    () => {
      getCoords(interPoint).then((coords) =>
        setInterCoord({
          latitude: coords?.latitude!,
          longitude: coords?.longitude!,
        }),
      );
      if (!interPoint.length) {
        setInterCoord(undefined);
      }
    },
    1000,
    [interPoint],
  );

  return (
    <div className={styles.app}>
      <input
        className={styles.input}
        type="text"
        placeholder="Место загрузки"
        value={firstPoint}
        onChange={(event) => setFirstPoint(event.target.value)}
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Место разгрузки"
        value={secondPoint}
        onChange={(event) => setSecondPoint(event.target.value)}
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Промежуточнчая точка"
        value={interPoint}
        onChange={(event) => setInterPoint(event.target.value)}
      />
      <MapTest
        className={styles.map__wrapper}
        startPoint={firstCoord}
        endPoint={secondCoord}
        interPoints={interCoord ? [interCoord] : undefined}
      />
    </div>
  );
};

export default App;
