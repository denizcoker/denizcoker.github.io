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
    width: '100%',
    height: 480,
    video: 'congo_2048.mp4',
    is_stereo: true,
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

    if (formatTime(vrView.currentTime) ==  formatTime(0) && !videoStarts) {
      console.log('multimedia:VIDEO STARTS');
      videoStarts = true;
    }
    if (formatTime(vrView.currentTime) == q1 && !videoQ1) {
      console.log('multimedia:VIDEO Q1');
      videoQ1 = true;
    }
    if (formatTime(vrView.currentTime) == q2 && !videoQ2) {
      console.log('multimedia:VIDEO Q2');
      videoQ2 = true;
    }
    if (formatTime(vrView.currentTime) == q3 && !videoQ3) {
      console.log('multimedia:VIDEO Q3');
      videoQ3 = true;
    }
    if (formatTime(vrView.currentTime) == formatTime(vrView.duration) && !videoCompletes) {
      console.log('multimedia:VIDEO COMPLETES');
      videoCompletes = true;
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
