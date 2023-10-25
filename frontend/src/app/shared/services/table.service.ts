import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, tap } from "rxjs";

import { TableResponse } from "../models/misc.model";
import { DestroyClass } from "../utils/destroyClass";

@Injectable()
export class TableService<T> extends DestroyClass {
    public readonly capacity = 7;
    private readonly currentPageIndexStore$ = new BehaviorSubject<number>(0);
    private readonly totalItemsStore$ = new BehaviorSubject<number>(0);
    private readonly tableItemsStore$ = new BehaviorSubject<T[]>([]);

    private set tableItems(tableItems: T[]) {
        this.tableItemsStore$.next(tableItems);
    }

    public get tableItems(): T[] {
        return this.tableItemsStore$.value;
    }

    public get tableItems$(): Observable<T[]> {
        return this.tableItemsStore$.asObservable();
    }

    public get currentPageIndex(): number {
        return this.currentPageIndexStore$.value;
    }

    public get currentPageIndex$(): Observable<number> {
        return this.currentPageIndexStore$.asObservable();
    }

    private set totalItems(totalItems: number) {
        this.totalItemsStore$.next(totalItems);
    }

    public get totalItems$(): Observable<number> {
        return this.totalItemsStore$.asObservable();
    }

    public changePage(newPage: number): void {
        this.currentPageIndexStore$.next(newPage);
    }

    public refreshTableItems$(
        request: Observable<TableResponse<T>>
    ): Observable<T[]> {
        return request.pipe(
            tap((response) => {
                this.totalItems = response.total;
                this.tableItems = response.items;
            }),
            this.untilDestroyed(),
            map((items) => items.items)
        );
    }
}
