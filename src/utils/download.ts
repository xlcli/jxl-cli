import * as downloadGit from 'download-git-repo';

const download = async (templateName: string, projectName: string) => {
  let url = `direct:https://github.com/xlcli/${templateName}-template.git`;
  return new Promise((resolve, reject) => {
    downloadGit(url, projectName, { clone: true }, (err) => {
      if (err) {
        reject(err);
        process.exit(1);
      }
      resolve();
    });
  });
}

export {
  download
}
