import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MatchEventsComponent } from "./match-events.component";

describe("MatchEventsComponent", () => {
    let component: MatchEventsComponent;
    let fixture: ComponentFixture<MatchEventsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatchEventsComponent],
        });
        fixture = TestBed.createComponent(MatchEventsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
