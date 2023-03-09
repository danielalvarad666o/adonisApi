// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import Hospital from "App/Models/Hospital"


import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';


export default class HospitalsController {


    public async create({ request, response }: HttpContextContract) {
        const validacion = await request.validate({
          schema: schema.create({
            numero_de_seguro: schema.number(),
            nombre_del_hospital: schema.string(),
          }),
          messages: {
            'numero_de_seguro.required': 'El número de seguro es requerido.',
            'nombre_del_hospital.required': 'El nombre del hospital es requerido.',
          },
        })
    
        const hospital = new Hospital()
        hospital.numero_de_seguro = validacion.numero_de_seguro
        hospital.nombre_del_hospital = validacion.nombre_del_hospital
    
        await hospital.save()
    
        return response.status(200).json({
          status: 200,
          message: 'Datos almacenados',
          error: null,
          data: hospital,
        })
      }
      public async index({response}:HttpContextContract )
    {
      const hospitales= await Hospital.all();
    
      return response.status(200).json({
        hospitales:hospitales
      })
    }
    public async delete({ response, params }: HttpContextContract) {
        try {
          // Verifica si el id del conductor es válido
          if (!params.id) {
            return response.badRequest({ message: 'El id del hospital es requerido.' })
          }
      
          const hospital = await Hospital.find(params.id)
      
          if (!hospital) {
            return response.notFound({ message: 'El hospital no existe.' })
          }
      
          hospital.status = 0
          await hospital.save()
      
          return response.status(200).json({
            status: 200,
            msg: 'Se ha eliminado correctamente',
            error: null,
            data: hospital
          })
        } catch (error) {
          console.error(error)
          return response.status(500).json({
            status: 500,
            msg: 'Error al eliminar el avion',
            error: error.message,
            data: null,
          })
        }
      }

        public async update({ request, response, params }: HttpContextContract) {
        try {
            // Verifica si el id del conductor es válido
            if (!params.id) {
                return response.badRequest({ message: 'El id del hospital es requerido.' });
            }
    
            const hospitals = await Database.from('hospitals').where('id', params.id).first();
    
            if (!hospitals) {
                return response.notFound({ message: 'El hospitals no existe.' });
            }
    
            const validationSchema = schema.create({
              numero_de_seguro: schema.number(),
              nombre_del_hospital: schema.string(),
            });
    
            const validatedData = await request.validate({
                schema: validationSchema,
                messages: {
                  'numero_de_seguro.required': 'El número de seguro es requerido.',
                  'nombre_del_hospital.required': 'El nombre del hospital es requerido.',
                }
            });
    
            await Database.from('hospitals').where('id', params.id).update(validatedData);
    
            return response.status(200).json({
                message: "hospitals actualizado exitosamente",
                data: hospitals,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                message: "Error al actualizar el hospitals",
                error: error,
            });
        }
    }
    



}
