import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CinemaService } from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes;cinemas;salles;projections
  public currentVille; currentCinema;currentProjection
  public selectedTicket:any;
  
  constructor(public cinemaService: CinemaService) { }

  ngOnInit() {
    this.cinemaService.getVilles().subscribe(data => {
      this.villes = data;
    }, err => {
      console.log(err);
    }
    )
  }
  onGetCinema(v) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v).subscribe(data => {
      this.cinemas = data;
    }, err => {
      console.log(err);
    }
    );
  }
  onGetSalle(c){
    
    this.currentCinema=c;
    this.cinemaService.getSalles(c).subscribe(data => {
      this.salles = data;
      this.salles._embedded.salles.forEach(salle => {
        this.cinemaService.getProjections(salle).subscribe(data => {
          salle.projections = data;
        }, err => {
          console.log(err);
        }
        );
      });
    }, err => {
      console.log(err);
    }
    );
  }
  onGetTicketsPlace(p){
    this.currentProjection=p;
    this.cinemaService.getTicketsPlace(p).subscribe(data => {
      this.currentProjection.tickets=data;
      this.selectedTicket=[];
    }, err => {
      console.log(err);
    }
    );
  }
  onSelectTicket(t){
   if(!t.selected){
     t.selected=true;
     this.selectedTicket.push(t);
   }
   else{
     t.selected=false;
     this.selectedTicket.splice(this.selectedTicket.indexOf(t),1);
   }
      
  }
  getTicketClass(t){
    let str="btn ";
    
    if(t.selected){
      str+="btn-warning ticket";
    }
    else if(t.reserve==true){
      str+="btn-danger ticket";
    }
    else{
      str+="btn-success ticket";
    }
    return str;
    
  }
  onPayTicket(form){
    let tickets=[];
    this.selectedTicket.forEach(t=>{
      tickets.push(t.id);
    });
    form.tickets=tickets;
    this.cinemaService.payerTicket(form).subscribe(data => {
      alert("Reserved with success");
      this.onGetTicketsPlace(this.currentProjection);
    }, err => {
      console.log(err);
    }
    );
  }

}
