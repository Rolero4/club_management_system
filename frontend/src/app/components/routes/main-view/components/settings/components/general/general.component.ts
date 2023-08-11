import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: "app-general",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./general.component.html",
    styleUrls: ["./general.component.scss"],
})
export class GeneralComponent {}
