import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuarios$ = this.usuariosSubject.asObservable();

  constructor() { }

  adicionarUsuario(novoUsuario: Usuario) {
    const usuariosAtualizados = [...this.usuariosSubject.value, novoUsuario];
    this.usuariosSubject.next(usuariosAtualizados);
  }

  atualizarUsuario(usuarioAtualizado: Usuario) {
    const usuarios = this.usuariosSubject.value;
    const index = usuarios.findIndex(usuario => usuario.id === usuarioAtualizado.id);
    if (index !== -1) {
      usuarios[index] = usuarioAtualizado;
      this.usuariosSubject.next(usuarios);
    }
  }

  excluirUsuario(id: number) {
    const usuariosFiltrados = this.usuariosSubject.value.filter(usuario => usuario.id !== id);
    this.usuariosSubject.next(usuariosFiltrados);
  }

  carregarUsuarios(usuarios: Usuario[]) {
    this.usuariosSubject.next(usuarios);
  }
}
