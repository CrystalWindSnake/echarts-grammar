export class IdGenerator {
  private count = 0;

  constructor(private readonly prefix: string) {}

  next(): string {
    this.count += 1;
    return `${this.prefix}-${this.count}`;
  }
}
