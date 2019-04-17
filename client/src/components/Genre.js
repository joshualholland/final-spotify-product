import React, { Component } from 'react';
import CanvasJSReact from '../utils/canvasjs.react';
import SpotifyWebApi from 'spotify-web-api-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import './css/Genre.css';
import { Link } from 'react-scroll';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const spotifyApi = new SpotifyWebApi();

export default class Genre extends Component {
    constructor(props) {
        super(props)
        this.state = {
            genres: {
                rock: null,
                rap: null,
                soul: null,
                folk: null,
                indie: null,
                classics: null,
                country: null,
                electronic: null,
                other: null
            }
        }
    }

    async componentDidMount() {
        try {
            let genres = await spotifyApi.getMyTopArtists();
            let n = 20;
            let rockArray = [];
            let popArray = [];
            let rapArray = [];
            let soulArray = [];
            let folkArray = [];
            let indieArray = [];
            let classicsArray = [];
            let countryArray = [];
            let electronicArray = [];
            let otherArray = [];
            for (let i = 0; i < n; i++) {
                genres.items[i].genres.forEach(genre => {
                    if (genre.includes('rock') || genre.includes('metal') || genre.includes('post-grunge') || genre.includes('alternative') || genre.includes('punk')) {
                        rockArray.push(genre)
                    } else if (genre.includes('hip hop') || genre.includes('rap')) {
                        rapArray.push(genre)
                    } else if (genre.includes('pop')) {
                        popArray.push(genre)
                    } else if (genre.includes('soul')) {
                        soulArray.push(genre)
                    } else if (genre.includes('folk') || genre.includes('americana') || genre.includes('indiecoustica')) {
                        folkArray.push(genre)
                    } else if (genre.includes('indie') || genre.includes('singer-songwriter')) {
                        indieArray.push(genre)
                    } else if (genre.includes('adult standards') || genre.includes('classic')) {
                        classicsArray.push(genre)
                    } else if (genre.includes('country') || genre.includes('bluegrass') || genre.includes('holler')) {
                        countryArray.push(genre)
                    } else if (genre.includes('mellow') || genre.includes('house') || genre.includes('wave') || genre.includes('escape')) {
                        electronicArray.push(genre)
                    } else (
                        otherArray.push(genre)
                    )
                });
            }

            this.setState({
                genres: {
                    rock: rockArray.length,
                    rap: rapArray.length,
                    soul: soulArray.length,
                    folk: folkArray.length,
                    indie: indieArray.length,
                    classics: classicsArray.length,
                    country: countryArray.length,
                    electronic: electronicArray.length,
                    other: otherArray.length
                }
            });
        } catch (e) { console.log(e) }
    }

    render() {
        const options = {
            theme: "dark2",
            animationEnabled: true,
            exportFileName: "Top Genres",
            exportEnabled: true,
            title: {
                text: "Top Genres from Your Top Artists"
            },
            data: [{
                type: "pie",
                showInLegend: true,
                legendText: "{label}",
                toolTipContent: "{label}: <strong>{y}%</strong>",
                indexLabel: "{y}%",
                indexLabelPlacement: "inside",
                dataPoints: [
                    { y: this.state.genres.rock, label: "Rock" },
                    { y: this.state.genres.rap, label: "Hip Hop" },
                    { y: this.state.genres.indie, label: "Indie" },
                    { y: this.state.genres.folk, label: "Folk" },
                    { y: this.state.genres.soul, label: "Soul" },
                    { y: this.state.genres.classics, label: "Classics" },
                    { y: this.state.genres.country, label: "Country" },
                    { y: this.state.genres.electronic, label: "Electronic" },
                    { y: this.state.genres.other, label: "Other" }
                ]
            }]
        }
        return (
            <div className='genre'>
                <div className='col-md-8 col-sm-10' id='genre-contain'>
                    <CanvasJSChart options={options} />
                </div>
                <div className='scroll-genre'>
                        <Link
                            to='decade-chart'
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