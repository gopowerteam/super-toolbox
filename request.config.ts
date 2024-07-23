import { defineConfig } from '@gopowerteam/request-generate'
import { pascal } from 'radash'

export default defineConfig({
  gateway: 'https://api.gopowerteam.cn',
  openapi: '/swagger/api-docs',
  output: './src/http',
  exportModels: true,
  logger: true,
  exportServices: {
    serviceResolve({ object }) {
      const [tag] = object.tags || []

      if (tag) {
        return pascal(tag.replace(/\s/g, '').replace(/Controller$/g, ''))
      }
      else {
        throw new Error('未找到相应Tag')
      }
    },
    operationResolve({ object }) {
      return object.operationId!
        .replace(/_*\d*$/g, '')
        .replace(/Using(GET|POST|PUT|PATCH|DELETE)_*\d*$/g, '')
    },
    responseType: 'promise',
    excludeQueryParams: [
      'pageNumber',
      'pageSize',
      'page',
      'size',
      'paged',
      'unpaged',
      'order',
      'sort',
      'offset',
    ],
  },
})
