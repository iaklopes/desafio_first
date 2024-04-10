export interface Usuario {
    id?: number;
    nome: string;
    sobrenome: string;
    telefone?: string;
    email?: string;
    perfil?: string[];
    idioma?: string;
    contatoPreferencial?: string;
    status: string;
    dataCriacao?: Date;
    ultimoAcesso?: Date;
}
