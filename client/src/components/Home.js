import React, { Component } from 'react';
import './css/Home.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons'

import Genre from './Genre';
import Decades from './Decades';
import Other from './Other';

import Logo from './svg/Logo';
import Play from './svg/Play';
import Pause from './svg/Pause';
import Next from './svg/Next';
import Previous from './svg/Previous';

import { Link } from 'react-scroll';


const spotifyApi = new SpotifyWebApi();

class Home extends Component {
    constructor() {
        super();
        const params = this.getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: {
                name: 'Not Checked',
                albumArt: '',
                artist: null,
            },
            me: {
                display_name: null,
                profile_img: null,
                followers: null
            },
            isPaused: false,
        }
    }

    // gets token off url
    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    async componentDidMount() {
        try {
            let song = await spotifyApi.getMyCurrentPlaybackState();
            this.setState({
                nowPlaying: {
                    name: song.item.name,
                    albumArt: song.item.album.images[0].url,
                    artist: song.item.artists[0].name,
                }
            });

            let me = await spotifyApi.getMe();
            this.setState({
                me: {
                    display_name: me.display_name,
                    profile_img: me.images[0].url,
                    followers: me.followers.total
                }
            });
        } catch (e) {
            console.log(e)
        }
    }

    async pauseTrack() {
        try {
            await spotifyApi.pause()
            this.setState({
                isPaused: true
            })
        } catch (e) {
            console.log(e)
        }
    }

    async playTrack() {
        try {
            await spotifyApi.play()
            this.setState({
                isPaused: false
            })
        } catch (e) {
            console.log(e)
        }
    }

    async nextTrack() {
        try {
            await spotifyApi.skipToNext();
            setTimeout(function () { window.location.reload() }, 2000);
        } catch (e) { console.log(e) }
    }

    async previousTrack() {
        try {
            await spotifyApi.skipToPrevious();
            setTimeout(function () { window.location.reload() }, 2000);
        } catch (e) { console.log(e) }
    }

    switchButtons() {
        if (this.state.isPaused === false) {
            return (<div id='pauseSpotify' className='m-3' style={{ display: 'inline-block' }} onClick={e => this.pauseTrack()}><Pause /></div>)
        } else if (this.state.isPaused === true) {
            return (<div id='playSpotify' className='m-3' style={{ display: 'inline-block' }} onClick={e => this.playTrack()}><Play /></div>)
        }
    }

    render() {
        return (
            <div className="Home">
                <div className='svg-top'>
                    <Logo />
                    <div className='scroll'>
                        <Link
                            to='genre-contain'
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                        ><span><FontAwesomeIcon icon={faSortDown} size={"lg"} color={"white"} /></span> </Link>
                    </div>
                </div>

                <div className='analytics'>

                    <Genre />
                    <Decades />
                    <Other />
                </div>
                <footer className='footer'>
                    <div className='song-container'>
                        <img className='song-img m-3' alt='album art' src={this.state.nowPlaying.albumArt} />
                        <div className='song-title'>
                            {this.state.nowPlaying.name}
                            <div className='song-artist'>
                                {this.state.nowPlaying.artist}
                            </div>
                        </div>
                    </div>
                    <div id='wrapper'>
                        <div id='buttons' className='text-center'>
                            <span onClick={e => this.previousTrack()}><Previous /></span>
                            {this.switchButtons()}
                            <span onClick={e => this.nextTrack()}><Next /></span>
                        </div>
                    </div>
                    <div className='me mr-4'>
                        <img className='me-pic' alt='profile' src={this.state.me.profile_img} />
                        <div className='me-text'>
                            <p className='text-white'>{this.state.me.display_name}</p>
                        </div>
                    </div>
                </footer>
            </div>

        );
    }
}

export default Home;