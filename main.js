//if(require ('electron-squirrel-startup')) return;
const electron = require('electron')
    //var childProcess = require('child_process');
    // Module to control application life.
const app = electron.app;
const path = require('path');
const ChildProcess = require('child_process');
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            // explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
};
const {
    globalShortcut
} = electron;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const Menu = electron.Menu
const logger = require('winston');
logger.level = 'debug';
global.logger = logger;

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
let template = [{
        label: 'Edit1',
        submenu: [{
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
        }, {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
        }, {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
        }, {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
        }, {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
        }]
    }, {
        label: 'View',
        submenu: [{
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function(item, focusedWindow) {
                if (focusedWindow) {
                    // on reload, start fresh and close any old
                    // open secondary windows
                    if (focusedWindow.id === 1) {
                        BrowserWindow.getAllWindows().forEach(function(win) {
                            if (win.id > 1) {
                                win.close()
                            }
                        })
                    }
                    focusedWindow.reload()
                }
            }
        }, {
            label: 'Toggle Full Screen',
            accelerator: (function() {
                if (process.platform === 'darwin') {
                    return 'Ctrl+Command+F'
                } else {
                    return 'F11'
                }
            })(),
            click: function(item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                }
            }
        }, {
            label: 'Toggle Developer Tools',
            accelerator: (function() {
                if (process.platform === 'darwin') {
                    return 'Alt+Command+I'
                } else {
                    return 'Ctrl+Shift+I'
                }
            })(),
            click: function(item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }
        }, {
            type: 'separator'
        }, {
            label: 'App Menu Demo',
            click: function(item, focusedWindow) {
                if (focusedWindow) {
                    const options = {
                        type: 'info',
                        title: 'Application Menu Demo',
                        buttons: ['Ok'],
                        message: 'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
                    }
                    electron.dialog.showMessageBox(focusedWindow, options, function() {})
                }
            }
        }]
    }, {
        label: 'Window',
        role: 'window',
        submenu: [{
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        }, {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        }, {
            type: 'separator'
        }, {
            label: 'Reopen Window',
            accelerator: 'CmdOrCtrl+Shift+T',
            enabled: false,
            key: 'reopenMenuItem',
            click: function() {
                app.emit('activate')
            }
        }]
    }, {
        label: 'Help',
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click: function() {
                electron.shell.openExternal('http://electron.atom.io')
            }
        }]
    }]
    //ipc.on('open-error-dialog', function (event) {
    //  dialog.showErrorBox('An Error Message', 'Demonstrating an error message.')
    //})

//ipc.on('open-information-dialog', function (event) {
//  const options = {
//  type: 'info',
//  title: 'Information',
//  message: "This is an information dialog. Isn't it nice?",
//    buttons: ['Yes', 'No']
//  }
//  dialog.showMessageBox(options, function (index) {
//    event.sender.send('information-dialog-selection', index)
//  })
//})

function addUpdateMenuItems(items, position) {
    if (process.mas) return

    const version = electron.app.getVersion()
    let updateItems = [{
        label: `Version ${version}`,
        enabled: false
    }, {
        label: 'Checking for Update',
        enabled: false,
        key: 'checkingForUpdate'
    }, {
        label: 'Check for Update',
        visible: false,
        key: 'checkForUpdate',
        click: function() {
            require('electron').autoUpdater.checkForUpdates()
        }
    }, {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: function() {
            require('electron').autoUpdater.quitAndInstall()
        }
    }]

    items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu()
    if (!menu) return

    let reopenMenuItem
    menu.items.forEach(function(item) {
        if (item.submenu) {
            item.submenu.items.forEach(function(item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item
                }
            })
        }
    })
    return reopenMenuItem
}

if (process.platform === 'darwin') {
    const name = electron.app.getName()
    template.unshift({
        label: name,
        submenu: [{
            label: `About ${name}`,
            role: 'about'
        }, {
            type: 'separator'
        }, {
            label: 'Services',
            role: 'services',
            submenu: []
        }, {
            type: 'separator'
        }, {
            label: `Hide ${name}`,
            accelerator: 'Command+H',
            role: 'hide'
        }, {
            label: 'Hide Others',
            accelerator: 'Command+Alt+H',
            role: 'hideothers'
        }, {
            label: 'Show All',
            role: 'unhide'
        }, {
            type: 'separator'
        }, {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() {
                app.quit()
            }
        }]
    })

    // Window menu.
    template[3].submenu.push({
        type: 'separator'
    }, {
        label: 'Bring All to Front',
        role: 'front'
    })

    addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu
    addUpdateMenuItems(helpMenu, 0)
}

app.on('ready', function() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})

app.on('browser-window-created', function() {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function() {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = true
})


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    logger.debug("Starting application");
    // Create the browser window.
    const {
        width,
        height
    } = electron.screen.getPrimaryDisplay().workAreaSize;
    let options = {
        frame: false,
        transparent: true,
        resizable: false,
        title: 'Chat',
        titleBarStyle: 'hidden',
        width: width,
        height: height,
        icon: __dirname + 'icon.ico'

    };
    //  ----------------------------------------------------------------------------------------
    // Register a 'CommandOrControl+X' shortcut listener.
    const ret = globalShortcut.register('CommandOrControl+R', () => {
        console.log('CommandOrControl+R is pressed')
    })

    if (!ret) {
        console.log('registration failed')
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('CommandOrControl+R'))
        //  ----------------------------------------------------------------------------------------
    mainWindow = new BrowserWindow(options);
    mainWindow.setThumbarButtons([{
        tooltip: 'Exit',
        icon: path.join(__dirname, 'public','img','twc-logo.png'),
        click() {
        mainWindow.close();
        }
    },{
        tooltip: 'Minimize',
        icon: path.join(__dirname, 'public','img','twc-logo.png'),
        click() {
        mainWindow.minimize();
        }
    },{
        tooltip: 'maximize',
        icon: path.join(__dirname, 'public','img','twc-logo.png'),
        click() {
        mainWindow.focus();
        }
    }]);
    //mainWindow.setOverlayIcon(path.join(__dirname, 'public','img','twc-logo.png'), 'Description for overlay')
    // app.setUserTasks([
    //   {
    //     program: process.execPath,
    //     arguments: '--new-window',
    //     iconPath: process.execPath,
    //     iconIndex: 0,
    //     title: 'New Window',
    //     description: 'Create a new window'
    //   }
    // ]);
    //app.clearRecentDocuments()
    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/views/index.html`);
    //mainWindow.setFullScreen(true)
    //mainWindow.maximize()
    // mainWindow.getMaximumSize()

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}
//app.commandLine.appendSwitch('enable-transparent-visuals');
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})
app.on('will-quit', () => {
        // Unregister a shortcut.
        globalShortcut.unregister('CommandOrControl+R');

        // Unregister all shortcuts.
        globalShortcut.unregisterAll();
        console.log('CommandOrControl+R is Unregister');
    })
    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and require them here.