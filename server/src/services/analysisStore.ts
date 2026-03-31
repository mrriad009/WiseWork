import { getSql, isDbConfigured } from "../db/client.js";

export type AnalysisRunRow = {
  id: string;
  created_at: string;
  candidate_name: string | null;
  linkedin_url: string | null;
  file_name: string | null;
  result: unknown;
  error: string | null;
};

export async function saveAnalysisRun(record: {
  candidateName?: string | undefined;
  linkedinUrl?: string | undefined;
  fileName?: string | undefined;
  result: Record<string, unknown> | null;
  error?: string | null | undefined;
}): Promise<void> {
  const sql = getSql();
  if (!isDbConfigured() || !sql) return;

  const resultJson = record.result != null ? JSON.stringify(record.result) : null;

  try {
    if (resultJson === null) {
      await sql`
        INSERT INTO analysis_runs (candidate_name, linkedin_url, file_name, result, error)
        VALUES (
          ${record.candidateName ?? null},
          ${record.linkedinUrl ?? null},
          ${record.fileName ?? null},
          NULL,
          ${record.error ?? null}
        )
      `;
    } else {
      await sql`
        INSERT INTO analysis_runs (candidate_name, linkedin_url, file_name, result, error)
        VALUES (
          ${record.candidateName ?? null},
          ${record.linkedinUrl ?? null},
          ${record.fileName ?? null},
          ${resultJson}::jsonb,
          ${record.error ?? null}
        )
      `;
    }
  } catch (e) {
    console.error("[db] Failed to save analysis run:", e);
  }
}

export async function listRecentAnalysisRuns(limit = 50): Promise<AnalysisRunRow[]> {
  const sql = getSql();
  if (!isDbConfigured() || !sql) return [];

  const rows = await sql`
    SELECT id, created_at, candidate_name, linkedin_url, file_name, result, error
    FROM analysis_runs
    ORDER BY created_at DESC
    LIMIT ${Math.min(Math.max(limit, 1), 200)}
  `;

  return rows as unknown as AnalysisRunRow[];
}
