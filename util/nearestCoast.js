import stations from '../public/stations.json'
import haversineDistance from './haversineFormula'

export default function findNearestCoast(userLat,userLng){
    let nearest=stations[0];
    let minDist=haversineDistance(userLat,userLng,nearest.lat,nearest.lng)

    stations.forEach(station =>{
        const dist=haversineDistance(userLat,userLng,station.lat,station.lng)
        if(dist<minDist){
            minDist=dist
            nearest=station
        }
    })

    return nearest;
}