export const SHEET_FIELD_KINDS = ['text', 'multiline', 'checkbox'] as const;

export type SheetFieldKind = (typeof SHEET_FIELD_KINDS)[number];

export type SheetFields = Readonly<Record<string, SheetFieldKind>>;

type SheetFieldValue<Kind extends SheetFieldKind> = Kind extends 'checkbox' ? boolean : string;

export type SheetValues<Fields extends SheetFields> = {
  -readonly [Name in keyof Fields]?: SheetFieldValue<Fields[Name]>;
};
