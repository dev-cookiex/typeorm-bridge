import { RequestHandler } from 'express'

import { _require } from '../helpers/_import'
import { BridgeRequestHandler } from '../types/bridge-handler'
import BridgeStatic from '../types/bridge-static'
import _delete from './delete/delete'
import findAndDelete from './delete/findAndDelete'
import findAndSoftDelete from './delete/findAndSoftDelete'
import findByIdsAndDelete from './delete/findByIdsAndDelete'
import findByIdsAndSoftDelete from './delete/findByIdsAndSoftDelete'
import findOneAndDelete from './delete/findOneAndDelete'
import findOneAndSoftDelete from './delete/findOneAndSoftDelete'
import findOneOrFailAndDelete from './delete/findOneOrFailAndDelete'
import findOneOrFailAndSoftDelete from './delete/findOneOrFailAndSoftDelete'
import softDelete from './delete/softDelete'
import find from './find/find'
import findAndCount from './find/findAndCount'
import findByIds from './find/findByIds'
import findOne from './find/findOne'
import findOneOrFail from './find/findOneOrFail'
import insert from './insert/insert'
import insertAndFind from './insert/insertAndFind'
import insertOne from './insert/insertOne'
import insertOneAndFind from './insert/insertOneAndFind'
import recovery from './instance/recovery'
import remove from './instance/remove'
import save from './instance/save'
import softRemove from './instance/softRemove'
import parserOperations from './parser-options'
import clear from './tools/clear'
import count from './tools/count'
import decrement from './tools/decrement'
import increment from './tools/increment'
import findAndRestore from './update/findAndRestore'
import findAndUpdate from './update/findAndUpdate'
import findByIdsAndRestore from './update/findByIdsAndRestore'
import findByIdsAndUpdate from './update/findByIdsAndUpdate'
import findOneAndRestore from './update/findOneAndRestore'
import findOneAndUpdate from './update/findOneAndUpdate'
import findOneOrFailAndRestore from './update/findOneOrFailAndRestore'
import findOneOrFailAndUpdate from './update/findOneOrFailAndUpdate'
import restore from './update/restore'
import update from './update/update'

const _ = <
  T extends { [K: string]: BridgeRequestHandler<any, any, any, any>
}>( bridge: BridgeStatic<any>, object: T, def?: keyof T ): RequestHandler<any, any, any, any> => {
  const keys = Object.keys( object )
  return ( req, res, next ) => {
    // @ts-ignore
    ( ( ( req.bridge ??= {} ).methods ??= [] ) ).push( ...keys )
    try {
      const method = req.query.method ??= def
      if ( !method || !keys.includes( method ) ) next()
      else object[method]( bridge, req, res, next )
    } catch ( e ) { next( e ) }
  }
}

const _d = { delete: _delete, findAndDelete, findAndSoftDelete, findByIdsAndDelete, findByIdsAndSoftDelete, softDelete }
const _f = { find, findAndCount, findByIds }
const _i = { insert, insertAndFind, insertOne, insertOneAndFind }
const _u = { update, restore, findAndUpdate, findByIdsAndUpdate, findAndRestore, findByIdsAndRestore }

const __f = { findOne, findOneOrFail }
const __d = { findOneAndDelete, findOneAndSoftDelete, findOneOrFailAndDelete, findOneOrFailAndSoftDelete }
const __u = { findOneAndUpdate, findOneAndRestore, findOneOrFailAndUpdate, findOneOrFailAndRestore }

const t_g = { count }

const t_p = { increment, decrement }

const t_d = { clear }

const i_d = { remove, softRemove }
const i_p = { save, recovery }

const createBridgeHandler = ( bridge: BridgeStatic<any> ) => {
  if ( typeof window !== 'undefined' ) throw new Error( '' )
  type Express = typeof import( 'express' )
  const router = _require<
    Express>( 'express' ).Router()

  router.use( parserOperations( 'options', 'criteria', 'conditions' ) )

  const fallHandler: RequestHandler = ( req, res, next ) => {
    // @ts-ignore
    const methods: string[] | undefined = req.bridge?.methods
    if ( !methods ) next()
    else res.status( 404 ).json( { message: `method not find in '${bridge.name}', please check list of methods`, methods } )
  }

  const uri = bridge.config.path ?? bridge.uri

  router.route( uri )
    .get( _( bridge, _f, 'find' ) )
    .get( _( bridge, t_g, 'count' ) )
    .post( _( bridge, _i, 'insert' ) )
    .put( _( bridge, _u, 'update' ) )
    .put( _( bridge, i_p ) )
    .delete( _( bridge, _d, 'delete' ) )
    .delete( _( bridge, t_d ) )
    .delete( _( bridge, i_d ) )
    .all( fallHandler )

  router.route( `${uri}/:id` )
    .get( _( bridge, __f, 'findOne' ) )
    .put( _( bridge, __u, 'findOneAndUpdate' ) )
    .delete( _( bridge, __d, 'findOneAndDelete' ) )
    .all( fallHandler )

  router.put( `${uri}/:property`, _( bridge, t_p, 'increment' ), fallHandler )
  router.put( `${uri}/:property/:value`, _( bridge, t_p, 'increment' ), fallHandler )

  return router
}

export default createBridgeHandler
