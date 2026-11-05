
// GET HTML ELEMENTS
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const albumImage = document.querySelector(".album-art img");

const playlist = document.getElementById("playlist");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
const playbackStatus = document.getElementById("playback-status");
const songCount = document.getElementById("song-count");

// AUDIO
const audio = new Audio();

// SONG COLLECTION
const songs = [
    {
        title: "Dreams",
        artist: "CODESCORNER",
        src: "Songs/song1.mp3",
        cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500"
    },
    {
        title: "Midnight Vibes",
        artist: "Eaters",
        src: "songs/song2.mp3",
        cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500"
    },
    {
        title: "Lost in Music",
        artist: "Brakhage",
        src: "songs/song3.mp3",
        cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500"
    },
     {
        title: "Earth on Fire",
        artist: "Joint C Beat Laboratory",
        src: "songs/song4.mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
    },
     {
        title: "white Desert",
        artist: "Brentin Davis",
        src: "songs/song5.mp3",
        cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
    }
];

// PLAYER SETTINGS
let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// FORMAT TIME
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// SHOW STATUS
function showStatus(message) {
    playbackStatus.textContent = message;
}

// LOAD SONG
function loadSong(index) {
    const song = songs[index];

    if (!song) return;

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;

    albumImage.src = song.cover;

    audio.src = song.src;
    audio.load();

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    showStatus("");
    renderPlaylist();
}

// PLAY SONG
function playSong() {
    if (!audio.src) {
        showStatus("No song selected.");
        return;
    }

    audio.play()
        .catch(() => {
            isPlaying = false;
            playBtn.textContent = "▶";
            showStatus("Unable to play this song. Check your audio file.");
        });
}

// PAUSE SONG
function pauseSong() {
    audio.pause();
}

// PLAYBACK EVENTS
audio.addEventListener("play", () => {
    isPlaying = true;
    playBtn.textContent = "⏸";
    showStatus("");
});

audio.addEventListener("pause", () => {
    isPlaying = false;
    playBtn.textContent = "▶";
});

audio.addEventListener("error", () => {
    isPlaying = false;
    playBtn.textContent = "▶";
    showStatus("Audio file not found. Check your songs folder.");
});

// PLAY / PAUSE BUTTON
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// NEXT SONG
function nextSong() {
    if (songs.length <= 1) return;

    if (isShuffle) {
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === songIndex);

        songIndex = randomIndex;
    } else {
        songIndex = (songIndex + 1) % songs.length;
    }

    loadSong(songIndex);
    playSong();
}

// PREVIOUS SONG
function previousSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    songIndex = (songIndex - 1 + songs.length) % songs.length;

    loadSong(songIndex);
    playSong();
}

// BUTTON EVENTS
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

// SONG DURATION
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

// UPDATE PROGRESS BAR
audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTime.textContent = formatTime(audio.currentTime);
    }
});

// SEEK THROUGH SONG
progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
        audio.currentTime = (progress.value / 100) * audio.duration;
    }
});

// VOLUME CONTROL
audio.volume = Number(volume.value);

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

// RENDER PLAYLIST
function renderPlaylist() {
    playlist.innerHTML = "";

    songCount.textContent =
        `${songs.length} ${songs.length === 1 ? "Song" : "Songs"}`;

    songs.forEach((song, index) => {
        const item = document.createElement("div");

        item.className = "playlist-item";

        if (index === songIndex) {
            item.classList.add("active");
        }

        item.innerHTML = `
            <span class="track-number">${index + 1}</span>
            <img src="${song.cover}" alt="Album cover">
            <div class="track-info">
                <h4></h4>
                <p></p>
            </div>
        `;

        item.querySelector("h4").textContent = song.title;
        item.querySelector("p").textContent = song.artist;

        item.addEventListener("click", () => {
            songIndex = index;
            loadSong(songIndex);
            playSong();
        });

        playlist.appendChild(item);
    });
}

// SHUFFLE CONTROL
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;

    shuffleBtn.classList.toggle("active", isShuffle);
    shuffleBtn.setAttribute("aria-pressed", isShuffle);
});

// REPEAT CONTROL
repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;

    repeatBtn.classList.toggle("active", isRepeat);
    repeatBtn.setAttribute("aria-pressed", isRepeat);
});

// AUTOMATIC NEXT SONG / REPEAT
audio.addEventListener("ended", () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

// INITIALIZE PLAYER
loadSong(songIndex);
