let isPlay = false;
let position = 0;
const play = document.querySelector(".play");
const backward = document.querySelector(".backward");
const forward = document.querySelector(".forward");
const audio = document.querySelector("audio");

let track1 = {
  id: 1,
  name: "Lose Yourself",
  signer: "Eminem",
  url: "./assets/audio/Eminem_-_Lose_Yourself.mp3",
};
let track2 = {
  id: 2,
  name: "Mockingbird",
  signer: "Eminem",
  url: "./assets/audio/Eminem_-_Mockingbird.mp3",
};
let track3 = {
  id: 3,
  name: "Burn It Down",
  signer: "Linkin Park",
  url: "./assets/audio/Linkin_Park_-_Burn_It_Down.mp3",
};
let track4 = {
  id: 4,
  name: "In The End",
  signer: "Linkin Park",
  url: "./assets/audio/Linkin_Park_-_In_The_End.mp3",
};

let track5 = {
  id: 5,
  name: "Lost",
  signer: "Linkin Park",
  url: "./assets/audio/Linkin_Park_-_Lost.mp3",
};
let track6 = {
  id: 6,
  name: "New Divide",
  signer: "Linkin Park",
  url: "./assets/audio/Linkin_Park_-_New_Divide.mp3",
};
let track7 = {
  id: 7,
  name: "What Ive Done",
  signer: "Linkin Park",
  url: "./assets/audio/Linkin_Park_-_What_Ive_Done.mp3",
};
let track8 = {
  id: 8,
  name: "Numb Encore",
  signer: "Linkin Park & Jay-Z",
  url: "./assets/audio/Linkin_Park_Jay-Z_-_Numb_Encore.mp3",
};

let listTracks = [
  track1,
  track2,
  track3,
  track4,
  track5,
  track6,
  track7,
  track8,
];

function playTrack(obj) {
  if (!isPlay) {
    audio.src = listTracks[position].url;
    audio.currentTime = 0;
    isPlay = true;
    play.classList.toggle("pause");
    audio.play();
  } else {
    audio.pause();
    play.classList.toggle("pause");
    isPlay = false;
  }
}

function nextTrack() {
  position += 1;
  if (position < listTracks.length) {
    audio.src = listTracks[position]?.url;
    if (isPlay) {
      audio.currentTime = 0;
      isPlay = true;
    play.classList.toggle("pause");
      audio.play();
    }
  }
}

play.addEventListener("click", playTrack);
forward.addEventListener("click", nextTrack);
backward.addEventListener("click", playTrack);
