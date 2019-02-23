import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LocationService, GoogleMapOptions, Environment, MarkerOptions, Marker
} from '@ionic-native/google-maps';

import {ToastController, Platform} from 'ionic-angular';

import {SecondPage} from "../second/second";

const CAMERA_DEFAULT_LAT = 47.497912;
const CAMERA_DEFAULT_LONG = 19.040235;
const CAMERA_DEFAULT_ZOOMLEVEL = 13;
const POLYGON_STROKE_COLOR = '#73922a70';
const POLYGON_FILL_COLOR = '#8fbf1c20';
const POLYGON_STROKE_WIDTH = 2;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mapReady: boolean = false;
  map: GoogleMap = null;
  firstLoad: boolean = true;

  constructor(private navCtrl: NavController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private platform: Platform)
  {
    this.setupEventListeners();
  }

  setupEventListeners() {
    console.log('HomePage: setupEventListeners()');
    this.platform.pause.subscribe(() => {
      console.info('Application is in running in the background...');
    });

    this.platform.resume.subscribe(() => {
      console.info('Application is in running in the foreground...');
    });
  }

  ionViewDidLoad() {
    console.log('HomePage: ionViewDidLoad()');
    this.loadMap();
  }

  loadMap() {
    console.log('HomePage: loadMap()');
    this.map = GoogleMaps.create('map_canvas', {
      mapType: "MAP_TYPE_NORMAL",
      controls: {
        compass: false,
        myLocation: true,
        myLocationButton: false,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: false,
        rotate: true,
        zoom: true
      },
      camera: {
        target: {
          lat: CAMERA_DEFAULT_LAT,
          lng: CAMERA_DEFAULT_LONG
        },
        zoom: CAMERA_DEFAULT_ZOOMLEVEL
      },
      preferences: {
        zoom: {
          minZoom: 10,
          maxZoom: 18
        },
        building: false
      }
    });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.mapReady = true;
      console.log('HomePage: map is ready.....');
    });

  }

  ionViewWillLeave() {
    console.log('HomePage: ionViewWillLeave()');

  }

  ionViewDidEnter() {
    console.log('HomePage: ionViewDidEnter()');
    if (!this.firstLoad) {
      this.map.setDiv('map_canvas');
    } else {
      this.firstLoad = false;
    }
  }

  displayToast() {
    console.log('displayToast()');
    let toast = this.toastCtrl.create({
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      showCloseButton: true,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  openSecondPage() {
    console.log('HomePage: openSecondPage()');
    this.navCtrl.setRoot(SecondPage, {}, {animate: false});
  }

  hideMap() {
    console.log('HomePage: hideMap()');
    this.map.setDiv();
  }

  showMap() {
    console.log('HomePage: showMap()');
    this.map.setDiv('map_canvas');
  }

  addNewMarker() {

    this.map.addMarker({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      draggable:true,
      position: {
        lat: CAMERA_DEFAULT_LAT,
        lng: CAMERA_DEFAULT_LONG
      }
    }).then((marker:Marker)=>{

      marker.showInfoWindow();
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        alert('clicked');
      });

      marker.addEventListener(GoogleMapsEvent.MAP_DRAG).subscribe((event)=>{
        alert('drag');
      })
    })

  }

  showDiv() {
    console.log('HomePage: showDiv()');
    const usedDiv = this.map.getDiv() ? this.map.getDiv().id : 'No div specified...';
    const alertCtrl = this.alertCtrl.create({
      title: 'Used div',
      subTitle: 'Your map is using the following div',
      message: JSON.stringify(usedDiv),
      buttons: [
        {text: 'Dismiss'}
      ]
    });

    alertCtrl.present();

  }

}
