import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import './css/Other.css';
import { animateScroll as scroll } from 'react-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp } from '@fortawesome/free-solid-svg-icons'

const spotifyApi = new SpotifyWebApi();

export default class Other extends Component {
    constructor(props) {
        super(props)
        this.state = {
            popularity: null,
            playlists: null,
            main: null,
            top: null
        }
    }

    async componentDidMount() {
        let popularity = await spotifyApi.getMyTopTracks();
        let n = 20;
        let total = 0;
        for (let i = 0; i < n; i++) {
            total += popularity.items[i].popularity;
        };
        total = total / 20;
        this.setState({
            popularity: total
        });

        let playlists = await spotifyApi.getUserPlaylists();
        this.setState({
            playlists: playlists.items.length
        })

        let main = await spotifyApi.getMyTopArtists();
        this.setState({
            main: main.items[0].name
        })

        let top = await spotifyApi.getMyTopTracks();
        this.setState({
            top: top.items[0].name
        })
    };

    scrollToTop() {
        scroll.scrollToTop();
    }

    render() {
        return (
            <div className='Other'>
                <div className='other-head text-center'>
                    <h3 id='breakdown'>Breakdown</h3>
                </div>
                <div className='text-center'>
                    <h3 className='breakdown-items mt-5'>Mainstreamness: <span className='results'>{this.state.popularity}%</span></h3>
                    <h3 className='breakdown-items mt-5'>Playlists Followed: <span className='results'>{this.state.playlists}</span></h3>
                    <h3 className='breakdown-items mt-5'>Most listened to Artist: <span className='results'>{this.state.main}</span></h3>
                    <h3 className='breakdown-items mt-5'>Most listened to Track: <span className='results'>{this.state.top}</span></h3>
                </div>
                <div className='scroll-other'>
                    <span onClick={e => this.scrollToTop()}><FontAwesomeIcon icon={faSortUp} size={"lg"} color={"white"} /></span>
                </div>
            </div >
        )
    }
}