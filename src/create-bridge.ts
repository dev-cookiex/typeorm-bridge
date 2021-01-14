import applyName from './applies/name'
import applyStatic from './applies/static'
import getRepo from './blinds/get-repo'
import isClientSide from './helpers/is-client-side'
import { description as recovery } from './methods/recovery'
import { description as remove } from './methods/remove'
import { description as save } from './methods/save'
import { description as softRemove } from './methods/softRemove'
import op from './op'
import Bridge from './types/bridge'
import Config from './types/config'
import { AnyTarget } from './types/helpers'

const methodGetBridge = <T>( bridge: T ): T => bridge

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isoDateRegEx = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/

const constructor = ( name: string ) => `
  ( function() {
    return function ${name}( entity ) {
      if ( !( this instanceof bridge ) )
        if ( Array.isArray( entity ) )
          return entity.map( bridge )
        else return new bridge( entity )

      const self = Target ? Object.assign( new Target(), this ) : this
  
      Object.keys( entity ).forEach( key => {
        if ( isoDateRegEx.test( entity[key] ) ) entity[key] = new Date( entity[key] )
      } )

      Object.assign( self, entity )
  
      Object.getOwnPropertyNames( bridge.prototype ).forEach( key => {
        if ( key !== 'constructor' )
          Object.defineProperty( self, key, Object.getOwnPropertyDescriptor( bridge.prototype, key ) ?? {} )
      } )
      
      return self
    }
  } )()
`

const createBridge = <E extends AnyTarget, S = {}, I = {}>(
  config: Config<E, S, I>
): Bridge<E, S, I> => {
  // eslint-disable-next-line no-eval
  const bridge: Bridge<E, S, I> = eval( constructor( config.name ?? 'Bridge' ) )

  Object.defineProperties( bridge.prototype, {
    recovery,
    remove,
    save,
    softRemove,
    bridge: { value: methodGetBridge.bind( bridge, bridge ), enumerable: false },
  } )
  bridge.getRepo = getRepo.bind( config )
  bridge.getTarget = config.target as any
  bridge.getAxios = config.axios
  bridge.uri = config.uri
  applyName( bridge, config )
  applyStatic( bridge )

  let Target: any = null
  if ( !isClientSide() )
    bridge.getTarget().then( T => Target = T )

  Object.defineProperty( bridge.prototype, Symbol.hasInstance, {
    value( instance: any ) {
      return Object.prototype.isPrototypeOf.call( this, instance )
        ||
      Target && instance instanceof Target 
    }
  } )

  Object.getOwnPropertyNames( config.prototype ?? {} ).forEach( property => {
    Object.defineProperty(
      bridge.prototype,
      property,
      Object.getOwnPropertyDescriptor( config.prototype, property ) ?? {}
    )
  } )

  Object.defineProperty( bridge, 'op', {
    value: op, enumerable: false, writable: false, configurable: false
  } )

  return bridge
}

export default createBridge
