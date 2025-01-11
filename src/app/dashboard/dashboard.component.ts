import { Component, OnInit } from '@angular/core';
import { ClasseService } from 'app/service/classe.service';
import { UserService } from 'app/user.service';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  countEleves: number = 0;
  countEnseignants: number = 0;
  countClasses: number = 0;
  constructor(private userService :UserService ,private classService :ClasseService) { }





  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
        if (data.type === 'line' || data.type === 'area') {
            data.element.animate({
                d: {
                    begin: 600,
                    dur: 700,
                    from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                    to: data.path.clone().stringify(),
                    easing: Chartist.Svg.Easing.easeOutQuint
                }
            });
        } else if (data.type === 'point') {
            seq++;
            data.element.animate({
                opacity: {
                    begin: seq * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: 'ease'
                }
            });
        }
    });

    seq = 0;
}

startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
        if (data.type === 'bar') {
            seq2++;
            data.element.animate({
                opacity: {
                    begin: seq2 * delays2,
                    dur: durations2,
                    from: 0,
                    to: 1,
                    easing: 'ease'
                }
            });
        }
    });

    seq2 = 0;
}

ngOnInit() {


  this.userService.getCountEleves().subscribe(
    (count: number) => {
      this.countEleves = count;
    },
    (error) => {
      console.error('Erreur lors de la récupération du nombre d\'élèves', error);
    }
  );

  this.userService.getCountEnseignants().subscribe(
    (count: number) => {
      this.countEnseignants = count;
    },
    (error) => {
      console.error('Erreur lors de la récupération du nombre d\'enseignants', error);
    }
  );
  this.classService.getCountClasses().subscribe(
    (count: number) => {
      this.countClasses = count;
    },
    (error) => {
      console.error('Erreur lors de la récupération du nombre de classes', error);
    }
  );

    const dataAbsenceChart: any = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        series: [
            [2, 5, 1, 3, 4, 2, 6] 
        ]
    };

    const optionsAbsenceChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        low: 0,
        high: 10, 
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    const absenceChart = new Chartist.Line('#absenceChart', dataAbsenceChart, optionsAbsenceChart);
    this.startAnimationForLineChart(absenceChart);

    const dataSanctionChart: any = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        series: [
            [1, 0, 2, 1, 3, 1, 0] 
        ]
    };

    const optionsSanctionChart: any = {
        lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
        }),
        low: 0,
        high: 5, 
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    const sanctionChart = new Chartist.Line('#sanctionChart', dataSanctionChart, optionsSanctionChart);
    this.startAnimationForLineChart(sanctionChart);

    const dataSubjectsChart: any = {
        labels: ['Maths', 'Fr', 'Hist', 'Angl', 'Scie', 'Sport'],
        series: [
            [30, 25, 40, 50, 35, 20] 
        ]
    };

    const optionsSubjectsChart: any = {
        axisX: {
            showGrid: false
        },
        low: 0,
        high: 60, 
        chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };

    const responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value[0];
                }
            }
        }]
    ];

    const subjectsChart = new Chartist.Bar('#subjectsChart', dataSubjectsChart, optionsSubjectsChart, responsiveOptions);
    this.startAnimationForBarChart(subjectsChart);
}



  

}
