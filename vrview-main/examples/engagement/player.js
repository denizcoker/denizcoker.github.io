/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var vrView;
var playButton;
var muteButton;

var videoStarts = false;
var videoQ1 = false;
var videoQ2 = false;
var videoQ3 = false;
var videoCompletes = false;

function onLoad() {
  // Load VR View.
  vrView = new VRView.Player('#vrview', {
    width: 960, //width: '100%',
    height: 500,
    video: 'https://media.truex.com/file_assets/2017-06-15/20428f1f-5958-413d-9047-fd720e7299c7.mp4',
    is_stereo: false,
    loop: false,
    //is_debug: true,
    //default_heading: 90,
    //is_yaw_only: true,
    //is_vr_off: true,
  });

  playButton = document.querySelector('#toggleplay');
  muteButton = document.querySelector('#togglemute');
  timeContainer = document.querySelector('#time');

  playButton.addEventListener('click', onTogglePlay);
  muteButton.addEventListener('click', onToggleMute);

  vrView.on('ready', onVRViewReady);

  vrView.on('play', function() {
    //console.log('media play');
    //console.log(vrView.getDuration());
  });
  vrView.on('pause', function() {
    //console.log('media paused');
  });
  vrView.on('timeupdate', function(e) {
    var current = formatTime(e.currentTime);
    var duration = formatTime(e.duration);
    timeContainer.innerText = current + ' | ' + duration;

    var q1 = formatTime(vrView.duration * .25);
    var q2 = formatTime(vrView.duration * .50);
    var q3 = formatTime(vrView.duration * .75);
  
    /*
    var video_starts = new Event('VIDEOSTARTED');
    var video_q1 = new Event('VIDEOQ1');
    var video_q2 = new Event('VIDEOQ2');
    var video_q3 = new Event('VIDEOQ3');
    var video_completes = new Event('VIDEOCOMPLETE');
    */
   
    var frame = document.getElementById('#vrview'); 
    
    var video_starts = new CustomEvent('VIDEOSTARTED');
    var video_q1 = new CustomEvent('VIDEOQ1');
    var video_q2 = new CustomEvent('VIDEOQ2');
    var video_q3 = new CustomEvent('VIDEOQ3');
    var video_completes = new CustomEvent('VIDEOCOMPLETE');
    
    addEventListener('VIDEOSTARTED', function (e) { console.log('multimedia:VIDEO STARTS'); }, false);
    addEventListener('VIDEOQ1', function (e) { console.log('multimedia:VIDEO Q1'); }, false);
    addEventListener('VIDEOQ2', function (e) { console.log('multimedia:VIDEO Q2'); }, false);
    addEventListener('VIDEOQ3', function (e) { console.log('multimedia:VIDEO Q3'); }, false);
    addEventListener('VIDEOCOMPLETE', function (e) { console.log('multimedia:VIDEO COMPLETES'); }, false);

    if (formatTime(vrView.currentTime) ==  formatTime(0) && !videoStarts) {
      //console.log('multimedia:VIDEO STARTS');
      videoStarts = true;
      //window.parent.document.dispatchEvent(video_starts);
      frame.contentWindow.postMessage("VIDEOSTARTED", 'denizcoker.github.io'); 
    }
    if (formatTime(vrView.currentTime) == q1 && !videoQ1) {
      //console.log('multimedia:VIDEO Q1');
      videoQ1 = true;
      //window.parent.document.dispatchEvent(video_q1);
      frame.contentWindow.postMessage("VIDEOQ1", 'denizcoker.github.io'); 
    }
    if (formatTime(vrView.currentTime) == q2 && !videoQ2) {
      //console.log('multimedia:VIDEO Q2');
      videoQ2 = true;
      //window.parent.document.dispatchEvent(video_q2);
      frame.contentWindow.postMessage("VIDEOQ2", 'denizcoker.github.io'); 
    }
    if (formatTime(vrView.currentTime) == q3 && !videoQ3) {
      //console.log('multimedia:VIDEO Q3');
      videoQ3 = true;
      //window.parent.document.dispatchEvent(video_q3);
      frame.contentWindow.postMessage("VIDEOQ3", 'denizcoker.github.io'); 
    }
    if (formatTime(vrView.currentTime) == formatTime(vrView.duration) && !videoCompletes) {
      //console.log('multimedia:VIDEO COMPLETES');
      videoCompletes = true;
      //window.parent.document.dispatchEvent(video_completes);
      frame.contentWindow.postMessage("VIDEOCOMPLETES", 'denizcoker.github.io'); 
    }
    //console.log('currently playing ' + current + ' secs.');
  });
  vrView.on('ended', function() {
    //console.log('media ended');
    playButton.classList.add('paused');
  });
}

function onVRViewReady() {
  console.log('vrView.isPaused', vrView.isPaused);
  // Set the initial state of the buttons.
  if (vrView.isPaused) {
    playButton.classList.add('paused');
  } else {
    playButton.classList.remove('paused');
  }
}

function onTogglePlay() {
  if (vrView.isPaused) {
    vrView.play();
    playButton.classList.remove('paused');
  } else {
    vrView.pause();
    playButton.classList.add('paused');
  }
}

function onToggleMute() {
  var isMuted = muteButton.classList.contains('muted');
  if (isMuted) {
    vrView.setVolume(1);
  } else {
    vrView.setVolume(0);
  }
  muteButton.classList.toggle('muted');
}

function formatTime(time) {
  time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

  var minutes = Math.floor(time / 60) % 60;
  var seconds = Math.floor(time % 60);

  minutes = minutes <= 0 ? 0 : minutes;
  seconds = seconds <= 0 ? 0 : seconds;

  var result = (minutes < 10 ? '0' + minutes : minutes) + ':';
  result += seconds < 10 ? '0' + seconds : seconds;
  return result;
}

window.addEventListener('load', onLoad);
