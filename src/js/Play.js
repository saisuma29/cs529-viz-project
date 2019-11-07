export class Play {
  init(...shapes) {
    this.button = document.getElementById('play-button');
    this.slider = document.getElementById('time-range');
    this.isPlaying = false;
    this.fps = 30;

    // Play / Pause SVG shapes
    this.playShape =
      'M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28';
    this.pauseShape = 'M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26';

    // Set play button onclick listener
    this.button.addEventListener('click', () => {
      // Play / pause timelapse
      this.isPlaying ? this.pauseTimelapse(shapes) : this.playTimelapse(shapes);
    });

    // Set slider input change listener
    this.slider.addEventListener('input', () => {
      // Pause time + update shape
      this.pauseTimelapse(shapes);
    });
  }

  playTimelapse(shapes) {
    console.log('Start playing..');

    // Swap to play button shape if not playing
    if (!this.isPlaying) {
      this.swapButtonShape();
    }
    this.isPlaying = true;

    let max = parseInt(this.slider.getAttribute('max')) + 1;

    // Start up play timer
    this.timer = setInterval(() => {
      // Get time + 1
      let t = (parseInt(this.slider.value) + 1) % max;
      this.slider.value = t;

      // Update shapes to current time
      for (let shape of shapes) {
        shape.update(t);
      }
    }, 1000 / this.fps);
  }

  pauseTimelapse(shapes) {
    console.log('Pause playing..');

    // Swap to pause button shape if playing
    if (this.isPlaying) {
      this.swapButtonShape();
    }
    this.isPlaying = false;

    // Clear play timer
    clearInterval(this.timer);

    // Update shapes to current time
    let max = parseInt(this.slider.getAttribute('max')) + 1;
    let t = (parseInt(this.slider.value) + 1) % max;
    this.slider.value = t;

    for (let shape of shapes) {
      shape.update(t);
    }
  }

  swapButtonShape() {
    // Set animation shapes
    let animation = document.getElementById('animation');
    animation.setAttribute(
      'from',
      this.isPlaying ? this.pauseShape : this.playShape
    );
    animation.setAttribute(
      'to',
      this.isPlaying ? this.playShape : this.pauseShape
    );

    // Begin animation
    animation.beginElement();
  }
}
