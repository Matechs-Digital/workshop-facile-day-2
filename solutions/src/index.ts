export {};

export function sum(x: string, y: string): string;
export function sum(x: number, y: number): number;
export function sum(x: any, y: any): any {
  return x + y;
}
