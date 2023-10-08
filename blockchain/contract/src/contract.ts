import { NearBindgen, near, call, view, LookupMap, UnorderedMap } from 'near-sdk-js'
import { blockTimestamp } from 'near-sdk-js/lib/api';

// Define una estructura para representar una sesión
class Session {
  id: string;
  owner: string;
  createdAt: BigInt; // Fecha de creación (usaremos un timestamp UNIX)
  isPrivate: boolean; // Si la sesión es privada
  lastModifiedAt: BigInt; // Fecha de la última modificación (timestamp UNIX)
  lastModifiedBy: string; // Quién lo modificó

  constructor (id: string, owner: string, isPrivate: boolean) {
    this.id = id;
    this.owner = owner;
    this.createdAt = blockTimestamp(); // Establecer la fecha de creación al momento actual
    this.isPrivate = isPrivate;
    this.lastModifiedAt = blockTimestamp(); // Inicialmente, la fecha de modificación es igual a la de creación
    this.lastModifiedBy = owner; // Inicialmente, el propietario es quien creó la sesión
  }
}

class Objetos {
  id: string;
  owner: string;
  createdAt: BigInt; // Fecha de creación (usaremos un timestamp UNIX)
  lastModifiedAt: BigInt; // Fecha de la última modificación (timestamp UNIX)
  lastModifiedBy: string; // Quién lo modificó

  constructor (id: string, owner: string) {
    this.id = id;
    this.owner = owner;
    this.createdAt = blockTimestamp(); // Establecer la fecha de creación al momento actual
    this.lastModifiedAt = blockTimestamp(); // Inicialmente, la fecha de modificación es igual a la de creación
    this.lastModifiedBy = owner; // Inicialmente, el propietario es quien creó la sesión
  }
}

// Genera un token aleatorio de la longitud especificada
function generateRandomToken (length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}

@NearBindgen({})
export class Contract {
  sessions: Session[] = [];
  obj: Objetos[] = [];

  @call({})
  create_session ({ is_private }: { is_private: boolean }): void {
    let id: string;

    do {
      id = generateRandomToken(6);
    } while (this.sessions.some(session => session.id === id));

    const session = new Session(id, near.currentAccountId(), is_private);
    this.sessions.push(session);
    near.log(`Created session with ID ${id}, owner ${session.owner}, and isPrivate: ${is_private}`);
  }

  @call({})
  create_obj ({ id }: { id: string }): void {
    const obj = new Objetos(id, near.currentAccountId());
    this.obj.push(obj);
    near.log(`Created obj with ID ${id}, owner ${obj.owner}`);
  }

  // Obtener todas las sesiones existentes
  @view({})
  get_sessions (): Session[] {
    return this.sessions;
  }

  @view({})
  get_obj (): Objetos[] {
    return this.obj;
  }

  // Obtener el dueño de una sesión por su ID
  @view({})
  get_owner_by_id ({ id }: { id: string }): string | null {
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].id === id) {
        return this.sessions[i].owner;
      }
    }
    return null; // Devuelve null si no se encuentra la sesión
  }

  // Obtener todas las sesiones de un propietario específico
  @view({})
  get_sessions_by_owner ({ owner }: { owner: string }): Session[] {
    const ownerSessions: Session[] = [];
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].owner === owner) {
        ownerSessions.push(this.sessions[i]);
      }
    }
    near.log(`Sessions with owner ${owner} ${ownerSessions.length}`);
    return ownerSessions;
  }
}