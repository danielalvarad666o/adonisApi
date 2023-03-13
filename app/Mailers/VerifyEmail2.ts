import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import View from '@ioc:Adonis/Core/View';

export default class VerifyEmail2 extends BaseMailer {

  constructor (private user: User) {
    super()
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
   * "VerifyEmail2.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    message
    .from('UTT@example.com')
    .to(this.user.email)
    .subject('Segundo paso/a a nuestro sitio')
    .html(await View.render('emails/welcome', { user:this.user }));

  }
}
