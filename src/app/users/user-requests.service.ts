import { Injectable } from '@angular/core';
import {
  IUser,
  IRole
 } from '@app/definitions';
import 'rxjs/add/observable/of';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { UserMockService } from './user-mocks.service';
import { IResponse } from 'response-type';
import { GetNetworkError, IsSuccessEntity } from '@app/common';
import 'rxjs/add/operator/toPromise';
import { UserModuleState } from '@app/users/user.module.defs';

declare var io: any;

@Injectable()
export class UserRequestsService {

  constructor(
    private mocks: UserMockService,
    private store: Store<UserModuleState>,
    private http: HttpClient,
  ) { }

  public async GetRoles (): Promise<IResponse<IRole>> {
    const url = environment.api + '/api/roles';
    const ref = this.http.get(url).toPromise();
    try {
      const response: IResponse<IRole> = await ref;
      const collections = response.data.items;
      for (const item of collections) {
        this.store.dispatch({
          type: 'UPDATE_ROLE',
          payload: item
        });
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }
  public async GetUser (id: number): Promise<IResponse<IRole>> {
    const url = environment.api + '/api/user/' + id;
    const ref = this.http.get(url).toPromise();
    try {
      const response: IResponse<IRole> = await ref;
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }
  public async GetUsers (): Promise<IResponse<IUser>> {
    const url = environment.api + '/api/users';
    const ref = this.http.get(url).toPromise();
    try {
      const response: IResponse<IUser> = await ref;
      const collections = response.data.items;
      for (const item of collections) {
        this.store.dispatch({
          type: 'UPDATE_USER',
          payload: item
        });
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }

  public async PostRole (role: IRole): Promise<IResponse<IRole>> {
    const ref = this.http.post(environment.api + '/api/role' , role).toPromise();
    try {
      const response: IResponse<IRole> = await ref;
      if (response && response.data && response.data.items && response.data.items[0]) {
        const $role = response.data.items[0];
        if ($role) {
          this.store.dispatch({
            type: 'UPDATE_ROLE',
            payload: $role
          });
        }
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }
  public async PostUser (user: IUser): Promise<IResponse<IUser>> {
    const ref = this.http.post(environment.api + '/api/user' , user).toPromise();
    try {
      const response: IResponse<IUser> = await ref;
      if (response && response.data && response.data.items && response.data.items[0]) {
        const $user = response.data.items[0];
        if ($user) {
          this.store.dispatch({
            type: 'UPDATE_USER',
            payload: $user
          });
        }
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }
  async DeleteUser (id: number ) {
    const url = environment.api + '/api/user/' + id;
    const ref = this.http.delete(url).toPromise();
    try {
      const response: IResponse<IUser> = await ref;

      if (IsSuccessEntity(response)) {
        const $user = response.data.items[0];
        if ($user) {
          this.store.dispatch({
            type: 'DELETE_USER',
            payload: id
          });
        }
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }

  async deleteRole (id: number ) {
    const ref = this.http.delete(environment.api + '/api/role/' + id).toPromise();
    try {
      const response: IResponse<IRole> = await ref;
      if (IsSuccessEntity(response)) {
        const $role = response.data.items[0];
        if ($role) {
          this.store.dispatch({
            type: 'DELETE_ROLE',
            payload: id
          });
        }
      }
      return response;
    } catch (error) {
      if (error.name === 'HttpErrorResponse') {
        return GetNetworkError();
      }
      return error;
    }
  }
}
