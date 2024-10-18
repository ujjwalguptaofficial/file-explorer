import { File } from '@/database/models/file';

export class BaseService {
    protected get tables() {
        return {
            FILE: File,
        }
    }
}
