import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit{
show=false;
  name = 'Angular Html To Pdf ';





  

  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  ngOnInit(): void {

    


}

  public downloadAsPDF() {
    console.log("oo")
    const doc = new jsPDF('p', 'pt', 'a4'); // Specify page orientation, units, and size
    const pdfTable = this.pdfTable.nativeElement;
    
    doc.html(pdfTable, {
        callback: (doc) => {
          
            doc.save('tableToPdf.pdf');
        },
        
        x: 10, // Adjust x and y position if needed
        y: 10,
        html2canvas: { scale: 0.65} // Adjust scale factor to fit content better
    });
  }}