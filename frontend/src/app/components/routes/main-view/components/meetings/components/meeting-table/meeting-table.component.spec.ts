import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MeetingTableComponent } from "./meeting-table.component";

describe("MeetingTableComponent", () => {
    let component: MeetingTableComponent;
    let fixture: ComponentFixture<MeetingTableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MeetingTableComponent],
        });
        fixture = TestBed.createComponent(MeetingTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
