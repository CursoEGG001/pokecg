import { useContext, useState, useEffect } from 'react';
import { CardContext } from './CardContext';
import PokedexServicio from '../../services/pokemon-api'

export default function CardPresenter(props) {
    const [dat, setDat] = useState([]);
    const [imagen, setImagen] = useState("");
    const [pokenombre, setPokenombre] = useState("");
    useEffect(() => {
        let isMounted = true;

        PokedexServicio.getCharacterByName(props.info)
                .then((data) => {
                    if (isMounted) {
                        setImagen(data.sprites.front_default);
                        setPokenombre(data.name);
                        setDat(data.stats);
                    }
                })
                .catch((e) => console.log(e.message));

        return () => {
            isMounted = false;
        };
    }, [props.info]);

    function CardInfo() {
        return(
                <>
                <h3>{pokenombre}</h3>
                <img className="card-image" src={imagen} alt={pokenombre} height="auto" width="100%"/>
                <ul>
                    {dat
                                .filter((laOpcion) => props.opcion && laOpcion.stat.name === props.opcion)
                                .map((d) => (
                                                <li key={d.stat.url}>
                                                    {d.stat.name}: {d.base_stat}
                                                </li>
                                            )
                                )
                    }
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

