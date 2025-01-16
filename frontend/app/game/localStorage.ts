import { Vec2 } from "kaplay";


const LOCAL_STORAGE_MOVEMENTS_KEY = "xion_adventures_movements"
const LOCAL_STORAGE_BACKUP_MOVEMENTS_KEY = "xion_adventures_movements_backup"

// One should only use the local storage before the wallet is connected
// Once an initialPosition has been set once, don't use the storage anymore

export function saveMovements(movements: Vec2[]) {
    localStorage.setItem(LOCAL_STORAGE_MOVEMENTS_KEY, JSON.stringify(movements));
}
export function getMovements(): Vec2[] | null {
    const storageItem = localStorage.getItem(LOCAL_STORAGE_MOVEMENTS_KEY);
    if (!storageItem) {
        return null
    } else {
        return JSON.parse(storageItem)
    }
}
export function eraseMovements() {
    localStorage.removeItem(LOCAL_STORAGE_MOVEMENTS_KEY);
}
export function saveBackupMovements(backup_movements: Vec2[]) {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_MOVEMENTS_KEY, JSON.stringify(backup_movements));
}
export function getBackupMovements(): Vec2[] | null {
    const storageItem = localStorage.getItem(LOCAL_STORAGE_BACKUP_MOVEMENTS_KEY);
    if (!storageItem) {
        return null
    } else {
        return JSON.parse(storageItem)
    }
}
export function eraseBackupMovements() {
    localStorage.removeItem(LOCAL_STORAGE_BACKUP_MOVEMENTS_KEY);
}

export function eraseAllMovements() {
    eraseMovements();
    eraseBackupMovements();
}