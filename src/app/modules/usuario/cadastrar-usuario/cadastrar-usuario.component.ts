import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import intlTelInput from 'intl-tel-input';
import { Usuario } from 'src/app/models/usuarios.model';
import { TelefonePipe } from 'src/app/pipe/telefone.pipe';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.scss']
})
export class CadastrarUsuarioComponent implements OnInit, AfterViewInit {
  @ViewChild('telefone', { static: false }) telefoneElement?: ElementRef;
  @Output() usuarioAdicionado = new EventEmitter<Usuario>();
  @Input() usuario?: Usuario;
  iti: any;
  modalRef: NgbModalRef | null = null;
  usuarioForm!: FormGroup;
  showSuccessAlert = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.createForm();
    if (this.usuario) {
      this.usuarioForm.patchValue(this.usuario); // Preenche o formulário com dados do usuário se estiver em modo de edição
    }
  }

  ngAfterViewInit(): void {
    if (this.telefoneElement) {
      this.iti = intlTelInput(this.telefoneElement.nativeElement, {
        initialCountry: "br",
        utilsScript: "node_modules/intl-tel-input/build/js/utils.js"
      });
    } else {
      console.error('Elemento de telefone não foi encontrado no DOM');
    }
  }

  createForm(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      telefone: [''],
      email: ['', Validators.required],
      perfil: [''],
      idioma: ['Português BR'],
      contatoPreferencial: this.fb.group({
        preferencial: ['']
      })
    });
  }
  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;
      const perfis = Array.isArray(formValue.perfil) ? formValue.perfil : formValue.perfil.split(', ');

      if (this.usuario) {
        const usuarioAtualizado: Usuario = { ...this.usuario, ...formValue };
        this.usuarioService.atualizarUsuario(usuarioAtualizado);
      } else {
        const usuario: Usuario = {
          id: new Date().getTime(),
          nome: formValue.nome,
          sobrenome: formValue.sobrenome,
          telefone: formValue.telefone,
          email: formValue.email,
          perfil: perfis, // Assumindo que perfil é uma string separada por vírgulas
          idioma: formValue.idioma,
          contatoPreferencial: formValue.contatoPreferencial.preferencial,
          status: 'Ativo', // Defina o status conforme necessário
          dataCriacao: new Date(),
          ultimoAcesso: new Date() // Assumindo que o último acesso é a data de criação
        };
        this.usuarioService.adicionarUsuario(usuario);
      }
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
        this.activeModal.close();  // Isso fechará o modal
      }, 1000);
    } else {
      // Tocar todos os campos para garantir que as mensagens de erro sejam exibidas
      Object.values(this.usuarioForm.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(subControl => subControl.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
  }

  formatarTelefone(): void {
    if (!this.iti || !this.usuarioForm) return;

    const numero = this.usuarioForm.get('telefone')?.value;
    const dadosPais = this.iti.getSelectedCountryData();
    const codigoPais = dadosPais.dialCode; // isto vai obter o código do país, como '55' para Brasil

    const telefoneFormatado = new TelefonePipe().transform(numero, codigoPais);
    this.usuarioForm.get('telefone')?.setValue(telefoneFormatado, { emitEvent: false });
  }


  closeModal() {
    this.activeModal.dismiss('Cross click');
  }

}
