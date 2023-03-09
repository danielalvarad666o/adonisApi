// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Conductor from 'App/Models/tabladaniel/Conductor';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import { Response } from '@adonisjs/core/build/standalone';




export default class ConductorsController {

  public async create({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      nombre: schema.string({}, [rules.required()]),
      Ap_materno: schema.string({}, [rules.required()]),
      Ap_paterno: schema.string({}, [rules.required()]),
      edad: schema.string({}, [rules.required()]),
    });
  
    try {
      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'nombre.required': 'El campo nombre es requerido',
          'Ap_materno.required': 'El campo Ap_materno es requerido',
          'Ap_paterno.required': 'El campo Ap_paterno es requerido',
          'edad.required': 'El campo edad es requerido',
        },
      });
  
      const conductor = new Conductor();
      conductor.nombre = payload.nombre;
      conductor.Ap_materno = payload.Ap_materno;
      conductor.Ap_paterno = payload.Ap_paterno;
      conductor.edad = payload.edad;
  
      await conductor.save();
  
      return response.status(201).json({
        status: 201,
        message: 'Datos almacenados',
        error: [],
        data: payload,
      });
    } catch (error) {
      return response.status(400).json({
        status: 400,
        message: 'Error en los datos',
        error: error.messages,
        data: {},
      });
    }
  }

  //----------------------------------------------------------------------------------
  public async update({ request, response, params }: HttpContextContract) {
    try {
        // Verifica si el id del conductor es válido
        if (!params.id) {
            return response.badRequest({ message: 'El id del conductor es requerido.' });
        }

        const conductor = await Database.from('conductors').where('id', params.id).first();

        if (!conductor) {
            return response.notFound({ message: 'El conductor no existe.' });
        }

        const validationSchema = schema.create({
            nombre: schema.string(),
            Ap_materno: schema.string(),
            Ap_paterno: schema.string(),
            edad: schema.string(),
        });

        const validatedData = await request.validate({
            schema: validationSchema,
            messages: {
                'nombre.string': 'El nombre debe ser una cadena de caracteres',
                'Ap_materno.string': 'El apellido materno debe ser una cadena de caracteres',
                'Ap_paterno.string': 'El apellido paterno debe ser una cadena de caracteres',
                'edad.string': 'La edad debe ser una cadena de caracteres',
            }
        });

        await Database.from('conductors').where('id', params.id).update(validatedData);

        return response.status(200).json({
            message: "Conductor actualizado exitosamente",
            data: conductor,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: "Error al actualizar el conductor",
            error: error.message,
        });
    }
}


//---------------------------------------------------------------------------
public async delete({ response, params }: HttpContextContract) {
  try {
    // Verifica si el id del conductor es válido
    if (!params.id) {
      return response.badRequest({ message: 'El id del conductor es requerido.' })
    }

    const conductor = await Conductor.find(params.id)

    if (!conductor) {
      return response.notFound({ message: 'El conductor no existe.' })
    }

    conductor.status = 0
    await conductor.save()

    return response.status(200).json({
      status: 200,
      msg: 'Se ha eliminado correctamente',
      error: null,
      data: conductor.nombre
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      status: 500,
      msg: 'Error al eliminar el conductor',
      error: error.message,
      data: null,
    })
  }
}

public async index({response}:HttpContextContract )
{
  const conductor= await Conductor.all();

  return response.status(200).json({
    conductore:conductor
  })
}


}


