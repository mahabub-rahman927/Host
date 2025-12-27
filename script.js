const socket = io();

async function upload() {
  const file = document.getElementById('file').files[0];
  const userId = document.getElementById('userId').value;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('userId', userId);
  const res = await fetch('/project/upload', { method: 'POST', body: fd });
  const data = await res.json();
  document.getElementById('logs').textContent = 'Container ID: ' + data.containerId;
  if (data.containerId) {
    socket.on('log', log => {
      document.getElementById('logs').textContent += '\n' + log;
    });
  }
}

async function stop() {
  const name = prompt('Enter container name to stop');
  await fetch('/project/stop/' + name, { method: 'POST' });
  alert('Stopped ' + name);
}
