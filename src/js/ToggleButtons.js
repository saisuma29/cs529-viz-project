export class ToggleButtons {
  init(canvas3D, canvas2D) {
    // Get button elements
    this.button2d = document.getElementById('2d-toggle');
    this.button3d = document.getElementById('3d-toggle');

    // Remove hidden field
    document.getElementById('toggle-view').classList.remove('d-none');
  }
}
