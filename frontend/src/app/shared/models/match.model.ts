import { ShortPlayer } from "./player.model";

export enum MatchContentType {
    Details = "details",
    Squad = "squad",
    Events = "events",
}

export enum MatchContinuity {
    Start = "start",
    End = "end",
}

export interface MatchDetails {
    notes: string;
    date: string;
}

export interface MatchScoreBase {
    opponent: string;
    is_home: boolean;
}

export interface MatchScore extends MatchScoreBase {
    goals_scored: number;
    goals_conceded: number;
    is_own_event: boolean;
}

export interface MatchBase extends MatchScoreBase, MatchDetails {
    team_id: number;
}

export interface MatchCreate {
    match: MatchBase;
    player_ids: number[];
}

export interface Match extends MatchDetails, MatchScore {
    id: number;
    team_name: string;
    players: ShortPlayer[];
}

export interface TableMatch extends MatchScore {
    id: number;
    team_name: string;
    date: string;
}
