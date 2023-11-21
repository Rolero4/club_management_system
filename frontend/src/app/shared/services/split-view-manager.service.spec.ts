import { TestBed } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { Meeting } from "../models/meeting.model";
import { SplitViewManagerService } from "./split-view-manager.service";

class MockActivatedRoute {
    queryParams = new BehaviorSubject({});
}

class MockRouter {
    navigate = jasmine.createSpy("navigate");
}

describe("SplitViewManagerService", () => {
    let mockService: SplitViewManagerService<Meeting>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                SplitViewManagerService,
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: Router, useClass: MockRouter },
            ],
        });
        mockService = TestBed.inject(SplitViewManagerService);
    });

    it("should be created", () => {
        expect(mockService).toBeTruthy();
    });
});
