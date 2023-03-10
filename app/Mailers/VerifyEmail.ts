import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View';
import User from 'App/Models/User'

export default class VerifyEmail extends BaseMailer {

  constructor(private user:User,private url){
    super()
    this.url=url
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "VerifyEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */



  public html =  View.render('emails/correo', {user:this.user,url:this.url});

  

  // Envía el correo
  public async prepare(message:MessageContract)  {
    message
      .from('UTT@example.com')
      .to(this.user.email)
      .subject('Bienvenido/a a nuestro sitio')
      .html(await this.html);
  }

}
