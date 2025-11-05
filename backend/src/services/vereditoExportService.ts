// backend/src/services/vereditoExportService.ts
import { buildVereditoArray } from "./vereditoAdapter.js";
import type { HorizonKey } from "./horizonPolicy.js";

export async function exportVereditoJSONByHorizon(h: HorizonKey): Promise<{ filename:string; payload:any[] }> {
  const arr = await buildVereditoArray();
  // Filter by horizon if needed, for now we pass all
  const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
  const filename = `lucra_veredito_${ts}_${h}.json`;
  return { filename, payload: arr };
}
