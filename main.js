const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

// index sarki icin

let index;

//loop

let loop = true;

let isShuffleActive = false;

// sarki listesi

let songsList = [
  {
    name: "UNTZ UNTZ",
    link: "assets/INJI - UNTZ UNTZ.mp3",
    artist: "INJI",
    image: "assets/untz-sound.jpg",
  },
  {
    name: "Tataki",
    link: "assets/Argy - Tataki.mp3",
    artist: "Argy",
    image: "assets/tataki-sound.jpg",
  },
  {
    name: "Devil",
    link: "assets/devil.mp3",
    artist: "Boris Brejcha",
    image: "assets/devil-sound.jpg",
  },
  {
    name: "High Passion",
    link: "assets/Smilla - High Passion.mp3",
    artist: "Smilla",
    image: "assets/smilla-sound.jfif",
  },
];

// zaman formatı ayarlama

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
};
//sarki atama

const setSong = (arrayIndex) => {
  if (loop == true && isShuffleActive == true) {
    arrayIndex = Math.floor(Math.random() * 100) % 4;
  }

  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration);
  };

  playListContainer.classList.add("hide");

  playAudio();
};

// sıradakini çal

const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index++;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
};

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

const previousSong = () => {
  if (index > 0) {
    index -= 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
  playAudio();
};

repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
    //tekrar kapatıldı
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
    //tekrar açıldı
  }
});

shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    isShuffleActive = false;
    shuffleButton.classList.remove("active");
    audio.loop = true;
    //shuffle  açıldı
  } else {
    isShuffleActive = true;
    shuffleButton.classList.add("active");
    audio.loop = false;
    //shuffle kapatıldı
  }
});

const initializePlaylist = () =>{
    for(let i in songsList){
        playListSongs.innerHTML += `<li class="playlistSong" onclick="setSong(${i}">
        <div class="playlist-image-container">
            <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
            <span id="playlist-song-name">
                 ${songsList[i].name}
            </span>
            <span id="playlist-song-artist-album">
                 ${songsList[i].artist}
            </span>
        </div>
        </li>`
    }
}



//Tıklama yakalama

nextButton.addEventListener("click", nextSong);
pauseButton.addEventListener("click", pauseAudio);
playButton.addEventListener("click", playAudio);
prevButton.addEventListener("click", previousSong);

//sarki bitisini yakala
audio.onended = () => {
  nextSong();
};

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

progressBar.addEventListener("click", (event) => {
  let coordStart = progressBar.getBoundingClientRect().left;

  let coordEnd = event.clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progressBar * 100 + "%";

  audio.currentTime = progress * audio.duration;
  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

audio.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(audio.currentTime);
});

//ekran yuklenildiginde

window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlaylist();

  //durdur ve sarki list olustur
};
