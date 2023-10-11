import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
    BehaviorSubject,
    combineLatest,
    map,
    Observable,
    startWith,
    tap,
} from "rxjs";

import { ShortUser } from "../../../../../../../../shared/models/user.model";
import { UserService } from "../../../../../../../../shared/services/user.service";
import { formatDateFromInputForBackend } from "../../../../../../../../shared/utils/dateHelpers";
import { DestroyClass } from "../../../../../../../../shared/utils/destroyClass";
import {
    newMeetingDataFormBuilder,
    NewMeetingFormGroup,
} from "../newMeetingFormBuilder";
import {
    Meeting,
    NewMeeting,
} from "./../../../../../../../../shared/models/meetings.model";

@Injectable()
export class MeetingsPopupFormService extends DestroyClass {
    public meetingForm: FormGroup<NewMeetingFormGroup>;
    public attendeeInputControl = new FormControl<string>("");

    public meetingData: Meeting;
    public isEditMode = false;

    private readonly allAttendeesStore$ = new BehaviorSubject<ShortUser[]>([]);
    private readonly selectedAttendeesStore$ = new BehaviorSubject<ShortUser[]>(
        []
    );

    constructor(private readonly userService: UserService) {
        super();
    }

    public initData(meetingData: Meeting | null): void {
        this.meetingForm =
            newMeetingDataFormBuilder.buildFormGroup(meetingData);

        if (meetingData !== null) {
            this.isEditMode = true;
            this.meetingData = meetingData;
        }

        this.userService
            .getAllUsers()
            .pipe(
                tap((users) => {
                    this.allAttendees = users;
                    if (meetingData !== null) {
                        this.selectedAttendees = users.filter((user) =>
                            meetingData.users.some(
                                (dataUser) => dataUser.id === user.id
                            )
                        );
                    }
                }),
                this.untilDestroyed()
            )
            .subscribe();
    }

    private set allAttendees(allAttendees: ShortUser[]) {
        this.allAttendeesStore$.next(allAttendees);
    }

    public get allAttendees$(): Observable<ShortUser[]> {
        return this.allAttendeesStore$.asObservable();
    }

    private set selectedAttendees(selectedAttendees: ShortUser[]) {
        this.selectedAttendeesStore$.next(selectedAttendees);
    }

    public get selectedAttendees(): ShortUser[] {
        return this.selectedAttendeesStore$.value;
    }

    public get selectedAttendees$(): Observable<ShortUser[]> {
        return this.selectedAttendeesStore$.asObservable();
    }

    public get filteredAttendees$(): Observable<ShortUser[]> {
        return combineLatest([
            this.allAttendees$,
            this.selectedAttendees$,
            this.attendeeInputControl.valueChanges.pipe(
                startWith(this.attendeeInputControl.value)
            ),
        ]).pipe(
            map(([allAttendees, selectedAttendees, inputValue]) => {
                const filterValue = inputValue ?? "";
                return allAttendees.filter((attendee) => {
                    if (this.isEditMode) {
                        return (
                            attendee.id !==
                                this.meetingData.created_by_user.id &&
                            !selectedAttendees.some(
                                (a) => a.id === attendee.id
                            ) &&
                            attendee.full_name
                                .toLowerCase()
                                .includes(filterValue)
                        );
                    }
                    return (
                        attendee.id !== this.userService.currentUser?.id &&
                        !selectedAttendees.some((a) => a.id === attendee.id) &&
                        attendee.full_name.toLowerCase().includes(filterValue)
                    );
                });
            })
        );
    }

    public addAttendeeToSelectedList(attendee: ShortUser): void {
        this.selectedAttendees = [...this.selectedAttendees, attendee];
        this.attendeeInputControl.setValue("");
        this.meetingForm
            .get("user_ids")
            ?.setValue(this.selectedAttendees.map((a) => a.id));
    }

    public removeAttendeeFromSelectedList(attendee: ShortUser): void {
        this.selectedAttendees = this.selectedAttendees.filter(
            (a) => a.id !== attendee.id
        );
        this.meetingForm
            .get("user_ids")
            ?.setValue(this.selectedAttendees.map((a) => a.id));
    }

    public setDateInMeetingForm(selectedDate: Date): void {
        this.meetingForm.controls.meeting.controls.date.setValue(
            formatDateFromInputForBackend(selectedDate)
        );
    }

    public getFormData(): NewMeeting {
        return this.meetingForm.value as NewMeeting;
    }
}