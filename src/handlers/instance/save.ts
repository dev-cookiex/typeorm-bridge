import { AnyBridge } from '../../types/bridge'
import { BridgeRequestHandler } from '../../types/bridge-handler'

const save: save.Handler = async ( bridge: AnyBridge, req, res, next ) => {
  bridge( req.body ).save()
    .then( res.json.bind( res ) )
    .catch( next )
}

namespace save {
  export type Query = { method: 'save' }
  export type Body = any
  export type Handler = BridgeRequestHandler<undefined, any, Body, Query>
}

export default save
