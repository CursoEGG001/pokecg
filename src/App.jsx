import './App.css';
import { useState, useEffect, useContext } from 'react';
import PokedexServicio from './services/pokemon-api';
import CardPresenter from './components/public/CardPresenter';
import { CardContext } from './components/public/CardContext';
import PokemonName from './components/public/PokemonName';

export default function App() {

    const [poke, setPoke] = useState([]);
    const [players, setPlayers] = useState({
        player1: { selectedIndex: 0, name: 'Esperando...', selectedList: [] },
        player2: { selectedIndex: 0, name: 'Esperando...', selectedList: [] }
    });
    const [comparisonStat, setComparisonStat] = useState('');

    // Fetch Pokémon data and initialize lists
    useEffect(() => {
        PokedexServicio.getAllCharacters()
            .then((data) => {
                const pokemonList = data.results;
                setPoke(pokemonList);

                // Generate random lists for both players
                const updatedPlayers = {
                    player1: {
                        ...players.player1,
                        selectedList: generGruposDeNumerosAlAzar(pokemonList.length, 20)
                    },
                    player2: {
                        ...players.player2,
                        selectedList: generGruposDeNumerosAlAzar(pokemonList.length, 20)
                    }
                };
                setPlayers(updatedPlayers);
            })
            .catch((error) => console.log(error));
    }, []);

    // Update names when selections change
    useEffect(() => {
        if (poke.length > 0) {
            const newPlayers = { ...players };
            newPlayers.player1.name = poke[players.player1.selectedIndex]?.name || 'Esperando...';
            newPlayers.player2.name = poke[players.player2.selectedIndex]?.name || 'Esperando...';
            setPlayers(newPlayers);
        }
    }, [players.player1.selectedIndex, players.player2.selectedIndex, poke]);

    const handlePlayerSelection = (playerKey, selectedNumber) => {
        setPlayers(prevPlayers => {
            const newPlayers = { ...prevPlayers };
            const playerData = newPlayers[playerKey];
            const listIndex = playerData.selectedList.indexOf(selectedNumber);

            if (listIndex !== -1) {
                // Rotate the list
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

function TextoAlusivo() {
    const [elije1, elije2, comparisonStat] = useContext(CardContext);
    const [comp1, setComp1] = useState(null);
    const [comp2, setComp2] = useState(null);
    const [quienGana, setQuienGana] = useState("");

    useEffect(() => {
        if (!comparisonStat)
            return;

        const fetchStats = async () => {
            try {
                const [poke1, poke2] = await Promise.all([
                    PokedexServicio.getCharacterById(elije1),
                    PokedexServicio.getCharacterById(elije2)
                ]);

                const stat1 = poke1.stats.find((stat) => stat.stat.name === comparisonStat)?.base_stat || 0;
                const stat2 = poke2.stats.find((stat) => stat.stat.name === comparisonStat)?.base_stat || 0;

                setComp1(stat1);
                setComp2(stat2);

                setQuienGana(
                    stat1 > stat2
                    ? `<< Izquierda (${stat1})`
                    : stat1 < stat2
                    ? `Derecha (${stat2}) >>`
                    : `Empate (${stat1})`
                );
            } catch (error) {
                console.error("Error al obtener estadísticas:", error);
            }
        };

        fetchStats();
    }, [elije1, elije2, comparisonStat]);

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

function Cartas({ numeros, onNumeroSeleccionado }) {
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

