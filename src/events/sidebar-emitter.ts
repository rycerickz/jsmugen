import { EventEmitter } from "events";

class SidebarEmitter extends EventEmitter {
  public onPlay(): void {
    this.emit("play");
  }

  public onPause(): void {
    this.emit("pause");
  }

  public onStop(): void {
    this.emit("stop");
  }

  public onSelectSound(index: number): void {
    this.emit("select-sound", index);
  }
}

const sidebarEmitter$ = new SidebarEmitter();

export default sidebarEmitter$;
