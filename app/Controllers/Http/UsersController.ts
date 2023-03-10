import { HttpContext, Request, Response } from "@adonisjs/core/build/standalone";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Hash from "@ioc:Adonis/Core/Hash";
import Mail from '@ioc:Adonis/Addons/Mail'
import View from "@ioc:Adonis/Core/View";

import Route from '@ioc:Adonis/Core/Route'
import Database from "@ioc:Adonis/Lucid/Database";
import axios from "axios";
import VerifyEmail from "App/Mailers/VerifyEmail";
import VerifyEmail2 from "App/Mailers/VerifyEmail2";
import Sms from "App/Mailers/Sms";

export default class UsersController {







  public async numerodeverificacionmovil({request, response}:HttpContext) {


    const numeroiddelaurl = request.param('url');
    console.log(numeroiddelaurl)
    
     const user = await Database.from('users').where('id', numeroiddelaurl).first();
     const correo = user.email;
    //  await Mail.send(async (message) => {
    //    message
    //      .from('UTT@example.com')
    //      .to(user.email)
    //      .subject('Segundo paso/a a nuestro sitio')
    //      .html(await View.render('emails/welcome', { user }));
    //  });
    await new VerifyEmail2(user).sendLater()

    await new Sms(user).sendLater()
  
    //  await axios.post('https://rest.nexmo.com/sms/json', {
    //    from: 'UTT',
    //    api_key: '58762ea2',
    //    api_secret: 'BClcjqQJjd41CtJD',
    //    to: `52${user.telefono}`,
    //    text: `Tu codigo de verificacion es: ${user.no_verificacion}, sigue las instrucciones en tu correo electronico`,
    //  });
   
   
  
     const domain = correo.substring(correo.lastIndexOf('@') + 1);
   //  return { status: 301, headers: { Location: `https://${domain}` } };
     response.redirect(`https://${domain}`)
  }
  

  //----------------------------------------------------------------------
  public async crearusuario({ request, response }: HttpContext) {
    const validationSchema = schema.create({
      name: schema.string({ trim: true, escape: true }, [
        rules.required(),
        rules.maxLength(255),
      ]),
      email: schema.string({ trim: true, escape: true }, [
        rules.required(),
        rules.minLength(3),
        rules.maxLength(255),
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string({}, [rules.required(), rules.minLength(8)]),

      telefono: schema.string([
        rules.required(),
        rules.unique({ table: "users", column: "telefono" }),
        rules.minLength(10),
        rules.maxLength(10),
      ]),
    });
    try {
      const data = await request.validate({
        schema: validationSchema,
        messages: {
          "name.required": "El nombre es requerido",
          "name.string": "El nombre debe ser un texto",
          "name.minLength": "El nombre debe tener al menos 3 caracteres",
          "name.maxLength": "El nombre debe tener como m??ximo 50 caracteres",
          "email.required": "El email es requerido",
          "email.string": "El email debe ser un texto",
          "email.email": "El email debe ser un email v??lido",
          "email.unique": "El email ya est?? en uso",

          "password.required": "La contrase??a es requerida",
          "password.string": "La contrase??a debe ser un texto",
          "password.minLength":
            "La contrase??a debe tener al menos 8 caracteres",
          "password.maxLength":
            "La contrase??a debe tener como m??ximo 50 caracteres",

          "telefono.required": "El tel??fono es requerido",
          "telefono.minLength": "Debe tener al menos 10 caracteres",
          "telefono.maxLength": "Debe tener como m??ximo 10 caracteres",
          "telefono.unique": "El tel??fono ya est?? en uso",
        },
      });
      const numeroAleatorio = Math.round(Math.random() * (9000 - 5000) + 5000);
      const { name, email, password, telefono } = data;
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = await Hash.make(password);
      user.telefono = telefono;
      user.no_verificacion = numeroAleatorio;
      await user.save();
      const HOST = process.env.HOST;
      const PORT = process.env.PORT;
      const url = "http://"+HOST+":"+PORT+Route.makeSignedUrl(
        "validarnumero",
        {
          url: user.id,
        },
        {
          expiresIn: "5m",
        }
      ); 
      
      await new VerifyEmail(user,url).sendLater()

      return response.status(201).json({
        message: "Usuario registrado correctamente",
        user: user,
        email: user.email,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        message: "Error al registrar el usuario",
        data: error,
      });
    }
  }

 

  public async registrarsms({ request, response }: HttpContext) {
    const validationSchema = schema.create({
      codigo: schema.string({ trim: true, escape: true }, [
        
        rules.minLength(4),
        rules.maxLength(4),
      ]),
    });
  
    const data = await request.validate({
      schema: validationSchema,
      messages: {
        "codigo.required": "El codigo es requerido",
        "codigo.minLength": "El codigo debe tener al menos 4 caracteres",
        "codigo.maxLength": "El codigo debe tener como m??ximo 4 caracteres",
      },
    });
  
    const user = await Database.from('users').where('no_verificacion', data.codigo).first();
  
    if (user) {
      // Actualizar el campo "status" a 1
      await Database.from('users').where('no_verificacion', data.codigo).update({ status: 1 });
  
      return response.status(200).json({ message: 'Usuario actualizado correctamente' });
    } else {
      return response.status(404).json({ message: 'Usuario no encontrado' });
    }
  }
  

//----------------------------------------------------------------------
  
  public async getRole({ auth, response }) {
    try {
      const user = await auth.authenticate();
      const role = user.rol_id;
      return response.json({ role });
    } catch (error) {
      return response.status(401).json({ message: "Usuario no autenticado" });
    }
  }
  public async getStatus({ auth, response }) {
    try {
      const user = await auth.authenticate();
      const status = user.status;
      return response.json({ status });
    } catch (error) {
      return response.status(401).json({ message: "Usuario no autenticado" });
    }
  }
  //----------------------------------------------------------------------

  public async updateRole({ auth, params, request, response }) {
    const user = await User.findOrFail(params.id);

    if (!auth.user) {
      return response.status(401).json({ message: "Usuario no autenticado" });
    }
    if (auth.user.rol_id !== 1) {
      return response.status(403).json({
        message: "No tienes permisos para actualizar roles de usuario",
      });
    }
    const rol_id = request.input("rol_id");
    if (!rol_id) {
      return response
        .status(422)
        .json({ message: "El campo rol_id es requerido" });
    }

    user.rol_id = rol_id;
    await user.save();

    return response
      .status(200)
      .json({ message: "Rol actualizado correctamente" });
  }
  //----------------------------------------------------------------------

  public async updateStatus({ request, response, params }) {
    const { id } = params;
    const user = await User.findOrFail(id);
    user.status = request.input("status");
    await user.save();
    return response.status(200).json({
      message: "Estado actualizado con ??xito",
      user: user,
    });
  }
  //----------------------------------------------------------------------
  public async destroy({ params, response }) {
    try {
      const user = await User.findOrFail(params.id);
      await user.delete();

      return response.status(200).json({
        message: "Usuario eliminado con ??xito",
      });
    } catch (error) {
      return response.status(500).json({
        message: "Ocurri?? un error al eliminar el usuario",
      });
    }
  }
  //----------------------------------------------------------------------
  public async updateUser({ request, response, params }) {
    const { id } = params;
    const user = await User.findOrFail(id);

    user.rol_id = request.input("rol_id");
    user.status = request.input("status");

    await user.save();

    return response.status(200).json({
      message: "Usuario actualizado correctamente",
      user: user,
    });
  }


  
}


function validationResult(req: Request) {
  throw new Error("Function not implemented.");
}

