import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Seguro extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public id_del_paciente:number

  @column()
  public numero_de_seguro:number

  @column()
  public numero_del_seguro_del_paciente:number

  @column()
  public status:number

  @column()
  public nombre:string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
