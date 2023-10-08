function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}

// make PromiseIndex a nominal typing
var PromiseIndexBrand;
(function (PromiseIndexBrand) {
  PromiseIndexBrand[PromiseIndexBrand["_"] = -1] = "_";
})(PromiseIndexBrand || (PromiseIndexBrand = {}));
const TYPE_KEY = "typeInfo";
var TypeBrand;
(function (TypeBrand) {
  TypeBrand["BIGINT"] = "bigint";
  TypeBrand["DATE"] = "date";
})(TypeBrand || (TypeBrand = {}));
function serialize(valueToSerialize) {
  return encode(JSON.stringify(valueToSerialize, function (key, value) {
    if (typeof value === "bigint") {
      return {
        value: value.toString(),
        [TYPE_KEY]: TypeBrand.BIGINT
      };
    }
    if (typeof this[key] === "object" && this[key] !== null && this[key] instanceof Date) {
      return {
        value: this[key].toISOString(),
        [TYPE_KEY]: TypeBrand.DATE
      };
    }
    return value;
  }));
}
function deserialize(valueToDeserialize) {
  return JSON.parse(decode(valueToDeserialize), (_, value) => {
    if (value !== null && typeof value === "object" && Object.keys(value).length === 2 && Object.keys(value).every(key => ["value", TYPE_KEY].includes(key))) {
      switch (value[TYPE_KEY]) {
        case TypeBrand.BIGINT:
          return BigInt(value["value"]);
        case TypeBrand.DATE:
          return new Date(value["value"]);
      }
    }
    return value;
  });
}
/**
 * Convert a string to Uint8Array, each character must have a char code between 0-255.
 * @param s - string that with only Latin1 character to convert
 * @returns result Uint8Array
 */
function bytes(s) {
  return env.latin1_string_to_uint8array(s);
}
/**
 * Convert a Uint8Array to string, each uint8 to the single character of that char code
 * @param a - Uint8Array to convert
 * @returns result string
 */
function str(a) {
  return env.uint8array_to_latin1_string(a);
}
/**
 * Encode the string to Uint8Array with UTF-8 encoding
 * @param s - String to encode
 * @returns result Uint8Array
 */
function encode(s) {
  return env.utf8_string_to_uint8array(s);
}
/**
 * Decode the Uint8Array to string in UTF-8 encoding
 * @param a - array to decode
 * @returns result string
 */
function decode(a) {
  return env.uint8array_to_utf8_string(a);
}

var CurveType;
(function (CurveType) {
  CurveType[CurveType["ED25519"] = 0] = "ED25519";
  CurveType[CurveType["SECP256K1"] = 1] = "SECP256K1";
})(CurveType || (CurveType = {}));
var DataLength;
(function (DataLength) {
  DataLength[DataLength["ED25519"] = 32] = "ED25519";
  DataLength[DataLength["SECP256K1"] = 64] = "SECP256K1";
})(DataLength || (DataLength = {}));

/**
 * A Promise result in near can be one of:
 * - NotReady = 0 - the promise you are specifying is still not ready, not yet failed nor successful.
 * - Successful = 1 - the promise has been successfully executed and you can retrieve the resulting value.
 * - Failed = 2 - the promise execution has failed.
 */
var PromiseResult;
(function (PromiseResult) {
  PromiseResult[PromiseResult["NotReady"] = 0] = "NotReady";
  PromiseResult[PromiseResult["Successful"] = 1] = "Successful";
  PromiseResult[PromiseResult["Failed"] = 2] = "Failed";
})(PromiseResult || (PromiseResult = {}));
/**
 * A promise error can either be due to the promise failing or not yet being ready.
 */
var PromiseError;
(function (PromiseError) {
  PromiseError[PromiseError["Failed"] = 0] = "Failed";
  PromiseError[PromiseError["NotReady"] = 1] = "NotReady";
})(PromiseError || (PromiseError = {}));

const U64_MAX = 2n ** 64n - 1n;
const EVICTED_REGISTER = U64_MAX - 1n;
/**
 * Logs parameters in the NEAR WASM virtual machine.
 *
 * @param params - Parameters to log.
 */
function log(...params) {
  env.log(params.reduce((accumulated, parameter, index) => {
    // Stringify undefined
    const param = parameter === undefined ? "undefined" : parameter;
    // Convert Objects to strings and convert to string
    const stringified = typeof param === "object" ? JSON.stringify(param) : `${param}`;
    if (index === 0) {
      return stringified;
    }
    return `${accumulated} ${stringified}`;
  }, ""));
}
/**
 * Returns the account ID of the account that called the function.
 * Can only be called in a call or initialize function.
 */
function predecessorAccountId() {
  env.predecessor_account_id(0);
  return str(env.read_register(0));
}
/**
 * Returns the account ID of the current contract - the contract that is being executed.
 */
function currentAccountId() {
  env.current_account_id(0);
  return str(env.read_register(0));
}
/**
 * Returns the current block timestamp.
 */
function blockTimestamp() {
  return env.block_timestamp();
}
/**
 * Returns the amount of NEAR attached to this function call.
 * Can only be called in payable functions.
 */
function attachedDeposit() {
  return env.attached_deposit();
}
/**
 * Reads the value from NEAR storage that is stored under the provided key.
 *
 * @param key - The key to read from storage.
 */
function storageReadRaw(key) {
  const returnValue = env.storage_read(key, 0);
  if (returnValue !== 1n) {
    return null;
  }
  return env.read_register(0);
}
/**
 * Writes the provided bytes to NEAR storage under the provided key.
 *
 * @param key - The key under which to store the value.
 * @param value - The value to store.
 */
function storageWriteRaw(key, value) {
  return env.storage_write(key, value, EVICTED_REGISTER) === 1n;
}
/**
 * Returns the arguments passed to the current smart contract call.
 */
function inputRaw() {
  env.input(0);
  return env.read_register(0);
}
/**
 * Returns the arguments passed to the current smart contract call as utf-8 string.
 */
function input() {
  return decode(inputRaw());
}

/**
 * Tells the SDK to expose this function as a view function.
 *
 * @param _empty - An empty object.
 */
function view(_empty) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target, _key, _descriptor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {};
}
function call({
  privateFunction = false,
  payableFunction = false
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target, _key, descriptor) {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    descriptor.value = function (...args) {
      if (privateFunction && predecessorAccountId() !== currentAccountId()) {
        throw new Error("Function is private");
      }
      if (!payableFunction && attachedDeposit() > 0n) {
        throw new Error("Function is not payable");
      }
      return originalMethod.apply(this, args);
    };
  };
}
function NearBindgen({
  requireInit = false,
  serializer = serialize,
  deserializer = deserialize
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return target => {
    return class extends target {
      static _create() {
        return new target();
      }
      static _getState() {
        const rawState = storageReadRaw(bytes("STATE"));
        return rawState ? this._deserialize(rawState) : null;
      }
      static _saveToStorage(objectToSave) {
        storageWriteRaw(bytes("STATE"), this._serialize(objectToSave));
      }
      static _getArgs() {
        return JSON.parse(input() || "{}");
      }
      static _serialize(value, forReturn = false) {
        if (forReturn) {
          return encode(JSON.stringify(value, (_, value) => typeof value === "bigint" ? `${value}` : value));
        }
        return serializer(value);
      }
      static _deserialize(value) {
        return deserializer(value);
      }
      static _reconstruct(classObject, plainObject) {
        for (const item in classObject) {
          const reconstructor = classObject[item].constructor?.reconstruct;
          classObject[item] = reconstructor ? reconstructor(plainObject[item]) : plainObject[item];
        }
        return classObject;
      }
      static _requireInit() {
        return requireInit;
      }
    };
  };
}

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2;

// Define una estructura para representar una sesión
class Session {
  // Fecha de creación (usaremos un timestamp UNIX)
  // Si la sesión es privada
  // Fecha de la última modificación (timestamp UNIX)
  // Quién lo modificó

  constructor(id, owner, isPrivate) {
    this.id = id;
    this.owner = owner;
    this.createdAt = blockTimestamp(); // Establecer la fecha de creación al momento actual
    this.isPrivate = isPrivate;
    this.lastModifiedAt = blockTimestamp(); // Inicialmente, la fecha de modificación es igual a la de creación
    this.lastModifiedBy = owner; // Inicialmente, el propietario es quien creó la sesión
  }
}

class Objetos {
  // Fecha de creación (usaremos un timestamp UNIX)
  // Fecha de la última modificación (timestamp UNIX)
  // Quién lo modificó

  constructor(id, owner) {
    this.id = id;
    this.owner = owner;
    this.createdAt = blockTimestamp(); // Establecer la fecha de creación al momento actual
    this.lastModifiedAt = blockTimestamp(); // Inicialmente, la fecha de modificación es igual a la de creación
    this.lastModifiedBy = owner; // Inicialmente, el propietario es quien creó la sesión
  }
}

// Genera un token aleatorio de la longitud especificada
function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }
  return token;
}
let Contract = (_dec = NearBindgen({}), _dec2 = call({}), _dec3 = call({}), _dec4 = view(), _dec5 = view(), _dec6 = view(), _dec7 = view(), _dec(_class = (_class2 = class Contract {
  sessions = [];
  obj = [];
  create_session({
    is_private
  }) {
    let id;
    do {
      id = generateRandomToken(6);
    } while (this.sessions.some(session => session.id === id));
    const session = new Session(id, currentAccountId(), is_private);
    this.sessions.push(session);
    log(`Created session with ID ${id}, owner ${session.owner}, and isPrivate: ${is_private}`);
  }
  create_obj({
    id
  }) {
    const obj = new Objetos(id, currentAccountId());
    this.obj.push(obj);
    log(`Created obj with ID ${id}, owner ${obj.owner}`);
  }

  // Obtener todas las sesiones existentes
  get_sessions() {
    return this.sessions;
  }
  get_obj() {
    return this.obj;
  }

  // Obtener el dueño de una sesión por su ID
  get_owner_by_id({
    id
  }) {
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].id === id) {
        return this.sessions[i].owner;
      }
    }
    return null; // Devuelve null si no se encuentra la sesión
  }

  // Obtener todas las sesiones de un propietario específico
  get_sessions_by_owner({
    owner
  }) {
    const ownerSessions = [];
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].owner === owner) {
        ownerSessions.push(this.sessions[i]);
      }
    }
    log(`Sessions with owner ${owner} ${ownerSessions.length}`);
    return ownerSessions;
  }
}, (_applyDecoratedDescriptor(_class2.prototype, "create_session", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "create_session"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "create_obj", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "create_obj"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_sessions", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "get_sessions"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_obj", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "get_obj"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_owner_by_id", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "get_owner_by_id"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_sessions_by_owner", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "get_sessions_by_owner"), _class2.prototype)), _class2)) || _class);
function get_sessions_by_owner() {
  const _state = Contract._getState();
  if (!_state && Contract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = Contract._create();
  if (_state) {
    Contract._reconstruct(_contract, _state);
  }
  const _args = Contract._getArgs();
  const _result = _contract.get_sessions_by_owner(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(Contract._serialize(_result, true));
}
function get_owner_by_id() {
  const _state = Contract._getState();
  if (!_state && Contract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = Contract._create();
  if (_state) {
    Contract._reconstruct(_contract, _state);
  }
  const _args = Contract._getArgs();
  const _result = _contract.get_owner_by_id(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(Contract._serialize(_result, true));
}
function get_obj() {
  const _state = Contract._getState();
  if (!_state && Contract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = Contract._create();
  if (_state) {
    Contract._reconstruct(_contract, _state);
  }
  const _args = Contract._getArgs();
  const _result = _contract.get_obj(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(Contract._serialize(_result, true));
}
function get_sessions() {
  const _state = Contract._getState();
  if (!_state && Contract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = Contract._create();
  if (_state) {
    Contract._reconstruct(_contract, _state);
  }
  const _args = Contract._getArgs();
  const _result = _contract.get_sessions(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(Contract._serialize(_result, true));
}
function create_obj() {
  const _state = Contract._getState();
  if (!_state && Contract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = Contract._create();
  if (_state) {
    Contract._reconstruct(_contract, _state);
  }
  const _args = Contract._getArgs();
  const _result = _contract.create_obj(_args);
  Contract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(Contract._serialize(_result, true));
}
function create_session() {
  const _state = Contract._getState();
  if (!_state && Contract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = Contract._create();
  if (_state) {
    Contract._reconstruct(_contract, _state);
  }
  const _args = Contract._getArgs();
  const _result = _contract.create_session(_args);
  Contract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(Contract._serialize(_result, true));
}

export { Contract, create_obj, create_session, get_obj, get_owner_by_id, get_sessions, get_sessions_by_owner };
//# sourceMappingURL=hello_near.js.map
