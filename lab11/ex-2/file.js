const fs = require("fs");

// 1. Create & Write file
fs.writeFile("sample.txt", "Hello World\n", (err) => {
  if (err) throw err;
  console.log("File created and written");

  // 2. Append data
  fs.appendFile("sample.txt", "This is appended text\n", (err) => {
    if (err) throw err;
    console.log("Data appended");

    // 3. Read file
    fs.readFile("sample.txt", "utf8", (err, data) => {
      if (err) throw err;
      console.log("File content:");
      console.log(data);

      // 4. Delete file
      fs.unlink("sample.txt", (err) => {
        if (err) throw err;
        console.log("File deleted");
      });

    });

  });

});