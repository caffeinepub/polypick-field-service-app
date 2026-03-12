declare module "xlsx" {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: Record<string, WorkSheet>;
  }
  export interface WorkSheet {
    [key: string]: unknown;
  }
  export function book_new(): WorkBook;
  export function book_append_sheet(
    wb: WorkBook,
    ws: WorkSheet,
    name?: string,
  ): void;
  export function writeFile(wb: WorkBook, filename: string): void;
  export function read(data: unknown, opts?: { type?: string }): WorkBook;
  export const utils: {
    aoa_to_sheet(data: unknown[][]): WorkSheet;
    json_to_sheet(data: Record<string, unknown>[]): WorkSheet;
    book_new(): WorkBook;
    book_append_sheet(wb: WorkBook, ws: WorkSheet, name?: string): void;
    sheet_to_json<T = Record<string, unknown>>(
      ws: WorkSheet,
      opts?: Record<string, unknown>,
    ): T[];
  };
}
