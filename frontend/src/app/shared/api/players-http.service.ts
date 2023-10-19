import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { BackendResponse } from "../models/misc.model";
import { Player, ShortPlayer } from "../models/player.model";

@Injectable({
    providedIn: "root",
})
export class PlayersHttpService {
    constructor(private readonly http: HttpClient) {}

    public createPlayer(player: Player): Observable<BackendResponse> {
        return this.http.post<BackendResponse>("/api/v1/players", player);
    }

    public getAllPlayers(): Observable<ShortPlayer[]> {
        return this.http.get<ShortPlayer[]>("/api/v1/players/all");
    }
}
