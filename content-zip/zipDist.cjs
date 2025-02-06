const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const preferredLocation = '../server/public/content.zip'
const output = fs.createWriteStream(path.join(__dirname, preferredLocation));
const archive = archiver('zip', {
  zlib: { level: 9 } // Set the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`Zipped ${archive.pointer()} total bytes.`);
  console.log(`content.zip has been created successfully in ${preferredLocation}`);
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err.message);
  } else {
    throw err;
  }
});

// Good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append files from the dist directory
archive.directory(path.join(__dirname, 'dist'), false);

// Finalize the archive (i.e. we are done appending files but streams have to finish yet)
archive.finalize(); 