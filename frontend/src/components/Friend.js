import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import actions from "../services/api";
import TheContext from "../services/TheContext";
import Tarot from "./Tarot";

const Friend = props => {

    const { user, setUser } = useContext(TheContext);
    const [friend, setFriend] = useState();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        actions.getFriends({ userId: user?.googleId }).then((res) => {
          console.log(res);
          setFriends(res)
          setFriend(friends?.find(e=> e.googleId === props.match.params.googleId))
        });
    }, []);
    console.log(friend)
    return (
        <div>
            {friend ?
                <div>
                    {Tarot(friend)}
                </div>
                :
                <p></p>
            }
        </div>
    )
}

export default Friend