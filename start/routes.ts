/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.post('/users', 'UsersController.crearusuario')
  Route.get('/users/:id', 'UsersController.mostrarusuario')
  Route.put('/users/:id', 'UsersController.actualizarusuario')
  Route.delete('/users/:id', 'UsersController.eliminarusuario')
  Route.get('/validarnumero/:url', 'UsersController.numerodeverificacionmovil').as('validarnumero');
  Route.post('/dartedealta','UsersController.registrarsms')
}).prefix('api')

Route.group(()=>{
Route.post('/registrarconductor', 'ConductorsController.create');
Route.get('/conductor', 'ConductorsController.index');
Route.put('/editarconductor/:id', 'ConductorsController.update');
Route.delete('/eliminarconductor/:id', 'ConductorsController.delete')
}).prefix('con')


Route.group(()=>{
Route.post('/crearhospitals', 'HospitalsController.create')
Route.get("/hospital", 'HospitalsController.index');
Route.put('/editarhospital/:id', 'HospitalsController.update')
Route.delete('/eliminarhospital/:id', 'HospitalsController.delete')
}).prefix('hos')


Route.group(()=>{
Route.post('/crearTipodeavion', 'TipodeavionsController.create')
Route.get("/tipodeavion", 'TipodeavionsController.index');
Route.put('/editartipodeavion/:id', 'TipodeavionsController.update')
Route.delete('/eliminartipodeavion/:id', 'TipodeavionsController.delete')
}).prefix('avi')



Route.group(()=>{
Route.post("/crearseguros", 'SegurosController.create');
Route.get("/seguros", 'SegurosController.getseguros');
Route.put('/editarseguros/:id', 'SegurosController.update')
Route.delete('/eliminarseguro/:id', 'SegurosController.delete')
}).prefix('seg')





