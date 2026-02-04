import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const DOCS_ROOT = path.join(process.cwd(), 'docs');

function safeResolveDocsPath(relativeFile: string): string | null {
  // Normalize and prevent path traversal
  const normalized = relativeFile.replace(/\\/g, '/').replace(/^\/+/, '');
  const resolved = path.join(DOCS_ROOT, normalized);
  const rel = path.relative(DOCS_ROOT, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return resolved;
}

export async function GET(request: NextRequest) {
  try {
    const file = request.nextUrl.searchParams.get('file');
    if (!file) {
      return NextResponse.json({ error: 'Missing file param' }, { status: 400 });
    }

    const resolved = safeResolveDocsPath(file);
    if (!resolved) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    const content = await readFile(resolved, 'utf8');
    return NextResponse.json({
      file,
      content,
    });
  } catch (error: unknown) {
    const message =
      typeof error === 'object' && error && 'message' in error && typeof (error as { message?: unknown }).message === 'string'
        ? (error as { message: string }).message
        : 'Failed to read doc';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

