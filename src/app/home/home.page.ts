import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private http: HttpClient, private nativeHttp: HTTP,
    private plt: Platform, private loadingCtrl: LoadingController) { }

  data: any[] = [];
  apiUrl: string = 'https://swapi.dev/api/films/';

  async getDataStandard() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    this.http.get(this.apiUrl).pipe(
      finalize(() => loading.dismiss())
    ).subscribe(data => {
      this.data = data['results'];
    }, err => {
      console.log('JS Call error: ', err);
    });
  }

  //mobile only
  async getDataNativeHttp() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    let nativeCall: Promise<HTTPResponse> = this.nativeHttp.get(this.apiUrl, {}, {
      'Content-Type': 'application/json'
    });

    from(nativeCall).pipe(
      finalize(() => loading.dismiss())
    ).subscribe(res => {
      console.log('native data: ', res);
      this.data = JSON.parse(res.data).results;
    }, err => {
      console.log('JS Call error: ', err);
    });
  }

  //both on mobile and browser
  getDataEverywhere() {
    this.plt.is('cordova') ? this.getDataNativeHttp() : this.getDataStandard();
  }

}
