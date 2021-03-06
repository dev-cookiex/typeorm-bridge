/* eslint-disable @typescript-eslint/no-unused-vars */
import { RemoveOptions, SaveOptions } from 'typeorm'

import BridgeInstance from './bridge-instance'
import BridgeStatic from './bridge-static'
import { AnyTarget } from './helpers'

namespace BridgeInstanceMethod {
  export type save<
    E extends AnyTarget,
    S extends { [key: string]: any } = {},
    I extends { [key: string]: any } = {}
  > =
    ( options?: SaveOptions ) => Promise<BridgeInstance<E, S, I>>
  export type remove<
    E extends AnyTarget,
    S extends { [key: string]: any } = {},
    I extends { [key: string]: any } = {}
  > =
    ( options?: RemoveOptions ) => Promise<BridgeInstance<E, S, I>>
  export type softRemove<
    E extends AnyTarget,
    S extends { [key: string]: any } = {},
    I extends { [key: string]: any } = {}
  > =
    ( options?: SaveOptions ) => Promise<BridgeInstance<E, S, I>>
  export type recovery<
    E extends AnyTarget,
    S extends { [key: string]: any } = {},
    I extends { [key: string]: any } = {}
  > =
    ( options?: SaveOptions ) => Promise<BridgeInstance<E, S, I>>

  export type bridge<
    E extends AnyTarget,
    S extends { [key: string]: any } = {},
    I extends { [key: string]: any } = {}
  > = () => BridgeStatic<E, S, I>
}

interface BridgeInstanceMethod<
    E extends AnyTarget,
    S extends { [key: string]: any } = {},
    I extends { [key: string]: any } = {}
  > {
  save: BridgeInstanceMethod.save<E, S, I>
  remove: BridgeInstanceMethod.remove<E, S, I>

  softRemove: BridgeInstanceMethod.softRemove<E, S, I>
  recovery: BridgeInstanceMethod.recovery<E, S, I>

  bridge: BridgeInstanceMethod.bridge<E, S, I>
}

export default BridgeInstanceMethod
