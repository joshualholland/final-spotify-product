import React, { Component } from 'react';
import CanvasJSReact from '../utils/canvasjs.react';
import SpotifyWebApi from 'spotify-web-api-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-scroll';
import './css/Decade.css';


const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const spotifyApi = new SpotifyWebApi();

export default class Decades extends Component {
    constructor(props) {
        super(props)
        this.state = {
            decades: {
                current: null,
                twoThousands: null,
                ninties: null,
                eighties: null,
                seventies: null,
                sixtiesAndBelow: null
            }
        }
    }

    async componentDidMount() {
        try {
            let decades = await spotifyApi.getMyTopTracks();
            let n = 20;
            let year = []
            let current = [];
            let twoThousands = [];
            let ninties = [];
            let eighties = [];
            let seventies = [];
            let sixtiesAndBelow = [];
            for (let i = 0; i < n; i++) {
                let decadeArr = []
                decadeArr.push(decades.items[i].album.release_date.split('', 4));
                let string = decadeArr[0].join('');
                year.push(string);
            }
            for (let r = 0; r < 9; r++) {
                year.forEach(one => {
                    if (one.includes(`201${r}`)) {
                        current.push(one)
                    } else if (one.includes(`200${r}`)) {
                        twoThousands.push(one)
                    } else if (one.includes(`199${r}`)) {
                        ninties.push(one)
                    } else if (one.includes(`198${r}`)) {
                        eighties.push(one)
                    } else if (one.includes(`197${r}`)) {
                        seventies.push(one)
                    } else if (one.includes(`196${r}`)) {
                        sixtiesAndBelow(one)
                    }
                })
            }

            this.setState({
                decades: {
                    current: current.length,
                    twoThousands: twoThousands.length,
                    ninties: ninties.length,
                    eighties: eighties.length,
                    seventies: seventies.length,
                    sixtiesAndBelow: sixtiesAndBelow.length
                }
            })
        } catch (e) { console.log(e) }
    }

    render() {
        const options = {
            title: {
                text: "Decades of Your Top Tracks"
            },
            data: [
                {
                    type: "column",
                    dataPoints: [
                        { label: "60's & Under", y: this.state.decades.sixtiesAndBelow },
                        { label: "70's", y: this.state.decades.seventies },
                        { label: "80's", y: this.state.decades.eighties },
                        { label: "90's", y: this.state.decades.ninties },
                        { label: "2000's", y: this.state.decades.twoThousands },
                        { label: "2010's", y: this.state.decades.current }
                    ]
                }
            ]
        }

        return (
            <div className='decade'>
                <div className='decade-chart col-md-8 col-sm-10'>
                    <CanvasJSChart options={options} />
                </div>
                <div className='scroll-decade'>
                        <Link
                            to='scroll-other'
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={500}
                        ><span><FontAwesomeIcon icon={faSortDown} size={"lg"} color={"white"} /></span> </Link>
                    </div>
            </div>
        )
    }
}