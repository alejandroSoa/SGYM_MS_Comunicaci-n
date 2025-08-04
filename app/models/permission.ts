
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Permission extends BaseModel {
    static table = 'permission'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

}
