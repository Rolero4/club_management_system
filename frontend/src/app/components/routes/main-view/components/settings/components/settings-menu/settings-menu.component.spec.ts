import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SettingsMenuComponent } from "./settings-menu.component";

describe("SettingsMenuComponent", () => {
    let component: SettingsMenuComponent;
    let fixture: ComponentFixture<SettingsMenuComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        fixture = TestBed.createComponent(SettingsMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });
});
