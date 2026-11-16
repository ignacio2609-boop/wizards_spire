import type { SheetFields, SheetValues } from '#shared/sheets/fields';

export async function fillSheet<Fields extends SheetFields>(
  template: Uint8Array | ArrayBuffer,
  fields: Fields,
  values: SheetValues<Fields>
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  const pdf = await PDFDocument.load(template);
  const form = pdf.getForm();

  for (const [name, kind] of Object.entries(fields)) {
    const value = values[name];
    if (value === undefined) continue;

    if (kind === 'checkbox') {
      const checkBox = form.getCheckBox(name);
      if (value) checkBox.check();
      else checkBox.uncheck();
    } else {
      form.getTextField(name).setText(String(value));
    }
  }

  return pdf.save();
}
