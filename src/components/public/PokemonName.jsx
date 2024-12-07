/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/reactjs.jsx to edit this template
 */
import { useState, useEffect } from 'react';
import PokedexServicio from '../../services/pokemon-api';

export default function PokemonName({ id }) {
    const [pokenombre, setPokenombre] = useState('Cargando...');

    useEffect(() => {
        let isMounted = true;

        PokedexServicio.getCharacterById(id)
            .then((data) => {
                if (isMounted) {
                    setPokenombre(data.name);
                }
            })
            .catch((e) => {
                console.log(e.message);
                setPokenombre('Error al cargar');
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    return (
            <strong>
            {pokenombre}
            </strong>
    );
}
