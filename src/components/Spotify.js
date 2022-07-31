import React, {useEffect,useRef, useState}  from "react";
import styled from "styled-components";
import axios from "axios";
import {reducerCases} from "../utils/constants";
import {useStateProvider} from "../utils/stateprovider";
import SideBar from "./Sidebar";
import Navbar from "./Navbar";
import Body from "./Body";
import Footer from "./Footer";


export default function Spotify() {
    const [{token},dispatch] = useStateProvider();
    const [navBackground, setNavBackground] = useState(false);
    const [headerBackground, setHeaderBackground] = useState(false);
    const bodyRef= useRef();
    const bodyScrolled = () => {
        bodyRef.current.scrollTop >=30 ? setNavBackground(true): setNavBackground(false);
        bodyRef.current.scrollTop >=268 ? setHeaderBackground(true) : setHeaderBackground(false);
    };

    useEffect(()=> {
        const getUserInfo = async ()=> {
            const {data} = await axios.get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type":"application/json",
                },
            });
            console.log("Datas",data);
            const userInfo = {
                userId:data.id,
                userUrl: data.external_urls.spotify,
                name: data.display_name
            };
            dispatch({type:reducerCases.SET_USER, userInfo});
        };
        getUserInfo();
    },[dispatch, token]);

    useEffect(() => {
        const getPlaybackState = async() => {
            const {data} =await axios.get(`https://api.spotify.com/v1/me/player`, {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type":"application/json",
                },
            });
            dispatch({
                type:reducerCases.SET_PLAYER_STATE,
                playerState:data.is_playing,
            });
        };
        getPlaybackState();
    },[dispatch,token])
     
    return (
        <Container>
            <div className="spotify_body">
                <SideBar/>
                <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
                    <Navbar navBackground={navBackground}/>
                    <div className="body__contents">
                        <Body headerBackground={headerBackground}/>
                    </div>
                </div>
            </div>
            <div className="spotify-footer">
                <Footer/>
            </div>
        </Container>
    )
}

const Container =styled.div `
  max-width:100vw;
  max-height:100vh;
  overflow:hidden;
  display:grid;
  grid-template-rows:85vh 15vh;
  .spotify_body{
    display:grid;
    grid-template-columns:15vw 85vw;
    height:100%;
    width:100%;
    backgrounds: linear-gradient(transparent,rgba(0, 0, 0,1));
    background-color: rbga(32, 87 100);
     .body {
        height:93%;
        width:100%;
        overflow:auto;
        background-color:#000;
        &::-webkit-scrollbar {
            width: 0.7rem;
            max-height: 2rem;
            &-thumb {
                background-color: rgba(255, 255, 255, 0.6);
            }
        }
     }
  }
`