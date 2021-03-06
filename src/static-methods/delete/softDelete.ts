import { UpdateResult } from 'typeorm'

import isClientSide from '../../helpers/is-client-side'
import BridgeStatic from '../../types/bridge-static'
import { AnyTarget, Criteria } from '../../types/helpers'

const method = 'softDelete' as const

const softDelete = async function<
  E extends AnyTarget,
  S extends { [key: string]: any } = {},
  I extends { [key: string]: any } = {}
>(
  this: BridgeStatic<E, S, I>,
  criteria: Criteria<E>
) {
  if ( isClientSide( this ) ) {
    const axios = await this.getAxios()
    const params = { criteria, method }
    const response = await axios.delete<UpdateResult>( this.uri, { params } )
    return response.data
  }
  const repo = await this.getRepo()
  const result = await repo.softDelete( criteria )
  return result
}

export default softDelete
