import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { Burndown } from '../types/burndow.type';
import { v1 } from '../types/sprint.v1.type';

@Component({
  selector: 'app-burndown-chart',
  templateUrl: './burndown-chart.component.html',
  styleUrls: ['./burndown-chart.component.scss']
})
export class BurndownChartComponent {
  // Data structure v1.0.0
  data?: v1.Root;
  burndown?: Burndown;
  currentSprint = 0;
  burndownChart: any = [];
  totalPontos = 0;
  pontosProduzidos: Array<number> = [];
  horasConsumidas: any = [];
  estimado: any = [];
  estimativaRestante: any = [];
  labelDias: any = [];
  horasDisponiveis: any = [];
  totalDias = 0;
  indiceUltimoPontoProduzido = 0;
  velocidadeEstimada = 0;
  pontosDiaEstimado = 0;
  velocidadeMedia = 0;

  ngOnInit() {
    this.loadData();
    this.currentSprint = 0;

    this.burndown = new Burndown();
    this.burndown.sprint.tamanhoDias = this.data!.sprints[0].size;
    this.burndown.sprint.horasDevDia = 8;
    this.burndown.sprint.membros = this.data!.team.length;

    // Get data
    for (let i = 0; i < this.data!.sprints[0].size; i++) {
      this.horasConsumidas.push(0);
      this.horasDisponiveis.push(0);
    }
    this.totalPontos = this.data!.userStories.map(x => x.estimation.calculatedPoints).reduce((x, y) => x + y);
    this.pontosProduzidos = this.data!.sprints[this.currentSprint].daily.map(x => x.remainingWork);
    // TODO esses dois foreach poderiam ser um só
    this.data!.team.map(x => x.worked).forEach((h) => {
      h.forEach((y, j) => {
        this.horasConsumidas[j] += y;
      });
    });

    this.data!.team.map(x => x.availability).forEach((h) => {
      h.forEach((y, j) => {
        this.horasDisponiveis[j] += y;
      });
    });

    this.totalDias = this.burndown.sprint.tamanhoDias - 1;
    for (let i = 0; i <= this.totalDias; i++) {
      let velocidade = this.totalPontos / this.totalDias;
      let pontosDia = this.totalPontos - (velocidade * i);
      this.estimado.push(pontosDia < 0 ? 0 : pontosDia);
      this.labelDias.push(i + 1);

      if (this.pontosProduzidos[i]) {
        this.estimativaRestante.push(this.pontosProduzidos[i]);
        this.indiceUltimoPontoProduzido = i;
        this.pontosDiaEstimado = this.pontosProduzidos[i];
        this.velocidadeEstimada = this.pontosProduzidos[i - 1 < 0 ? 0 : i - 1] - this.pontosProduzidos[i];
      } else {
        // Projeta evolução estimada à partir da última velocidade calculada
        this.pontosDiaEstimado -= this.velocidadeEstimada;
        this.estimativaRestante.push(this.pontosDiaEstimado > 0 ? this.pontosDiaEstimado : 0);
      }
    }

    // Distribuição Beta para calcular a média
    this.velocidadeMedia = (this.velocidadeEstimada
      + (this.totalPontos / (this.burndown!.sprint.tamanhoDias - 1)) * 4
      + (this.totalPontos - this.pontosProduzidos[this.indiceUltimoPontoProduzido]) / this.indiceUltimoPontoProduzido) / 6;
    this.burndown.sprint.pontosPorHora = (this.totalPontos - this.pontosProduzidos[this.indiceUltimoPontoProduzido]) / this.horasConsumidas.reduce((x: number, y: number) => x + y);

    this.burndownChart = new Chart('canvas', {
      data: {
        labels: this.labelDias,
        datasets: [
          {
            type: 'line',
            label: 'Burndown (pontos)',
            borderColor: '#E20069',
            backgroundColor: '#E20069',
            data: this.pontosProduzidos,
            yAxisID: 'escalaPontos',
          },
          {
            type: 'line',
            label: 'Projetado (pontos)',
            borderColor: 'orange',
            backgroundColor: 'orange',
            borderDash: [4],
            data: this.estimativaRestante,
            yAxisID: 'escalaPontos'
          },
          {
            type: 'line',
            label: 'Baseline (Pontos)',
            borderColor: '#7F7F7F',
            backgroundColor: '#7F7F7F',
            data: this.estimado,
            yAxisID: 'escalaPontos'
          },
          {
            type: 'bar',
            label: 'Horas Previstas',
            data: this.horasDisponiveis,
            backgroundColor: '#99DAFF',
            borderColor: '#BBC5B7',
            borderWidth: 1,
            barThickness: 30,
            yAxisID: 'escalaHoras'
          },
          {
            type: 'bar',
            label: 'Horas Consumidas',
            data: this.horasConsumidas,
            backgroundColor: '#C0EFAF',
            borderColor: '#BBC5B7',
            borderWidth: 1,
            barThickness: 30,
            yAxisID: 'escalaHoras'
          }
        ]
      },
      options: {
        scales: {
          escalaPontos: {
            position: 'left',
            title: {
              text: 'PONTOS REMANESCENTES',
              display: true
            }
          },
          escalaHoras: {
            position: 'right',
            type: 'linear',
            min: 0,
            max: 180,
            grid: {
              display: false
            },
            title: {
              text: 'HORAS',
              display: true
            }
          }
        }
      }
    });
  }

  loadData() {
    this.data = {
      "id": 1,
      "version": "1.0.0",
      "project": "Teste de teste",
      "goal": "",
      "sprints": [
        {
          "id": 1,
          "sequence": 2,
          "goals": ["Goal 1", "Goal 2", "Goal 3"],
          "startDate": "2024-06-24",
          "endData": "2024-07-05",
          "size": 10,
          "userStoriesId": [1],
          "daily": [
            {
              "day": 1,
              "remainingWork": 292,
              "notes": ["No impediments"]
            },
            {
              "day": 2,
              "remainingWork": 224.8,
              "notes": ["No impediments"]
            },
            {
              "day": 3,
              "remainingWork": 185.2,
              "notes": ["No impediments"]
            },
            {
              "day": 4,
              "remainingWork": 161.2,
              "notes": ["No impediments"]
            }
          ]
        }
      ],
      "team": [
        {
          "id": 1,
          "name": "DEV 1",
          "availability": [0, 8, 8, 8, 8, 8, 8, 8, 8, 8],
          "worked": [8, 8, 40],
          "hourRate": 115,
          "position": "developer"
        },
        {
          "id": 2,
          "name": "DEV 2",
          "availability": [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
          "worked": [8, 8],
          "hourRate": 85,
          "position": "developer"
        },
        {
          "id": 3,
          "name": "DEV 3",
          "availability": [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
          "worked": [8, 8],
          "hourRate": 135,
          "position": "developer"
        },
        {
          "id": 4,
          "name": "DEV 4",
          "availability": [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
          "worked": [8, 8],
          "hourRate": 135,
          "position": "developer"
        },
        {
          "id": 5,
          "name": "DEV 5",
          "availability": [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
          "worked": [8, 8],
          "hourRate": 135,
          "position": "developer"
        }
      ],
      "userStories": [
        {
          "id": 1,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 8
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 13
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 3,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 24
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 16
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 32
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 8
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 8
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 8
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 33
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 24
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 32
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 8
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 33
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        },
        {
          "id": 2,
          "parentId": null,
          "type": "userStory",
          "priority": 0,
          "story": "Me as customer want to buy a book so that I can gift a friend",
          "acceptanceCriteria": "The book should be ordered successful",
          "estimation": {
            "interaction": 3,
            "businessRules": 2,
            "entities": 1,
            "dataHandling": 3,
            "calculatedPoints": 45
          },
          "startDate": "2024-06-24",
          "endDate": "",
          "status": "working",
          "workedHours": 4,
          "estimatedHours": 16
        }
      ],
      "kanban": ["Product Backlog", "Sprint Backlog", "Working", "Validation", "Done"],
      "definitionOfReady": [],
      "definitionOfDone": [],
      "releases": [
        {
          "id": 1,
          "name": "Release 1",
          "userStoriesId": [1]
        }
      ]
    };
  }
}
