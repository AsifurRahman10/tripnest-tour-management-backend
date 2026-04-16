/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from 'mongoose'
import { excludedFields } from '../constant'

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public readonly query: Record<string, string>

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  filter(): any {
    const queryObj = { ...this.query }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    excludedFields.forEach((field) => delete queryObj[field])
    this.modelQuery = this.modelQuery.find(queryObj)

    return this
  }

  search(searchAbleFields: string[]): this {
    const searchQuery = {
      $or: searchAbleFields.map((field: string) => ({
        [field]: { $regex: this.query.search || '', $options: 'i' }
      }))
    }
    this.modelQuery = this.modelQuery.find(searchQuery)
    return this
  }

  sort(): this {
    const sort = this.query.sort || '-createdAt'
    this.modelQuery = this.modelQuery.sort(sort)
    return this
  }
  fields(): this {
    const fields = this.query.fields?.split(',').join(' ') || ''
    this.modelQuery = this.modelQuery.select(fields)
    return this
  }
  pagination(): this {
    const page = parseInt(this.query.page as string) || 1
    const limit = parseInt(this.query.limit as string) || 10
    const skip = (page - 1) * limit

    this.modelQuery = this.modelQuery.skip(skip).limit(limit)
    return this
  }
  build() {
    return this.modelQuery
  }
  async getMeta() {
    const total = await this.modelQuery.model.countDocuments()
    const page = parseInt(this.query.page as string) || 1
    const limit = parseInt(this.query.limit as string) || 10
    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  }
}
