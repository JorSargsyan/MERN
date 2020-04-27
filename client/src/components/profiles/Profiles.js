import React, { Fragment, useEffect, useState } from 'react'
import Spinner from "../layout/Spinner"
import { getProfiles } from "../../actions/profile"
import ProfileItem from "./ProfileItem"
import { useSelector, useDispatch } from 'react-redux';

function Profiles() {
    const [filteredData, setFilteredData] = useState([]);
    const [filterString, setFilterString] = useState("");
    const profilesData = useSelector(state => state.profile);
    const [isBusy, setIsBusy] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        setIsBusy(true);
        dispatch(getProfiles());
    }, []);

    useEffect(() => {
        if (profilesData) {
            setFilteredData(profilesData);
            if (profilesData.profiles.length) {
                setIsBusy(false);
            }
        }
    },[profilesData])

    const handleFilterChange = (e) => {
        setFilterString(e.target.value);
    }

    useEffect(() => {
        let newFilteredData = [];
        profilesData.profiles.forEach((profile) => {
            if (profile.user.name.toUpperCase().includes(filterString.toUpperCase())){
                newFilteredData.push(profile);
            }
        });

        setFilteredData(newFilteredData);
    }, [filterString, profilesData]);

    return (
        <Fragment>
            {
                isBusy ? <Spinner /> :
                    <Fragment>
                        <h1 className="large text-primary">Developers</h1>
                        <div className="filter-section">
                            <p className="lead">
                                    <i className="fab fa-connectdevelop"></i>
                                Browse and connect with developers
                            </p>
                            <input type="text" value={filterString} onChange={handleFilterChange} placeholder="Filter Developers" />
                        </div>
                        <div className="profiles">
                            {filteredData.length ? (filteredData.map(
                                (profile) => (<ProfileItem key={profile._id} profile={profile} />)
                            )) : <h4>No Profiles found</h4>}
                        </div>
                    </Fragment>
            }
        </Fragment>
    )
}


export default Profiles;

