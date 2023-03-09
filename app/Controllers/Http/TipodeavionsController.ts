// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';

import TipoDeAvion from 'App/Models/TipoDeAvion';

export default class TipodeavionsController {


    public async create(  { request , response }:HttpContextContract)
    {
        try{
        const validacion = await request.validate({
            schema: schema.create({
                id_piloto: schema.number(),
                Airolinea: schema.string(),
            
            }),
            messages:{
                'id_piloto':'El id del piloto es requerido',
                'Airolinea':'El nombre de la airolinea es necesario'
            },
        });
        const tipodeavion1= new TipoDeAvion();
        tipodeavion1.id_piloto=validacion.id_piloto;
        tipodeavion1.Airolinea=validacion.Airolinea;
        await tipodeavion1.save();

     
        
                
        

        return response.status(200).json({
            status:200,
            message:'Datos insertados',
            error:null,
            data:tipodeavion1
            
        });
    
}catch(error)
{
    return response.status(400).json({
        status: 400,
        message: 'Error en los datos',
        error: error.messages,
        data: {error},
      });
}
    }

    public async index({response}:HttpContextContract )
    {
      const aviones= await TipoDeAvion.all();
    
      return response.status(200).json({
        tipodeaviones:aviones
      })
    }
    public async delete({ response, params }: HttpContextContract) {
        try {
          // Verifica si el id del conductor es válido
          if (!params.id) {
            return response.badRequest({ message: 'El id del avion es requerido.' })
          }
      
          const aviones = await TipoDeAvion.find(params.id)
      
          if (!aviones) {
            return response.notFound({ message: 'El avion no existe.' })
          }
      
          aviones.status = 0
          await aviones.save()
      
          return response.status(200).json({
            status: 200,
            msg: 'Se ha eliminado correctamente',
            error: null,
            data: aviones
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
                return response.badRequest({ message: 'El id del avion es requerido.' });
            }
    
            const conductor = await Database.from('tipo_de_avions').where('id', params.id).first();
    
            if (!conductor) {
                return response.notFound({ message: 'El avion no existe.' });
            }
    
            const validationSchema = schema.create({
                id_piloto: schema.number(),
                Airolinea: schema.string(),
              
            });
    
            const validatedData = await request.validate({
                schema: validationSchema,
                messages: {
                    'id_piloto':'El id del piloto es requerido',
                    'Airolinea':'El nombre de la airolinea es necesario'
                }
            });
    
            await Database.from('tipo_de_avions').where('id', params.id).update(validatedData);
    
            return response.status(200).json({
                message: "avion actualizado exitosamente",
                data: conductor,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                message: "Error al actualizar el conductor",
                error: error,
            });
        }
    }
    



}
       
