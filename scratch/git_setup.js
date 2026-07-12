const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

async function run() {
  const dir = path.join(__dirname, '..');

  console.log('Initializing Git repository at:', dir);
  await git.init({ fs, dir });

  console.log('Retrieving status matrix...');
  const matrix = await git.statusMatrix({ fs, dir });
  
  console.log(`Found ${matrix.length} files in status matrix.`);

  let added = 0;
  let removed = 0;

  for (const [filepath, head, workdir, stage] of matrix) {
    // If workdir is 0, the file was deleted
    if (workdir === 0) {
      await git.remove({ fs, dir, filepath });
      removed++;
    } else {
      // If workdir is 1, 2, or 3 (present, modified, or new)
      await git.add({ fs, dir, filepath });
      added++;
    }
  }

  console.log(`Staged ${added} files, removed ${removed} files.`);

  // Set local user config
  await git.setConfig({ fs, dir, path: 'user.name', value: 'Jai' });
  await git.setConfig({ fs, dir, path: 'user.email', value: 'jai@example.com' });

  console.log('Committing changes...');
  const sha = await git.commit({
    fs,
    dir,
    message: 'Initial commit: setup project and deployment pipeline',
    author: {
      name: 'Jai',
      email: 'jai@example.com'
    }
  });

  console.log('Commit successful! SHA:', sha);
}

run().catch(err => {
  console.error('Error during git setup:', err);
  process.exit(1);
});
