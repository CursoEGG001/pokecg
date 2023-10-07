import './App.css'
import {useState, useEffect} from 'react'
import PokedexServicio from './services/pokemon-api'
import CardPresenter from './components/public/CardPresenter'

export default function App() {

    const [elije, setElije] = useState(0)
    const [cntOtro, setCntOtro] = useState(0)
    const [seCompara, setSeCompara] = useState(0)
    const [poke, setPoke] = useState([])
    const [unNombre, setUnNombre] = useState("")
    useEffect(() => {
        // Llamamos a la API Pokeapi
        const charactersAPI = PokedexServicio.getAllCharacters()
                .then((data) => {
                    setPoke(data.results)
                    setUnNombre(data.results[0].name)
                })
                .catch((error) => console.log(error));
    }, [poke]);

    function diceElBoton(evento) {

        let seCargo = evento.target;
        (elije + cntOtro) % 2 == 0 ? setElije(elije + 1) : setCntOtro(cntOtro + 1)
        setSeCompara(seCargo.name)
    }

    return (<>
    <table>
        <thead>
            <tr>
                <td>
                    Estoy con :
                </td>
                <td>Acciones</td>
                <td>
                    Esto Serían los otros :
                </td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
        <CardPresenter info={poke !== null ? "moltres" : "pikachu" } juega="1"/>
    </td>
    
    <td>
        ___________
    </td>
    
    <td>
        Espacio2
    </td></tr>
    <tr>
        <td onClick={() => setElije(elije + 1) }key="1">
            <ul>
                <Cartas 
                    item={poke}
                    mostrar={elije}
                    />
            </ul>
        </td>
        <td>
            <button name="hp" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije},{seCompara},{cntOtro}</button><br/>
            <button name="attack" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije},{seCompara},{cntOtro}</button><br/>
            <button name="defense" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije},{seCompara},{cntOtro}</button><br/>
            <button name="special-attack" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije},{seCompara},{cntOtro}</button><br/>
            <button name="special-defense" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije},{seCompara},{cntOtro}</button><br/>
            <button name="speed" type="submit" className="button-30" role="button" onClick={(e) => diceElBoton(e)}>{elije},{seCompara},{cntOtro}</button><br/>
        </td>
        <td  onClick={() => setCntOtro(cntOtro + 1)} key="2">
            <ul>
                <Cartas 
                    item={poke}
                    mostrar={cntOtro}
                    />
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

