const { app, BrowserWindow, Tray, Menu, shell, screen } = require('electron');
const path = require('path');

let tray = null;
let mainWindow = null;

function getWindowPosition() {
    const trayBounds = tray.getBounds();
    const windowBounds = mainWindow.getBounds();

    const currentDisplay = screen.getDisplayMatching(trayBounds);
    const { workArea } = currentDisplay;

    let x, y;

    x = Math.round(workArea.x + workArea.width - windowBounds.width);
    y = Math.round(workArea.y + workArea.height - windowBounds.height);
    
    return { x, y };
}

function toggleWindow() {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        const position = getWindowPosition();
        mainWindow.setPosition(position.x, position.y, false);
        mainWindow.show();
        mainWindow.focus();
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
        show: false,
        frame: false,
        resizable: false,
        movable: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    mainWindow.loadFile('contest_viewer.html');

    mainWindow.on('blur', () => {
        mainWindow.hide();
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.ico'));
    tray.setToolTip('DSAext - Contest Notifier');

    tray.on('click', () => {
        toggleWindow();
    });
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show Contests',
            click: () => {
                toggleWindow();
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        toggleWindow();
    });

    app.on('ready', () => {
        createWindow();
        createTray();
        app.setLoginItemSettings({ openAtLogin: true });
    });
}

