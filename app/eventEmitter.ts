export class EventEmitter<T extends {} | void> {
    private listeners: ((event: T) => void)[] = []

    public on(listener: (event: T) => void) {
        this.listeners.push(listener)
    }

    public off(type: string, listener: (event: T) => void): boolean {
        const ix = this.listeners.indexOf(listener)
        if (ix !== -1) {
            this.listeners.splice(ix, 1)
            return true
        }
        return false
    }

    public emit(event: T) {
        this.listeners.forEach(listener => listener(event))
    }
}
