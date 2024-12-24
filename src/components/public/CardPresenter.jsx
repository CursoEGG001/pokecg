/**
 * @fileoverview Componente que renderiza y gestiona la visualización de cartas Pokemon.
 */

import { useContext, useState, useEffect } from 'react';
import { CardContext } from './CardContext';
import PokedexServicio from '../../services/pokemon-api'
import PropTypes from 'prop-types';

/**
 * @typedef {Object} PokemonStat
 * @property {Object} stat - Información del stat
 * @property {string} stat.name - Nombre del stat
 * @property {string} stat.url - URL de referencia del stat
 * @property {number} base_stat - Valor base del stat
 */

/**
 * Este componente renderiza una carta Pokemon con info y imagen.
 * 
 * @component
 * @param {object} props - propiedades del componente.
 * @param {string} props.info - Nombre del pokemon a mostrar.
 * @param {string} props.juega - Identificador de jugador (ej.: "1" or "2").
 * @param {string} [props.opcion] - Nombre de opción a filtrar y mostrar del stat del Pokemon.
 * @returns {JSX.Element} El render del componente Carta Pokemon.
 */
export default function CardPresenter(props) {
    /** @type {[PokemonStat[], Function]} Estado para stats del Pokemon */
    const [dat, setDat] = useState([]);

    /** @type {[string, Function]} Estado para URL de la imagen del Pokemon */
    const [imagen, setImagen] = useState("");

    /** @type {[string, Function]} Estado para nombre del Pokemon */
    const [pokenombre, setPokenombre] = useState("");

    /**
     * Efecto para cargar datos del Pokemon cuando cambia props.info
     * @type {void}
     */
    useEffect(() => {
        let isMounted = true;

        /**
         * Trae data de Pokemon por name y actualiza estado de variables.
         */
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

    /**
     * Renderiza la sección con info del pokemon incluyendo name, image, y stats filtrado (si se aplica).
     * @returns {JSX.Element} El render de la sección info de Pokemon.
     */
    function CardInfo() {
        return (
                <>
                <h3>{pokenombre}</h3>
                <img className="card-image" src={imagen} alt={pokenombre} height="auto" width="100%" />
                <ul>
                    {dat
                                .filter((laOpcion) => props.opcion && laOpcion.stat.name === props.opcion)
                                .map((d) => (
                                                <li key={d.stat.url}>
                                                    {d.stat.name}: {d.base_stat}
                                                </li>
                                            ))}
                </ul>
                </>
                );
    }

    return (
            <>
            <h1>Jugador {props.juega}</h1>
            <CardInfo />
            </>
            );
}

/**
 * PropTypes para validación de props del componente
 */
CardPresenter.propTypes = {
    info: PropTypes.string.isRequired,
    juega: PropTypes.string.isRequired,
    opcion: PropTypes.string
};