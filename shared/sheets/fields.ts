// Field contract between the app and a family of PDF character sheet templates. Every
// template of a family (one per language, alternative designs...) has to define exactly these
// AcroForm field names: the app fills them by name and never looks at the layout.
export const SHEET_FIELD_KINDS = ['text', 'multiline', 'checkbox'] as const;

export type SheetFieldKind = (typeof SHEET_FIELD_KINDS)[number];

// Field name → kind. Names are PDF field names, so plain ASCII with no dots: a dot in an
// AcroForm name nests the field under a parent (`a.b` is field `b` inside `a`).
export type SheetFields = Readonly<Record<string, SheetFieldKind>>;

type SheetFieldValue<Kind extends SheetFieldKind> = Kind extends 'checkbox' ? boolean : string;

// Values to fill in. Every field is optional: one left out stays empty for the player.
export type SheetValues<Fields extends SheetFields> = {
  [Name in keyof Fields]?: SheetFieldValue<Fields[Name]>;
};
