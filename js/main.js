var constraints = { video: true, audio: true };

var start = () => navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => video.srcObject = stream)
  .catch(e => log(e +" "+ (e.constraint || "")));

var log = msg => div.innerHTML += "<br>" + msg;
