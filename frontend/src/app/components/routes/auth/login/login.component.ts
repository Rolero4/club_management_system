import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
    Validators,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "src/app/shared/modules/material.module";
import { UserService } from "../../../../shared/services/user.service";
import { switchMap } from "rxjs";
import { User } from "../../../../shared/models/user.model";
import { PermissionDirective } from "src/app/shared/directives/permission.directive";
import { TeamPermission } from "src/app/shared/models/permission.model";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
        PermissionDirective,
    ],
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public permissions = TeamPermission;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly userService: UserService
    ) {}

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.loginForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(8)]],
        });
    }

    public onSubmit(): void {
        if (this.loginForm.valid) {
            this.userService
                .login(this.loginForm.value)
                .pipe(switchMap(() => this.userService.get_current_user()))
                .subscribe((user: User) => console.log(user));
        }
    }
}
