import { Vec2 } from "kaplay";


const LOCAL_STORAGE_MOVEMENTS_KEY = "xion_adventures_movements"
const LOCAL_STORAGE_BACKUP_MOVEMENTS_KEY = "xion_adventures_movements_backup"

export function saveMovements(movements: Vec2[]) {
    localStorage.setItem(LOCAL_STORAGE_MOVEMENTS_KEY, JSON.stringify(movements));
}
export function saveBackupMovements(backup_movements: Vec2[]) {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_MOVEMENTS_KEY, JSON.stringify(backup_movements));
}