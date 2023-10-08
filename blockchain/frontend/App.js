import 'regenerator-runtime';
import React, { useState, useEffect } from 'react';

import './assets/global.css';

import { SignInPrompt, SignOutButton } from './ui-components';


export default function App ({ isSignedIn, contractId, wallet }) {
  const [valueFromBlockchain, setValueFromBlockchain] = useState();
  const [uiPleaseWait, setUiPleaseWait] = useState(true);
  const [ownerById, setOwnerById] = useState(null);
  const [sessionsByOwner, setSessionsByOwner] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [nft, setNFT] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputId, setInputId] = useState("");

  /*useEffect(() => {
    console.log("Wallet:", wallet);
  }, [wallet]); */

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()} />;
  }

  async function getSessions () {
    try {
      // Llama a la función de tu contrato para obtener todas las sesiones
      const sessionss = await wallet.viewMethod({ method: 'get_sessions', contractId });
      setSessions(sessionss);
      console.log(sessionss);
    } catch (error) {
      console.error('Error al obtener las sesiones:', error);
      return [];
    }
  }

  // Manejador de eventos para crear una sesión
  async function handleCreateSession () {
    try {
      // Llama a la función de tu contrato para crear una sesión
      await wallet.callMethod({ method: 'create_session', args: { is_private: true }, contractId });
      // Actualiza el estado para reflejar los cambios en la interfaz de usuario
      const sessions = await getSessions();
      // sessions ahora contiene la lista actualizada de sesiones
      console.log(sessions);
    } catch (error) {
      console.error('Error al crear la sesión:', error);
    }
  }

  // Manejador de eventos para obtener el propietario por ID
  async function handleGetOwnerById () {
    try {
      setLoading(true);
      const owner = await wallet.viewMethod({ method: 'get_owner_by_id', args: { id: inputId }, contractId });
      setOwnerById(owner);
      console.log(owner, inputId);
    } catch (error) {
      console.error('Error al obtener el propietario por ID:', error);
    } finally {
      setLoading(false); // La operación ha terminado
    }
  }

  // Manejador de eventos para obtener sesiones por propietario
  async function handleGetSessionsByOwner () {
    try {
      setLoading(true); // Marcar que hay una operación en curso
      // Obtener el propietario actual del wallet
      const owner = wallet.createAccessKeyFor
      // Llamar a la función de tu contrato para obtener las sesiones por el propietario actual
      const sessions = await wallet.viewMethod({ method: 'get_sessions_by_owner', args: { owner }, contractId });
      setSessionsByOwner(sessions);
      console.log("Todo OK", sessions.length, owner)
    } catch (error) {
      console.error('Error al obtener sesiones por propietario:', error);
    } finally {
      setLoading(false); // La operación ha terminado
    }
  }

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()} />
      <main className={uiPleaseWait || loading ? 'please-wait' : ''}>
        <button onClick={handleCreateSession}>Crear Sesión</button>
        <input type="text" value={inputId} onChange={(e) => setInputId(e.target.value)} />
        <button onClick={handleGetOwnerById}>Obtener Propietario por ID</button>
        <button onClick={handleGetSessionsByOwner}>Obtener Sesiones por Propietario</button>
        <button onClick={getSessions}>Obtener todas las Sesiones</button>
        <a href="https://skinny-lilac-telephone.glitch.me/">Ver Modelo 3D</a>
        <div>
          {ownerById && <div>Propietario de Session ID: {inputId} {ownerById}</div>}
          {sessionsByOwner.length > 0 && (
            <div>
              Sesiones por Propietario:
              <ul>
                {sessionsByOwner.map((session, index) => (
                  <li key={index}>ID: {session.id}, Propietario: {session.owner}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          {sessions.length > 0 && (
            <div>
              Todas las Sesiones:
              <ul>
                {sessions.map((session, index) => (
                  <li key={index}>
                    ID: {session.id}, Propietario: {session.owner}, Privado {session.isPrivate}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}