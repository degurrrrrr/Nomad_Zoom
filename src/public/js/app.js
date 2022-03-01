const socket = io(); //socketIO를 프론트와 연결

const myFace = document.getElementById('myFace');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const camerasSelect = document.getElementById('cameras');

let myStream; //stream = video + audio
let muted = false;
let cameraOff = false;

async function getCameras(deviceId) {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      // 기본 카메라가 먼저 선택되게끔
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (err) {
    console.log(err);
  }
}

async function getMedia(deviceId) {
  // device가 없을 때 실행
  const initialConstraints = {
    audio: true,
    video: { facingMode: 'user' },
  };
  // device가 있을 때 실행
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(deviceId ? cameraConstraints : initialConstraints);
    myFace.srcObject = myStream; //stream을 myFace에 넣어주기
    if (!deviceId) {
      await getCameras(); //한 번만 실행되게
    }
  } catch (err) {
    console.log(err);
  }
}

getMedia();

function handleMuteBtnClick() {
  console.log(myStream.getAudioTracks());
  myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = 'Unmute';
    muted = true;
  } else {
    muteBtn.innerText = 'Mute';
    muted = false;
  }
}

function handleCameraBtnClick() {
  console.log(myStream.getVideoTracks());
  myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = 'Turn camera On';
    cameraOff = false;
  } else {
    cameraBtn.innerText = 'Turn camera Off';
    cameraOff = true;
  }
}

async function handleCameraChange() {
  await getMedia(camerasSelect.value);
}

muteBtn.addEventListener('click', handleMuteBtnClick);
cameraBtn.addEventListener('click', handleCameraBtnClick);
camerasSelect.addEventListener('input', handleCameraChange);
