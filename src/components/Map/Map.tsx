import {useEffect, useRef, useState, memo} from "react";

import type { LngLat } from '../../types/ymaps.ts';

interface MapTestProps extends React.HTMLAttributes<HTMLDivElement> {
    routePoints?: LngLat[];
    center?: number[];
    zoom?: number;
}

const Map = ({ routePoints, center = [54.81181346408782,56.0817958701094], zoom = 16, className, ...props }: MapTestProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<ymaps.Map | undefined>();

    const { Map, multiRouter } = window?.ymaps;

    const initMap = () => {
        if (!map) {
            const map = new Map(mapRef.current!, { center, zoom, controls: [] });
            setMap(map);
        }
    }

    useEffect(() => {
        window.ymaps.ready(initMap);
    }, []);

    useEffect(() => {
        if (map) {
            map.geoObjects.removeAll();

            if (routePoints) {
                const route = new multiRouter.MultiRoute({
                    referencePoints: routePoints,
                    params: {
                        routingMode: "auto"
                    },
                }, {
                    boundsAutoApply: true
                });

                map.geoObjects.add(route);
            }
        }
    }, [routePoints]);

    return <div ref={mapRef} className={className} {...props} />
};

export default memo(Map);