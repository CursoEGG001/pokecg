/* global PropTypes */

/**
 * @fileoverview Pokemon card battle game implementation where players compare Pokemon stats.
 * @author pc
 * @version 1.0.0 
 */

import './App.css';
import { useState, useEffect, useRef, useContext } from 'react'; // Import useRef
import PokedexServicio from './services/pokemon-api';
import CardPresenter from './components/public/CardPresenter';
import { CardContext } from './components/public/CardContext';
import PokemonName from './components/public/PokemonName';
import PropTypes from 'prop-types';

/**
 * Cache for storing randomly generated Pokemon lists
 * @type {Map<string, Array<number>>}
 */

const RANDOM_LISTS_CACHE = new Map(); // Cache para números al azar

/**
 * @typedef {Object} PlayerState
 * @property {number} selectedIndex - indice del pokemon actualmente elegido
 * @property {string} name - nombre del pokemon elegido
 * @property {Array<number>} selectedList - Lista de Pokemon elegidos por indice
 */

/**
 * @typedef {Object} Players
 * @property {PlayerState} player1 - estado para player 1
 * @property {PlayerState} player2 - estado para player 2
 */

/**
 * component principal para juego de batalla de Pokemon
 * @component
 * @returns {JSX.Element} Renderizado de la app.
 */

export default function App() {

    /**
     * State hook para Pokemon data
     * @type {[Array<Object>, Function]}
     */
    const [poke, setPoke] = useState([]);

    /**
     * State hook para información del jugador
     * @type {[Players, Function]}
     */
    const [players, setPlayers] = useState({
        player1: {selectedIndex: 0, name: 'Esperando...', selectedList: []},
        player2: {selectedIndex: 0, name: 'Esperando...', selectedList: []}
    });


    const [comparisonStat, setComparisonStat] = useState('');

    /**
     * Referencia para guardar lista de pokemones
     * @type {React.MutableRefObject<Array<Object>>}
     */
    const pokemonListRef = useRef(null); // Ref para guardar pokemonList

    /**
     * Traer datos de Pokémon e inicializar lista
     * @async
     * @throws {Error} When API fetch fails
     * @returns {Promise<void>}
     */


    // Traer datos de Pokémon e inicializar lista

    const fetchPokemonData = async () => {
        try {
            const data = await PokedexServicio.getAllCharacters();
            const pokemonList = data.results;
            setPoke(pokemonList);
            pokemonListRef.current = pokemonList; // Guarda ref

            // Genera listas al azar fpara ambos jugadores listas nuevas o en cache
            const updatedPlayers = {
                player1: {
                    ...players.player1,
                    selectedList: getCachedOrGenerateList(pokemonList.length, 20, 'player1')
                },
                player2: {
                    ...players.player2,
                    selectedList: getCachedOrGenerateList(pokemonList.length, 20, 'player2')
                }
            };
            setPlayers(updatedPlayers);
        } catch (error) {
            console.error("Error fetching Pokemon data:", error);
        }
    };

    useEffect(() => {

        fetchPokemonData();
    }, []);



    const getCachedOrGenerateList = (n, m, playerKey) => {
        if (RANDOM_LISTS_CACHE.has(playerKey)) {
            return RANDOM_LISTS_CACHE.get(playerKey); // Devuelve lista en cache
        } else {
            const newList = generGruposDeNumerosAlAzar(n, m);
            RANDOM_LISTS_CACHE.set(playerKey, newList); // Cachea nueva lista
            return newList;
        }
    };

    // Actualiza nombres cuando cambia selección.
    useEffect(() => {
        if (poke.length > 0 && pokemonListRef.current) { // Verifica pokemonListRef tenga algo
            const newPlayers = {...players};
            newPlayers.player1.name = pokemonListRef.current[players.player1.selectedIndex]?.name || 'Esperando...';
            newPlayers.player2.name = pokemonListRef.current[players.player2.selectedIndex]?.name || 'Esperando...';
            setPlayers(newPlayers);
        }
    }, [players.player1.selectedIndex, players.player2.selectedIndex, poke]);

    const handlePlayerSelection = (playerKey, selectedNumber) => {
        setPlayers(prevPlayers => {
            const newPlayers = {...prevPlayers};
            const playerData = newPlayers[playerKey];
            const listIndex = playerData.selectedList.indexOf(selectedNumber);

            if (listIndex !== -1) {
                // Rota la lista
                const newList = [
                    ...playerData.selectedList.slice(listIndex + 1),
                    ...playerData.selectedList.slice(0, listIndex + 1)
                ];

                playerData.selectedList = newList;
                playerData.selectedIndex = selectedNumber;
            }

            return newPlayers;
        });
    };

    const handleStatSelection = (stat) => {
        setComparisonStat(stat);
    };

    return (
            <div className="container">
                <div className="header">
                    <div className="header-item">Jugador 1</div>
                    <div className="header-item">Acciones</div>
                    <div className="header-item">Jugador 2</div>
                </div>
                <div className="content">
                    <div className="column">
                        <CardPresenter 
                            info={players.player1.name} 
                            juega="1" 
                            opcion={comparisonStat} 
                            />
                    </div>
                    <div className="column">
                        <CardContext.Provider value={[
                                    players.player1.selectedIndex,
                                    players.player2.selectedIndex,
                                    comparisonStat
                                                      ]}>
                            <TextoAlusivo />
                        </CardContext.Provider>
                    </div>
                    <div className="column">
                        <CardPresenter 
                            info={players.player2.name} 
                            juega="2" 
                            opcion={comparisonStat} 
                            />
                    </div>
                </div>
                <div className="content">
                    <div className="column">
                        <Cartas 
                            numeros={players.player1.selectedList}
                            onNumeroSeleccionado={(num) => handlePlayerSelection('player1', num)}
                            />
                    </div>
                    <div className="column">
                        <div className="actions">
                            {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((stat) => (
                                <button
                                    key={stat}
                                    name={stat}
                                    type="button"
                                    className="button-30"
                                    onClick={() => handleStatSelection(stat)}
                                    >
                                    {stat}
                                </button>
                                            ))}
                        </div>
                    </div>
                    <div className="column">
                        <Cartas 
                            numeros={players.player2.selectedList}
                            onNumeroSeleccionado={(num) => handlePlayerSelection('player2', num)}
                            />
                    </div>
                </div>
            </div>
            );
}


/**
 * Generates random numbers within a range
 * @param {number} n - Upper bound of range (exclusive)
 * @param {number} m - Number of random numbers to generate
 * @throws {Error} If n is less than m
 * @returns {Array<number>} Array of random numbers
 */
function generGruposDeNumerosAlAzar(n, m) {
    if (n < m) {
        throw new Error('n tiene que ser mayor o igual a m');
    }

    const grupos = [];
    for (let i = 0; i < m; i++) {
        grupos.push(Math.floor(Math.random() * n) + 1);
    }
    return grupos;
}


/**
 * Componente para mostrar resultado de la batalla
 * @component
 * @returns {JSX.Element} Renderiza el resultado de la comparación
 */
function TextoAlusivo() {
    const [elije1, elige2, comparisonStat] = useContext(CardContext);
    const [comp1, setComp1] = useState(null);
    const [comp2, setComp2] = useState(null);
    const [quienGana, setQuienGana] = useState("");
    const [pokemonData, setPokemonData] = useState({});

    useEffect(() => {
        // Trae dato de pokemon solo una vez en render inicial o cuando comparisonStat cambia
        if (Object.keys(pokemonData).length === 0 || comparisonStat) {
            const fetchPokemonData = async () => {
                try {
                    const pokemon = await Promise.all([
                        PokedexServicio.getCharacterById(elije1), // Trae data de los pokemon inicialmente
                        PokedexServicio.getCharacterById(elige2)
                    ]);
                    setPokemonData(pokemon.reduce((acc, curr) => ({...acc, [curr.id]: curr}), {})); // Guarda datos pokemon por ID
                } catch (error) {
                    console.error("Error al obtener datos de Pokemon:", error);
                }
            };
            fetchPokemonData();
        }
    }, [comparisonStat]);

    useEffect(() => {
        // Calcula ganador solo si comparisonStat, elije1, elige2, y data del pokemon están disponibles.
        if (comparisonStat && elije1 && elige2 && Object.keys(pokemonData).length > 0) {
            const stat1 = pokemonData[elije1]?.stats?.find((stat) => stat.stat.name === comparisonStat)?.base_stat || 0;
            const stat2 = pokemonData[elige2]?.stats?.find((stat) => stat.stat.name === comparisonStat)?.base_stat || 0;

            setComp1(stat1);
            setComp2(stat2);

            setQuienGana(
                    stat1 > stat2
                    ? `<< Izquierda (${stat1})`
                    : stat1 < stat2
                    ? `Derecha (${stat2}) >>`
                    : `Empate (${stat1})`
                    );
        }
    }, [comparisonStat, elije1, elige2, pokemonData]);


    return (
            <>
            <h4>Ganador</h4>
            <h2>{quienGana}</h2>
            {comp1 !== null && comp2 !== null && (
                                    <p>{comparisonStat}: {comp1 > comp2 ? comp1 : comp2}</p>
                                )}
            </>
            );
}

/**
 * Muestra la lista de Cartas de Pokemon
 * @component
 * @param {Object} props - propiedades de componentes
 * @param {Array<number>} numeros - Lista de indices de Pokemon
 * @param {Function} onNumeroSeleccionado - Callback para selección de Carta
 * @returns {JSX.Element} Render de la lista
 * 
 */
function Cartas( { numeros, onNumeroSeleccionado }) {

    /**
     * Handles click events on the card list
     * @param {Event} event - Click event object
     * @returns {void}
     */
    const handleListClick = (event) => {
        const clickedIndex = Array.from(event.currentTarget.children).indexOf(event.target.closest("li"));
        if (clickedIndex !== -1) {
            const clickedNumber = numeros[clickedIndex];
            onNumeroSeleccionado(clickedNumber);
        }
    };


    return (
            <ul onClick={handleListClick}>
                {numeros.map((num, index) => (
                                        <li key={num + 'r' + index} data-index={index}>
                                        <PokemonName id={num} />
                                    </li>
                                    ))}
            </ul>
            );
}

/**
 * PropTypes para componente Cartas
 */
Cartas.propTypes = {
    /** Arreglo de indices de Pokemon */
    numeros: PropTypes.arrayOf(PropTypes.number).isRequired,
    /** funcion Callback para selección de cartas */
    onNumeroSeleccionado: PropTypes.func.isRequired
};