const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dockerUtil = require('../utils/docker');
const unzipper = require('unzipper');

router.post('/upload', async (req, res) => {
  if (!req.files || !req.files.file) return res.status(400).send('No file uploaded');
  const file = req.files.file;
  const userId = req.body.userId;
  const projectId = Date.now();
  const uploadPath = path.join(__dirname, '../user-projects', `${userId}-${projectId}`);
  fs.mkdirSync(uploadPath, { recursive: true });
  const filePath = path.join(uploadPath, file.name);
  await file.mv(filePath);
  fs.createReadStream(filePath).pipe(unzipper.Extract({ path: uploadPath })).on('close', async () => {
    const containerId = await dockerUtil.createContainer(`${userId}-${projectId}`, uploadPath);
    res.json({ status: 'success', containerId });
  });
});

router.post('/stop/:name', async (req, res) => {
  await dockerUtil.stopContainer(req.params.name);
  res.json({ status: 'stopped' });
});

module.exports = router;
