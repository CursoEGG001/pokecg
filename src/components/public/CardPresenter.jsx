import { useContext, useState, useEffect } from 'react';
import { CardContext } from './CardContext';
import PokedexServicio from '../../services/pokemon-api'

export default function CardPresenter(props) {
    const [dat, setDat] = useState([]);
    const [imagen, setImagen] = useState("");
    const [pokenombre, setPokenombre] = useState("");
    useEffect(() => {
        const oneCharacter = PokedexServicio.getCharacterByName(props.info)
                .then((data) => {
                    let obs = []
                    obs = data
                    setImagen(obs.sprites.front_default)
                    setPokenombre(obs.name)
                    setDat(obs.stats)
                })
                .catch((e) => console.log(e.message))


    }, [dat])

    function CardInfo() {
        return(
                <>
                <h3>{pokenombre}</h3>
                <img src={imagen} alt={pokenombre} height="96px" width="72px"/>
                <ul>
                    {dat.map(
                                        d => <li key={d.stat.url}>{d.stat.name}:{d.base_stat}</li>
                                )}
                </ul>
                </>
                )
    }

    return (
            <>
            <h1>Jugador {props.juega}</h1>
            <CardInfo/>
            </>
            )
}