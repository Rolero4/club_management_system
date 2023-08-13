import { MainMenuItem } from "src/app/shared/models/misc.model";
import { ModulesPermissions } from "src/app/shared/models/permission.model";

export const menuItems: MainMenuItem[] = [
    {
        name: ModulesPermissions.Dashboard,
        icon: "dashboard",
        route: "/app/dashboard",
    },
    { name: "calendar", icon: "calendar_month", route: "/app" },
    {
        name: ModulesPermissions.Meetings,
        icon: "question_answer",
        route: "/app/meetings",
    },
    { name: ModulesPermissions.Teams, icon: "groups", route: "/app" },
    {
        name: ModulesPermissions.Schedule,
        icon: "event_available",
        route: "/app",
    },
    { name: "finances", icon: "savings", route: "/app" },
    { name: "medic", icon: "local_hospital", route: "/app" },
    {
        name: ModulesPermissions.Schedule,
        icon: "settings",
        route: "/app/settings",
    },
];
