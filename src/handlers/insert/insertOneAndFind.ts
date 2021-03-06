import { BridgeRequestHandler } from '../../types/bridge-handler'
import BridgeStatic from '../../types/bridge-static'
import { FindOneOptions } from '../../types/bridge-static-find'

const insertOneAndFind: insertOneAndFind.Handler = ( bridge: BridgeStatic<any>, req, res, next ) => {
  bridge.insertOneAndFind( req.body, req.query.options )
    .then( res.json.bind( res ) )
    .catch( next )
}

namespace insertOneAndFind {
  export type Query = { method: 'insertOneAndFind', options?: Omit<FindOneOptions<any>, 'where'> }
  export type Body = any
  export type Handler = BridgeRequestHandler<undefined, any, Body, Query>
}

export default insertOneAndFind
