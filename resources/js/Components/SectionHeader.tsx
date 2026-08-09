import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    href?: string;
}

export function SectionHeader({ title, subtitle, href }: SectionHeaderProps) {
    return (
        <div className="mb-6 flex items-end justify-between gap-4">
            <div>
                <h2 className="text-balance text-xl font-extrabold tracking-tight text-primary sm:text-2xl">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {href && (
                <Link
                    href={href}
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:underline"
                >
                    Voir plus
                    <ArrowRight className="size-4" />
                </Link>
            )}
        </div>
    );
}
