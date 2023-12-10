import { useEffect, useRef, useMemo } from 'react';

import type { LngLat } from '../../types/ymaps.ts';
import ymaps from 'yandex-maps';

interface MapTestProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Начальныые координаты, по умолчанию Москва
   * */
  center?: number[];
  /**
   * Начальный зум, по умолчанию 16
   * */
  zoom?: number;
  /**
   * Точка А
   * */
  startPoint?: LngLat;
  /**
   * Точка Б
   * */
  endPoint?: LngLat;
  /**
   * Массив промежуточных точек
   * */
  interPoints?: LngLat[];
}

const Map = ({
  center = [55.755864, 37.617698],
  zoom = 16,
  startPoint,
  endPoint,
  interPoints,
  className,
  ...props
}: MapTestProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ymaps.Map>();

  const { Map, multiRouter } = window.ymaps;

  useEffect(() => {
    // когда карта готова к работе, создаем инстанс
    window.ymaps.ready(() => {
      if (!mapInstance.current) {
        mapInstance.current = new Map(mapRef.current!, {
          center,
          zoom,
          controls: [],
        });
      }
    });
    // удаляем карту при размонтировании
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = undefined;
      }
    };
  }, []);

  const routePoints = useMemo<LngLat[] | null>(() => {
    // проверяем если в координатах есть undefined, то не рисуем маршрут
    if (
      !startPoint?.latitude ||
      !startPoint.longitude ||
      !endPoint?.latitude ||
      !endPoint.longitude
    )
      return null;
    // если нет промежуточных, то рисуем только от А до Б
    if (!interPoints) {
      return [startPoint, endPoint];
    }
    // Рисуем маршрут от А до Б до ... Я
    return [
      startPoint,
      ...interPoints.filter((point) => point.longitude && point.latitude),
      endPoint,
    ];
  }, [endPoint, interPoints, startPoint]);

  useEffect(() => {
    // если есть инстанс карты
    if (mapInstance.current) {
      // удаляем прошлые маршруты
      mapInstance.current.geoObjects.removeAll();
      // если есть маршруты
      if (routePoints) {
        // создаем инстанс маршрута
        const route = new multiRouter.MultiRoute(
          {
            // добавляем точки по маршрутам
            referencePoints: routePoints.map((point) => [
              point.longitude,
              point.latitude,
            ]),
            params: {
              // тип передвижения
              routingMode: 'auto',
              // учитывать пробки
              avoidTrafficJams: true,
            },
          },
          {
            // автоскейл карты по маршруту
            boundsAutoApply: true,
          },
        );
        // добавляем маршрут на карту
        mapInstance.current.geoObjects.add(route);
      }
    }
  }, [multiRouter.MultiRoute, routePoints]);

  return <div ref={mapRef} className={className} {...props} />;
};

export default Map;
