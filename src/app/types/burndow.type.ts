export type Sprint = {
    tamanhoDias: number;
    membros: number;
    horasDevDia: number;
    pontosPorHora: number;
}

export type Metrica = {
    dia: number;
    velocidade: Velocidade;
    pontosRemanescentes: number;
}

export type Velocidade = {
    horaPorPonto: number;
    pontosPorHora: number;
    pontosPorDia: number;
}

export class Burndown {
    sprint: Sprint;
    corrente?: Metrica;
    historico: Array<Metrica> = [];

    constructor() {
        this.sprint = {
            tamanhoDias: 0,
            horasDevDia: 0,
            pontosPorHora: 0,
            membros: 0
        }
    }
}