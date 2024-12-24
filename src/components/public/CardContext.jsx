/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/reactjs.jsx to edit this template
 */
/**
 * @fileoverview Provee un React Context para compartir estado de carta Pokemon entre componentes
 */

import React, { createContext } from 'react';

/**
 * @typedef {Array} CardContextType
 * @property {string} 0 - identificador primero
 * @property {string} 1 - identificador segundo
 * @property {string} 2 - cadena de opcion
 */

/**
 * Context para manejar estado de carta Pokemon entre componentes.
 * Por defecto: ["1_", "2_", "3_"]
 * 
 * @type {React.Context<CardContextType>}
 * 
 * @example
 * // Usar el contexto en un componente:
 * import { CardContext } from './CardContext';
 * 
 * function MyComponent() {
 *   const [first, second, third] = useContext(CardContext);
 *   return <div>{first}</div>;
 * }
 */
export const CardContext = createContext(["1_", "2_", "3_"]);