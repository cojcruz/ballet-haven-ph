import DOMPurify from 'dompurify';
import { Head, Link } from '@inertiajs/react';

type CmsBlock = {
    id: number;
    type: string;
    data: any;
    sort_order: number;
    is_enabled: boolean;
};

type CmsPage = {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    is_home: boolean;
    meta: any;
    blocks: CmsBlock[];
};

export default function Show({ page }: { page: CmsPage }) {
    const blocks = (page.blocks ?? []).filter((b) => b.is_enabled);

    return (
        <>
            <Head title={page.title} />

            <div className="min-h-screen bg-background text-foreground">
                <div className="border-b border-border bg-card">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <div className="font-display text-lg">{page.title}</div>
                        <div className="text-sm">
                            <Link className="text-muted-foreground hover:text-foreground" href={route('home')}>
                                Home
                            </Link>
                        </div>
                    </div>
                </div>

                <main className="mx-auto max-w-5xl px-6 py-10">
                    {blocks.length === 0 ? (
                        <div className="rounded-md border border-border bg-card p-6 text-muted-foreground">
                            This page has no blocks yet.
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {blocks.map((block) => (
                                <BlockRenderer key={block.id} block={block} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

function BlockRenderer({ block }: { block: CmsBlock }) {
    if (block.type === 'hero') {
        const title = block.data?.title ?? '';
        const subtitle = block.data?.subtitle ?? '';

        return (
            <section className="rounded-lg border border-border bg-card p-8">
                <h1 className="font-display text-3xl font-medium">{title}</h1>
                {subtitle ? (
                    <p className="mt-4 font-body text-muted-foreground">{subtitle}</p>
                ) : null}
            </section>
        );
    }

    if (block.type === 'rich_text') {
        const html = String(block.data?.html ?? block.data?.text ?? '');
        const safeHtml = DOMPurify.sanitize(html);

        return (
            <section className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
            </section>
        );
    }

    const fallback = JSON.stringify(block.data ?? {}, null, 2);

    return (
        <section className="rounded-lg border border-border bg-card p-6">
            <div className="text-sm font-medium text-foreground">{block.type}</div>
            <pre className="mt-4 overflow-auto text-xs text-muted-foreground">{fallback}</pre>
        </section>
    );
}
