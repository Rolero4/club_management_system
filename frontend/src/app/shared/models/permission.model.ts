import { Roles } from "./user.model";

export interface RolePermission {
    modules: ModulesPermissions[];
    permissions: SubPermissions[];
}

export enum ModulesPermissions {
    Settings = "settings",
    Dashboard = "dashboard",
    Meetings = "meetings",
    Teams = "teams",
    Schedule = "schedule",
}

export type SubPermissions =
    | TeamPermission
    | MeetingsPermission
    | SettingsPermission
    | SchedulePermission;

export enum TeamPermission {
    Bio = "bio",
    Stats = "stats",
    Modify = "modify",
    Cluster = "cluster",
}
export enum MeetingsPermission {
    CreateMeeting = "createMeeting",
}

export enum SettingsPermission {
    Modifyusers = "modifyUsers",
}

export enum SchedulePermission {
    Marks = "marks",
}

export const allPermissions: SubPermissions[] = [
    ...Object.values(TeamPermission),
    ...Object.values(MeetingsPermission),
    ...Object.values(SettingsPermission),
    ...Object.values(SchedulePermission),
];

export const RoleDefinitions: Record<Roles, RolePermission> = {
    [Roles.Admin]: {
        modules: Object.values(ModulesPermissions),
        permissions: [
            ...Object.values(TeamPermission),
            ...Object.values(MeetingsPermission),
            ...Object.values(SettingsPermission),
            ...Object.values(SchedulePermission),
        ],
    },
    [Roles.Coach]: {
        modules: Object.values(ModulesPermissions),
        permissions: [
            ...Object.values(TeamPermission),
            ...Object.values(SchedulePermission),
        ],
    },
    [Roles.Player]: {
        modules: Object.values(ModulesPermissions),
        permissions: [TeamPermission.Bio],
    },
    [Roles.Viewer]: {
        modules: [ModulesPermissions.Dashboard, ModulesPermissions.Settings],
        permissions: [],
    },
};