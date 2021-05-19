import React, { useContext, useEffect, useState } from 'react';
import actions from '../services/api';
import TheContext from '../services/TheContext';
import axios from 'axios';
import { Origin, Horoscope } from "circular-natal-horoscope-js";
import Auth from '../services/Auth';

const Profile = () => {

    const { user, setUser } = useContext(TheContext)
    // const [myMessages, setMyMessages] = useState([])
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState();
    const [place, setPlace] = useState();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        actions.getFriends({ userId: user?.googleId }).then((res) => {
            console.log(res);
            setFriends(res.data);
        })
    }, [])
    // useEffect(() => {
    //     actions.getMyMessages().then(messages => {
    //         if (!messages.err)
    //             setMyMessages(messages)
    //     })
    // }, [])

    const [loc, setLoc] = useState({});
    useEffect(() => {
        // axios.get(`https://iron-cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?${place}`)
        //     .then(res => {
        //         setLoc(res.data.results.geometry.location)
        //     })
    })
    const handleSubmit = e => {

        const origin = new Origin({
            year: parseInt(date.slice(0, 4)),
            month: (parseInt(date.slice(5, 7)) - 1), // 0 = January, 11 = December!
            date: parseInt(date.slice(8, 10)),
            hour: parseInt(time.slice(0, 2)),
            minute: parseInt(time.slice(0, 2)),
            latitude: loc.lat,
            longitude: loc.lng,
        });
        axios.get(`https://iron-cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?${place}`)
            .then(res => {
                setLoc(res.data.results.geometry.location)
            })
        //Sample output of date and time object { date: '2021-05-03', time: '13:26' }

        const horoscope = new Horoscope({
            origin: origin,
            houseSystem: "whole-sign",
            zodiac: "tropical",
            aspectPoints: ['bodies', 'moon', 'sun', 'points', 'angles'],
            aspectWithPoints: ['bodies', 'moon', 'points', 'angles'],
            aspectTypes: ["major", "minor"],
            customOrbs: {},
            language: 'en'
        });
        const userChart = { chart: horoscope.CelestialBodies, userId: user?.googleId, rising: horoscope._ascendant }
        actions.submitDate(userChart).then(res => {
            console.log(res.data.chart);
        })
    }

    const revealChart = () => {
        return (
            <div>
                {user?.chart?.sun ?
                    <div className="chart">
                        <p>Sun: {user?.chart?.sun.Sign.label}</p>
                        <p>Moon: {user?.chart?.moon.Sign.label}</p>
                        <p>Rising: {user?.rising?.Sign.label}</p>
                        {friends?.map(a => <p>{a.name}</p>)}
                    </div>
                    :
                    <form onSubmit={handleSubmit}>
                        <input type="date" onChange={e => setDate(e.target.value)} />
                        <input type="time" onChange={e => setTime(e.target.value)} />
                        <input type="text" onChange={e => setPlace(e.target.value)} />
                        <button>Submit</button>
                    </form>}
            </div>
        )
    }


    return (
        <div>
            <p>Profile</p> {user?.name}

            {user?.name ?
                <section>
                    <img src={user?.imageUrl} alt="profile avi" />
                    <p>{user?.email}</p>

                    {revealChart()}
                </section>
                :
                <Auth setUser={setUser} />
            }
        </div>
    );
}

export default Profile;