import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { Toast } from '@ionic-native/toast';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Toast,
    FCM,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {

  constructor(private fcm: FCM, private toast: Toast) {
    this.toast.show(`App started`, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
    this.fcm.getToken().then(token => {
      localStorage.setItem('token', token);
      this.toast.show(token, '5000', 'bottom');
      this.fcm.subscribeToTopic('marketing');
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          this.toast.show(`Received in background`, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
          console.log("Received in background");
        } else {
          this.toast.show(`Received in foreground`, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
          console.log("Received in foreground");
        };
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        localStorage.setItem('token', token);
      });
    });
    
  }

}
