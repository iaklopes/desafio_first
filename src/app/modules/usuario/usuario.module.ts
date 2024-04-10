import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastrarUsuarioComponent } from './cadastrar-usuario/cadastrar-usuario.component';
import { ListarUsuariosComponent } from './listar-usuarios/listar-usuarios.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsuarioRountingModule } from './usuario-routing.module';



@NgModule({
  declarations: [
    CadastrarUsuarioComponent,
    ListarUsuariosComponent
  ],
  imports: [
    CommonModule, SharedModule, UsuarioRountingModule
  ]
})
export class UsuarioModule { }
