import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListarUsuariosComponent } from "./listar-usuarios/listar-usuarios.component";
import { CadastrarUsuarioComponent } from "./cadastrar-usuario/cadastrar-usuario.component";

const routes: Routes = [
    {
        path: '',
        component: ListarUsuariosComponent
    },
    {
        path: 'cadastrar',
        component: CadastrarUsuarioComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsuarioRountingModule { }