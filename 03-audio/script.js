class AudioGraphic {
  constructor(src) {
    this.audio = new Audio();
    this.audio.src = src;
    this.audio.autoplay = true;
    this.audio.crossOrigin = 'anonymous';
    this.audio.loop = true;

    this.createAudioContext();
    this.createCanvas();

    this.setCanvasSize();
    this.renderLoop();

    window.addEventListener('resize', () => this.setCanvasSize(), false);
  }

  createAudioContext() {
    // create context
    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaElementSource(this.audio);

    // create analyser and set frequency array
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    this.fbc_array = new Uint8Array(this.analyser.frequencyBinCount);

    // Connect the output of the source to the input of the analyser
    source.connect(this.analyser);

    // Connect the output of the analyser to the destination
    this.analyser.connect(audioContext.destination);
  }

  createCanvas() {
    this.canvas = document.getElementById('graphic');
    this.canvasContext = this.canvas.getContext('2d');
  }
  setCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Create the animation
  renderLoop() {
    // recursive to create animation
    window.requestAnimationFrame(() => this.renderLoop());
    // Get the new frequency data
    this.analyser.getByteFrequencyData(this.fbc_array);
    this.render();
  }

  // Too much data, lets filter it
  getData() {
    const steps = 50;
    const relation = parseInt(this.analyser.frequencyBinCount / steps, 10);
    return this.fbc_array.filter((value, index) => index % relation === 0);
  }

  render() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const data = this.getData();

    this.canvasContext.fillStyle = '#2A68AB';

    data.forEach((step, i) => {
      const w = this.canvas.width / data.length;
      const x = (i * this.canvas.width) / data.length;
      const h = -((step * this.canvas.height) / this.analyser.fftSize);

      this.canvasContext.fillRect(x, this.canvas.height, w, h);
    });
  }
}

const audioGraphic = new AudioGraphic('audio-epic.mp3');
