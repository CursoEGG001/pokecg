import './App.css'
import {useState, useEffect, useContext} from 'react'
import PokedexServicio from './services/pokemon-api'
import CardPresenter from './components/public/CardPresenter'


export default function App() {

    const [elije, setElije] = useState(0)
    const [cntOtro, setCntOtro] = useState(0)
    const [seCompara, setSeCompara] = useState(0)
    const [poke, setPoke] = useState([])
    const [unNombre, setUnNombre] = useState("151")
    const [esteOtroNombre, setEsteOtroNombre] = useState("151")

    let mat = []

    useEffect(() => {
        // Llamamos a la API Pokeapi
        const charactersAPI = PokedexServicio.getAllCharacters()
                .then((data) => {
                    setPoke(data.results);
                    mat = data.results;
                    const caden1 = mat.filter((d, i) => i == elije)[0].name
                    const caden2 = mat.filter((d, i) => i == cntOtro)[0].name
                    setUnNombre(caden1)
                    setEsteOtroNombre(caden2)
                    return data.results;
                })
                .catch((error) => console.log(error));

    }, [elije, cntOtro]);

    function diceElBoton(evento) {

        let seCargo = evento.target;
        (elije + cntOtro) % 2 == 0 ? setElije(elije + 1) : setCntOtro(cntOtro + 1)
        setSeCompara(seCargo.name)

    }

    return (<>
    <table>
        <thead>
            <tr>
                <th>
                    Estoy con :
                </th>
                <th>Acciones</th>
                <th>
                    Esto Serían los otros :
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
        <CardPresenter info={unNombre} juega="1" opcion={seCompara}/>
    </td>
    
    <td>
    <TextoAlusivo />
    </td>
    
    <td>
    
    <CardPresenter info={esteOtroNombre} juega="2" opcion={seCompara}/>
    
    </td>
    </tr>
    <tr>
        <td onClick={() => setElije(elije + 1) } key="1">
            <ul>
                <Cartas 
                    item={poke}
                    mostrar={elije}
                    />
            </ul>
        </td>
    
        <td>
            <button name="hp" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije}, HP, {cntOtro}</button><br/>
            <button name="attack" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije}, Ataque, {cntOtro}</button><br/>
            <button name="defense" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije}, Defensa, {cntOtro}</button><br/>
            <button name="special-attack" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije}, Ataque Especial, {cntOtro} </button><br/>
            <button name="special-defense" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije}, Defensa Especial, {cntOtro} </button><br/>
            <button name="speed" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije}, Velocidad, {cntOtro}</button><br/>
        </td>
    
        <td  onClick={() => setCntOtro(cntOtro + 1)} key="2">
            <ul>
                <Cartas item={poke} mostrar={cntOtro}/>
            </ul>
        </td>
    </tr>
    </tbody>
    </table>
    </>)
}

function Cartas( {item, mostrar}) {

    const resultado = item.filter((dato, indice) => indice >= mostrar && indice < (mostrar + 20)).map((a) => (
                <li key={a.url + mostrar}>
                    <strong>{a.name}</strong>
                </li>
                ));


    return (
            <>{resultado}</>
            );
}

function TextoAlusivo() {
    return (
            <>
            <h2>Texto Alusivo de situación</h2>
            </>)
}
