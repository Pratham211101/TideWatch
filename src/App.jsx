import mockFavorites from '../public/mockFavorites.json'
import { useState,useEffect } from "react"
import axios from "axios"
import findNearestCoast from "../util/nearestCoast"
import haversineDistance from "../util/haversineFormula"
import formatLocalTime from "../util/formatLocalTime"

import TideMap from "./components/TideMap"
import Header from "./components/Header"
import TideOverview from "./components/TideOverview"
import UpcomingTides from "./components/UpcomingTides"
import FavoriteCoasts from "./components/FavoriteCoasts"
import FishingTimes from "./components/FishingTimes"
import NearestCoastHeader from './components/NearestCoast'

function App() {

  const STORMGLASS_API_KEY=import.meta.env.VITE_STORMGLASS_API_KEY
  
  const [location,setLocation]=useState(null)
  const [error,setError]=useState(null)
  const [place,setPlace]=useState(null)
  const [tides,setTides]=useState([])
  const [loading,setLoading]=useState(false)
  const [nearestStation,setNearestStation]=useState(null)
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites,setFavorites]=useState([])

  useEffect(()=>{
    const savedLocation=localStorage.getItem('user_location')
    const savedPlace=localStorage.getItem('user_place')
    const cachedData=JSON.parse(localStorage.getItem("cachedTideData"))
    const savedStation=localStorage.getItem('nearestStation')
    const savedFavorites=JSON.parse(localStorage.getItem('favoriteCoasts')) || []

    setFavorites(savedFavorites)

    if(savedLocation){

      const parsedLocation=JSON.parse(savedLocation)
      setLocation(parsedLocation)

      if(savedPlace){
        setPlace(savedPlace)
      }else{
        fetchPlace(parsedLocation.lat,parsedLocation.lng)
          .then((fetchedPlace)=>{
            setPlace(fetchedPlace)
            localStorage.setItem('user_place',fetchedPlace)
          })
          .catch(()=>{
            setPlace("unknown location")
          })
      }

      if (savedStation) {
        setNearestStation(JSON.parse(savedStation));
      }

      if(cachedData && Date.now() - cachedData.timestamp < 6*60*60*1000){
        console.log("Using cached tide data on startup")
        setTides(cachedData.data)
        setLoading(false)
      }else{
        console.log("Fetching fresh tide data on startup")
        fetchTides(parsedLocation)
      }
    }

  },[])

  useEffect(() => {
  if (!nearestStation || !nearestStation.name) return;

  const favorites = (JSON.parse(localStorage.getItem("favoriteCoasts")) || [])
    .filter(fav => fav && fav.name);

  const exists = favorites.some(fav => fav.name === nearestStation.name);
  setIsFavorite(exists);

}, [nearestStation]);

  const toUnixSeconds = (date) => Math.floor(date.getTime()/1000)

  function generateMockTides (){
    const now=new Date
    return [
      { time: new Date(now.getTime() * 60 * 60 * 1000).toISOString(), sg: 1.5},
      { time: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(), sg: 0.3 },
      { time: new Date(now.getTime() + 10 * 60 * 60 * 1000).toISOString(), sg: 1.7 },
      { time: new Date(now.getTime() + 16 * 60 * 60 * 1000).toISOString(), sg: 0.2 }
    ]
  }

  const getLocation=()=>{

    if(!navigator.geolocation){
      setError("Geolocation not supported by your browser")
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position)=>{
        //location is set as an arr of 2 elements lat and long
        const loc={
          lat:position.coords.latitude,
          lng:position.coords.longitude
        }
        // console.log(position);
        // console.log(STORMGLASS_API_KEY);
        
        setLocation(loc)
        setError(null)
        localStorage.setItem('user_location',JSON.stringify(loc))

        const placeName=await fetchPlace(loc.lat,loc.lng)
        setPlace(placeName)
        localStorage.setItem("user_place",placeName)

        fetchTides(loc)
      },
      (err)=> setError(err.message),
      {enableHighAccuracy :true,timeout:10000}
    )
  }

  
  //to get placename from lat and long
  const fetchPlace = async (lat , lng)=>{
    try {
      const res= await axios.get(`https://nominatim.openstreetmap.org/reverse`,{
        params:{
          lat:lat,
          lon:lng,
          format:'jsonv2'
        },
        headers:{
          'Accept-Language':'en'
        }
      })
      // console.log(res)
      setPlace( res.data.display_name || "unknown location")
      console.log(res.data.display_name);
      return res.data.display_name || "unknown location"
      
    } catch (err) {
      setPlace("unknow location")
      setError("error fetching place name")
    }
  }

  const fetchTides= async(location)=>{
    if(!location){
      setError("Location not set. Click 'Get Location' first")
      return;
    }
    setLoading(true)

    try {
      setError(null)

      const nearest=findNearestCoast(location.lat,location.lng)
      setNearestStation(nearest)
      localStorage.setItem("nearestStation",JSON.stringify(nearest))

      const start=new Date()
      const end=new Date(start.getTime()+24*60*60* 1000) // 24 hours ahead

      const STORMGLASS_API_URL=`${import.meta.env.VITE_STORMGLASS_API_URL}?lat=${nearest.lat}&lng=${nearest.lng}&start=${toUnixSeconds(start)}&end=${toUnixSeconds(end)}`

      const cachedData=JSON.parse(localStorage.getItem('cachedTideData'))
      //if cached data exists and is less than 6 hrs old
      if(cachedData && Date.now()-cachedData.timestamp< 6*60*60*1000 ){
        console.log("using cached tide data")
        setTides(cachedData.data);
        setLoading(false)
        return
        
      }

      //else fetch from api
      console.log("Fetching fresh data from API...");
      
      const res= await axios.get(STORMGLASS_API_URL,{
        headers:{Authorization:STORMGLASS_API_KEY}
      })

      if(res.data && res.data.data){
        setTides(res.data.data)

        //store the data in local storage
        localStorage.setItem('cachedTideData',JSON.stringify({
          timestamp:Date.now(),
          data:res.data.data
        }));
        
      }else{
        setError("No tide data found")
      }
    } catch (err) {
      console.error("API error, using mock data",err)
      setTides(generateMockTides())
      
    } finally {
      setLoading(false)
    }

  }

  const getNextHighLowTide=()=>{
    if(!tides.length) return {nextHigh:null,nextLow:null}

    const now=new Date()

    const futureTides = tides.filter(t=> new Date(t.time) > now)

    if(!futureTides.length) return {nextHigh:null,nextLow:null}

    const nextHigh=futureTides.reduce((max,curr)=> curr.sg > max.sg ? curr : max ,futureTides[0])
    const nextLow=futureTides.reduce((min,curr)=> curr.sg < min.sg ? curr : min, futureTides[0])

    return {nextHigh,nextLow}
  }

  // Inside App component
  const saveFavoriteCoast = () => {
    if (!nearestStation || !nextHigh || !nextLow) {
      console.error("Missing data to save favorite coast.");
      return;
    }

    const favoriteCoast = {
      name: nearestStation.name,
      lat: nearestStation.lat,
      lng: nearestStation.lng,
      nextHigh: {
        time: nextHigh.time,
        height: nextHigh.sg
      },
      nextLow: {
        time: nextLow.time,
        height: nextLow.sg
      }
    };

    // Get existing favorites or initialize an empty array
    let existingFavorites = JSON.parse(localStorage.getItem("favoriteCoasts")) || [];
    const index=existingFavorites.findIndex(fav=>fav.name===nearestStation.name)
    if(index===-1){
      existingFavorites.push(favoriteCoast)
      setIsFavorite(true)
    }else{
      existingFavorites.splice(index,1);
      setIsFavorite(false)
    }

    localStorage.setItem("favoriteCoasts",JSON.stringify(existingFavorites))
    
    setFavorites(existingFavorites)
  };


  const {nextHigh,nextLow} = getNextHighLowTide()
  return (
  <>
    <Header
      setLocation={setLocation}
      setPlace={setPlace}
      place={place}
      getLocation={getLocation}
      setTides={setTides}
      setNearestStation={setNearestStation}
      saveFavoriteCoast={saveFavoriteCoast}
      isFavorite={isFavorite}
    />
    <NearestCoastHeader nearestStation={nearestStation} />

    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
      
        {/* LEFT SIDE - 2 Columns for Overview & Fishing */}
        <div className="lg:col-span-3 space-y-6">
        
          {/* First Row: TideOverview and FishingTimes side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TideOverview tides={tides} nextHigh={nextHigh} nextLow={nextLow} />
            <FishingTimes 
              nearestStation={nearestStation}
              nextHigh={nextHigh}
              nextLow={nextLow}
            />
          </div>

          {/* Second Row: Map and Upcoming Tides */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TideMap station={nearestStation} />
            <UpcomingTides tides={tides} />
          </div>

          {/* Third Row: Favorite Coasts */}
          <FavoriteCoasts favorites={favorites} />
        </div>
      </div>
    </div>
  </>
  )
}

export default App
