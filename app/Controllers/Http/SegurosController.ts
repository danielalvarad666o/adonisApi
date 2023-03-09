// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Seguro from "App/Models/Seguro";

export default class SegurosController {


    public async create({ request, response }: HttpContextContract) {
        const validacion = await request.validate({
          schema: schema.create({
            id_del_paciente: schema.number(),
            numero_de_seguro: schema.number(),
            numero_del_seguro_del_paciente: schema.number(),
            nombre: schema.string(),
          }),
          messages: {
            'id_del_paciente.required': 'El id del paciente es requerido.',
            'numero_de_seguro.required': 'El número de seguro es requerido.',
            'numero_del_seguro_del_paciente.required': 'El numero del pacinete  del seguro es requerido.',
            'nombre.required': 'El nombre del seguro es requerido.',
          },
        });
    
        const seguro = new Seguro();
        seguro.id_del_paciente = validacion.id_del_paciente;
        seguro.numero_de_seguro = validacion.numero_de_seguro;
        seguro.numero_del_seguro_del_paciente = validacion.numero_del_seguro_del_paciente;
        seguro.nombre=validacion.nombre;
    
        await seguro.save();
    
        return response.status(200).json({
          status: 200,
          message: 'Datos almacenados',
          error: null,
          data: seguro,
        });
      }

      public async getseguros({response}:HttpContextContract )
      {
        const seguros= await Seguro.all();
      
        return response.status(200).json({
          seguros
        })
      }

    

  public async update({ request, response, params }: HttpContextContract) {
    const validacion = await request.validate({
      schema: schema.create({
        id_del_paciente: schema.number(),
        numero_de_seguro: schema.number(),
        numero_del_seguro_del_paciente: schema.number(),
        nombre: schema.string(),
      }),
      messages: {
        'id_del_paciente.required': 'El id del paciente es requerido.',
        'numero_de_seguro.required': 'El número de seguro es requerido.',
        'nombre.required': 'El nombre de seguro es requerido.',
        'numero_del_seguro_del_paciente.required': 'El numero  del seguro de paciente es requerido.',
      },
    });

    const seguro = await Seguro.find(params.id);
    if (!seguro) {
      return response.status(404).json({
        status: 404,
        message: 'Seguro no encontrado',
        error: null,
        data: null,
      });
    }

    seguro.merge(validacion);

    await seguro.save();

    return response.status(200).json({
      status: 200,
      message: 'Seguro actualizado exitosamente',
      error: null,
      data: seguro,
    });
  }
  public async delete({ response, params }: HttpContextContract) {
    try { if (!params.id) {
      return response.badRequest({ message: 'El id del conductor es requerido.' })
    }
    const seguros = await Seguro.find(params.id)
    if (!seguros) {
      return response.notFound({ message: 'El seguro no existe.' })
    }
    seguros.status = 0
    await seguros.save()
   
    return response.status(200).json({
      status: 200,
      msg: 'Se ha eliminado correctamente',
      error: null,
      data: seguros
    })


  }
  catch (error) {
    console.error(error)
    return response.status(500).json({
      status: 500,
      msg: 'Error al eliminar el seguro',
      error: error.message,
      data: null,
    })
}
}
}


