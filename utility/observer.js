const chokidar = require("chokidar");
const readLastLines = require("read-last-lines");
const EventEmitter = require("events").EventEmitter;

class Observer extends EventEmitter {
    constructor() {
        super();
    }

    watchFile(fileName, maxReadLines = 1) {
        return new Promise((resolve, reject) => {
            try {
                console.log(
                    `[${new Date().toLocaleString()}] Watching for file changes on: ${fileName}`
                  );

                const watcher = chokidar.watch(fileName, { persistent: true });

                watcher.on("all", async (event, filePath) => {
                    console.log(
                        `[${new Date().toLocaleString()}] ${filePath} has been updated.`
                      );
                    
                    const logContent = await readLastLines.read(filePath, maxReadLines);
                    this.emit("log-received", { metadata: logContent });
                });

            } catch(error) {
                console.log("Error occured => ", error.message);
                reject(error);
            }
        });
    }
}

module.exports = Observer;