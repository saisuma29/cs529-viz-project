export class Play {
  init(layers, ...shapes) {
    this.layers = layers;

    this.button = document.getElementById("play-button");
    this.slider = document.getElementById("time-range");
    this.timeInput = document.getElementById("time-input");

    this.timeLength = Object.keys(layers[0][0]).length;
    this.slider.setAttribute("max", this.timeLength);

    this.isPlaying = false;
    this.fps = 30;
    this.timestep = 2;

    // Play / Pause SVG shapes
    this.playShape =
      "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";
    this.pauseShape = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";
  }

  playTimelapse() {
    console.log("Start playing..");

    // Swap to play button shape if not playing
    if (!this.isPlaying) {
      this.swapButtonShape();
    }
    this.isPlaying = true;
  }

  pauseTimelapse() {
    console.log("Pause playing..");

    // Swap to pause button shape if playing
    if (this.isPlaying) {
      this.swapButtonShape();
    }
    this.isPlaying = false;

    // Clear play timer
    clearInterval(this.timer);
  }

  swapButtonShape() {
    // Set animation shapes
    let animation = document.getElementById("animation");
    animation.setAttribute(
      "from",
      this.isPlaying ? this.pauseShape : this.playShape
    );
    animation.setAttribute(
      "to",
      this.isPlaying ? this.playShape : this.pauseShape
    );

    // Begin animation
    animation.beginElement();
  }
}
