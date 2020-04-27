import React, {useEffect, useState} from 'react';
import {Loader, LoaderOptions} from 'google-maps';
import {useSelector, useDispatch} from 'react-redux';
import {getProfiles} from '../../actions/profile';
import { useHistory } from 'react-router-dom'

const Map = () => {
    const myMapRef = React.createRef();
    const options= {/* todo */};
    const loader = new Loader('AIzaSyCfVgS-lSNvFJ443ebUPiwP0fGBVdo_99w', options);
    const profilesData = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const [mapIsInited, setMapIsInited] = useState(false);
    const history = useHistory();

    useEffect(() => {
        dispatch(getProfiles());
    }, []);

    useEffect(() => {
        if (profilesData && profilesData.profiles.length && !mapIsInited) {
            initMap(profilesData.profiles);
        }
    }, [profilesData])

    const initMap = async (profiles) => {
        const google =await loader.load();
        
        const map = new google.maps.Map(myMapRef.current, {
          center: {lat: 40.177200, lng: 44.503490},
          zoom: 13
        });

        profiles.map((item) => {
            if (item.geoLocation) {
                var myLatlng = new google.maps.LatLng(item.geoLocation.lat,item.geoLocation.lng);
                let markerDev = new google.maps.Marker({
                    position: myLatlng,
                    title:`${item.user.name}, ${item.status}`,
                    label: "D"
                });
                markerDev.addListener('click', function() {
                    history.push(`/profile/${item.user._id}`);
                });
                markerDev.setMap(map);
            }
        })

        setMapIsInited(true);
    }

    return (
        <div>
            <div className="google-map-container" ref={myMapRef}></div>
        </div>
    )
}

export default Map;