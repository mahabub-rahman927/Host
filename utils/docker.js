const Docker = require('dockerode');
const docker = new Docker();

exports.createContainer = async (name, path) => {
  const stream = await docker.buildImage({ context: path, src: ['.'] }, { t: name });
  await new Promise((res, rej) => docker.modem.followProgress(stream, (err, out) => err ? rej(err) : res(out)));
  const container = await docker.createContainer({
    Image: name,
    name,
    Tty: true,
    HostConfig: { AutoRemove: true, Memory: 200 * 1024 * 1024 }
  });
  await container.start();
  return container.id;
};

exports.stopContainer = async (name) => {
  const container = docker.getContainer(name);
  await container.stop();
};
