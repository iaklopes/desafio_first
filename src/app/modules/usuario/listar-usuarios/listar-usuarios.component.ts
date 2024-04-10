import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuarios.model';
import { UsuarioService } from 'src/app/service/usuario.service';
import { CadastrarUsuarioComponent } from '../cadastrar-usuario/cadastrar-usuario.component';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent implements OnInit {
  searchForm = new FormGroup({
    searchQuery: new FormControl('')
  });

  currentPage = 1;
  usuarios: Usuario[] = [];
  searchQuery = '';
  sortConfig = {
    property: '' as keyof Usuario | '',
    direction: 'asc' as 'asc' | 'desc'
  };
  statusOptions = ['Todos', 'Ativo', 'Bloqueado', 'Pendente'];
  selectedStatus: string[] = [];
  pageSize = 10;
  collectionSize = 5;

  showSuccessAlert = false;
  mensagem = '';

  constructor(private usuarioService: UsuarioService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadUsuarios();
    this.setupSearchListener();
  }

  private loadUsuarios(): void {
    this.usuarioService.usuarios$.subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  private setupSearchListener(): void {
    this.searchForm.get('searchQuery')?.valueChanges.subscribe(query => {
      this.searchQuery = query || '';
      this.applyFilters();
    });
  }

  toggleStatus(status: string): void {
    this.selectedStatus.includes(status)
      ? this.selectedStatus = this.selectedStatus.filter(s => s !== status)
      : this.selectedStatus.push(status);
    this.applyFilters();
  }

  applyFilters(): void {
    this.filterUsuarios();
    this.sortUsuarios();
  }

  private filterUsuarios(): void {
    if (!this.searchQuery && this.selectedStatus.length === 0) {
      this.loadUsuarios();
    }
    if (this.searchQuery) {
      this.usuarios = this.usuarios.filter(user => this.doesUserMatchSearchQuery(user));
      return
    }
    if (this.selectedStatus.length > 0) {
      if (this.selectedStatus.includes('Todos')) {
        this.loadUsuarios();
      } else {
        this.usuarios = this.usuarios.filter(user =>
          this.selectedStatus.includes(user.status)
        );
      }
      return;
    }
  }

  private doesUserMatchSearchQuery(user: Usuario): boolean {
    const query = this.searchQuery.toLowerCase();
    return user.nome.toLowerCase().includes(query) || (user.email?.toLowerCase().includes(query) || false);
  }

  sort(property: keyof Usuario): void {
    this.sortConfig = this.sortConfig.property === property
      ? { ...this.sortConfig, direction: this.sortConfig.direction === 'asc' ? 'desc' : 'asc' }
      : { property, direction: 'asc' };

    this.sortUsuarios();
  }

  private sortUsuarios(): void {
    this.usuarios.sort((a, b) => this.compareForSort(a, b));
  }

  private compareForSort(a: Usuario, b: Usuario): number {
    const { property, direction } = this.sortConfig;
    if (!property) {
      return 0;
    }

    const modifier = direction === 'asc' ? 1 : -1;
    const aValue = a[property] || ''; // Fallback para evitar undefined
    const bValue = b[property] || ''; // Fallback para evitar undefined

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * modifier;
    }

    return 0;
  }

  getSortIcon(property: keyof Usuario): string {
    return this.sortConfig.property !== property
      ? 'fa-angle-down'
      : this.sortConfig.direction === 'asc'
        ? 'fa-angle-up'
        : 'fa-angle-down';
  }

  getAvatarClass(nome: string): string {
    const feminineNames = ['Maria', 'Ana', 'Joana', 'Aline', 'Juliana', 'Gabriela', 'Isabela'];
    return feminineNames.includes(nome) ? 'pink' : 'green';
  }

  openCadastrarUsuarioModal(): void {
    this.modalService.open(CadastrarUsuarioComponent, { size: 'lg' });
  }

  private paginateUsuarios(): void {
    const startItem = (this.currentPage - 1) * this.pageSize;
    const endItem = startItem + this.pageSize;
    this.usuarios = this.usuarios.slice(startItem, endItem);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.paginateUsuarios();
  }

  excluirUsuario(id: number): void {
    this.usuarioService.excluirUsuario(id);
    this.loadUsuarios();
    this.mensagem = 'Usuário excluido com sucesso !'
    this.showSuccessAlert = true;
    this.temporizadorAlert();
  }

  editarUsuario(usuario: Usuario): void {
    const modalRef = this.modalService.open(CadastrarUsuarioComponent, { size: 'lg' });
    modalRef.componentInstance.usuario = usuario;
  }


  temporizadorAlert(): void {
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 2000);
  }
}
