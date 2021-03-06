import { AnyTarget, Extract } from './helpers'

namespace BridgeInstanceProp {}

type BridgeInstanceProp<
    E extends AnyTarget> =
  Extract.Entity<E> extends { [key: string]: any }
    ? Extract.Entity<E>
    : {}

export default BridgeInstanceProp
