import './App.css'
import {useState, useEffect, useContext} from 'react'
import PokedexServicio from './services/pokemon-api'
import CardPresenter from './components/public/CardPresenter'
import {CardContext} from './components/public/CardContext'

export default function App() {

    const [elije, setElije] = useState(0)
    const [cntOtro, setCntOtro] = useState(0)
    const [seCompara, setSeCompara] = useState(0)
    const [poke, setPoke] = useState([])
    const [unNombre, setUnNombre] = useState("151")
    const [esteOtroNombre, setEsteOtroNombre] = useState("151")
    const [sel, setSel] = useState([])


    let mat = [];
    let poneCartas = [];
    let cuantosPoke = 0;

    useEffect(() => {
        // Llamamos a la API Pokeapi
        const charactersAPI = PokedexServicio.getAllCharacters()
                .then((data) => {
                    cuantosPoke = Object.values(data)?.[0]
                    console.log("Cuantos pokemones hay:", Object.values(data)?.[0]);
                    poneCartas = generGruposDeNumerosAlAzar(cuantosPoke, 20)
                    setSel(poneCartas);
                    setPoke(data.results);
                    mat = data.results;

                    const caden1 = () => (Object.hasOwn(mat, "lenght") !== 0 ? mat.filter((d, i) => i == elije)?.[0].name : "Esperando...")
                    const caden2 = () => (Object.hasOwn(mat, "lenght") !== 0 ? mat.filter((d, i) => i == cntOtro)?.[0].name : "Esperando...")
                    setUnNombre(caden1)
                    setEsteOtroNombre(caden2)
                    return data.results;
                })
                .catch((error) => console.log(error));
    }, [elije, cntOtro]);
    function diceElBoton(evento) {

        let seCargo = evento.target;
        setSeCompara(seCargo.name)

    }

    return (
            <div className="container">
                <div className="header">
                    <div className="header-item">Estoy con:</div>
                    <div className="header-item">Acciones</div>
                    <div className="header-item">Esto serían los otros:</div>
                </div>
                <div className="content">
                    <div className="column">
                        <CardPresenter info={unNombre} juega="1" opcion={seCompara} />
                    </div>
            
                    <div className="column">
                        <CardContext.Provider value={[elije, cntOtro, seCompara]}>
                            <TextoAlusivo />
                        </CardContext.Provider>
                    </div>
            
                    <div className="column">
                        <CardPresenter info={esteOtroNombre} juega="2" opcion={seCompara} />
                    </div>
                </div>
                <div className="content">
                    <div className="column" onClick={() => {
                    setElije(elije + 1);
                    setSeCompara("");
                }}>
                        <ul>
                            <Cartas item={poke} mostrar={elije} />
                        </ul>
                    </div>
            
                    <div className="column">
                        <div className="actions">
                            {["hp", "attack", "defense", "special-attack", "special-defense", "speed"].map((stat) => (
                                <button
                                    key={stat}
                                    name={stat}
                                    type="button"
                                    className="button-30"
                                    onClick={diceElBoton}
                                    >
                                    {elije}, {stat.toUpperCase()}, {cntOtro}
                                </button>
                            ))}
                        </div>
                    </div>
            
                    <div className="column" onClick={() => {
                    setCntOtro(cntOtro + 1);
                    setSeCompara("");
                }}>
                        <ul>
                            <Cartas item={poke} mostrar={cntOtro} />
                        </ul>
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
        let numAzar = 0;

        numAzar = (Math.floor(Math.random() * n) + 1);
        grupos.push(numAzar);
    }
    return grupos;
}

function Cartas( {item, mostrar})
{
    const resultado = item.filter((dato, indice) => (indice > mostrar) && (indice <= (mostrar + 20))).map((a) => (
                <li key={a.url + mostrar}>
                    <strong>{a.name}</strong>
                </li>
                ));
    return (
            <>
            {resultado}
            
            </>
            );
}

function TextoAlusivo() {
    const info1 = useContext(CardContext);
    const [comp1, setComp1] = useState(null);
    const [comp2, setComp2] = useState(null);
    const [quienGana, setQuienGana] = useState("");

    useEffect(() => {
        if (!info1 || !info1[2])
            return; // Asegurarse de que `info1` y el atributo comparativo existen.

        const fetchStats = async () => {
            try {
                const [poke1, poke2] = await Promise.all([
                    PokedexServicio.getCharacterById(info1[0]),
                    PokedexServicio.getCharacterById(info1[1]),
                ]);

                const stat1 = poke1.stats.find((stat) => stat.stat.name === info1[2])?.base_stat || 0;
                const stat2 = poke2.stats.find((stat) => stat.stat.name === info1[2])?.base_stat || 0;

                setComp1(stat1);
                setComp2(stat2);

                // Determinar el ganador después de obtener las estadísticas
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
    }, [info1]);

    return (
            <>
            <h4>Ganador</h4>
            <h2>{quienGana}</h2>
            {comp1 !== null && comp2 !== null && (
                                    <p>{info1[2]}: {comp1 > comp2 ? comp1 : comp2}</p>
                                )}
            </>
            );
}
